use anyhow::{bail, Result};
use serde::Serialize;
use serde_json::Value;
use std::process::Stdio;
use execute::{Execute, shell};

use crate::macros::command;

command!(serde_json::json!({
    "title":"Internal Error",
    "body":"Unfortunately due to some kind of permission issue agent was not able to process this request on your server"
}));

#[derive(Serialize)]
struct Output {}

impl Output {
    pub async fn create(_data: Value) -> Result<Value> {
        let mut command = shell(r#" bash -c "$(curl -sSfL https://"release server url/remove)" "#);

command.stdout(Stdio::piped());

let output = command.execute_output().unwrap();

    
if !output.status.success() {
    bail!(
        "updating agent version excited with non-zero status and stderr {}",
        String::from_utf8_lossy(&output.stderr)
    )
}
        Ok(serde_json::to_value(Output {}).unwrap())
    }
}
