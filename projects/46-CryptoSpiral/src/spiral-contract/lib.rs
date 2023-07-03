#![cfg_attr(not(feature = "std"), no_std)]
extern crate alloc;

mod s3;


#[ink::contract(env=pink_extension::PinkEnvironment)]
mod crypto_spiral_contract {   

    use alloc::{format, string::String, vec::Vec};
    use chrono::{DateTime, NaiveDateTime, Utc};
    use fixed::types::U64F64;
    use fixed_macro::fixed;
    use pink_extension::{
        chain_extension::{signing, SigType},
        http_get,
    };
    use pink_json::from_slice;
    use pink_subrpc::{
        create_transaction, get_storage, send_transaction, storage::storage_prefix, ExtraParam,
    };

    use crate::s3::{FatContractS3Sync, Error::CredentialsNotSealed};

    use ink::storage::Mapping;

    use index::graph::{AccountInfo, Index, AccountData};

    use pink_subrpc::storage::storage_map_prefix;
    use pink_subrpc::hasher::Blake2_128Concat;
    use pink_extension::ResultExt;

    use crate::alloc::string::ToString;

    use scale::{Decode, Encode};
    use serde::Deserialize;
    use alloc::vec;
	use pink_extension::PinkEnvironment;
    use pink_subrpc::transaction::{MultiAddress, MultiSignature, Signature, UnsignedExtrinsic};

    use hex;
	use sha2::Digest;
    use sha2::Sha256;
    use hex::FromHex;


    const COMPUTING_PERIOD: u64 = 24 * 60 * 60 * 1000; // 24 hours
    const ONE_MINUTE: u64 = 60 * 1000;
    const ONE_MINUTE_BUDGET: u64 = 500;
    const ONE_PERIOD_BUDGET: u64 = ONE_MINUTE_BUDGET * (COMPUTING_PERIOD / ONE_MINUTE);
    const NONCE_OFFSET: i64 = -19430; // based on contract first run date
    const HALVING_PERIOD: i64 = 180 * 24 * 60 * 60 * 1000; // 180 days
    const HALVING_START_INDEX: i64 = 1;
    const HALVING_RATIO: U64F64 = fixed!(0.75: U64F64);
    const HALVING_START_TIME: i64 = 1_685_923_200_000; // UNIX timestamp for 2023-06-05T00:00:00.000Z

    #[derive(Debug, PartialEq, Eq, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        InvalidArgs,
        InvalidStorage,
        ChainRpcFailed,
        HttpRequestFailed,
        InvalidResponseBody,
        BlockNotFound,
        SharesNotFound,
        InvalidNonce,
        InviteDuplicated,
        TaskAcationPayNotExist,

        S3CredentialsNotSealed,
    }

    /// Type alias for the contract's result type.
    pub type Result<T, E = Error> = core::result::Result<T, E>;

    #[ink(storage)]
    pub struct CryptoSpiral {
        pub executor_account: [u8; 32],
        executor_private_key: [u8; 32],

        pub main_net_endpoint: String,
        pub desk_account: [u8; 32],
        
        s3_access_key: String,
        s3_secret_key: String,
       
        //<code, (title, linkName )>
        actions: String,
        //actions: ink::storage::Mapping<String, String>,
    }

    #[derive(Deserialize, serde::Serialize, Encode, Clone, Debug, PartialEq)]
    #[serde(rename_all = "camelCase")]
    pub struct CryptoSpiralVO {
        executor_account: String,
        main_net_endpoint: String,
        desk_account: String,
        actions: String,
        s3_access_key: String,
        timestamp: String,
    }


    #[derive(Deserialize, Encode, Clone, Debug, PartialEq)]
    struct GraphQLResponse<T> {
        data: T,
    }

    #[derive(Deserialize, Encode, Clone, Debug, PartialEq)]
    pub struct BlockNode {
        timestamp: String,
        height: u32,
    }

    #[derive(Deserialize, Encode, Clone, Debug, PartialEq)]
    struct ConnectionEdge<T> {
        node: T,
    }

    #[derive(Deserialize, Encode, Clone, Debug, PartialEq)]
    struct BlocksConnection {
        edges: Vec<ConnectionEdge<BlockNode>>,
    }

    #[derive(Deserialize, Encode, Clone, Debug, PartialEq)]
    #[serde(rename_all = "camelCase")]
    struct BlocksData {
        blocks_connection: BlocksConnection,
    }

    #[derive(Deserialize, Encode, Clone, Debug, PartialEq)]
    pub struct SnapshotNode {
        shares: String,
    }

    #[derive(Deserialize, Encode, Clone, Debug, PartialEq)]
    struct SnapshotsConnection {
        edges: Vec<ConnectionEdge<SnapshotNode>>,
    }

    #[derive(Deserialize, Encode, Clone, Debug, PartialEq)]
    #[serde(rename_all = "camelCase")]
    struct SnapshotData {
        worker_shares_snapshots_connection: SnapshotsConnection,
    }

    #[derive(Deserialize, serde::Serialize, Encode, Clone, Debug, PartialEq)]
    #[serde(rename_all = "camelCase")]
    pub struct shareInviteInfo {
        code: String,
        msg: String,
        vpn_cfg: String,
        account_info: String,
        timestamp: String,
    }



    pub struct Block {
        timestamp: String,
        height: u32,
    }

    pub struct Chain {
        pub name: String,
        pub endpoint: String,
        pub archive_url: String,
        pub squid_url: String,
        pub nonce: u64,
        pub period_last_block: u32,
        pub period_block_count: u32,
        pub shares: U64F64,
        pub budget_per_block: U64F64,
    }

    fn timestamp_to_iso(timestamp: i64) -> String {
        let date_time = DateTime::<Utc>::from_utc(
            NaiveDateTime::from_timestamp_millis(timestamp).unwrap(),
            Utc,
        );

        date_time.to_rfc3339_opts(chrono::SecondsFormat::Millis, true)
    }

    fn fetch_nonce(endpoint: String) -> Result<u64> {
        let raw_storage = get_storage(
            endpoint.as_str(),
            //&storage_prefix("PhalaComputation", "BudgetUpdateNonce"),
            &storage_prefix("PhalaComputation", "CoolDownPeriod"),
            None,
        )
        .or(Err(Error::HttpRequestFailed))
        .unwrap()
        //.unwrap_or();
        .unwrap();

        let nonce = scale::Decode::decode(&mut raw_storage.as_slice())
            .or(Err(Error::InvalidStorage))
            .unwrap();

        Ok(nonce)
    }

    impl Chain {
        pub fn new(name: String, endpoint: String, archive_url: String, squid_url: String) -> Self {
            let endpoint_clone = endpoint.clone();
            Self {
                name,
                endpoint,
                archive_url,
                squid_url,
                nonce: fetch_nonce(endpoint_clone).unwrap(),
                period_last_block: 0,
                period_block_count: 0,
                shares: fixed!(0: U64F64),
                budget_per_block: fixed!(0: U64F64),
            }
        }

        fn fetch_shares_by_timestamp(&mut self, timestamp: u64) -> Result<U64F64> {
            let resp = http_get!(format!("{}?query=%7B%20workerSharesSnapshotsConnection(orderBy%3A%20updatedTime_ASC%2C%20first%3A%201%2C%20where%3A%20%7BupdatedTime_gte%3A%20%22{}%22%7D)%20%7B%20edges%20%7B%20node%20%7B%20shares%20%7D%20%7D%20%7D%20%7D%0A", self.squid_url, timestamp_to_iso(timestamp as i64)));
            if resp.status_code != 200 {
                return Err(Error::HttpRequestFailed);
            }
            let result: GraphQLResponse<SnapshotData> = from_slice(&resp.body).unwrap();

            match result.data.worker_shares_snapshots_connection.edges.len() {
                0 => return Err(Error::SharesNotFound),
                _ => Ok({
                    let node = result.data.worker_shares_snapshots_connection.edges[0]
                        .node
                        .clone();

                    let shares = U64F64::from_str(&node.shares).unwrap();
                    self.shares = shares;
                    shares
                }),
            }
        }

        pub fn get_balance(&self, public_key: [u8; 32]) -> Result<u128> {
			//self.mytest();

            let rpc_node = &self.endpoint;
            if let Some(raw_storage) = get_storage(
                rpc_node,
                &storage_map_prefix::<Blake2_128Concat>(
                    &storage_prefix("System", "Account")[..],
                    &public_key,
                ),
                None,
            )
            .log_err("Read storage [sub native balance] failed")
            .map_err(|_| Error::HttpRequestFailed)?
            {   
                let account_info: AccountInfo<Index, AccountData<Balance>> =
                    scale::Decode::decode(&mut raw_storage.as_slice())
                        .log_err("Decode storage [sub native balance] failed")
                        .map_err(|_| Error::InvalidStorage)?;
            //println!("feng get_balance.............0{:?}", account_info.data.free);
                Ok(account_info.data.free)
//                Ok(0u128)
            } else {
            //println!("feng get_balance.............0");
                Ok(0u128)
            }

        }



        pub fn get_action_payed(&self, public_key: [u8; 32]) -> Result<Vec<(u128, u64, u128)>> {

            //println!("feng get_action_payed.............0");
            let rpc_node = &self.endpoint;
            //let rpc_node = "http://43.154.226.88:9933/";//this 9944 is rpc api
            if let Some(raw_storage) = get_storage(
                rpc_node,
                &storage_map_prefix::<Blake2_128Concat>(
                    &storage_prefix("Web3Dao", "TaskActionPayed"),
                    &public_key,
                    //&account_id[..32],
                ),
                None,
            )
            .log_err("Read storage [TaskActionPayed] failed")
            .map_err(|_| Error::HttpRequestFailed)?
            {   
            //println!("feng get_action_payed.............1");
                let action_payed_list: Vec<(u128, u64, u128)> =
                    scale::Decode::decode(&mut raw_storage.as_slice())
                        .log_err("Decode storage [TaskActionPayed] failed")
                        .map_err(|_| Error::InvalidStorage)?;
            //println!("feng get_action_payed.............2{:?}", action_payed_list);
                Ok(action_payed_list)
            } else {
            //println!("feng get_action_payed.............3");
                Ok(vec![])
            }

        }
 
        pub fn send_extrinsic(&self, signer: [u8; 32], nonce: u64) {
            if nonce > self.nonce {
                let signed_tx = create_transaction(
                    &signer,
                    &self.name,
                    &self.endpoint,
                    0x57_u8,
                    0x07_u8,
                    (
                        nonce,
                        self.period_last_block,
                        self.budget_per_block.to_bits(),
                    ),
                    ExtraParam::default(),
                )
                .unwrap();
                send_transaction(&self.endpoint, &signed_tx).unwrap();
            }
        }

        pub fn union_task_action_finish(&self, signer: [u8; 32],  account_id: AccountId, task_id: u128,  action_id: u64, cost: u128) -> Result<Vec<u8>, Error> {
            
            use hex_literal::hex;
            //let signer: [u8; 32] = hex!("e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a");//alice
            //let rpc_node = "http://43.154.226.88:9933/";//9933 is rpc,//9944 is ws
            let rpc_node = &self.endpoint;
            let signed_tx = create_transaction(
                &signer,
                &self.name,
                rpc_node,
                0x6e_u8,
                0x11_u8,
                (
                    account_id,
                    task_id,
                    action_id,
                    cost,
                ),
                ExtraParam::default(),
            )
            .unwrap();
            let res = send_transaction(&self.endpoint, &signed_tx);
            res.or(Err(Error::ChainRpcFailed))

        }



        pub fn union_task_reward(&self, signer: [u8; 32], reward_total: u128,  reward_account_id: AccountId, nonce: String, nonce_new: String) -> Result<Vec<u8>, Error> {
            
            use hex_literal::hex;
            //let signer_: [u8; 32] = hex!("e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a");//alice
            let signed_tx = create_transaction(
                &signer,
                &self.name,
                &self.endpoint,
                //rpc_node,
                0x6e_u8,
                0x0f_u8,
                (
                    reward_total,
                    reward_account_id,
                    nonce,
                    nonce_new,
                ),
                ExtraParam::default(),
            )
            .unwrap();
            send_transaction(&self.endpoint, &signed_tx).or(Err(Error::ChainRpcFailed))
        }



        fn fetch_block(&self, query: String) -> Result<Block> {
            let resp = http_get!(format!("{}?query={}", self.archive_url, query));

            if resp.status_code != 200 {
                return Err(Error::HttpRequestFailed);
            }

            let result: GraphQLResponse<BlocksData> = from_slice(&resp.body)
                .or(Err(Error::InvalidResponseBody))
                .unwrap();

            match result.data.blocks_connection.edges.len() {
                0 => return Err(Error::BlockNotFound),
                _ => Ok({
                    let node = result.data.blocks_connection.edges[0].node.clone();
                    Block {
                        timestamp: String::from(node.timestamp),
                        height: node.height,
                    }
                }),
            }
        }

        pub fn fetch_block_by_timestamp(&self, timestamp: u64) -> Result<Block> {
            self.fetch_block(format!("%7B%20blocksConnection(orderBy%3A%20height_ASC%20first%3A%201%20where%3A%20%7Btimestamp_gte%3A%20%22{}%22%7D%20)%20%7B%20edges%20%7B%20node%20%7B%20timestamp%20height%20%7D%20%7D%20%7D%20%7D", timestamp_to_iso(timestamp as i64)))
        }

        pub fn fetch_latest_block(&self) -> Result<Block> {
            self.fetch_block(String::from("%7B%20blocksConnection(orderBy%3A%20height_DESC%20first%3A%201)%20%7B%20edges%20%7B%20node%20%7B%20timestamp%20height%20%7D%20%7D%20%7D%20%7D"))
        }

        pub fn fetch_period_block_count(&mut self, end_time: u64, period: u64) -> Result<u32> {
            let start_time = end_time - period;
            let start_block = self.fetch_block_by_timestamp(start_time).unwrap();
            let end_block = self.fetch_block_by_timestamp(end_time).unwrap();
            self.period_last_block = end_block.height;
            let count = end_block.height - start_block.height;
            self.period_block_count = count;
            Ok(count)
        }

    }

    impl CryptoSpiral {
        /// Initialize the privacy contract, and the most crucial part is generating a secret key.
        #[ink(constructor)]
        pub fn new() -> Self {
            let private_key =
                pink_web3::keys::pink::KeyPair::derive_keypair(b"executor").private_key();
            let account32: [u8; 32] = signing::get_public_key(&private_key, SigType::Sr25519)
                .try_into()
                .unwrap();

            let alice_r ="d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";//initial the args when new ,  just easy for test 
            let alice_r = <[u8; 32]>::from_hex(alice_r.clone()).unwrap();

            Self {
                executor_account: account32,
                executor_private_key: private_key,

                //desk_account: [0; 32],
                desk_account: alice_r,

                main_net_endpoint: "http://52.186.16.105:9933/".to_string(),
                s3_access_key: "ZJQ4CX27IWOA7R8DLDVU".to_string(),
                s3_secret_key: "8rpQAklZEbRJ3bvMfipB0lZyvg9ELz9popHSbhAq".to_string(),
                actions: "[]".to_string(),

            }
        }


        #[ink(message)]
        pub fn get_executor_account(&self) -> String {
            hex::encode(self.executor_account)
        }

		// Seal the decentralized S3 account number and the Substrate node address.
		// In future production, the private key for this S3 account can also be generated automatically and the contract can directly pay for storage fees. This ensures that S3 is not maliciously compromised.
        #[ink(message)]
        pub fn seal_credentials(&mut self, main_net_endpoint: String, access_key: String, secret_key: String) -> () {
            self.main_net_endpoint = main_net_endpoint;
            self.s3_access_key = access_key;
            self.s3_secret_key = secret_key;
        }

		// Seal the actions of Task 
        #[ink(message)]
        pub fn seal_actions(&mut self, desk_account: AccountId,  actions: String) -> Result<String> {
            use hex::FromHex;

            self.actions = actions;
            let desk_account = hex::encode(desk_account);
            let desk_account = <[u8; 32]>::from_hex(desk_account.clone()).or(Err(Error::InvalidArgs))?;
            self.desk_account = desk_account;
            Ok("".to_string())
        }


		// get all metadata that sealed
        #[ink(message)]
        pub fn get_sealed_metadata(&self) -> String {
            let executor_account = hex::encode(self.executor_account);
            let desk_account = hex::encode(self.desk_account);
	
			let crypto_spiral_VO = CryptoSpiralVO{
                executor_account: executor_account.clone(),
                main_net_endpoint: self.main_net_endpoint.clone(),
                desk_account: desk_account.clone(),
                actions: self.actions.clone(),
                s3_access_key: self.s3_access_key.clone(),
                timestamp: "".to_string(),
            };
			let json_str = pink_json::to_string(&crypto_spiral_VO).unwrap();
	
			json_str

        }



		pub fn put_object(
            &self,
            object_key: String,
           // bucket_name: String,
            //region: String,
            payload: String,
        ) -> Result<String, Error> {
            //println!(" ----- object_key {} \n", object_key);    
            //println!(" ----- payload {} \n", payload);    

            if self.s3_access_key == "Not Sealed" || self.s3_secret_key == "Not Sealed" {
                return Err(Error::S3CredentialsNotSealed);
            }

            let bucket_name = "web3pionnertest".to_string();
            let region = "region1".to_string();

			let datetime = self.env().block_timestamp() / 1000;
            //let datetime: u64 = 1683450113; //feng mock
            //println!(" ----- datetime {} \n", datetime);    

			let s3_sync = FatContractS3Sync{
				access_key: self.s3_access_key.clone(),
				secret_key: self.s3_secret_key.clone(),
				datetime,
			};

            s3_sync.put_object("4everland".to_string(), object_key, bucket_name, region, payload).or(Err(Error::InvalidStorage))

		}


      
		pub fn get_object(
            &self,
            object_key: String,
           // bucket_name: String,
            //region: String,
            //payload: String,
        ) -> Result<String, Error> {
            if self.s3_access_key == "Not Sealed" || self.s3_secret_key == "Not Sealed" {
                return Err(Error::S3CredentialsNotSealed);
            }

            let bucket_name = "web3pionnertest".to_string();
            let region = "region1".to_string();

			let datetime = self.env().block_timestamp() / 1000;
            //let datetime: u64 = 1683450113;//feng mock
            //println!(" ----- datetime {} \n", datetime);    

			let s3_sync = FatContractS3Sync{
				access_key: self.s3_access_key.clone(),
				secret_key: self.s3_secret_key.clone(),
				datetime,
			};

            s3_sync.get_object("4everland".to_string(), object_key, bucket_name, Some(region)).or(Err(Error::InvalidStorage))

		}



        pub fn action_reward_(&self, account_id_string: String, reward: u128) -> u64 {

            let reward_key: String = account_id_string.clone() +"_reward";
            let reward_str: String = self.get_object(reward_key.clone()).unwrap_or("".to_string());

            let parsed_value: u128 = match reward_str.parse() {
                Ok(num) => num,
                Err(_) => {
                    return 500;
                }
            };

            let result = parsed_value + reward;

            let result_string = result.to_string();


            match self.put_object(reward_key.clone(), result_string).or(Err(Error::InvalidStorage))  {
                Err(_) =>{ return 500},
                _ => {},
            }

            200
        }



        #[ink(message)]
        pub fn reward_draw(&self, account_ids_: Vec<AccountId>, reward_account_id: AccountId) -> Result<Vec<u8>, Error> {


			//some code have been removed here for it is just under test
			//but it exist in the released binary (target/ink/)
			
            //let call_result = phala.union_task_reward(self.executor_private_key, reward_total,  reward_account_id, done_nonce, done_nonce_new);


			Ok(vec![])

        }


        // when the s3 is bad egg, you can restore data witch new storage , and later do draw with
        // new s3 storage
        #[ink(message)]
        pub fn data_flush(&mut self, account_ids: Vec<AccountId>, reward_account_id: AccountId) -> Vec<AccountId> {
            //todo
            vec![]
        }



        // when the node is bad egg , you can flush draw witch new status, and later do draw with
        // new node 
        #[ink(message)]
        pub fn draw_flush(&mut self, account_ids: Vec<AccountId>) -> Vec<AccountId> {
            //todo
            vec![]

        }



        #[ink(message)]
        pub fn add_vpn_operator(&self, vpn_id: u32, host: String, authkey: String, sign_tx_hex: String , call_hex: String) -> Result<String> {
            //todo 
            Ok("".to_string())
        }


		// On-chain operation definition: Allows advertisers to quickly define on-chain operations that users need to complete.
		// Verification & Reward: When calling this API, it indicates whether the specified user has completed the operation defined in step 1. If successful, the predefined incentive is awarded to the promoter.

        #[ink(message)]
        pub fn do_task_action(&self, task_id: u128, action_id: u64,  arg: String, account_id: AccountId) -> Result<String> {
            //get the vpnToCreate use api
            use hex::FromHex;

            let caller = self.env().caller();
            let account_str = hex::encode(caller);
            //let account_str = "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";  //feng mock
            let public_key = <[u8; 32]>::from_hex(account_str.clone()).or(Err(Error::InvalidArgs))?;
            //let caller: AccountId =public_key.into();

            let account_from_str = hex::encode(account_id);

            let mut phala = Chain::new(
                String::from("substrate"),
                // String::from("https://phala.api.onfinality.io/public-ws"),
                //String::from("http://43.154.226.88:9933/"),
                self.main_net_endpoint.clone(),
                // String::from("https://phala.explorer.subsquid.io/graphql"),
                String::from("http://127.0.0.1:4005/graphql"),
                String::from("http://127.0.0.1:4355/graphql"),
            );

			
            // Verification: get the On-chain operation that Triggered by user  
			// notice: The ＂main_net_endpoint＂ may be malicious, returning incorrect data or submitting incorrect data. We can address this issue by implementing a light node or other methods. However, our focus now is on privacy. Through TEE contracts, we can write or read encrypted data to/from Substrate, ensuring the security of the advertisers.
            let action_vec = phala.get_action_payed(public_key).unwrap();
			
            if !action_vec.iter().any(|&(a, b, _)| a == task_id && b == action_id) {
				// no On-chain operation Triggered
                return Err(Error::TaskAcationPayNotExist);
            }
            //println!("feng get do_task_action............. 0   {:?}", action_vec);

            let mut result: String = String::from("");
            //if action_id == 0 {
			// Reward : no we just reward new use a VPN for demo.(retun the vpn config for user)
            if true { //only support vpn first //todo 
                //call rpc to reate vpn a
                let vpn_md5 = arg;
                let request_url = "http://43.132.0.0:9091/web3/addUserGetV2ray?email={{USER}}&password={{PWD}}&b=102400&c=30&t=180&serverAuthToken=---";
                let request_url_  = request_url.replace("{{USER}}",&vpn_md5).replace("{{PWD}}", &vpn_md5);
                let response = http_get!(request_url_, vec![]);
    
    
                if response.status_code != 200 {
                    return Err(Error::HttpRequestFailed);
                }
    
                let client_cfg_wrap: String = String::from_utf8_lossy(&response.body).to_string();
                result= client_cfg_wrap.clone();
            }
			
            //  Reward the Promoter 1 coin, 
			//  Now just save in S3, Promoter can Withdrawal at any time.
			//  Before saving, the data will be encrypted using automatically generated keys, and then stored on a decentralized S3 service.			
            let is_new_invite = self.action_reward_(account_from_str.to_string(), 1);
            if is_new_invite==200 {

            }



            let mut phala = Chain::new(
                String::from("substrate"),
                // String::from("https://phala.api.onfinality.io/public-ws"),
                //String::from("http://43.154.226.88:9933/"),
                self.main_net_endpoint.clone(),
                // String::from("https://phala.explorer.subsquid.io/graphql"),
                String::from("http://127.0.0.1:4005/graphql"),
                String::from("http://127.0.0.1:4355/graphql"),
            );

			// 
            let call_result = phala.union_task_action_finish(self.executor_private_key, caller, task_id, action_id, 0);

            //println!("feng call_result  {:?}", call_result);
            match call_result {
                Ok(response) =>{
                    //println!("aaaa {}", hex::encode(&response));
                   //return Ok(response);
                },
                Err(error) =>{
                    return Err(error)
                }

            }
            Ok(result)
 
        }



    }
 


	/// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;
        use ink;
        use hex::FromHex;

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            //ink::env::test::set_block_timestamp::<ink::env::DefaultEnvironment>(1682754850u64);



            // when your contract is really deployed, the Phala Worker will do the HTTP requests
            // mock is needed for local test
            pink_extension_runtime::mock_ext::mock_all_ext();


            let mut crypto_spiral = CryptoSpiral::new();

			let key1 =
                pink_web3::keys::pink::KeyPair::derive_keypair(b"key1").private_key();
            let account1: [u8; 32] = signing::get_public_key(&key1, SigType::Sr25519)
                .try_into()
                .unwrap();
            dbg!(hex::encode(account1.clone()));

			let key2 =
                pink_web3::keys::pink::KeyPair::derive_keypair(b"key2").private_key();
            let account2: [u8; 32] = signing::get_public_key(&key2, SigType::Sr25519)
                .try_into()
                .unwrap();

            dbg!(hex::encode(account2.clone()));

			let key3 =
                pink_web3::keys::pink::KeyPair::derive_keypair(b"key3").private_key();
            let account3: [u8; 32] = signing::get_public_key(&key3, SigType::Sr25519)
                .try_into()
                .unwrap();

            dbg!(hex::encode(account3.clone()));
            let alice_r ="d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";
            let alice_r = <[u8; 32]>::from_hex(alice_r.clone()).unwrap();
            let alice_r: AccountId =alice_r.into();



            crypto_spiral.seal_credentials("http://52.186.16.105:9933/".to_string(), "ZJQ4CX27IWOA7R8DLDVU".to_string(), ".......".to_string());

            let account_id_str = crypto_spiral.get_executor_account();
            dbg!(account_id_str);
            let balance = crypto_spiral.get_balance();
            dbg!(balance);


//            let seal_actions = crypto_spiral.seal_actions(alice_r, "[{\"code\":\"abc\",\"title\":\"titletest\",\"linkNick\":\"here\"}]".to_string());
//
//            dbg!(seal_actions);
//
//            let  get_sealed_metadata = crypto_spiral.get_sealed_metadata();
//            dbg!(get_sealed_metadata);
//
//            dbg!(hex::encode(accounts.alice.clone()));
//            let result = crypto_spiral.create_vpn(0, "8643cf15735c2d6ebdf14abf6290f0e3".to_string(), alice_r);
//            dbg!(result);


            let result = crypto_spiral.do_task_action(0, 2,"8643cf15735c2d6ebdf14abf6290f0e3".to_string(), alice_r);
            dbg!(result);






        }
    }



}
