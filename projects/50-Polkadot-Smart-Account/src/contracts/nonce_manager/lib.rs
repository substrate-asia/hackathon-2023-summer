#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod nonce_manager {
    use ink::storage::Mapping;
    use ink_aa::traits::nonce_manager::INonceManager;

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct NonceManager {
        /// Stores a single `bool` value on the storage.
        nonce_sequence_number: Mapping<(AccountId, [u8; 24]), [u8; 32]>,
    }

    impl NonceManager {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                nonce_sequence_number: Mapping::default(),
            }
        }

        // fn validateAndUpdateNonce(&mut self,sender: AccountId,nonce: [u8; 32]) -> bool {
        //     let key = nonce >> 64;
        //     let seq = u64::from_be_bytes(nonce);

        //     let mut nonce_sequence_number = self.get_nonce(sender,key);
        //     increment_bytes(&mut nonce_sequence_number);
        //     self.nonce_sequence_number
        //         .insert((sender, key), &nonce_sequence_number);

        //     return nonceSequenceNumber[sender][key]++ == seq;
        // }
    }

    impl INonceManager for NonceManager {
        #[ink(message)]
        fn get_nonce(&self, sender: AccountId, key: [u8; 24]) -> [u8; 32] {
            self.nonce_sequence_number.get((sender, key)).unwrap_or({
                let mut h = [0; 32];
                h[..24].copy_from_slice(&key);
                h
            })
        }

        #[ink(message)]
        fn increment_nonce(&mut self, key: [u8; 24]) {
            let mut nonce = self.get_nonce(self.env().caller(), key);
            increment_bytes(&mut nonce);
            self.nonce_sequence_number
                .insert((self.env().caller(), key), &nonce);
        }
    }
    fn increment_bytes(bytes: &mut [u8; 32]) {
        let mut carry = true;
        for i in (0..bytes.len()).rev() {
            if carry {
                if bytes[i] == 255 {
                    bytes[i] = 0;
                } else {
                    bytes[i] += 1;
                    carry = false;
                }
            }
        }
    }
}
