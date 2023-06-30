use anyhow::{Context, Result};
use serde::Deserialize;

use super::Configuration;

pub mod none {
    use super::*;

    #[derive(Deserialize)]
    struct OldConfiguration {
        /// basic configuration
        base: BaseConfig,
    }

    #[derive(Deserialize)]
    struct BaseConfig {
        websocket_url: String,
        csc_uuid: String,
        user_token: String,
    }

    pub fn create_config(value: toml::Value) -> Result<Configuration> {
        assert!(value.get("version").is_none());
        let config: OldConfiguration = value
            .try_into()
            .context("Failed to parse configuration file into config with version *missing*.")?;
        let mut output = Configuration::new(config.base.user_token);
        output.base.websocket_url = config.base.websocket_url;
        output.base.csc_uuid = config.base.csc_uuid;
        Ok(output)
    }
}
