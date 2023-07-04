#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract(env = ink_aa::core::env::AAEnvironment)]
mod sender_creator {
    use core::mem::size_of;

    #[ink(storage)]
    pub struct SenderCreator;

    impl SenderCreator {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {}
        }

        #[ink(message)]
        pub fn create_sender(&self, init_code: Vec<u8>) -> AccountId {
            const LEN: usize = size_of::<AccountId>();
            let factory = AccountId::try_from(&init_code[0..LEN]);
            if factory.is_err() {
                return AccountId::from([0; LEN]);
            }
            let factory = factory.unwrap();
            let init_call_data = &init_code[LEN..];
            let selector = ink::env::call::Selector::new([0u8; 4]); // Selector for the constructor function

            let call = ink::env::call::build_call::<ink_aa::core::env::AAEnvironment>()
                .call(factory)
                .gas_limit(self.env().gas_left())
                .exec_input(ink::env::call::ExecutionInput::new(selector).push_arg(init_call_data))
                .returns::<AccountId>()
                .try_invoke();

            match call {
                Ok(Ok(result)) => result,
                _ => AccountId::from([0; LEN]),
            }
        }
    }
}
