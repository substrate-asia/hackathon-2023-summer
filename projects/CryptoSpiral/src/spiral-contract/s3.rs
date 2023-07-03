#![cfg_attr(not(feature = "std"), no_std)]

// use ink_lang as ink;
use pink_extension as pink;

//#[pink::contract(env=PinkEnvironment)]
//mod fat_contract_s3_sync {

    //use super::pink;

//    use ink_env;
//    use ink_env:://println;
//    use ink_prelude::format;
//    use ink_prelude::vec;
//    use ink_prelude::{
//        string::{String, ToString},
//        vec::Vec,
//    };
    use scale::{Decode, Encode};

    // To make HTTP request
    use pink::{http_get, PinkEnvironment};

    // To generate AWS4 Signature
    use hmac::{Hmac, Mac};
    use sha2::Digest;
    use sha2::Sha256;

    // To format block timestamp for http request headers
    use chrono::{TimeZone, Utc};

    // To encrypt/decrypt HTTP payloads
    use aes_gcm_siv::aead::{Aead, KeyInit, Nonce};
    use aes_gcm_siv::Aes256GcmSiv;
    use base16;
    use cipher::{
        consts::{U12, U32},
        generic_array::GenericArray,
    };
    use pink::chain_extension::signing;

    use crate::alloc::string::ToString;
    //use alloc::vec::Vec;
    //use alloc::string::String;
    use alloc::{format, string::String, vec::Vec, vec, };

    // Wrap PUT request in macro
    macro_rules! http_put {
        ($url: expr, $data: expr, $headers: expr) => {{
            use pink::chain_extension::HttpRequest;
            let headers = $headers;
            let body = $data.into();
            let request = HttpRequest {
                url: $url.into(),
                method: "PUT".into(),
                headers,
                body,
            };
            pink::ext().http_request(request)
        }};
        ($url: expr, $data: expr) => {{
            pink::http_put!($url, $data, Default::default())
        }};
    }

    // Make macro available for use inside/outside of module
    pub(crate) use http_put;

    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct FatContractS3Sync {
        pub access_key: String,
        pub secret_key: String,
        pub datetime: u64,
    }

    #[derive(Encode, Decode, Debug, PartialEq, Eq, Copy, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        RequestFailed,
        EncryptionFailed,
        DecryptionFailed,
        PlatformNotFound,
        CredentialsNotSealed,
    }

    impl FatContractS3Sync {
        pub fn new() -> Self {
            Self {
                access_key: "Not Sealed".to_string(),
                secret_key: "Not Sealed".to_string(),
                datetime: 0u64,
            }
        }

        pub fn seal_credentials(&mut self, access_key: String, secret_key: String) -> () {
            self.access_key = access_key;
            self.secret_key = secret_key;
        }

        pub fn get_time(&self) -> (String, String) {
            // Get block time (UNIX time in nano seconds)and convert to Utc datetime object
            //let time = self.env().block_timestamp() / 1000;
            let time = self.datetime; 
            let datetime = Utc.timestamp(time.try_into().unwrap(), 0);

            // Format both date and datetime for AWS4 signature
            let datestamp = datetime.format("%Y%m%d").to_string();
            let datetimestamp = datetime.format("%Y%m%dT%H%M%SZ").to_string();

            (datestamp, datetimestamp)
        }

        /// HTTP GETs and decrypts the data from the specified storage platform.
        /// Must seal the correct credentials before calling this function
        pub fn get_object(
            &self,
            platform: String,
            object_key: String,
            bucket_name: String,
            region: Option<String>,
        ) -> Result<String, Error> {
            if self.access_key == "Not Sealed" || self.secret_key == "Not Sealed" {
                return Err(Error::CredentialsNotSealed);
            }

            // Set request values
            let method = "GET";
            let service = "s3";
            let region = region.unwrap_or(String::from("us-east-1"));

            let host = if platform == "s3" {
                format!("{}.s3.amazonaws.com", bucket_name)
            } else if platform == "4everland" {
                "endpoint.4everland.co".to_string()
            } else if platform == "storj" {
                "gateway.storjshare.io".to_string()
            } else if platform == "filebase" {
                "s3.filebase.com".to_string()
            } else {
                return Err(Error::PlatformNotFound);
            };

            let payload_hash = format!("{:x}", Sha256::digest(b"")); // GET has default payload empty byte

            // Get current time: datestamp (e.g. 20220727) and amz_date (e.g. 20220727T141618Z)
            let (datestamp, amz_date) = self.get_time();

            // 1. Create canonical request
            let canonical_uri: String = if platform == "s3" {
                format!("/{}", object_key)
            } else {
                format!("/{}/{}", bucket_name, object_key)
            };
            let canonical_querystring = "";
            let canonical_headers = format!(
                "host:{}\nx-amz-content-sha256:{}\nx-amz-date:{}\n",
                host, payload_hash, amz_date
            );
            let signed_headers = "host;x-amz-content-sha256;x-amz-date";
            let canonical_request = format!(
                "{}\n{}\n{}\n{}\n{}\n{}",
                method,
                canonical_uri,
                canonical_querystring,
                canonical_headers,
                signed_headers,
                payload_hash
            );

            //println!(" ----- Canonical request -----  \n{}\n", canonical_request);
            //  ----- Canonical request -----
            // GET
            // /test/api-upload
            //
            // host:fat-contract-s3-sync.s3.amazonaws.com
            // x-amz-content-sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            // x-amz-date:19700101T000000Z
            //
            // host;x-amz-content-sha256;x-amz-date
            // e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

            // 2. Create "String to sign"
            let algorithm = "AWS4-HMAC-SHA256";
            let credential_scope = format!("{}/{}/{}/aws4_request", datestamp, region, service);
            let canonical_request_hash =
                format!("{:x}", Sha256::digest(&canonical_request.as_bytes()));
            let string_to_sign = format!(
                "{}\n{}\n{}\n{}",
                algorithm, amz_date, credential_scope, canonical_request_hash
            );

            //println!(" ----- String to sign ----- \n{}\n", string_to_sign);
            //  ----- String to sign -----
            // AWS4-HMAC-SHA256
            // 19700101T000000Z
            // 19700101/ap-southeast-1/s3/aws4_request
            // ec70fa653b4f867cda7a59007db15a7e95ed45d70bacdfb55902a2fb09b6367f

            // 3. Calculate signature
            let signature_key = get_signature_key(
                self.secret_key.as_bytes(),
                &datestamp.as_bytes(),
                &region.as_bytes(),
                &service.as_bytes(),
            );
            let signature_bytes = hmac_sign(&signature_key, &string_to_sign.as_bytes());
            let signature = format!("{}", base16::encode_lower(&signature_bytes));

            //println!(" ----- Signature ----- \n{}\n", &signature);
            //  ----- Signature -----
            // 485e174a7fed1691de34f116a968981709ed5a00f4975470bd3d0dd06ccd3e1d

            // 4. Create authorization header
            let authorization_header = format!(
                "{} Credential={}/{}, SignedHeaders={}, Signature={}",
                algorithm, self.access_key, credential_scope, signed_headers, signature
            );

            //println!(                 " ----- Authorization header ----- \nAuthorization: {}\n",                 &authorization_header             );
            //  ----- Authorization header -----
            // Authorization: AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE/19700101/ap-southeast-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=485e174a7fed1691de34f116a968981709ed5a00f4975470bd3d0dd06ccd3e1d

            let headers: Vec<(String, String)> = vec![
                ("Host".into(), host.to_string()),
                ("Authorization".into(), authorization_header.clone()),
                ("x-amz-content-sha256".into(), payload_hash),
                ("x-amz-date".into(), amz_date),
            ];

            // Make HTTP GET request
            let request_url: String = if platform == "s3" {
                format!(
                    "https://{}.s3.{}.amazonaws.com/{}",
                    bucket_name, region, object_key
                )
            } else {
                format!("https://{}/{}/{}", host, bucket_name, object_key)
            };
            let response = http_get!(request_url, headers);

            ////println!(" ----- response----- \n{}\n", &response);
            if response.status_code != 200 {
                return Err(Error::RequestFailed);
            }

            // Generate key and nonce
            let key_bytes: Vec<u8> =
                signing::derive_sr25519_key(object_key.as_bytes())[..32].to_vec();
            let key: &GenericArray<u8, U32> = GenericArray::from_slice(&key_bytes);
            let nonce_bytes: Vec<u8> = self.access_key.as_bytes()[..12].to_vec();
            let nonce: &GenericArray<u8, U12> = Nonce::<Aes256GcmSiv>::from_slice(&nonce_bytes);

            // Decrypt payload
            let cipher = Aes256GcmSiv::new(key.into());
            let decrypted_byte = cipher
                .decrypt(&nonce, response.body.as_ref())
                .or(Err(Error::DecryptionFailed));
            let result = format!("{}", String::from_utf8_lossy(&decrypted_byte.unwrap()));

            Ok(result)
        }

        /// Encrypts and HTTP PUTs the data to the specified storage platform as byte stream.
        /// Must seal the correct credentials before calling this function.
        pub fn put_object(
            &self,
            platform: String,
            object_key: String,
            bucket_name: String,
            region: String,
            payload: String,
        ) -> Result<String, Error> {
            if self.access_key == "Not Sealed" || self.secret_key == "Not Sealed" {
                return Err(Error::CredentialsNotSealed);
            }

            // Generate key and nonce
            let key_bytes: Vec<u8> =
                signing::derive_sr25519_key(object_key.as_bytes())[..32].to_vec();
            let key: &GenericArray<u8, U32> = GenericArray::from_slice(&key_bytes);
            let nonce_bytes: Vec<u8> = self.access_key.as_bytes()[..12].to_vec();
            let nonce: &GenericArray<u8, U12> = Nonce::<Aes256GcmSiv>::from_slice(&nonce_bytes);

            // Encrypt payload
            let cipher = Aes256GcmSiv::new(key.into());
            let encrypted_bytes: Vec<u8> = cipher.encrypt(nonce, payload.as_bytes().as_ref()).unwrap();
            //let encrypted_bytes: Vec<u8> = payload.as_bytes().as_ref().to_vec(); //feng

            // Set request values
            let method = "PUT";
            let service = "s3";
            // let region = region.unwrap_or(String::from("us-east-1"));

            let host = if platform == "s3" {
                format!("{}.s3.amazonaws.com", bucket_name)
            } else if platform == "4everland" {
                "endpoint.4everland.co".to_string()
            } else if platform == "storj" {
                "gateway.storjshare.io".to_string()
            } else if platform == "filebase" {
                "s3.filebase.com".to_string()
            } else {
                return Err(Error::PlatformNotFound);
            };

            let payload_hash = format!("{:x}", Sha256::digest(&encrypted_bytes));
            let content_length = format!("{}", encrypted_bytes.clone().len());

            // Get datestamp (20220727) and amz_date (20220727T141618Z)
            let (datestamp, amz_date) = self.get_time();

            //println!(" ----- datestamp {} amz_date {}\n", datestamp, amz_date);

            // 1. Create canonical request
            let canonical_uri: String = if platform == "s3" {
                format!("/{}", object_key)
            } else {
                format!("/{}/{}", bucket_name, object_key)
            };
            let canonical_querystring = "";
            let canonical_headers = format!(
                "host:{}\nx-amz-content-sha256:{}\nx-amz-date:{}\n",
                host, payload_hash, amz_date
            );
            let signed_headers = "host;x-amz-content-sha256;x-amz-date";
            let canonical_request = format!(
                "{}\n{}\n{}\n{}\n{}\n{}",
                method,
                canonical_uri,
                canonical_querystring,
                canonical_headers,
                signed_headers,
                payload_hash
            );

            //println!(" ----- Canonical request -----  \n{}\n", canonical_request);
            //  ----- Canonical request -----
            // PUT
            // /test/api-upload
            //
            // host:fat-contract-s3-sync.s3.amazonaws.com
            // x-amz-content-sha256:505f2ec6d688d6e15f718b5c91edd07c45310e08e8c221018a7c0f103515fa28
            // x-amz-date:19700101T000000Z
            //
            // host;x-amz-content-sha256;x-amz-date
            // 505f2ec6d688d6e15f718b5c91edd07c45310e08e8c221018a7c0f103515fa28

            // 2. Create string to sign
            let algorithm = "AWS4-HMAC-SHA256";
            let credential_scope = format!("{}/{}/{}/aws4_request", datestamp, region, service);
            let canonical_request_hash =
                format!("{:x}", Sha256::digest(&canonical_request.as_bytes()));
            let string_to_sign = format!(
                "{}\n{}\n{}\n{}",
                algorithm, amz_date, credential_scope, canonical_request_hash
            );

            //println!(" ----- String to sign ----- \n{}\n", string_to_sign);
            //  ----- String to sign -----
            // AWS4-HMAC-SHA256
            // 19700101T000000Z
            // 19700101/ap-southeast-1/s3/aws4_request
            // efd07a6d8013f3c35d4c3d6b7f52f86ae682c51a8639fe80b8f68198107e3039

            // 3. Calculate signature
            let signature_key = get_signature_key(
                self.secret_key.as_bytes(),
                &datestamp.as_bytes(),
                &region.as_bytes(),
                &service.as_bytes(),
            );
            let signature_bytes = hmac_sign(&signature_key, &string_to_sign.as_bytes());
            let signature = format!("{}", base16::encode_lower(&signature_bytes));

            //println!(" ----- Signature ----- \n{}\n", &signature);
            //  ----- Signature -----
            // 84bf2db9f7a0007f5124cf2e9c0e1b7e1cec2b1b1b209ab9458387caa3b8da52

            // 4. Create authorization header
            let authorization_header = format!(
                "{} Credential={}/{},SignedHeaders={},Signature={}",
                algorithm, self.access_key, credential_scope, signed_headers, signature
            );

            //println!(          " ----- Authorization header ----- \nAuthorization: {}\n",              &authorization_header             );
            //  ----- Authorization header -----
            // Authorization: AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE/19700101/ap-southeast-1/s3/aws4_request,SignedHeaders=host;x-amz-content-sha256;x-amz-date,Signature=b9b6bcb29b1369678e3a3cfae411a5277c084c8c1796bb6e78407f402f9e3f3d

            let request_url: String = if platform == "s3" {
                format!(
                    "https://{}.s3.{}.amazonaws.com/{}",
                    bucket_name, region, object_key
                )
            } else {
                format!("https://{}/{}/{}", host, bucket_name, object_key)
            };

            let headers: Vec<(String, String)> = vec![
                ("Host".into(), host),
                ("Authorization".into(), authorization_header),
                ("Content-Length".into(), content_length),
                ("Content-Type".into(), "binary/octet-stream".into()),
                ("x-amz-content-sha256".into(), payload_hash),
                ("x-amz-date".into(), amz_date),
            ];


            //println!(" ----- request_url ----- \n{}\n", &request_url);
            //println!(" ----- encrypted_bytes ----- \n{:?}\n", &encrypted_bytes);
            //println!(" ----- headers ----- \n{:?}\n", &headers);

            let response = http_put!(request_url, encrypted_bytes, headers);

            // if response.status_code != 200 {
            //     return Err(Error::RequestFailed);
            // }

            Ok(format!(
                "{}\n{}\n{}\n{:?}",
                response.status_code,
                response.reason_phrase,
                String::from_utf8_lossy(&response.body),
                response.headers
            ))
        }
    }

    // Create alias for HMAC-SHA256
    type HmacSha256 = Hmac<Sha256>;

    // Returns encrypted hex bytes of key and message using SHA256
    pub fn hmac_sign(key: &[u8], msg: &[u8]) -> Vec<u8> {
        let mut mac =
            <HmacSha256 as Mac>::new_from_slice(key).expect("Could not instantiate HMAC instance");
        mac.update(msg);
        let result = mac.finalize().into_bytes();
        result.to_vec()
    }

    // Returns the signature key for the complicated version
    pub fn get_signature_key(
        key: &[u8],
        datestamp: &[u8],
        region_name: &[u8],
        service_name: &[u8],
    ) -> Vec<u8> {
        let k_date = hmac_sign(&[b"AWS4", key].concat(), datestamp);
        let k_region = hmac_sign(&k_date, region_name);
        let k_service = hmac_sign(&k_region, service_name);
        let k_signing = hmac_sign(&k_service, b"aws4_request");
        return k_signing;
    }

 //}
