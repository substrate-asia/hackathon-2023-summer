/*
    Session keeps user session_id and shared_key
    Sessions keeps the whole table of session_id -> share key
*/

use sgx_types::*;
use std::collections::HashMap;
use std::convert::TryInto;
use std::fmt;
use std::prelude::v1::*;
use std::vec::Vec;

use super::err::*;
use super::log::*;
use super::model::*;
use super::os_utils;
use super::sgx_utils;

/// User state includes a Map
/// which stores user account -> confirm code mapping
#[derive(Clone)]
pub struct Session {
    pub shr_k: [u8; 16],
    pub session_id: String, // sha256
    pub code: String,
    pub data: InnerAccount,
    pub register_time: u64,
}

impl Session {
    pub fn new(session_id: String, shr_k: [u8; 16]) -> Self {
        Self {
            shr_k: shr_k,
            session_id: session_id,
            code: "".to_string(),
            data: InnerAccount::default(),
            register_time: os_utils::system_time(),
        }
    }

    pub fn decrypt(&self, content: &[u8]) -> GenericResult<Vec<u8>> {
        sgx_utils::decrypt(&self.shr_k, content)
    }

    pub fn encrypt(&self, content: &[u8]) -> Vec<u8> {
        sgx_utils::encrypt(&self.shr_k, content)
    }

    pub fn expire(&self) -> bool {
        // session last 10 minutes
        (os_utils::system_time() - self.register_time) > 60 * 10
    }
}

impl fmt::Debug for Session {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Session")
            .field("shr_k", &os_utils::encode_hex(&self.shr_k))
            .field("session_id", &self.session_id)
            .finish()
    }
}

pub struct Sessions {
    pub state: HashMap<String, Session>,
    pub prv_k: sgx_ec256_private_t,
}

impl Sessions {
    pub fn new(prv_k: sgx_ec256_private_t) -> Self {
        Self {
            state: HashMap::new(),
            prv_k: prv_k,
        }
    }

    pub fn register_session(&mut self, user_key: [u8; 64]) -> [u8; 32] {
        let user_pub_k = sgx_utils::pub_k_from_user(&user_key);
        let shr_k_result = sgx_utils::compute_shared_dhkey(&self.prv_k, &user_pub_k);

        if let Err(err) = shr_k_result {
            info(&format!("user pub key gen share key fail {}", err));
            return [0; 32];
        }
        let mut shr_k_reverse = shr_k_result.unwrap().clone();
        shr_k_reverse.reverse();
        info(&format!("user share key {:?}", shr_k_reverse));
        let sha_result = sgx_utils::sha256(&user_pub_k);
        if let Err(err) = sha_result {
            info(&format!("sha256 failed {}", err));
            return [0; 32];
        }
        let sha = sha_result.unwrap();
        let sha_str = os_utils::encode_hex(&sha);
        let session = Session::new(sha_str.clone(), shr_k_reverse[16..].try_into().unwrap());
        self.state.insert(sha_str, session);
        return sha;
    }

    pub fn close_session(&mut self, session_id: &str) {
        if let Some(v) = self.state.get(session_id) {
            self.state.remove(session_id);
        }
    }

    pub fn get_session(&self, session_id: &str) -> Option<Session> {
        match self.state.get(session_id) {
            None => None,
            Some(s) => Some(s.to_owned()),
        }
    }

    pub fn update_session(&mut self, k: &str, v: &Session) {
        self.state.insert(k.to_string(), v.clone());
    }
}
