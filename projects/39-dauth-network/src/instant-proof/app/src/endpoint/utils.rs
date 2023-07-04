use rand::{thread_rng, Rng};
use std::time::SystemTime;
#[macro_use]
use time::{PrimitiveDateTime, format_description};
use chrono::prelude::*;

// pub type GenericError = Box<dyn std::error::Error + Send + Sync + 'static>;
// pub type GenericResult<T> = Result<T, GenericError>;

/// Get system time now in u64 format
pub fn system_time() -> u64 {
    match SystemTime::now().duration_since(SystemTime::UNIX_EPOCH) {
        Ok(n) => n.as_secs(),
        Err(_) => panic!("SystemTime before UNIX EPOCH!"),
    }
}

pub fn now_datetime() -> Option<PrimitiveDateTime> {
    let now = Local::now();
    let now_datetime = format!("{}", now.format("%Y-%m-%d %H:%M:%S"));
    let format =
        format_description::parse("[year]-[month]-[day] [hour]:[minute]:[second]").unwrap();
    let current_datetime = PrimitiveDateTime::parse(&now_datetime, &format);
    if current_datetime.is_err() {
        return None;
    } else {
        return Some(current_datetime.unwrap());
    }
}

/// Gen random confirm code for user mail authentication
pub fn gen_random() -> i32 {
    let mut rng = thread_rng();
    rng.gen_range(1000..9999)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_system_time() {
        let current = system_time();
        let future = system_time();
        assert!(current <= future);
    }
}
