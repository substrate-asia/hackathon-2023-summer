use crate::endpoint::utils;
use actix_web::{
    get, http::header::HeaderValue, http::header::InvalidHeaderValue,
    http::header::TryIntoHeaderValue, post, web, Error, FromRequest, HttpRequest, HttpResponse,
    Responder,
};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde_derive::{Deserialize, Serialize};
use std::{convert::TryFrom, str::FromStr};
use std::{thread, time};

/// Claims is used when encode and decode JWT token
/// fields including:
/// sub: account name and
/// exp: expire date
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub sub_t: String,
    pub exp: usize,
}

/// Verify token including: checking whether token format is valid,
/// and whether token expired or not, return true for valid and false for invalid
pub fn verify_token(token_option: Option<&HeaderValue>, secret: &str) -> bool {
    if let Some(v) = token_option {
        println!("analyze header {} with {}", v.to_str().unwrap(), secret);
        let mut validation = Validation::new(Algorithm::HS256);
        validation.validate_exp = true;
        let token = v.to_str().unwrap();
        let token_data = decode::<Claims>(
            &token,
            &DecodingKey::from_secret(secret.as_ref()),
            &validation,
        );
        match token_data {
            Ok(c) => true,
            _ => {
                println!("token verify failed");
                false
            }
        }
    } else {
        println!("extract token from header failed");
        false
    }
}

/// Extract token extracts sub from Claims,
/// when extract successfully, returns sub as account name, or None when failure
pub fn extract_token(token_option: Option<&HeaderValue>, secret: &str) -> Option<Claims> {
    if let Some(v) = token_option {
        println!("analyze header {} with {}", v.to_str().unwrap(), secret);
        let mut validation = Validation::new(Algorithm::HS256);
        let token = v.to_str().unwrap();
        let token_data = decode::<Claims>(
            &token,
            &DecodingKey::from_secret(secret.as_ref()),
            &validation,
        );
        match token_data {
            Ok(t) => Some(t.claims),
            _ => {
                println!("token verify failed");
                None
            }
        }
    } else {
        println!("extract token from header failed");
        None
    }
}

/// Gen token calls gen_token_n with expire date length
/// currently set to 7 days as 7 days with 24 hours with 3600 seconds
pub fn gen_token(account: &str, atype: &str, secret: &str) -> String {
    gen_token_n(account, atype, secret, 7 * 24 * 3600)
}

/// It generates a new token using Claims and secret,
/// where Claims including account name as sub, and 7 days ahead as expiry date
fn gen_token_n(account: &str, atype: &str, secret: &str, n: u64) -> String {
    println!("{}", utils::system_time());
    encode(
        &Header::default(),
        &Claims {
            sub: account.to_string(),
            sub_t: atype.to_string(),
            exp: (utils::system_time() + n).try_into().unwrap(),
        },
        &EncodingKey::from_secret(secret.to_string().as_bytes()),
    )
    .unwrap()
}

#[cfg(test)]
mod tests {
    use crate::persistence;

    use super::*;

    #[test]
    fn test_verify_token() {
        let token1 = gen_token("abc", "email", "rust123");
        println!("{}", token1);
        let header = HeaderValue::from_str(&token1).unwrap();
        let secret = "rust123";
        // data is "account": "admin@keysafe.network"
        let verify_result = verify_token(Some(&header), &secret);
        assert!(verify_result);
    }

    #[test]
    fn test_verify_invalid_token() {
        let token1 = "invalid token string";
        println!("{}", token1);
        let header = HeaderValue::from_str(&token1).unwrap();
        let secret = "rust123";
        // data is "account": "admin@keysafe.network"
        let verify_result = verify_token(Some(&header), &secret);
        assert_eq!(verify_result, false);
    }

    #[test]
    fn test_extract_token() {
        let token1 = gen_token("abc", "email", "rust123");
        println!("{}", token1);
        let header = HeaderValue::from_str(&token1).unwrap();
        let secret = "rust123";
        // data is "account": "admin@keysafe.network"
        match extract_token(Some(&header), &secret) {
            Some(c) => {
                assert_eq!(c.sub, "abc")
            }
            None => {
                panic!("tests failed")
            }
        }
    }

    #[test]
    fn test_extract_invalid_token() {
        let token1 = "some invalid token";
        println!("{}", token1);
        let header = HeaderValue::from_str(&token1).unwrap();
        let secret = "rust123";
        // data is "account": "admin@keysafe.network"
        match extract_token(Some(&header), &secret) {
            Some(c) => {
                panic!("test failed")
            }
            None => {
                assert!(true)
            }
        }
    }

    #[test]
    fn test_expired_token() {
        let token1 = gen_token_n("abc", "email", "rust123", 1);
        let header = HeaderValue::from_str(&token1).unwrap();
        let secret = "rust123";
        // data is "account": "admin@keysafe.network"
        let one_sec = time::Duration::new(100, 0);
        thread::sleep(one_sec);
        assert_eq!(verify_token(Some(&header), &secret), false)
    }
}
