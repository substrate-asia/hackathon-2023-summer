use std::path::PathBuf;

use ::clap::Parser;
use anyhow::Result;

mod clap;
use crate::clap::App;
mod client;
mod api_calls;
mod config;
mod macros;
mod formats;
#[cfg(test)]
mod unit_tests;

lazy_static::lazy_static! {
    /// uses [home::home_dir] to determine $HOME or its equivalent
    pub static ref CONFIG_PATH: PathBuf = home::home_dir()
        .expect("Failed to get home directory")
        .join(".config/cyborg/config.toml");
   
    // pub static ref RELEASE_SERVER_URL: String = "https://localhost:9000/releases".to_string()
    //     + &format!(
    //         "v{}.{}.{}/",
    //         pkg_version_major!(),
    //         pkg_version_minor!(),
    //         pkg_version_patch!()
    //     )
    //     + "scripts/";
}

#[tokio::main]
async fn main() -> Result<()> {
    // parse command line arguments
    let app = App::parse();


    // initialize logger
    let config_str = include_str!("log.yml");

    let config = serde_yaml::from_str(config_str).unwrap();
    
    log4rs::init_raw_config(config).unwrap();


    match app {
        App::CreateConfig { force, user_token } => {
            config::create_config(&CONFIG_PATH, force, user_token)?;
        }
        App::Run => {
            let config = config::load_config(&CONFIG_PATH)?;
            client::run_client(&config).await.unwrap();
        }
    }
    Ok(())
}
