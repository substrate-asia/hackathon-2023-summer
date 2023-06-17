extern crate mio_extras;
extern crate time;
extern crate ws;
extern crate hyper;

use ws::listen;
use hyper::Server;
use hyper::service::{make_service_fn, service_fn};
use std::convert::Infallible;
use std::sync::{Arc, Mutex};
use log::*;


mod ws_handler;
mod messages;
mod serde_types;
mod connections;
mod http_handler;

use ws_handler::Server as WsServer;
use http_handler::{http_handler, forward_message};
use crate::connections::Connections;

#[tokio::main]
async fn main() {
    // Initialize logger
    let config_str = include_str!("log.yml");
    let config = serde_yaml::from_str(config_str).unwrap();
    log4rs::init_raw_config(config).unwrap();

    // Create a new instance of Connections
    let connections = Arc::new(Mutex::new(Connections::new()));

    // Spawn a tokio task to run the WebSocket server
    let ws_connections = connections.clone();
    tokio::spawn(async move {
        listen("127.0.0.1:9000", |out| {
            WsServer {
                connections: ws_connections.clone(),
                out,
                ping_timeout: None,
                expire_timeout: None,
            }
        }).unwrap();
    });

    // Create an HTTP server
    let addr = ([127, 0, 0, 1], 8080).into();
    let make_svc = make_service_fn(|_conn| {
        async {
            Ok::<_, Infallible>(service_fn(http_handler))
        }
    });

    let http_server = Server::bind(&addr).serve(make_svc);

    // Spawn a tokio task to execute the forward_message function
    tokio::spawn(async move {
        let body = "Your message body here".to_string();
        forward_message(body).await.unwrap();
    });

    if let Err(e) = http_server.await {
        error!("HTTP server error: {}", e);
    }
}
