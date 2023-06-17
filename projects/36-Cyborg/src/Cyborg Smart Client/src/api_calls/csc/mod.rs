mod remove;

use proc_macros::Command;


#[derive(Debug, Clone, Command)]
pub enum Command {
   Remove,
}
