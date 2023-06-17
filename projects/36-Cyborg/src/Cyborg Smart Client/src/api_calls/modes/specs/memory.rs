use std::process::{Command, Stdio};
use std::str;

use anyhow::Result;



    pub async fn get_memory() -> Result<String> {

    let ps_child = Command::new("free") // `ps` command...
        .arg("-h")                  // with argument `axww`...
        .stdout(Stdio::piped())       // of which we will pipe the output.
        .spawn()                      // Once configured, we actually spawn the command...
        .unwrap();                    // and assert everything went right.
    let grep_child_one = Command::new("grep")
        .arg("-i")
        .arg("Mem")
        .stdin(Stdio::from(ps_child.stdout.unwrap())) // Pipe through.
        .stdout(Stdio::piped())
        .spawn()
        .unwrap();
    let output = grep_child_one.wait_with_output().unwrap();
    let result = str::from_utf8(&output.stdout).unwrap();
    
    let res = &result.to_string()[14..19];

            Ok(res.to_string())
        }
    