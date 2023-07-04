use std::error::Error;

use bytes::Bytes;
use reqwest;
use tokio::fs::File;
use tokio::io::{self, AsyncReadExt};
use uuid::Uuid;

const DEOSS_URL: &str = "https://deoss-pub-gateway.cess.cloud";
const DEOSS_BUCKET: &str = "blog-images";
pub struct DeOssClient {
    bucket_name: String,
    access_token: String,
    account: String,
}

impl DeOssClient {
    pub fn new(bucket_name: String, access_token: String, account: String) -> Self {
        Self {
            bucket_name,
            access_token,
            account,
        }
    }

    pub async fn put(self, file_path: String, file_name: String) {
        // get file stream from url
        let full_url = format!("{}/{}-{}", DEOSS_URL, Uuid::new_v4(), file_name);
        println!("put full_url: {}", full_url);
        let mut file = File::open(file_path).await.unwrap();
        let mut vec = Vec::new();
        file.read_to_end(&mut vec);
        let client = reqwest::Client::new();
        let res = client
            .put(full_url)
            .header("content-type", "application/octet-stream")
            .header("Authorization", self.access_token)
            .header("BucketName", DEOSS_BUCKET)
            .body(vec)
            .send()
            .await
            .unwrap();
        println!("put res: {:?}", res);
    }

    pub async fn get(self, fid: String) -> Option<Bytes> {
        println!("deoss fid: {}", fid);
        let full_url = format!("{}/{}", DEOSS_URL, fid);
        println!("full_url with fid: {}", full_url);
        let client = reqwest::Client::new();
        let response = client
            .get(full_url)
            .header("Account", self.account)
            .header("Operation", "download")
            .send()
            .await
            .unwrap();
        let content = response.bytes().await.unwrap();
        println!("content: {:?}", content);
        Some(content)
    }

    pub async fn delete(self, fid: &str) {
        let full_url = format!("{}/{}", DEOSS_URL, fid);
        let client = reqwest::Client::new();
        client
            .delete(full_url)
            .header("Account", self.account)
            .header("Operation", "delete")
            .send()
            .await
            .unwrap();
    }

    pub async fn info(self, fid: &str) {}
}
