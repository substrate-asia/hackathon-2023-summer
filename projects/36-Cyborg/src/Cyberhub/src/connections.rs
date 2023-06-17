use std::collections::HashMap;
use serde::{Serialize, Deserialize};
use std::fs::File;
use std::io::{Read, Write};

#[derive(Serialize, Deserialize)]
pub struct Connections {
    active_clients: HashMap<String, String>,
}

impl Connections {
   pub fn new() -> Self {
        Connections {
            active_clients: HashMap::new(),
        }
    }

    pub fn insert(&mut self, user_token: &str, node_id: &str) {
        self.active_clients.insert(user_token.to_string(), node_id.to_string());
    }

    pub fn save_to_file(&self, file_path: &str) -> std::io::Result<()> {
        let json_str = serde_json::to_string(&self)?;
        let mut file = File::create(file_path)?;
        file.write_all(json_str.as_bytes())?;
        Ok(())
    }

    pub fn load_from_file(file_path: &str) -> std::io::Result<Self> {
        let mut file = File::open(file_path)?;
        let mut json_str = String::new();
        file.read_to_string(&mut json_str)?;
        let active_clients: Connections = serde_json::from_str(&json_str)?;
        Ok(active_clients)
    }
}
