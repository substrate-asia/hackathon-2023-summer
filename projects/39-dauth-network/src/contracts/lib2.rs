#![cfg_attr(not(feature = "std"), no_std)]


#[ink::contract]
mod key_ledger {

    use ink::storage::Mapping;
    use ink::storage::traits::StorageLayout;
    use ink_env::debug_println;

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
    struct Node {
        nid: AccountId,
        pub_k: String
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
    struct User {
        uid: AccountId,
        pub_k: String,
        node1_cond_type: u8,
        node1_id: AccountId,
        node2_cond_type: u8,
        node2_id: AccountId,
        node3_cond_type: u8,
        node3_id: AccountId,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
    struct Recovery {
        status: u8, // 0 for not started, 1 for started, 2 for finished
        uid: AccountId,
        r_times: u32,
        recovery1_proof: String,
        node1_confirm: u32,
        recovery2_proof: String,
        node2_confirm: u32,
        recovery3_proof: String,
        node3_confirm: u32,
    }
  
    #[ink(storage)]
    pub struct KeyLedger {
        /// Stores balance for both user and node
        total_supply: Balance,
        balances: Mapping<AccountId, Balance>,
        nodes: Mapping<AccountId ,Node>,
        users: Mapping<AccountId, User>,
        recoveries: Mapping<AccountId, Recovery>
    }

    pub type Result<T> = core::result::Result<T, Error>;

    /// The ERC-20 error types.
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Returned if not enough balance to fulfill a request is available.
        InsufficientBalance,
    }

    impl KeyLedger {
        /// Constructor that initializes maps
        #[ink(constructor)]
        pub fn new(total_supply: Balance) -> Self {
            let mut balances = Mapping::default();
            let mut nodes = Mapping::default();
            let mut users = Mapping::default();
            let mut recoveries  = Mapping::default();
            let caller = Self::env().caller();
            balances.insert(caller, &total_supply);
            Self {
                total_supply: total_supply,
                balances: balances,
                nodes: nodes,
                users: users,
                recoveries: recoveries,
            }
        }

        #[ink(message)]
        pub fn total_supply(&self) -> Balance {
            self.total_supply
        }

        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> Balance {
            self.balances.get(&owner).unwrap_or_default()
        }

        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, value: Balance) -> Result<()> {
            let from = self.env().caller();
            let from_balance = self.balance_of(from);
            // if from_balance < value {
            //     return Err(Error::InsufficientBalance)
            // }

            self.balances.insert(&from, &(from_balance - value));
            let to_balance = self.balance_of(to);
            self.balances.insert(to, &(to_balance + value));
            Ok(())
        }

        fn transfer_from_to(&mut self, from: &AccountId,
            to: &AccountId, value: Balance,
        ) -> Result<()> {
            let from_balance = self.balance_of(*from);
            if from_balance < value {
                return Err(Error::InsufficientBalance)
            }

            self.balances.insert(from, &(from_balance - value));
            let to_balance = self.balance_of(*to);
            self.balances.insert(to, &(to_balance + value));
            Ok(())
        }

        // for new machines just install node app, call register_node to alert the chain
        #[ink(message)]
        pub fn register_node(&mut self, pub_k: String) {
            let sender = self.env().caller();
            let node = self.nodes.get(sender);
            match node {
                Some(n) => {},
                None => {
                    self.nodes.insert(sender, &Node {
                        nid: sender,
                        pub_k: pub_k.to_string()
                    });
                }
            }
        }

        #[ink(message)]
        pub fn verify_node(&mut self, pub_k: String) -> bool {
            let sender = self.env().caller();
            let node = self.nodes.get(sender);
            match node {
                Some(n) => n.pub_k == pub_k,
                None => false
            }
        }

        // // get all nodes registered
        // #[ink(message)]
        // pub fn get_nodes(&self) -> Vec<AccountId> {
        //     let mut result: Vec<AccountId> = Vec::new();
        //     for (k, v) in self.nodes.into_iter() {
        //         result.push(k);
        //     }
        //     result
        // }

        // for new user, call register user after all user secret shares are 
        // stored in 3 nodes
        #[ink(message)]
        pub fn register_user(&mut self, pub_k: String,
            node1_cond_type: u8, node1_id: AccountId,
            node2_cond_type: u8, node2_id: AccountId,
            node3_cond_type: u8, node3_id: AccountId) {
            let sender = self.env().caller();
            let user = User {
                uid: sender,
                pub_k: pub_k,
                node1_cond_type: node1_cond_type,
                node1_id: node1_id,
                node2_cond_type: node2_cond_type,
                node2_id: node2_id,
                node3_cond_type: node3_cond_type,
                node3_id: node3_id
            };
            self.users.insert(sender, &user);
            let recovery = Recovery {
                status: 0,
                uid: sender,
                r_times: 0,
                recovery1_proof: "".to_string(),
                node1_confirm: 0,
                recovery2_proof: "".to_string(),
                node2_confirm: 0,
                recovery3_proof: "".to_string(),
                node3_confirm: 0
            };
            self.recoveries.insert(sender, &recovery);
        }

        #[ink(message)]
        pub fn verify_new_user(&self, pub_k: String) -> bool {
            let sender = self.env().caller();
            let user = self.users.get(sender);
            let recovery = self.recoveries.get(sender);
            let u = match user {
                Some(user) => user,
                None => return false
            };
            let r = match recovery {
                Some(recovery) => recovery,
                None => return false
            };
            u.pub_k == pub_k && r.status == 0
        }

        // before user try to access its secret, call request_recovery 
        #[ink(message)]
        pub fn start_recovery(&mut self) {
            let sender = self.env().caller();
            let balance = self.balance_of(sender);
            // not enough balance to start a recover
            if balance < 3 {
                return
            }
            let recovery_info = self.recoveries.get(sender);
            if let Some(r) = recovery_info {
                // when user start a recovery, set recovery status to 1
                // keep every thing else
                let r1 = Recovery {
                    status: 1,
                    recovery1_proof: "".to_string(),
                    node1_confirm: 0,
                    recovery2_proof: "".to_string(),
                    node2_confirm: 0,
                    recovery3_proof: "".to_string(),
                    node3_confirm: 0,
                    ..r
                };

                self.recoveries.insert(sender, &r1);
            }
        }

        #[ink(message)]
        pub fn verify_new_recovery(&self) -> bool{
            let sender = self.env().caller();
            let r = self.recoveries.get(sender);
            if let Some(r) = r {
                debug_println!("find recovery info");
                return r.status == 1;
            }
            false
        }

        // before user try to access its secret, call request_recovery 
        #[ink(message)]
        pub fn finish_recovery(&mut self, user: AccountId, proof: String) {
            let node = self.env().caller();
            let user_info = self.users.get(user);
            if let Some(u) = user_info {
                debug_println!("finish recovery find user info");
                let recovery_info = self.recoveries.get(user);
                if let Some(mut r) = recovery_info {
                    // when user did not start recovery before node, quit
                    if r.status != 1 {
                        return
                    }
                    if u.node1_id == node {
                        debug_println!("finish recovery match node1");
                        r.node1_confirm = 1;
                        r.recovery1_proof = proof;
                    } else if u.node2_id == node {
                        debug_println!("finish recovery match node2");
                        r.node2_confirm = 1;
                        r.recovery2_proof = proof;
                    } else if u.node3_id == node {
                        debug_println!("finish recovery match node3");
                        r.node3_confirm = 1;
                        r.recovery3_proof = proof;
                    } else {
                    }

                    let confirm_parts = r.node1_confirm + r.node2_confirm + r.node3_confirm;
                    if confirm_parts >= 2 {
                        // when recovery completed, send coin from user to node.
                        debug_println!("finish recovery finish 2 shares");
                        let r1 = Recovery {
                            r_times: r.r_times + 1,
                            status: 2,
                            ..r
                        };
                        self.recoveries.insert(user, &r1);
                        self.transfer_from_to(&user, &u.node1_id, 1);
                        self.transfer_from_to(&user, &u.node2_id, 1);
                        self.transfer_from_to(&user, &u.node3_id, 1);
                    } else {
                        // when recovery not completed, record partial recovery
                        self.recoveries.insert(user, &r);
                    }
                }
            }
        }


    }


    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// We test if the default constructor does its job.
        #[ink::test]
        fn test_default_works() {
            let kl = KeyLedger::new(100);
            assert_eq!(kl.total_supply(), 100);
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            assert_eq!(kl.balance_of(accounts.alice), 100);
        }

        #[ink::test]
        fn test_transfer() {
            let mut kl: KeyLedger = KeyLedger::new(100);
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            kl.transfer(accounts.bob, 10);
            assert_eq!(kl.balance_of(accounts.bob), 10);            
            assert_eq!(kl.balance_of(accounts.alice), 90);
        }

        #[ink::test]
        fn test_register_node() {
            let mut kl: KeyLedger = KeyLedger::new(100);
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            kl.register_node("some_node".to_string());
            assert_eq!(kl.verify_node("some_node".to_string()), true);
        }

        #[ink::test]
        fn test_register_user() {
            let mut kl: KeyLedger = KeyLedger::new(100);
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            let node1 = accounts.charlie;
            let node2 = accounts.django;
            let node3 = accounts.eve;
            kl.register_user("some_node".to_string(),
                1, node1, 2, node2, 3, node3);
            assert_eq!(kl.verify_new_user("some_node".to_string()), true);
        }

        #[ink::test]
        fn test_start_recovery() {
            let mut kl: KeyLedger = KeyLedger::new(100);
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let user = accounts.bob;
            kl.transfer(user, 10);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(user);
            let node1 = accounts.charlie;
            let node2 = accounts.django;
            let node3 = accounts.eve;
            kl.register_user("some_user".to_string(),
                1, node1, 2, node2, 3, node3);
            kl.start_recovery();
            assert_eq!(kl.verify_new_recovery(), true);
        }


        #[ink::test]
        fn test_recovery() {
            let mut kl: KeyLedger = KeyLedger::new(100);
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            // transfer some coin to bob for him to recover his account
            let user = accounts.bob;
            kl.transfer(user, 10);
            
            let node1 = accounts.charlie;
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(node1);
            kl.register_node("node1".to_string());

            let node2 = accounts.django;
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(node2);
            kl.register_node("node2".to_string());

            let node3 = accounts.eve;
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(node3);
            kl.register_node("node3".to_string());

            // user start recovery
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(user);
            kl.register_user("some_node".to_string(),
                1, node1, 2, node2, 3, node3);
            kl.start_recovery();

            // node report finish recovery 
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(node3);
            kl.finish_recovery(user, "proof1".to_string());
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(node2);
            kl.finish_recovery(user, "proof2".to_string());

            assert_eq!(kl.balance_of(user), 7);
            assert_eq!(kl.balance_of(node1), 1);
            assert_eq!(kl.balance_of(node2), 1);
            assert_eq!(kl.balance_of(node3), 1);   
        }


    }
}
