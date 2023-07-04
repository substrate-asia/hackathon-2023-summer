extern crate openssl;
#[macro_use]
use std::str;
use actix_http::header::{HeaderMap, ORIGIN};
use actix_web::{get, post, web, HttpRequest, HttpResponse, Responder};
use jsonwebkey_convert::*;
use log::{error, info};
use serde::Serialize as Serialize2;
use serde_derive::{Deserialize, Serialize};
extern crate sgx_types;
extern crate sgx_urts;
use crate::config::*;
use crate::ecall;
use crate::endpoint::utils;
use crate::error as derr;
use crate::model::*;
use crate::persistence::dauth::*;
use crate::persistence::dclient::*;
use mysql::*;

use super::tee::*;

/// BaseResp is a base response for most request
/// status can either be:
/// SUCCESS or
/// FAIL
#[derive(Debug, Serialize, Deserialize)]
pub struct FailResp {
    status: Status,
    error_code: String,
    error_msg: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
enum Status {
    Fail,
    Success,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SuccResp<Data: Serialize2> {
    status: Status,
    data: Data,
}

fn fail_resp(err: derr::Error) -> HttpResponse {
    HttpResponse::Ok().json(FailResp {
        status: Status::Fail,
        error_code: format!("{:?}", err.kind()),
        error_msg: err.to_string(),
    })
}

fn succ_resp() -> HttpResponse {
    HttpResponse::Ok().json(SuccResp {
        status: Status::Success,
        data: "".to_string(),
    })
}

fn json_resp<S: Serialize2>(resp: S) -> HttpResponse {
    HttpResponse::Ok().json(SuccResp {
        status: Status::Success,
        data: resp,
    })
}

/// AppState includes:
/// enclave instance, db_pool instance and config instance
/// It is Passed to every request handler
#[derive(Debug)]
pub struct AppState {
    pub tee: TeeService,
    pub rsa_pub_key: RSAPublicKey,
    pub db_pool: Pool,
    pub clients: Vec<Client>,
    pub env: Env,
    pub port: u16,
    // pub conf: HashMap<String, String>
}

/// Exchange Key Request includes a user public key for secure channel
#[derive(Deserialize)]
pub struct ExchangeKeyReq {
    client_id: String,
    key: String,
}

/// Exchange key Response returns tee public key
#[derive(Debug, Serialize)]
pub struct ExchangeKeyResp {
    status: String,
    data: ExchangeKeyOut,
}

/* Exchange key function takes exchange key req from user as user pub key,
   and return exchange key resp as tee pub key.
   Browser accept pub key format as 04 + hex of pub key,
   while tee accept pub key format as [u8;64].
   Remove 04 before send to tee and add 04 before send to browser.
*/
#[post("/exchange_key")]
pub async fn exchange_key(
    req: web::Json<ExchangeKeyReq>,
    http_req: HttpRequest,
    endex: web::Data<AppState>,
) -> impl Responder {
    info!("exchange key with {}", &req.key);
    let tee = &endex.tee;
    // remove 04 from pub key
    if get_client(
        &endex.clients,
        &req.client_id,
        http_req.headers(),
        &endex.env,
    )
    .is_none()
    {
        info!("client id not found");
        return fail_resp(derr::Error::new(derr::ErrorKind::ClientError));
    }
    let exk_in = ExchangeKeyIn { key: &req.key };
    match tee.exchange_key(exk_in) {
        Ok(r) => json_resp(r),
        Err(e) => fail_resp(e),
    }
}

#[derive(Deserialize)]
pub struct AuthOtpReq {
    client_id: String,
    session_id: String,
    cipher_account: String,
    account_type: AuthType,
    request_id: Option<String>,
}

// with BaseResp
#[post("/send_otp")]
pub async fn send_otp(
    req: web::Json<AuthOtpReq>,
    http_req: HttpRequest,
    endex: web::Data<AppState>,
) -> HttpResponse {
    info!("auth email with session_id {}", &req.session_id);
    // validate client
    let client_o = get_client(
        &endex.clients,
        &req.client_id,
        http_req.headers(),
        &endex.env,
    );
    if client_o.is_none() {
        info!("client id not found");
        return fail_resp(derr::Error::new(derr::ErrorKind::ClientError));
    }
    let client = client_o.unwrap();
    let tee = &endex.tee;
    let auth_otp_in = OtpIn {
        session_id: &req.session_id,
        cipher_account: &req.cipher_account,
        auth_type: req.account_type,
        client: &client,
    };
    match tee.send_otp(auth_otp_in) {
        Ok(_) => succ_resp(),
        Err(e) => fail_resp(e),
    }
}

#[derive(Deserialize)]
pub struct AuthInOneReq {
    client_id: String,
    session_id: String,
    cipher_code: String,
    auth_type: AuthType,
    request_id: Option<String>,
    sign_mode: Option<SignMode>, // default proof, or JWT
}

#[post("/auth_in_one")]
pub async fn auth_in_one(
    req: web::Json<AuthInOneReq>,
    http_req: HttpRequest,
    endex: web::Data<AppState>,
) -> HttpResponse {
    info!("register mail confirm with session_id {}", &req.session_id);
    info!("auth email with session_id {}", &req.session_id);
    // validate client
    let client_o = get_client(
        &endex.clients,
        &req.client_id,
        http_req.headers(),
        &endex.env,
    );
    if client_o.is_none() {
        info!("client id not found");
        return fail_resp(derr::Error::new(derr::ErrorKind::ClientError));
    }
    let client = client_o.unwrap();
    let tee = &endex.tee;
    let request_id = match &req.request_id {
        Some(r) => r,
        None => "None",
    };
    let sign_mode = match &req.sign_mode {
        Some(r) => r.to_owned(),
        None => SignMode::Proof,
    };
    let auth_in = AuthIn {
        session_id: &req.session_id,
        cipher_code: &req.cipher_code,
        request_id,
        client: &client,
        auth_type: req.auth_type,
        sign_mode,
    };
    let auth_result = tee.auth_dauth(auth_in);
    if auth_result.is_err() {
        return fail_resp(auth_result.err().unwrap());
    }
    let auth_out = auth_result.unwrap();
    let account = auth_out.account;
    let insert_r = insert_account_if_new(&endex.db_pool, &account);
    if insert_r.is_err() {
        error!("insert account error {}", insert_r.err().unwrap());
        return fail_resp(derr::Error::new(derr::ErrorKind::DbError));
    }
    let auth = Auth::new(&account, &client.client_name, request_id);
    let insert_auth_r = insert_auth(&endex.db_pool, auth);
    if insert_auth_r.is_err() {
        error!("insert auth error {}", insert_auth_r.err().unwrap());
        return fail_resp(derr::Error::new(derr::ErrorKind::DbError));
    }
    json_resp(auth_out.cipher_sign)
}

#[get("/health")]
pub async fn health(endex: web::Data<AppState>) -> impl Responder {
    // for health check
    info!("dauth sdk is up and running");
    HttpResponse::Ok().body(format!("{} is up!", endex.port))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JwksResp {
    keys: Vec<RSAPublicKey>,
}

/*
#[get("/jwks.json")]
pub async fn jwks(endex: web::Data<AppState>) -> impl Responder {
    // for health check
    info!("get rsa pub key");
    let pub_key = endex.rsa_pub_key.clone();
    json_resp(JwksResp {
        keys: vec![pub_key]
    })
}
*/

fn get_client(
    clients: &Vec<Client>,
    client_id: &str,
    headers: &HeaderMap,
    env: &Env,
) -> Option<Client> {
    for client in clients {
        debug!("comparing {}", &client.client_id);
        if client.client_id == client_id {
            match env {
                Env::PROD => {
                    let origin_v = headers.get(ORIGIN);
                    if origin_v.is_none() {
                        error!("origin is none");
                        return None;
                    }
                    let origin = origin_v.unwrap().to_str().unwrap();
                    debug!("comparing origin {} {}", origin, client.client_origin);
                    if origin.eq(&client.client_origin) {
                        return Some(client.clone());
                    } else {
                        error!("origin not match");
                        return None;
                    }
                }
                _ => {
                    return Some(client.clone());
                }
            }
        }
    }
    None
}
