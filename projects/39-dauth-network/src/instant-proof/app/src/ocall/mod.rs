use sgx_types::*;
use std::ffi::CStr;
use std::slice;
use std::str;

#[no_mangle]
pub extern "C" fn oc_log(level: i32, msg: *const u8, msg_len: i32) {
    let msg_bytes = unsafe { slice::from_raw_parts(msg, msg_len as usize) };
    let msg = match str::from_utf8(&msg_bytes) {
        Ok(r) => r,
        Err(_) => "",
    };
    match level {
        0 => debug!("enclave: {}", msg),
        1 => info!("enclave: {}", msg),
        2 => error!("enclave: {}", msg),
        _ => info!("enclave: {}", msg),
    }
}
