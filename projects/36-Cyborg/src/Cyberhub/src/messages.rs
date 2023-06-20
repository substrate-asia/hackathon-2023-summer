use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::serde_types::{self};
use std::{
    time::{SystemTime, UNIX_EPOCH},
};

#[derive(Deserialize, Serialize)]
/// the required format for messages within text websocket frames
pub struct Messages {
    #[serde(rename = "type")]
    request_type: RequestType,
    /// randomly generated id for the message
    #[serde(with = "serde_types::SerdeUuid")]
    id: Uuid,
    /// reference to the previous message, if any
    #[serde(rename = "ref")]
    reference_id: String,
    /// ms since UNIX epoch
    timestamp: String,
    /// a status code
    status_code: String,
    node_id: String,
    args: Vec<String>,
    data: Option<Vec<Vec<String>>>,
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

pub enum Command {
    GetSpecifications,
    Remove,
    Cli,
}


impl Command {
    pub fn to_message(&self, data: Vec<Vec<String>>) -> Messages {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis()
            .to_string();
        
        let args = match self {
            Command::GetSpecifications => vec!["modes".to_string(), "specs".to_string()],
            Command::Cli => vec!["modes".to_string(), "cli".to_string(), "cmd".to_string()],
            Command::Remove => vec!["modes".to_string(), "specs".to_string()],
        };
        
        
        Messages {
            request_type: RequestType::Syn,
            id: Uuid::new_v4(), 
            reference_id: "".to_string(),
            timestamp,
            status_code: String::from(""), 
            node_id: String::from("6c5b824b-2555-4d50-9e6d-6538a1730582"),       
            args,
            data: Some(data),
    
        }
    }
}
