extern crate sgx_types;
extern crate sgx_urts;
use sgx_types::*;

extern "C" {

    pub fn ec_key_exchange(
        eid: sgx_enclave_id_t,
        retval: *mut sgx_status_t,
        user_pub_key: &[u8; 64],
        tee_pub_key: &mut [u8; 64],
        session_id: &mut [u8; 32],
    ) -> sgx_status_t;

    pub fn ec_set_conf(
        eid: sgx_enclave_id_t,
        retval: *mut sgx_status_t,
        config_b: *const u8,
        config_b_size: usize,
    ) -> sgx_status_t;

    pub fn ec_send_otp(
        eid: sgx_enclave_id_t,
        retval: *mut sgx_status_t,
        otp_req: *const u8,
        otp_req_size: usize,
        error_code: *mut u8,
    ) -> sgx_status_t;

    pub fn ec_auth_in_one(
        eid: sgx_enclave_id_t,
        retval: *mut sgx_status_t,
        auth_req: *const u8,
        auth_req_size: usize,
        max_len: usize,
        account_b: *mut u8,
        account_b_size: *mut usize,
        cipher_dauth: *mut u8,
        cipher_dauth_size: *mut usize,
        error_code: *mut u8,
    ) -> sgx_status_t;

    pub fn ec_test(eid: sgx_enclave_id_t, retval: *mut sgx_status_t) -> sgx_status_t;

}
