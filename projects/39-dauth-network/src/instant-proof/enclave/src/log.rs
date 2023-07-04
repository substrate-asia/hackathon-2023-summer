extern "C" {
    pub fn oc_log (level: i32, msg: *const u8, msg_len: i32);
}


pub fn info(msg: &str) {
    let msg_len = msg.len() as i32;
    unsafe {
        oc_log(1, msg.as_bytes().as_ptr(), msg_len);
    }
}

pub fn debug(msg: &str) {
    let msg_len = msg.len() as i32;
    unsafe {
        oc_log(0, msg.as_bytes().as_ptr(), msg_len);
    }
}

pub fn error(msg: &str) {
    let msg_len = msg.len() as i32;
    unsafe {
        oc_log(2, msg.as_bytes().as_ptr(), msg_len);
    }
}
