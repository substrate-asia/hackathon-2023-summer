#![crate_name = "enclave"]
#![crate_type = "staticlib"]
#![cfg_attr(not(target_env = "sgx"), no_std)]
#![cfg_attr(target_env = "sgx", feature(rustc_private))]
extern crate jsonwebtoken;
extern crate libsecp256k1;
extern crate sgx_tcrypto;
extern crate sgx_trts;
extern crate sgx_tseal;
extern crate sgx_types;
extern crate tiny_keccak;
#[cfg(not(target_env = "sgx"))]
#[macro_use]
extern crate sgx_tstd as std;
extern crate base64;
extern crate http_req;
extern crate serde;
extern crate serde_json;
extern crate sgx_rand;
#[macro_use]
extern crate serde_cbor;
#[cfg(target_env = "sgx")]
extern crate sgx_tseal;
use config::*;
use jsonwebtoken::crypto::sign;
use os_utils::{decode_hex, encode_hex};
use serde::{Deserialize, Serialize};
use sgx_tcrypto::*;
use sgx_types::*;
use std::convert::TryInto;
use std::ffi::CStr;
use std::mem::MaybeUninit;
use std::os::raw::c_char;
use std::slice;
use std::string::{String, ToString};
use std::sync::{Once, SgxMutex};
//use std::backtrace::{self, PrintFormat};
// use std::prelude::v1::*;
use std::ptr;
use std::str;
pub mod config;
pub mod err;
pub mod log;
pub mod model;
pub mod oauth;
pub mod os_utils;
pub mod otp;
pub mod session;
pub mod sgx_utils;
pub mod web3;
use self::err::*;
use self::log::*;
use self::model::*;
use self::session::*;
use jsonwebtoken::{
    decode, decode_header, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation,
};
use libsecp256k1::{PublicKey, SecretKey};
use oauth::*;

// EnclaveState includes session state that constatntly changes
struct EnclaveState {
    sessions: Sessions,
    pub_k_r1: [u8; 64],
    pub_k_k1: [u8; 65],
}

// EnclaveConfig includes config set once and never changes
struct EnclaveConfig {
    pub config: TeeConfig,
    pub mail: otp::MailChannelClient,
    pub mail_api: otp::MailApiChannelClient,
    pub sms: otp::SmsChannelClient,
    pub google: oauth::GoogleOAuthClient,
    pub github: oauth::GithubOAuthClient,
    pub apple: oauth::AppleOAuthClient,
}

// Rust doesn't support mutable statics, as it could lead to bugs in a multithreading setting
// and it cannot prevent this. So we need to use a mutex even if we have one thread
struct StateReader {
    inner: SgxMutex<EnclaveState>,
}

struct ConfigReader {
    inner: EnclaveConfig,
}

fn state() -> &'static StateReader {
    // Create an uninitialized static
    static mut SINGLETON: MaybeUninit<StateReader> = MaybeUninit::uninit();
    static ONCE: Once = Once::new();
    unsafe {
        ONCE.call_once(|| {
            // gen secp256r1 keypair
            let ecc_handle = SgxEccHandle::new();
            let _result = ecc_handle.open();
            let (prv_k, pub_k) = ecc_handle.create_key_pair().unwrap();
            // gen secp256k1 keypair
            let prv_k1 = SecretKey::parse(&prv_k.r).unwrap();
            let pub_k1 = PublicKey::from_secret_key(&prv_k1);

            let singleton = StateReader {
                inner: SgxMutex::new(EnclaveState {
                    sessions: Sessions::new(prv_k),
                    pub_k_r1: sgx_utils::key_to_bigendian(&pub_k),
                    pub_k_k1: pub_k1.serialize(),
                }),
            };
            // Store it to the static var, i.e. initialize it
            SINGLETON.write(singleton);
        });
        // Now we give out a shared reference to the data, which is safe to use
        // concurrently.
        SINGLETON.assume_init_ref()
    }
}

fn config(tee_config: Option<TeeConfig>) -> &'static ConfigReader {
    // Create an uninitialized static
    static mut SINGLETON: MaybeUninit<ConfigReader> = MaybeUninit::uninit();
    static ONCE: Once = Once::new();
    unsafe {
        ONCE.call_once(|| {
            let tee_conf = tee_config.unwrap();
            let singleton = ConfigReader {
                inner: EnclaveConfig {
                    config: tee_conf.clone(),
                    mail: otp::MailChannelClient::new(tee_conf.otp.email.clone()),
                    mail_api: otp::MailApiChannelClient::new(tee_conf.otp.email_api.clone()),
                    sms: otp::SmsChannelClient::new(tee_conf.otp.sms.clone()),
                    github: oauth::GithubOAuthClient::new(tee_conf.oauth.github.clone()),
                    google: oauth::GoogleOAuthClient::new(tee_conf.oauth.google.clone()),
                    apple: oauth::AppleOAuthClient::new(tee_conf.oauth.apple.clone()),
                },
            };
            // Store it to the static var, i.e. initialize it
            SINGLETON.write(singleton);
        });
        // Now we give out a shared reference to the data, which is safe to use
        // concurrently.
        SINGLETON.assume_init_ref()
    }
}

#[no_mangle]
pub extern "C" fn ec_key_exchange(
    user_key: *const u8,
    tee_key: &mut [u8; 64],
    session_id: &mut [u8; 32],
) -> sgx_status_t {
    // set tee_key
    let user_key_slice = unsafe { slice::from_raw_parts(user_key, 64) };
    let pub_k_r1 = get_pub_k_r1();
    info(&format!("user pub key {:?}", &user_key_slice));
    info(&format!("tee pub key {:?}", &pub_k_r1));
    let sid = register_session(user_key_slice);
    *tee_key = pub_k_r1;
    *session_id = sid.try_into().unwrap();
    if sid == [0; 32] {
        // unable to calculate share key for the given public key
        sgx_status_t::SGX_ERROR_INVALID_ATTRIBUTE
    } else {
        sgx_status_t::SGX_SUCCESS
    }
}

fn get_pub_k_r1() -> [u8; 64] {
    let state: std::sync::SgxMutexGuard<EnclaveState> = state().inner.lock().unwrap();
    state.pub_k_r1.clone()
}

#[no_mangle]
pub extern "C" fn ec_set_conf(config_b: *const u8, config_b_size: usize) -> sgx_status_t {
    let config_slice = unsafe { slice::from_raw_parts(config_b, config_b_size) };
    let new_config = serde_json::from_slice(config_slice).unwrap();
    info(&format!("sgx config {:?}", &new_config));
    config(new_config);
    info("set config success");
    sgx_status_t::SGX_SUCCESS
}

/*
 ec_register_email decrypts cipher_email and cipher_account,
 1, generate a random 6 digits, bind with user session
 2, send the digits to user email
*/
pub trait OtpChannelClient {
    fn new(conf: config::OtpChannelConf) -> Self
    where
        Self: Sized;
    fn send_otp(&self, to_account: &str, client: &Client, c_code: &str) -> GenericResult<()>;
}

#[no_mangle]
pub extern "C" fn ec_send_otp(
    otp_req: *const u8,
    otp_req_size: usize,
    error_code: &mut u8,
) -> sgx_status_t {
    info("sgx send otp");
    let req_slice = unsafe { slice::from_raw_parts(otp_req, otp_req_size as usize) };
    let req: OtpIn = serde_json::from_slice(req_slice).unwrap();
    // verify session
    let session_r = get_session(&req.session_id);
    if session_r.is_none() {
        error(&format!("sgx session {:?} not found.", &req.session_id));
        unsafe {
            *error_code = Error::new(ErrorKind::SessionError).to_int();
        }
        return sgx_status_t::SGX_SUCCESS;
    }
    let mut session = session_r.unwrap();
    if session.expire() {
        error(&format!("sgx session {:?} expired.", &req.session_id));
        unsafe {
            *error_code = Error::new(ErrorKind::SessionError).to_int();
        }
        ec_close_session(&req.session_id);
        return sgx_status_t::SGX_SUCCESS;
    }
    // decrypt account
    let account_r = decrypt_text_to_text(&req.cipher_account, &session);
    if account_r.is_err() {
        error(&format!("decrypt opt account failed."));
        unsafe {
            *error_code = Error::new(ErrorKind::DataError).to_int();
        }
        return sgx_status_t::SGX_SUCCESS;
    }
    let account = account_r.unwrap();
    info(&format!("otp account is {}", account));
    let otp = sgx_utils::rand();
    //TODO: sendmail error
    // get otp_client and send mail
    let otp_client_o = otp::get_otp_client(req.auth_type);
    if otp_client_o.is_none() {
        unsafe {
            *error_code = Error::new(ErrorKind::SendChannelError).to_int();
        }
        return sgx_status_t::SGX_SUCCESS;
    }
    // send otp
    let otp_client = otp_client_o.unwrap();
    let otp_r = otp_client.send_otp(&account, &req.client, &otp.to_string());
    if otp_r.is_err() {
        error("send otp failed");
        unsafe {
            *error_code = Error::new(ErrorKind::SendChannelError).to_int();
        }
        return sgx_status_t::SGX_SUCCESS;
    }
    // update session
    session.code = otp.to_string();
    let inner_account = InnerAccount {
        account: account.to_string(),
        auth_type: req.auth_type,
        id_type: IdType::from_auth_type(req.auth_type),
    };
    session.data = inner_account;
    update_session(&req.session_id, &session);
    unsafe {
        *error_code = 255;
    }
    sgx_status_t::SGX_SUCCESS
}

fn decrypt_text_to_text(cipher_text: &str, session: &Session) -> Result<String, Error> {
    let cipher_text_b_r = decode_hex(cipher_text);
    if cipher_text_b_r.is_err() {
        error("decode account failed");
        return Err(Error::new(ErrorKind::DataError));
    }
    let cipher_text_b = cipher_text_b_r.unwrap();
    let text_b_r = session.decrypt(&cipher_text_b);
    if text_b_r.is_err() {
        error("decrypt otp account failed");
        return Err(Error::new(ErrorKind::DataError));
    }
    let text_b = text_b_r.unwrap();
    match str::from_utf8(&text_b) {
        Ok(v) => Ok(v.to_string()),
        Err(e) => {
            error(&format!("decrypt otp account failed {:?}", e));
            Err(Error::new(ErrorKind::DataError))
        }
    }
}

pub trait OAuthClient {
    fn new(conf: config::OAuthConf) -> Self
    where
        Self: Sized;
    fn oauth(&self, c_code: &str, redirect_url: &str) -> GenericResult<InnerAccount>;
}

#[no_mangle]
pub extern "C" fn ec_auth_in_one(
    auth_req: *const u8,
    auth_req_size: usize,
    max_len: u32,
    account_b: *mut u8,
    account_b_size: *mut u32,
    cipher_dauth: *mut u8,
    cipher_dauth_size: *mut u32,
    error_code: &mut u8,
) -> sgx_status_t {
    // get request
    let req_slice = unsafe { slice::from_raw_parts(auth_req, auth_req_size) };
    let req_r = serde_json::from_slice(req_slice);
    if req_r.is_err() {
        error("invalid auth type");
        unsafe {
            *error_code = Error::new(ErrorKind::DataError).to_int();
        }
        return sgx_status_t::SGX_SUCCESS;
    }
    let req: AuthIn = req_r.unwrap();
    // get session
    let session_r = get_session(&req.session_id);
    if session_r.is_none() {
        error(&format!("sgx session {:?} not found.", &req.session_id));
        unsafe {
            *error_code = Error::new(ErrorKind::SessionError).to_int();
        }
        return sgx_status_t::SGX_SUCCESS;
    }
    let mut session = session_r.unwrap();
    if session.expire() {
        error(&format!("sgx session {:?} expired.", &req.session_id));
        unsafe {
            *error_code = Error::new(ErrorKind::SessionError).to_int();
        }
        ec_close_session(&req.session_id);
        return sgx_status_t::SGX_SUCCESS;
    }
    // decrypt code
    let code_r = decrypt_text_to_text(&req.cipher_code, &session);
    if code_r.is_err() {
        error(&format!("decrypt code failed."));
        unsafe {
            *error_code = Error::new(ErrorKind::DataError).to_int();
        }
        return sgx_status_t::SGX_SUCCESS;
    }
    let code = code_r.unwrap();
    info(&format!("auth code is {}", &code));
    // get account from author
    let result: Result<InnerAccount, Error> = match req.auth_type {
        AuthType::Email | AuthType::Sms => {
            // when auth_type None, compare otp code, if match, return account in session
            if !code.eq(&session.code) {
                info("confirm code not match, returning");
                Err(Error::new(ErrorKind::OtpCodeError))
            } else {
                Ok(session.data.clone())
            }
        }
        _ => {
            // when auth_type not none, call oauth, return oauth account or error
            let oauth_client_o = oauth::get_oauth_client(req.auth_type);
            if oauth_client_o.is_none() {
                Err(Error::new(ErrorKind::DataError))
            } else {
                let oauth_client = oauth_client_o.unwrap();
                let oauth_r = oauth_client.oauth(&code, &req.client.client_redirect_url);
                if oauth_r.is_err() {
                    Err(Error::new(ErrorKind::OAuthCodeError))
                } else {
                    Ok(oauth_r.unwrap())
                }
            }
        }
    };
    if result.is_err() {
        error("auth failed");
        unsafe {
            *error_code = result.err().unwrap().to_int();
        }
        return sgx_status_t::SGX_SUCCESS;
    }
    let mut account = result.unwrap();
    // when success, seal the account
    info(&format!("account is {:?}", &account));
    let sealed_r = sgx_utils::i_seal(account.account.as_bytes(), &get_config_seal_key());
    let sealed = match sealed_r {
        Ok(r) => r,
        Err(_) => {
            error("seal account failed");
            return sgx_status_t::SGX_ERROR_INVALID_ATTRIBUTE;
        }
    };
    let raw_hashed = web3::eth_hash(account.account.as_bytes());
    let account_hash = os_utils::encode_hex(&raw_hashed);
    info(&format!("account seal {:?}", sealed));
    info(&format!("account hash {:?}", raw_hashed));
    let out_account = Account {
        auth_type: account.auth_type,
        id_type: account.id_type,
        acc_seal: os_utils::encode_hex(&sealed),
        acc_hash: account_hash.clone(),
    };
    // update account to account_hash
    account.account = account_hash;
    // sign the auth
    let auth = InnerAuth {
        account: &account,
        auth_in: &req,
    };
    let mut dauth_signed = vec![];
    match req.sign_mode {
        SignMode::Jwt => {
            info("signing jwt");
            let claim = auth.to_jwt_claim(&get_issuer());
            let pem_key = get_config_rsa_key();
            let pem_key_b = pem_key.as_bytes();
            let key = EncodingKey::from_rsa_pem(pem_key_b).unwrap();
            let token = encode(&Header::new(Algorithm::RS256), &claim, &key).unwrap();
            dauth_signed = token.as_bytes().to_vec();
        }
        SignMode::Proof => {
            info("signing proof");
            let signature_b = web3::eth_sign_abi(
                &auth.account.id_type.to_string(),
                &auth.account.account,
                &auth.auth_in.request_id,
                get_config_edcsa_key(),
            );
            dauth_signed = EthSigned::new(auth.to_eth_auth(), &signature_b).to_json_bytes();
        }
        _ => {
            error("invalid sign mode");
            unsafe {
                *error_code = Error::new(ErrorKind::DataError).to_int();
            }
            return sgx_status_t::SGX_SUCCESS;
        }
    }
    info(&format!("dauth is {:?}", &dauth_signed));
    let cipher_dauth_b = session.encrypt(&dauth_signed);
    info(&format!("cipher dauth is {:?}", &cipher_dauth_b));
    // return
    let account_sgx = out_account.to_json_bytes();
    if account_sgx.len() > max_len as usize {
        error("account too long");
        return sgx_status_t::SGX_ERROR_INVALID_ATTRIBUTE;
    }
    if cipher_dauth_b.len() > max_len as usize {
        error("auth too long");
        return sgx_status_t::SGX_ERROR_INVALID_ATTRIBUTE;
    }
    unsafe {
        ptr::copy_nonoverlapping(account_sgx.as_ptr(), account_b, account_sgx.len());
        *account_b_size = account_sgx.len().try_into().unwrap();
        ptr::copy_nonoverlapping(cipher_dauth_b.as_ptr(), cipher_dauth, cipher_dauth_b.len());
        *cipher_dauth_size = cipher_dauth_b.len().try_into().unwrap();
    }
    ec_close_session(&req.session_id);
    unsafe {
        *error_code = 255;
    }
    sgx_status_t::SGX_SUCCESS
}

fn get_config_seal_key() -> String {
    let conf = &config(None).inner;
    conf.config.seal_key.clone()
}

fn get_config_edcsa_key() -> String {
    let conf = &config(None).inner;
    conf.config.ecdsa_key.clone()
}

fn get_pub_k_k1() -> [u8; 65] {
    let enclave_state = state().inner.lock().unwrap();
    enclave_state.pub_k_k1
}

fn get_prv_k() -> sgx_ec256_private_t {
    let enclave_state = state().inner.lock().unwrap();
    enclave_state.sessions.prv_k
}

fn get_issuer() -> String {
    let conf = &config(None).inner;
    conf.config.jwt_issuer.clone()
}

fn get_config_rsa_key() -> String {
    let conf = &config(None).inner;
    conf.config.rsa_key.clone()
}

//TODO: get sign pub key automatically
#[no_mangle]
pub extern "C" fn ec_get_sign_pub_key(
    pub_key: &mut [u8; 2048],
    pub_key_size: *mut u32,
) -> sgx_status_t {
    let mut enclave_state = state().inner.lock().unwrap();
    // let pub_key_slice = enclave_state.rsa_pub_key.to_public_key_pem();
    // pkcs1::ToRsaPublicKey::to_pkcs1_pem(&pub_key_slice);
    sgx_status_t::SGX_SUCCESS
}

fn ec_close_session(session_id: &String) -> sgx_status_t {
    let mut enclave_state = state().inner.lock().unwrap();
    enclave_state.sessions.close_session(session_id);
    sgx_status_t::SGX_SUCCESS
}

pub fn keccak256(bytes: &[u8]) -> [u8; 32] {
    use tiny_keccak::{Hasher, Keccak};
    let mut output = [0u8; 32];
    let mut hasher = Keccak::v256();
    hasher.update(bytes);
    hasher.finalize(&mut output);
    output
}

fn get_session(session_id: &str) -> Option<Session> {
    let mut enclave_state = state().inner.lock().unwrap();
    enclave_state.sessions.get_session(session_id)
}

fn update_session(session_id: &str, session: &Session) {
    let mut enclave_state = state().inner.lock().unwrap();
    enclave_state.sessions.update_session(session_id, session);
}

fn register_session(user_key_slice: &[u8]) -> [u8; 32] {
    let mut enclave_state = state().inner.lock().unwrap();
    enclave_state
        .sessions
        .register_session(user_key_slice.try_into().unwrap())
}

//Testing functions
#[no_mangle]
pub extern "C" fn ec_test() -> sgx_status_t {
    sgx_status_t::SGX_SUCCESS
}

#[no_mangle]
pub extern "C" fn ec_test_seal_unseal() -> sgx_status_t {
    sgx_status_t::SGX_SUCCESS
}
