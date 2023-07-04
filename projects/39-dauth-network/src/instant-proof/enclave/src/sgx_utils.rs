use sgx_tcrypto::*;
use sgx_tseal::{SgxSealedData, SgxUnsealedData};
use sgx_types::*;
use std::slice;
use std::string::{String, ToString};
use std::vec::Vec;

use std::convert::TryInto;

use crate::os_utils;

use super::err::*;
use super::log::*;
use super::os_utils::*;

pub fn pub_k_from_user(user_key: &[u8; 64]) -> sgx_ec256_public_t {
    let mut gx: [u8; 32] = user_key[0..32].try_into().unwrap();
    let mut gy: [u8; 32] = user_key[32..].try_into().unwrap();
    gx.reverse();
    gy.reverse();
    sgx_ec256_public_t { gx: gx, gy: gy }
}

pub fn sig_from_user(signature: &[u8; 64]) -> sgx_ec256_signature_t {
    let mut gx: [u8; 32] = signature[0..32].try_into().unwrap();
    let mut gy: [u8; 32] = signature[32..].try_into().unwrap();
    // gx.reverse();
    // gy.reverse();
    let x: [u32; 8] = u8_to_u32(gx);
    let y: [u32; 8] = u8_to_u32(gy);
    sgx_ec256_signature_t { x: x, y: y }
}

fn u8_to_u32(x: [u8; 32]) -> [u32; 8] {
    let mut result = [0_u32; 8];
    for i in (0..32).step_by(4) {
        result[i / 4] = as_u32_le(&x[i..i + 4].try_into().unwrap());
    }
    result
}

fn as_u32_be(array: &[u8; 4]) -> u32 {
    ((array[0] as u32) << 24)
        + ((array[1] as u32) << 16)
        + ((array[2] as u32) << 8)
        + ((array[3] as u32) << 0)
}

fn as_u32_le(array: &[u8; 4]) -> u32 {
    ((array[0] as u32) << 0)
        + ((array[1] as u32) << 8)
        + ((array[2] as u32) << 16)
        + ((array[3] as u32) << 24)
}

pub fn key_to_bigendian(pub_k: &sgx_ec256_public_t) -> [u8; 64] {
    let mut gx: [u8; 32] = pub_k.gx.clone();
    let mut gy: [u8; 32] = pub_k.gy.clone();
    gx.reverse();
    gy.reverse();
    [gx, gy].concat().try_into().unwrap()
}

pub fn compute_shared_dhkey(
    prv_k: &sgx_ec256_private_t,
    pub_k: &sgx_ec256_public_t,
) -> GenericResult<[u8; 32]> {
    let handle: SgxEccHandle = SgxEccHandle::new();
    handle.open()?;
    let share_k_result = handle.compute_shared_dhkey(prv_k, pub_k);
    match share_k_result {
        Ok(r) => Ok(r.s),
        Err(err) => Err(GenericError::from(err)),
    }
}

pub fn edcsa_verify_signature(
    data: &[u8],
    pub_k: &sgx_ec256_public_t,
    signature: &sgx_ec256_signature_t,
) -> GenericResult<bool> {
    let handle: SgxEccHandle = SgxEccHandle::new();
    handle.open()?;
    let result = handle.ecdsa_verify_slice(data, pub_k, signature);
    match result {
        Ok(r) => Ok(r),
        Err(err) => Err(GenericError::from(err)),
    }
}

pub fn sha256(pub_k: &sgx_ec256_public_t) -> GenericResult<([u8; 32])> {
    let slice = [pub_k.gx, pub_k.gy].concat();
    let hash_v = rsgx_sha256_slice(&slice)?;
    let r: [u8; 32] = hash_v.try_into()?;
    Ok(r)
}

pub fn hash(content: &[u8]) -> GenericResult<([u8; 32])> {
    let hash_v = rsgx_sha256_slice(content)?;
    let r: [u8; 32] = hash_v.try_into()?;
    Ok(r)
}

pub fn decrypt(key: &[u8; 16], cipher_text: &[u8]) -> GenericResult<Vec<u8>> {
    info(&format!("aes_gcm_128_decrypt invoked!"));
    // handle cipher_text length < 16
    if cipher_text.len() <= 16 {
        error("encrypted length must not be less than 16 bytes");
        return Err(GenericError::from("encrypted length shorter than 16"));
    }
    let mac: &[u8; 16] = &cipher_text[0..16].try_into()?;
    let cipher_text_core = &cipher_text[16..];
    let mut plain_text: Vec<u8> = vec![0; cipher_text_core.len()];
    let iv: [u8; 12] = [0; 12];
    let aad_array: [u8; 0] = [0; 0];
    info(&format!("key is {:?}", key));
    info(&format!("cipher text is {:?}", cipher_text));
    let result =
        rsgx_rijndael128GCM_decrypt(key, cipher_text_core, &iv, &aad_array, mac, &mut plain_text);
    match result {
        Ok(_) => Ok(plain_text),
        Err(err) => {
            error(&format!("decrypt failed {}", err));
            Err(GenericError::from(err))
        }
    }
}

pub fn encrypt(key: &[u8; 16], plain_text: &[u8]) -> Vec<u8> {
    info("aes_gcm_128_encrypt invoked!");
    let mut cipher_text: Vec<u8> = vec![0; plain_text.len()];
    let mut mac = [0; 16];
    let iv: [u8; 12] = [0; 12];
    let aad_array: [u8; 0] = [0; 0];
    let result =
        rsgx_rijndael128GCM_encrypt(key, plain_text, &iv, &aad_array, &mut cipher_text, &mut mac);
    match result {
        Ok(_) => [mac.to_vec(), cipher_text].concat(),
        Err(err) => {
            error(&format!("encrypt failed {}", err));
            Vec::new()
        }
    }
}

pub fn rand() -> u32 {
    let rand = sgx_rand::random::<u32>();
    let six_digits = rand % 1000000;
    if six_digits < 100000 {
        return six_digits + 100000;
    }
    return six_digits;
}

// when using seal, sgx generates a seal_key using cpu and sgx signing key
// when using iseal, sgx use config key
pub fn i_seal(plain_binary: &[u8], key: &String) -> GenericResult<Vec<u8>> {
    let key_b = os_utils::decode_hex(&key)?;
    let key_b_128: [u8; 16] = key_b.try_into().unwrap();
    Ok(encrypt(&key_b_128, plain_binary))
}

pub fn seal(plain_binary: &[u8]) -> ([u8; 1024], u32) {
    let aad: [u8; 0] = [0_u8; 0];
    let result = SgxSealedData::<[u8]>::seal_data(&aad, plain_binary);
    if result.is_err() {
        info("seal failed");
        return ([0_u8; 1024], 1024);
    }
    let raw_sealed = [0_u8; 1024];
    let sgx_sealed = result.unwrap();
    let mac_len = sgx_sealed.get_add_mac_txt_len();
    let en_len = sgx_sealed.get_encrypt_txt_len();
    let seal_len = unsafe { sgx_calc_sealed_data_size(mac_len, en_len) };
    info(&format!("sealed len is {}", seal_len));
    unsafe {
        sgx_sealed.to_raw_sealed_data_t(raw_sealed.as_ptr() as *mut sgx_sealed_data_t, seal_len);
    };
    (raw_sealed, seal_len)
}

pub fn unseal(raw_sealed: &[u8]) -> Vec<u8> {
    info(&format!("unseal {:?}", raw_sealed));
    let opt = unsafe {
        SgxSealedData::<[u8]>::from_raw_sealed_data_t(
            raw_sealed.as_ptr() as *mut sgx_sealed_data_t,
            raw_sealed.len().try_into().unwrap(),
        )
    };
    let sealed_data = match opt {
        Some(x) => x,
        None => {
            error("seal data init failed");
            return Vec::new();
        }
    };
    let result = sealed_data.unseal_data();
    match result {
        Ok(x) => {
            return x.get_decrypt_txt().to_vec();
        }
        Err(err) => {
            error(&format!("unseal data failed {}", err));
            return Vec::new();
        }
    }
}
