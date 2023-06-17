use ws::util::Token;
use ws::{CloseCode, Error, ErrorKind, Frame, Handler, Handshake, Message, OpCode, Result, Sender, Request, Response};
use std::sync::{Arc, Mutex};
use std::collections::VecDeque;
use lazy_static::lazy_static;
use log::*;

use mio_extras::timer::Timeout;

use crate::messages::Command;
use crate::connections::Connections;


lazy_static! {
    // Create a shared mutable state to store the messages received by the server
    pub static ref MESSAGES: Mutex<VecDeque<String>> = Mutex::new(VecDeque::new());
}

// Load the index.html file
static INDEX_HTML: &'static [u8] = include_bytes!("index.html");

const PING: Token = Token(1);
const EXPIRE: Token = Token(2);

pub struct Server {
    pub connections: Arc<Mutex<Connections>>,
    pub out: Sender,
    pub ping_timeout: Option<Timeout>,
    pub expire_timeout: Option<Timeout>,
}

// Server WebSocket handler
impl Handler for Server {
    fn on_open(&mut self, _: Handshake) -> Result<()> {
        // Schedule a timeout to send a ping every 15 seconds
        self.out.timeout(15_000, PING)?;
        // Schedule a timeout to close the connection if there is no activity for 60 seconds
        self.out.timeout(120_000, EXPIRE)?;
        Ok(())
    }

    fn on_request(&mut self, req: &Request) -> Result<Response> {
        match req.resource() {
            // The default trait implementation
            "/ws" => ws::Response::from_request(req),
    
            // Handle the root endpoint ("/")
            "/" => Ok(ws::Response::new(200, "OK", INDEX_HTML.to_vec())),
    
            // Handle other requests
            _ => Ok(ws::Response::new(404, "Not Found", b"404 - Not Found".to_vec())),
        }
    }
    
    fn on_message(&mut self, msg: Message) -> Result<()> {
        match msg {
            Message::Text(json_str) => {
                // Log the received message
                info!("Received message: {}", json_str);
    
                // Parse the JSON message
                let json_obj: serde_json::Value = match serde_json::from_str(&json_str) {
                    Ok(value) => value,
                    Err(_error) => {
                        // Ignore messages that cannot be parsed as JSON
                        return Ok(());
                    }
                };
    
                // Check if the type is "ack"
                let type_str = json_obj["type"].as_str().unwrap_or_default();
                if type_str == "ack" {
                    // Store the received message
                    MESSAGES.lock().unwrap().push_back(json_str.clone());
                } else {
                    // Extract the command field
                    let command_str = json_obj["command"].as_str().unwrap_or_default();
    
                    // Convert the command string to a Command enum
                    let command = match command_str {
                        "get_specs" => Command::GetSpecifications,
                        "remove" => Command::Remove,
                        "cli" => Command::Cli,
                        _ => return Ok(()), // Ignore unknown commands
                    };
    
                    // Extract the data field
                    let data_arr = json_obj["data"].as_array().unwrap();
                    let mut data: Vec<Vec<String>> = vec![];
    
                    for arg_val in data_arr {
                        if let Some(arg_str) = arg_val.as_str() {
                            let arg_arr: Vec<String> = arg_str.split_whitespace().map(|s| s.to_string()).collect();
                            data.push(arg_arr);
                        }
                    }
    
                    // Convert the Command enum to a Messages instance
                    let message = command.to_message(data);
    
                    // Convert the Messages instance to a Message instance
                    let message_str = serde_json::to_string(&message).unwrap();
    
        
                    // Broadcast the message to all connected clients
                    self.out.broadcast(message_str.clone())?;
                }
            }
            _ => (),
        }
    
        Ok(())
    }
    
    
    
    fn on_error(&mut self, err: Error) {
        // Shutdown on any error
        warn!("Shutting down server for error: {}", err);
        self.out.shutdown().unwrap();
    }

    fn on_timeout(&mut self, event: Token) -> Result<()> {
        match event {
            // PING timeout has occurred, send a ping and reschedule
            PING => {
                self.out.send(Message::Text("ping".to_string()))?;
                self.ping_timeout.take();
                self.out.timeout(15_000, PING)
            }
            // EXPIRE timeout has occurred, this means that the connection is inactive, let's close
            EXPIRE => self.out.close(CloseCode::Away),
            // No other timeouts are possible
            _ => Err(Error::new(
                ErrorKind::Internal,
                "Invalid timeout token encountered!",
            )),
        }
    }

    fn on_new_timeout(&mut self, event: Token, timeout: Timeout) -> Result<()> {
        // Cancel the old timeout and replace.
        if event == EXPIRE {
            if let Some(t) = self.expire_timeout.take() {
                self.out.cancel(t)?
            }
            self.expire_timeout = Some(timeout)
        } else {
            // This ensures there is only one ping timeout at a time
            if let Some(t) = self.ping_timeout.take() {
                self.out.cancel(t)?
            }
            self.ping_timeout = Some(timeout)
        }

        Ok(())
    }

    fn on_frame(&mut self, frame: Frame) -> Result<Option<Frame>> {
        // If the frame is a pong, check the payload
        if frame.opcode() == OpCode::Pong {
            let payload_str = String::from_utf8_lossy(frame.payload());
            if payload_str == "pong" {
                info!("Received pong.");
            } else {
                warn!("Received unexpected pong: {}", payload_str);
            }
        }

        // Reset the expiration timeout
        self.out.timeout(120_000, EXPIRE)?;

        // Run default frame validation
        DefaultHandler.on_frame(frame)
    }
}

// For accessing the default handler implementation
struct DefaultHandler;

impl Handler for DefaultHandler {}
