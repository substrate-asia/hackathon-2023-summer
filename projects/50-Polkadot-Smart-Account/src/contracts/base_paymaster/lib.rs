#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract(env = ink_aa::core::env::AAEnvironment)]
mod base_paymaster {
    use ink_aa::core::helpers::ValidationData;
    use ink_aa::core::user_operation::UserOperation;
    use ink_aa::traits::entry_point::IEntryPoint;
    use ink_aa::traits::paymaster::{IPaymaster, PostOpMode};

    #[ink(storage)]
    pub struct BasePaymaster {
        entry_point: ink::contract_ref!(IEntryPoint),
    }

    impl BasePaymaster {
        #[ink(constructor)]
        pub fn new(entry_point: ink::contract_ref!(IEntryPoint)) -> Self {
            Self { entry_point }
        }

        #[ink(message)]
        pub fn get(&self) {
            self.env().account_id();
        }
    }

    impl IPaymaster for BasePaymaster {
        #[ink(message)]
        fn validate_paymaster_user_op(
            &self,
            user_op: UserOperation<ink_aa::core::env::AAEnvironment>,
            user_op_hash: Hash,
            max_cost: Balance,
        ) -> (Vec<u8>, ValidationData<ink_aa::core::env::AAEnvironment>) {
            todo!()
        }

        #[ink(message)]
        fn post_op(&self, mode: PostOpMode, context: Vec<u8>, actual_gas_cost: Balance) {
            todo!()
        }
    }
}
