use hyper::{Body, Request, Response, Client};
use std::convert::Infallible;
use log::*;
use tokio::task;


use crate::ws_handler::MESSAGES; // Import the MESSAGES from the WebSocket handler

pub async fn http_handler(_req: Request<Body>) -> Result<Response<Body>, Infallible> {
    // Handle your HTTP requests here
    info!("Received HTTP request: {:?}", _req);

    // Get the received messages from the MESSAGES queue
    let messages = MESSAGES.lock().unwrap();
    let message_str = messages.iter().cloned().collect::<Vec<String>>().join("\n");

    // Create the response with the received messages
    let response = Response::builder()
        .header("Content-Type", "text/plain")
        .body(Body::from(message_str))
        .unwrap();

    Ok(response)
}

pub async fn forward_message(body: String) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Replace with your desired HTTP endpoint
    let endpoint_url = "http://127.0.0.1:8080/block";

    let client = Client::new();

    let request = Request::builder()
        .uri(endpoint_url)
        .header("Content-Type", "application/json")
        .body(Body::from(body))
        .unwrap();

    info!("Sending HTTP request: {:?}", request);

    let response = task::spawn_blocking(move || {
        tokio::task::block_in_place(|| client.request(request))
    })
    .await?;

    info!("Received HTTP response: {:?}", response);

    Ok(())
}