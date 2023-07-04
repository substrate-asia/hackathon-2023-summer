use super::err::*;
use super::log::*;
use std::io::prelude::*;
use std::io::Write;
use std::net::TcpStream;
use std::str;
use std::string::String;
use std::string::ToString;
use std::time::*;
use std::vec::Vec;

pub fn encode_hex(bytes: &[u8]) -> String {
    let strs: Vec<String> = bytes
        .iter()
        .map(|byte| encode_hex_byte(*byte).iter().map(|c| *c).collect())
        .collect();
    strs.join("")
}

fn encode_hex_byte(byte: u8) -> [char; 2] {
    [encode_hex_digit(byte >> 4), encode_hex_digit(byte & 0x0Fu8)]
}

fn encode_hex_digit(digit: u8) -> char {
    match char::from_digit(digit as u32, 16) {
        Some(c) => c,
        _ => panic!(),
    }
}

pub fn decode_hex(hex: &str) -> GenericResult<Vec<u8>> {
    let mut r: Vec<u8> = Vec::new();
    let mut chars = hex.chars().enumerate();
    loop {
        let (pos, first) = match chars.next() {
            None => break,
            Some(elt) => elt,
        };
        if first == ' ' {
            continue;
        }
        let (_, second) = match chars.next() {
            None => return Err(GenericError::from("decode error")),
            Some(elt) => elt,
        };
        r.push((decode_hex_digit(first)? << 4) | decode_hex_digit(second)?);
    }
    Ok(r)
}

fn decode_hex_digit(digit: char) -> GenericResult<u8> {
    match digit {
        '0'..='9' => Ok(digit as u8 - '0' as u8),
        'a'..='f' => Ok(digit as u8 - 'a' as u8 + 10),
        'A'..='F' => Ok(digit as u8 - 'A' as u8 + 10),
        _ => Err(GenericError::from("decode error")),
    }
}

/// Get system time now in u64 format
pub fn system_time() -> u64 {
    match SystemTime::now().duration_since(SystemTime::UNIX_EPOCH) {
        Ok(n) => n.as_secs(),
        Err(_) => panic!("SystemTime before UNIX EPOCH!"),
    }
}

#[test]
fn test_encode_hex() {
    let bytes = [0x01, 0x02, 0x03];
    let expected_hex = "010203";
    let actual_hex = encode_hex(&bytes);
    assert_eq!(expected_hex, actual_hex);
}

#[test]
fn test_decode_hex() {
    let hex = "010203";
    let expected_bytes = [0x01, 0x02, 0x03];
    let actual_bytes = decode_hex(&hex).unwrap();
    assert_eq!(expected_bytes, actual_bytes.as_slice());
}

#[test]
fn test_decode_hex_with_spaces() {
    let hex = "01 02 03";
    let expected_bytes = [0x01, 0x02, 0x03];
    let actual_bytes = decode_hex(&hex).unwrap();
    assert_eq!(expected_bytes, actual_bytes.as_slice());
}

#[test]
fn test_decode_hex_with_invalid_characters() {
    let hex = "010203abc";
    assert!(decode_hex(&hex).is_err());
}
