mod cmd;

use proc_macros::Command;
use serde::Deserialize;


#[derive(Debug, Clone, Command)]
pub enum Command {
    Cmd,
}


#[derive(Deserialize)]
struct Input {
    command: Vec<String>,
}