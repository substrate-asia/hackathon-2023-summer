#![cfg_attr(not(feature = "std"), no_std, no_main)]

pub use base_account::*;

#[ink::contract]
mod base_account {
    use ink_aa::traits::account::IAccount;

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct BaseAccount {
        /// Stores a single `bool` value on the storage.
        value: bool,
    }

    impl BaseAccount {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(init_value: bool) -> Self {
            Self { value: init_value }
        }

        /// A message that can be called on instantiated contracts.
        /// This one flips the value of the stored `bool` from `true`
        /// to `false` and vice versa.
        #[ink(message)]
        pub fn flip(&mut self) {
            self.value = !self.value;
        }

        /// Simply returns the current value of our `bool`.
        #[ink(message)]
        pub fn get_nonce(&self) -> u64 {
            self.value
        }
    }

    impl IAccount for BaseAccount {
        #[ink(message)]
        fn validate_user_op(
            &self,
            user_op: UserOperation<AAEnvironment>,
            user_op_hash: Hash<AAEnvironment>,
            missing_account_funds: Balance<AAEnvironment>,
        ) -> ValidationData<AAEnvironment> {
            todo!()
        }
    }
}
