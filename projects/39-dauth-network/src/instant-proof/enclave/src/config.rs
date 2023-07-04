extern crate serde;
use serde::{Deserialize, Serialize};
use std::fmt::*;
use std::string::*;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OtpChannelConf {
    pub account: String,
    pub password: String,
    pub sender: String,
    pub server: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OtpChannel {
    pub sms: OtpChannelConf,
    pub email: OtpChannelConf,
    pub email_api: OtpChannelConf,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OAuthConf {
    pub client_id: String,
    pub client_secret: String,
    pub redirect_url: String,
    pub kid: Option<String>,
    pub iss: Option<String>,
    pub sub: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OAuth {
    pub github: OAuthConf,
    pub google: OAuthConf,
    pub apple: OAuthConf,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TeeConfig {
    pub otp: OtpChannel,
    pub oauth: OAuth,
    pub rsa_key: String,
    pub ecdsa_key: String,
    pub seal_key: String,
    pub proof_issuer: String,
    pub jwt_issuer: String,
}

impl std::default::Default for TeeConfig {
    fn default() -> Self {
        Self {
            otp: OtpChannel {
                sms: OtpChannelConf::default(),
                email: OtpChannelConf::default(),
                email_api: OtpChannelConf::default(),
            },
            oauth: OAuth {
                github: OAuthConf::default(),
                google: OAuthConf::default(),
                apple: OAuthConf::default(),
            },
            rsa_key: emp(),
            ecdsa_key: emp(),
            seal_key: emp(),
            proof_issuer: emp(),
            jwt_issuer: emp(),
        }
    }
}

impl OAuthConf {
    fn default() -> Self {
        Self {
            client_id: emp(),
            client_secret: emp(),
            redirect_url: emp(),
            iss: None,
            kid: None,
            sub: None,
        }
    }
}

impl OtpChannelConf {
    fn default() -> Self {
        Self {
            account: emp(),
            password: emp(),
            sender: emp(),
            server: emp(),
        }
    }
}

fn emp() -> String {
    "".to_string()
}

#[test]
fn test_oauth_client_creation() {
    let oauth_client = OAuthConf {
        client_id: "client_id".to_string(),
        client_secret: "client_secret".to_string(),
        redirect_url: "redirect_url".to_string(),
        iss: None,
        kid: None,
        sub: None,
    };
    assert_eq!(oauth_client.client_id, "client_id");
    assert_eq!(oauth_client.client_secret, "client_secret");
    assert_eq!(oauth_client.redirect_url, "redirect_url");
}

#[test]
fn test_oauth_creation() {
    let oauth = OAuth {
        github: OAuthConf::default(),
        google: OAuthConf::default(),
        apple: OAuthConf::default(),
    };
    assert_eq!(oauth.github.client_id, "");
    assert_eq!(oauth.github.client_secret, "");
    assert_eq!(oauth.github.redirect_url, "");
}
