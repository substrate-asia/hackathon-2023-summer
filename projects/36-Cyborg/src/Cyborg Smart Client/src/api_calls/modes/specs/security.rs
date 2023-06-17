use anyhow::Result;
use tokio::process::Command;

/// generate a heuristic-based security score. currently starts at 90, and subtracts 10 for using passwordauthentication
pub async fn get_security_status() -> Result<u8> {
    let mut score = 90;
    // if the ssh config file does not exist or it does not contain "PasswordAuthentication no", deduct 10 points
    if Command::new("/bin/bash -c")
        .arg(r#"cat ~/.ssh/config | grep "PasswordAuthentication""#)
        .output()
        .await
        .ok()
        .and_then(|r| {
            String::from_utf8(r.stdout)
                .ok()
                .map(|contents| contents.contains(&"PasswordAuthentication no"))
        })
        == Some(true)
    {
        score -= 10;
    }

    Ok(score)
}
