use std::{
    borrow::Cow,
    time::{Duration, SystemTime, UNIX_EPOCH},
};


use crate::{
    api_calls,
    config::Configuration,
    formats::{self, OptionalStatusCode, OptionalUuid},
};
use anyhow::{anyhow, bail, Context, Result};
use futures_util::{SinkExt, StreamExt, TryFutureExt, TryStreamExt};
use http::{Request, Uri};
use log::{self, error, info};
use serde::{Deserialize, Serialize};
use serde_json::{from_str, Value};
use tokio::select;
use tokio_tungstenite::{
    connect_async,
    tungstenite::{
        protocol::{frame::coding::CloseCode, CloseFrame},
        Message,
    },
};
use uuid::Uuid;
// use local_ip_address::local_ip;


#[derive(Deserialize, Serialize)]
/// the required format for messages within text websocket frames
struct Messages {
    #[serde(rename = "type")]
    request_type: RequestType,
    /// randomly generated id for the message
    #[serde(with = "formats::SerdeUuid")]
    id: Uuid,
    /// reference to the previous message, if any
    #[serde(rename = "ref")]
    reference_id: OptionalUuid,
    /// ms since UNIX epoch
    timestamp: String,
    /// a status code
    status_code: OptionalStatusCode,
    args: Vec<String>,
    /// timeout value in ms
    timeout: Option<u64>,
    data: Value,
}

#[derive(Deserialize, Serialize)]
pub enum RequestType {
    /// a new request
    #[serde(rename = "syn")]
    Syn,
    #[serde(rename = "ack")]
    /// a response (acknowledgement) to a previous request
    Ack,
}

/// connects to websocket, handles message frames, and starts scheduled actions
pub async fn run_client(config: &Configuration) -> Result<()> {
    let config: Configuration = config.clone();
    let request = create_request(
        &config.base.websocket_url,
        &config.base.user_token,
        &config.base.csc_uuid,
    )?;
    let (ws_stream, _) = connect_async(request).await.context("Failed to connect")?;
    info!("Connected to {}", config.base.websocket_url);
    let (mut ws_sender, ws_receiver) = ws_stream.split();
    let (mut input_tx, input_rx) = futures_channel::mpsc::unbounded();
    let (output_tx, output_rx) = futures_channel::mpsc::unbounded();
  
    
    let message_handling = tokio::spawn(async move {
        // map with ok and use try_for_each_concurrent to short circuit message handling on error
        input_rx
            .map(Ok)
            .try_for_each_concurrent(None, |message| async {
                let mut output_tx = output_tx.clone();
                match message {
                    Err(e) => {
                        error!("Error in receiving message: {}", e);
                        output_tx
                            .send(Message::Close(Some(CloseFrame {
                                code: CloseCode::Error,
                                reason: Cow::from("Error receiving message"),
                            })))
                            .await
                            .unwrap();
                        bail!("{}", e);
                    }
                    Ok(message) => {
                        use Message::*;
    
                        match message {
                            Text(data) => {
                                info!("Received message: {}", data);
                                let processed_message = process_message(data, config.runtime.timeout)
                                    .await
                                    .context("Failed to process message")?;
                                info!("Processed message: {}", processed_message);
                                output_tx
                                    .send(Text(processed_message))
                                    .await
                                    .context("Failed to reply with message")
                            }
                            Close(_) => {
                                info!("Received close, closing");
                                // ignore any errors while sending close frame
                                let _ = output_tx
                                    .send(Message::Close(Some(CloseFrame {
                                        code: CloseCode::Normal,
                                        reason: Cow::from(""),
                                    })))
                                    .await
                                    .context("Failed to reply with message");
                                Err(anyhow!("Received close, closing"))
                            }
                            _ => {
                                info!("Received unexpected frame: {:?}", message);
                                Ok(())
                            }
                        }
                    }
                }?;
                info!("Processed message");
                Ok(())
            })
            .inspect_err(|e| error!("Error in message handling: {:#}", e))
            .await
    })
    .inspect_err(|e| error!("Panic in message handling: {:#}", e));
    

    // forward output from a transmitter to the websocket
    let forward_output = output_rx.map(Ok).forward(&mut ws_sender);
    // read from the websocket and forward its input to the transmitter
    let forward_input = ws_receiver.map(Ok).forward(&mut input_tx);

    select! {
        _ = message_handling => (),
        _ = forward_input => (),
        _ = forward_output => (),
    }

    Ok(())
}


/// creates websocket request. taken approximately from [tungstenite docs](https://docs.rs/tungstenite/0.17.1/src/tungstenite/client.rs.html#216-237)
fn create_request(url: &str, user_token: &str, csc_uuid: &str) -> Result<Request<()>> {
    let uri = url.parse::<Uri>().unwrap();
    let authority = uri
        .authority()
        .ok_or(anyhow!("Failed to get authority from uri"))?
        .to_string();
    let host = authority
        .find('@')
        .map(|idx| authority.split_at(idx + 1).1)
        .unwrap_or_else(|| &authority);

    if host.is_empty() {
        bail!("Failed to get host from uri");
    }
    let r: [u8; 16] = rand::random();
    let key = base64::encode(&r);

    Ok(Request::builder()
        .method("GET")
        .header("Host", host)
        .header("Connection", "Upgrade")
        .header("Upgrade", "websocket")
        .header("Sec-WebSocket-Version", "13")
        .header("Sec-WebSocket-Key", key)
        .header("userToken", user_token)
        .header("nodeID", csc_uuid)
        .uri(uri)
        .body(())?)
}

/// processes websocket message with text frame
pub async fn process_message(data: String, default_timeout: u64) -> Result<String> {

    if data == "ping" {
        return Ok("pong".to_string());
    
       }
    let message: Messages = deserialize_message(data).context("Failed to deserialize message")?;

    // chain building command, then spawn a task with specified timeout
    let result = futures::future::ready(
        build_command(message.args)
            .context("Failed to get command from message arguments")
            .map_err(|e| {
                serde_json::json!({
                    "title": "Argument Error",
                    "body": "Unable to deserialize arguments",
                    "error_details": format!("{:#}", e),
                })
            }),
    )
    .and_then(|cmd| async move {
        tokio::time::timeout(
            Duration::from_millis(message.timeout.unwrap_or(default_timeout)),
            tokio::spawn(cmd.run(message.data)).map_err(|e| {
                serde_json::json!({
                    "title":"Internal Error",
                    "body":"Error occured in processing",
                    "error_details": format!("{:#}", e)
                })
            }),
        )
        .await
        .map_err(|_| {
            serde_json::json!({
                "title":"Internal Error",
                "body":"The command did not complete within the timeout period"
            })
        })
    })
    .await;
    let result = flatten(flatten(result));

    // response
    // temporary fix, removing the timeout from return value. issues with parsing it in server (was using eval for json parse)
    let a = 
    // serialize_message(
        
        Messages {
        request_type: RequestType::Ack,
        id: Uuid::new_v4(),
        reference_id: OptionalUuid(Some(message.id)),
        timestamp: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis()
            .to_string(),
        status_code: if result.is_err() {
            OptionalStatusCode(Some(http::StatusCode::INTERNAL_SERVER_ERROR))
        } else {
            OptionalStatusCode(Some(http::StatusCode::OK))
        },
        args: vec![],
        timeout: None,
        // simply return the ok value or the err value. the status is already encoded within the message and the status code
        data: result.unwrap_or_else(std::convert::identity),
      };
    let mut a = serde_json::to_value(a).unwrap();
    let a = a.as_object_mut().unwrap();
    a.remove("timeout");
    Ok(Value::Object(a.clone()).to_string())
    // )
    // .context("Failed to serialize output")
}


fn deserialize_message(msg: String) -> Result<Messages> {
    Ok(from_str(&msg).context("Failed to get message from string")?)
}

/// helper method. builds a command enum from a vector of arguments
pub fn build_command(args: Vec<String>) -> Result<api_calls::Command> {
    api_calls::Command::from_args(&args)
}

/// flattens a Result (due to .flatten being unstable)
fn flatten<K, E>(r: Result<Result<K, E>, E>) -> Result<K, E> {
    match r {
        Ok(Ok(k)) => Ok(k),
        Ok(Err(e)) => Err(e),
        Err(e) => Err(e),
    }
}
