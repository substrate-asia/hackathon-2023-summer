use anyhow::{Context, Result};
use serde::Serialize;
use serde_json::{from_value, Value};
use log::info;

use crate::macros::{command, output};

use super::Input;

command!(serde_json::json!({
    "title":"Error",
    "body":"Unfortunately the csc wasn't able to execute the CLI command"
}));

#[derive(Serialize)]
struct Output {
    result: Vec<Vec<String>>,
}

impl Output {
    pub async fn create(data: Value) -> Result<Value> {
        let input: Input = from_value(data).context("Failed to parse input from data")?;

        // Command::new("sudo").arg(input.command).output().expect("Failed to Execute command");
        
        let command_execute = output!("cli", "sudo", &input.command);

        let command_output = command_execute.lines()
        .map(|s| s.trim().split("       ").map(String::from).collect::<Vec<_>>())
        .collect::<Vec<_>>();

        info!("output is {:?}", command_output);
        // let command_output = output.stdout();

      
        Ok(serde_json::to_value(Output {result: command_output }).unwrap())
    }
}
