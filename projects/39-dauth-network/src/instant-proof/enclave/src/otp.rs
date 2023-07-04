use super::config;
use super::err::*;
use super::log::*;
use crate::*;
use base64;
use http_req::{
    request::{Method, RequestBuilder},
    tls,
    uri::Uri,
};
use serde_json::{json, to_string, Result, Value};
use std::collections::HashMap;
use std::io::prelude::*;
use std::io::Write;
use std::net::TcpStream;
use std::str;
use std::string::String;
use std::string::ToString;
use std::vec::Vec;

pub fn get_otp_client(auth_type: AuthType) -> Option<&'static dyn OtpChannelClient> {
    let conf = &config(None).inner;
    match auth_type {
        // AuthType::Email => Some(&conf.otp.mail), smtp only supports text/plain
        AuthType::Email => Some(&conf.mail_api),
        AuthType::Sms => Some(&conf.sms),
        _ => {
            error("invalid auth type");
            None
        }
    }
}

pub struct MailChannelClient {
    pub conf: config::OtpChannelConf,
}

impl OtpChannelClient for MailChannelClient {
    fn new(conf: config::OtpChannelConf) -> Self {
        Self { conf }
    }
    fn send_otp(&self, to_account: &str, client: &Client, c_code: &str) -> GenericResult<()> {
        info("send mail");
        let from_account = &self.conf.sender;
        let account = &self.conf.account;
        let password = &self.conf.password;
        let server = &self.conf.server;
        let port = 465;
        let conn_addr = format!("{}:{}", server, port);
        let raw_stream = TcpStream::connect(conn_addr).unwrap();
        let mut stream = tls::Config::default().connect(server, raw_stream).unwrap();
        tls_read(&mut stream);
        let cmds = [
            "EHLO dauth.network",
            "AUTH LOGIN",
            account,
            password,
            &format!("MAIL FROM: <{}>", from_account),
            &format!("RCPT TO: <{}>", to_account),
            "DATA",
        ];
        for c in cmds {
            tls_write(&mut stream, c);
        }
        let m_lines = &format!(
            r###"subject: DAuth Verification Code
from: <{}> 
to: <{}> 
    
Please use the following code to verify your account:
{}
."###,
            from_account, to_account, c_code
        );
        let result = tls_write(&mut stream, m_lines);
        tls_write(&mut stream, "QUIT");
        info(&format!("mail result is {}", result));
        if result.contains("250 Ok") {
            Ok(())
        } else {
            Err(GenericError::from("send mail failed"))
        }
    }
}

fn tls_read(conn: &mut tls::Conn<TcpStream>) -> String {
    let mut buffer = [0; 1024];
    //read();
    let size = conn.read(&mut buffer).unwrap();
    let output: &str = str::from_utf8(&buffer[0..size]).unwrap();
    info(&format!("S: {}", output));
    return output.to_string();
}

fn tls_write(conn: &mut tls::Conn<TcpStream>, content: &str) -> String {
    content.split('\n').for_each(|l| {
        info(&format!("C: {}", l));
        let l_enter = format!("{}\r\n", l);
        let r1 = conn.write(l_enter.as_bytes()).unwrap();
        info(&format!("{} bytes written", r1));
    });
    conn.flush().unwrap();
    tls_read(conn)
}

pub struct MailApiChannelClient {
    pub conf: config::OtpChannelConf,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct EmailApiReq {
    personalizations: Vec<Personalization>,
    from: MailAddress,
    subject: String,
    content: Vec<Content>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Personalization {
    to: Vec<MailAddress>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct MailAddress {
    email: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Content {
    #[serde(rename = "type")]
    type_: String,
    value: String,
}

impl OtpChannelClient for MailApiChannelClient {
    fn new(conf: config::OtpChannelConf) -> Self {
        Self { conf }
    }
    fn send_otp(&self, to_account: &str, client: &Client, c_code: &str) -> GenericResult<()> {
        let text_content = match client.mail_text_template {
            Some(ref t) => t.replace("{{code}}", c_code),
            None => format!(
                "Please use the following code to verify your account:\n{}",
                c_code
            ),
        };
        let html_content = match client.mail_html_template {
            Some(ref t) => {
                let result = t.as_bytes();
                let b64 = base64::decode(result);
                let content = match b64 {
                    Ok(c) => String::from_utf8(c).unwrap(),
                    Err(e) => {
                        error(&format!("decode html template failed: {}", e));
                        return Err(GenericError::from("decode html template failed"));
                    }
                };
                content.replace("{{code}}", c_code)
            }
            None => format!(
                "<h1>Please</h1> use the following code to verify your account:<br/>{}",
                c_code
            ),
        };
        debug(&format!("text content: {}", &text_content));
        debug(&format!("html content: {}", &html_content));
        let subject = match client.mail_subject {
            Some(ref t) => t,
            None => "DAuth Verification Code",
        };
        let mail_req = EmailApiReq {
            personalizations: vec![Personalization {
                to: vec![MailAddress {
                    email: to_account.to_string(),
                }],
            }],
            from: MailAddress {
                email: self.conf.sender.to_string(),
            },
            subject: subject.to_string(),
            content: vec![
                Content {
                    type_: "text/plain".to_string(),
                    value: text_content,
                },
                Content {
                    type_: "text/html".to_string(),
                    value: html_content,
                },
            ],
        };
        let token_req = serde_json::to_string(&mail_req).unwrap();
        let token_headers = HashMap::from([
            ("Content-Type", "application/json"),
            ("Authorization", &self.conf.password),
        ]);
        let mail_resp = http_req(
            &self.conf.server,
            Method::POST,
            Some(token_req),
            token_headers,
        );
        if mail_resp.is_err() {
            return Err(GenericError::from("http error"));
        }
        // empty response is OK
        info("sendmail ok");
        Ok(())
    }
}

pub struct SmsChannelClient {
    pub conf: config::OtpChannelConf,
}

impl OtpChannelClient for SmsChannelClient {
    fn new(conf: config::OtpChannelConf) -> Self {
        Self { conf }
    }
    fn send_otp(&self, to_account: &str, client: &Client, c_code: &str) -> GenericResult<()> {
        let body = format!(
            "[DAuth Verification Code] Please use the following code to verify your account: {}",
            c_code
        );
        let token_req = format!("Body={}&From={}&To={}", &body, self.conf.sender, to_account);
        let token_headers = HashMap::from([
            ("Content-Type", "application/x-www-form-urlencoded"),
            ("Authorization", &self.conf.password),
        ]);
        let sms_resp = http_req(
            &self.conf.server,
            Method::POST,
            Some(token_req),
            token_headers,
        );
        if sms_resp.is_err() {
            return Err(GenericError::from("http error"));
        }
        let v: Value = serde_json::from_str(&sms_resp?)?;
        if v["status"].is_null() {
            return Err(GenericError::from("send sms got an empty response"));
        }
        let status = v["status"].as_str().unwrap();
        info(&status);
        match status {
            "queued" => Ok(()),
            "sent" => Ok(()),
            _ => {
                error(&format!("sms failed: {:?}", v));
                Err(GenericError::from("sms failed"))
            }
        }
    }
}
