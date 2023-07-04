extern crate openssl;
#[macro_use]
extern crate log;
extern crate config as config_file;
extern crate log4rs;

use std::env;
use std::str;

use actix_cors::Cors;
use actix_files as afs;
use actix_web::{dev::Service as _, web, App, HttpServer};
use jsonwebkey_convert::der::FromPem;
use jsonwebkey_convert::*;
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};

use log::{debug, error, info, warn};
extern crate sgx_types;
extern crate sgx_urts;
use sgx_types::*;
use sgx_urts::SgxEnclave;

use mysql::*;

mod config;
mod ecall;
mod endpoint;
mod error;
mod model;
mod ocall;
mod persistence;

use config_file::{Config, File};
use endpoint::service::*;
use endpoint::tee::*;
use ocall::*;
use persistence::dclient::*;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use sp_core::{sr25519, Pair};
use subxt::{dynamic::Value, tx::PairSigner, OnlineClient, PolkadotConfig};

static ENCLAVE_FILE: &'static str = "enclave.signed.so";

/// Create enclave instance when app starts
fn init_enclave() -> SgxEnclave {
    let mut launch_token: sgx_launch_token_t = [0; 1024];
    let mut launch_token_updated: i32 = 0;
    // call sgx_create_enclave to initialize an enclave instance
    let debug = 1;
    let mut misc_attr = sgx_misc_attribute_t {
        secs_attr: sgx_attributes_t { flags: 0, xfrm: 0 },
        misc_select: 0,
    };
    let sgx_result = SgxEnclave::create(
        ENCLAVE_FILE,
        debug,
        &mut launch_token,
        &mut launch_token_updated,
        &mut misc_attr,
    );
    match sgx_result {
        Ok(r) => {
            info!("Init Enclave Successful {}!", r.geteid());
            return r;
        }
        Err(x) => {
            error!("Init Enclave Failed {}!", x.as_str());
            panic!("Init Enclave Failed, exiting");
        }
    };
}

/// Create enclave instance and generate key pairs inside tee
/// for secure communication
fn init_enclave_and_set_conf(conf: config::TeeConfig) -> SgxEnclave {
    let enclave = init_enclave();
    let mut sgx_result = sgx_status_t::SGX_SUCCESS;
    let config_b = serde_json::to_vec(&conf).unwrap();
    let config_b_size = config_b.len();
    let result = unsafe {
        ecall::ec_test(enclave.geteid(), &mut sgx_result);
        ecall::ec_set_conf(
            enclave.geteid(),
            &mut sgx_result,
            config_b.as_ptr() as *const u8,
            config_b_size,
        )
    };
    match result {
        sgx_status_t::SGX_SUCCESS => {
            println!("set config in sgx done.");
        }
        _ => panic!("Enclave generate key-pair failed!"),
    }
    return enclave;
}

/// Create enclave instance and generate key pairs inside tee
/// for secure communication
/*
fn get_rsa_pub_key(enclave: SgxEnclave) -> Result<String> {
    let mut sgx_result = sgx_status_t::SGX_SUCCESS;
    let mut rsa_pub_key = [0u8; 2048];
    let result = unsafe {
        ecall::ec_get_sign_pub_key(
            enclave.geteid(),
            &mut sgx_result,
            &mut rsa_pub_key,
            rsa_pub_key_size
        );
    };
    match result {
        sgx_status_t::SGX_SUCCESS => {
            println!("set config in sgx done.");
        },
        _ => panic!("Enclave generate key-pair failed!")
    }
    return enclave;
}
*/

fn parse_jwk(rsa_pub_key: String) -> RSAPublicKey {
    jsonwebkey_convert::RSAPublicKey::from_pem(rsa_pub_key).unwrap()
}

/// Create database connection pool using conf from config file
fn init_db_pool(conf: &config::DbConfig) -> Pool {
    let db_user = &conf.user;
    let db_host = &conf.host;
    let db_password = &conf.password;
    let db_port = conf.port;
    let db_name = &conf.name;
    let db_url = format!(
        "mysql://{}:{}@{}:{}/{}",
        db_user, db_password, db_host, db_port, db_name
    );
    let ops = Opts::from_url(&db_url).unwrap();
    let pool = mysql::Pool::new(ops).unwrap();
    return pool;
}

/// Read config file and save config to hash map
fn load_conf(fname: &str) -> config::DauthConfig {
    Config::builder()
        .add_source(File::with_name(fname))
        .build()
        .unwrap()
        .try_deserialize::<config::DauthConfig>()
        .unwrap()
}

async fn register_node(phrase: &str) {
    let apir = OnlineClient::<PolkadotConfig>::new().await;
    let api = match apir {
        Ok(api) => api,
        Err(err) => {
            error!("Error registering");
            return;
        }
    };
    let pair = sr25519::Pair::from_string(phrase, None).unwrap();
    let signer = PairSigner::new(pair);
    // call register_node when start up
    let tx = subxt::dynamic::tx(
        "KeyLedger",
        "register_node",
        vec![Value::string("testnode")],
    );
    // submit the transaction with default params:
    let hash = api.tx().sign_and_submit_default(&tx, &signer).await;
    match hash {
        Ok(hash) => {
            info!("register_node: {}", hash);
        }
        Err(e) => {
            error!("register_node: {}", e);
        }
    }
}

/// This is the entrance of the web app server.
/// It binds all api to function defined in mod endpoint.
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    log4rs::init_file("log4rs.yml", Default::default()).unwrap();
    info!("logging!");
    register_node(&env::var("KS_ACCOUNT").unwrap()).await;
    let conf = load_conf("conf");
    let workers: usize = conf.api.workers.try_into().unwrap();
    let pool = rayon::ThreadPoolBuilder::new()
        .num_threads(workers)
        .build()
        .unwrap();
    // edata stores environment and config information
    let client_db = init_db_pool(&conf.db.client);
    let enclave = init_enclave_and_set_conf(conf.to_tee_config(
        env::var("RSA_KEY").unwrap(),
        env::var("ECDSA_KEY").unwrap(),
        env::var("SEAL_KEY").unwrap(),
    ));
    let rsa_pub_key = parse_jwk(env::var("RSA_PUB_KEY").unwrap());
    let edata: web::Data<AppState> = web::Data::new(AppState {
        tee: TeeService::new(enclave, pool),
        rsa_pub_key: rsa_pub_key,
        db_pool: init_db_pool(&conf.db.auth),
        clients: query_clients(&client_db).unwrap(),
        env: conf.api.env.clone(),
        port: conf.api.port,
    });

    // add certs to server for https service api
    let mut builder = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
    builder
        .set_private_key_file("certs/MyKey.key", SslFiletype::PEM)
        .unwrap();
    builder
        .set_certificate_chain_file("certs/MyCertificate.crt")
        .unwrap();

    let subpath = conf.api.prefix;
    let server = HttpServer::new(move || {
        let cors = Cors::permissive();
        let app = App::new()
            //.wrap(endpoint::middleware::VerifyToken)
            //.wrap(middleware::Logger::default())
            .wrap(cors)
            .app_data(web::Data::clone(&edata))
            .service(
                web::scope(&subpath)
                    .service(exchange_key)
                    .service(send_otp)
                    .service(auth_in_one)
                    // .service(jwks)
                    .service(health),
            );
        // load index.html for testing only when env is dev
        match conf.api.env {
            config::Env::TEST => {
                app.service(afs::Files::new("/", "./public").index_file("index.html"))
            }
            _ => app,
        }
    })
    .workers(workers);
    // uncomment to enable https
    let protocol = conf.api.protocol;
    if protocol.eq("https") {
        let server_url = format!("{}:{}", &conf.api.host, &conf.api.port);
        server.bind_openssl(server_url, builder)?.run().await
    } else {
        server.bind((conf.api.host, conf.api.port))?.run().await
    }
}
