extern crate sgx_types;
extern crate sgx_urts;

use crate::ecall;
use crate::error::{Error, ErrorKind};
use crate::model::*;
use crate::persistence::dclient::Client;

use super::utils;
use serde_derive::{Deserialize, Serialize};
use sgx_types::*;
use sgx_urts::SgxEnclave;
pub trait TeeAuth {
    fn exchange_key(&self, exk_in: ExchangeKeyIn) -> Result<ExchangeKeyOut, Error>;
    fn send_otp(&self, otp_in: OtpIn) -> Result<(), Error>;
    fn auth_dauth(&self, otp_confirm_in: AuthIn) -> Result<AuthOut, Error>;
}

#[derive(Debug)]
pub struct TeeService {
    enclave: SgxEnclave,
    pool: rayon::ThreadPool,
}

impl TeeService {
    pub fn new(enclave: SgxEnclave, pool: rayon::ThreadPool) -> Self {
        Self { enclave, pool }
    }
}

/// Exchange Key Request includes a user public key for secure channel
#[derive(Debug)]
pub struct ExchangeKeyIn<'a> {
    pub key: &'a str,
}

/// Exchange key Response returns tee public key
#[derive(Debug, Serialize)]
pub struct ExchangeKeyOut {
    pub key: String,
    pub session_id: String,
}

/// Exchange Key Request includes a user public key for secure channel
#[derive(Debug, Serialize)]
pub struct OtpIn<'a> {
    pub session_id: &'a str,
    pub cipher_account: &'a str,
    pub auth_type: AuthType,
    pub client: &'a Client,
}

/// Exchange Key Request includes a user public key for secure channel
#[derive(Debug, Serialize)]
pub struct AuthIn<'a> {
    pub session_id: &'a str,
    pub request_id: &'a str, // default None
    pub cipher_code: &'a str,
    pub client: &'a Client,
    pub auth_type: AuthType, // when sms/email, compare code; when google, github, apple, call oauth
    pub sign_mode: SignMode, // default Proof
}

/// Exchange Key Request includes a user public key for secure channel
#[derive(Debug)]
pub struct AuthOut {
    pub account: Account,
    pub cipher_sign: String,
}

impl TeeAuth for TeeService {
    fn exchange_key(&self, exk_in: ExchangeKeyIn) -> Result<ExchangeKeyOut, Error> {
        let in_key = hex::decode(&exk_in.key[2..]).map_err(|err| {
            error!("decode pub key failed {}", err);
            Error::new(ErrorKind::DataError)
        })?;
        let in_key_b: [u8; 64] = in_key.try_into().map_err(|err| {
            error!("user pub key is not 64 bytes");
            Error::new(ErrorKind::DataError)
        })?;
        let mut out_key: [u8; 64] = [0; 64];
        let mut session_id: [u8; 32] = [0; 32];
        let mut sgx_result = sgx_status_t::SGX_SUCCESS;
        let result = self.pool.install(|| unsafe {
            ecall::ec_key_exchange(
                self.enclave.geteid(),
                &mut sgx_result,
                &in_key_b,
                &mut out_key,
                &mut session_id,
            )
        });
        if !sgx_success(result) || !sgx_success(sgx_result) {
            error!("tee call failed.");
            return Err(Error::new(ErrorKind::SgxError));
        }
        let out_key_hex = hex::encode(out_key);
        let session_id_hex = hex::encode(session_id);
        Ok(ExchangeKeyOut {
            key: out_key_hex,
            session_id: session_id_hex,
        })
    }

    fn send_otp(&self, otp_in: OtpIn) -> Result<(), Error> {
        let in_b = serde_json::to_vec(&otp_in).map_err(|err| {
            error!("auth_otp request to bytes failed, {}", err);
            Error::new(ErrorKind::DataError)
        })?;

        let mut sgx_result = sgx_status_t::SGX_SUCCESS;
        let mut error_code = 255;
        let result = self.pool.install(|| unsafe {
            ecall::ec_send_otp(
                self.enclave.geteid(),
                &mut sgx_result,
                in_b.as_ptr() as *const u8,
                in_b.len(),
                &mut error_code,
            )
        });
        if !sgx_success(result) || !sgx_success(sgx_result) {
            error!("tee call failed.");
            return Err(Error::new(ErrorKind::SgxError));
        }
        if error_code == 255 {
            return Ok(());
        }
        match Error::from_int(error_code) {
            Some(err) => Err(err),
            None => {
                error!("unknown error code {}", error_code);
                Err(Error::new(ErrorKind::SgxError))
            }
        }
    }

    fn auth_dauth(&self, otp_c_in: AuthIn) -> Result<AuthOut, Error> {
        let auth_req = serde_json::to_vec(&otp_c_in).map_err(|err| {
            error!("encode client error, {}", err);
            Error::new(ErrorKind::DataError)
        })?;
        const MAX_LEN: usize = 2048;
        let mut account_b = [0_u8; MAX_LEN];
        let mut account_b_size = 0;
        let mut cipher_dauth = [0_u8; MAX_LEN];
        let mut cipher_dauth_size = 0;
        let mut sgx_result = sgx_status_t::SGX_SUCCESS;
        let mut error_code = 255;
        let result = self.pool.install(|| unsafe {
            ecall::ec_auth_in_one(
                self.enclave.geteid(),
                &mut sgx_result,
                auth_req.as_ptr() as *const u8,
                auth_req.len(),
                MAX_LEN,
                account_b.as_ptr() as *mut u8,
                &mut account_b_size,
                cipher_dauth.as_ptr() as *mut u8,
                &mut cipher_dauth_size,
                &mut error_code,
            )
        });
        if error_code == 255 {
            info!("confirm otp successfully");
            let account_slice = &account_b[0..account_b_size];
            let account = serde_json::from_slice(account_slice).unwrap();
            let dauth_slice = &cipher_dauth[0..cipher_dauth_size];
            return Ok(AuthOut {
                account,
                cipher_sign: hex::encode(dauth_slice),
            });
        }
        match Error::from_int(error_code) {
            Some(err) => Err(err),
            None => {
                error!("unknown error code {}", error_code);
                Err(Error::new(ErrorKind::SgxError))
            }
        }
    }
}

fn sgx_success(t: sgx_status_t) -> bool {
    t == sgx_status_t::SGX_SUCCESS
}
