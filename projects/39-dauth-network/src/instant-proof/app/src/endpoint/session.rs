use std::collections::HashMap;
use std::fmt;
use std::sync::{Arc, Mutex};

use crate::endpoint::utils;

#[derive(Clone)]
pub struct Session {
    pub register_time: u64,
}

impl fmt::Debug for Session {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Session")
            .field("register_time", &self.register_time)
            .finish()
    }
}

impl Session {
    pub fn new() -> Self {
        Self {
            register_time: utils::system_time(),
        }
    }

    pub fn expire(&self) -> bool {
        // session last 10 minutes
        (utils::system_time() - &self.register_time) > 60 * 60 * 24
    }
}

#[derive(Debug)]
pub struct SessionState {
    pub state: Arc<Mutex<HashMap<String, Session>>>,
}

impl SessionState {
    pub fn new() -> Self {
        Self {
            state: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn register_session(&self, session_id: &str) {
        let mut state = self.state.lock().unwrap();
        if let Some(_v) = state.get(session_id) {
            return;
        }
        info!("session id {}", session_id);
        state.insert(session_id.to_string(), Session::new());
    }

    pub fn close_session(&self, session_id: &str) {
        let mut state = self.state.lock().unwrap();
        if let Some(_v) = state.get(session_id) {
            state.remove(session_id);
        }
    }

    pub fn get_session(&self, session_id: &str) -> Option<Session> {
        let state = self.state.lock().unwrap();
        match state.get(session_id) {
            None => None,
            Some(s) => Some(s.to_owned()),
        }
    }
}
