#![cfg_attr(not(feature = "std"), no_std)]

use rand::Rng;

fn generate_circuit(property: &str, num_gates: u32) -> String {
    let mut rng = rand::thread_rng();
    let mut circuit = String::new();

    for i in 0..num_gates {
        let gate_type = if rng.gen::<bool>() { "and" } else { "or" };
        let other_property = generate_property(rng.gen_range(1..=4));

        let gate_expr = format!(r#"("{}" {} "{}")"#, property, gate_type, other_property);
        circuit.push_str(&gate_expr);

        if i != num_gates - 1 {
            circuit.push_str(" ");
            circuit.push_str("or");
            circuit.push_str(" ");
        }
    }

    let formatted_circuit = format!(r#"( {} )"#, circuit);

    formatted_circuit
}

fn generate_property(length: u32) -> String {
    let mut rng = rand::thread_rng();
    let property: String = (0..length)
        .map(|_| rng.gen_range(b'A'..=b'z') as char)
        .collect();

    property
}

#[ink::contract]
mod t_cyber {

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct TryptoCyber {
        user_id: String,
        account: String,
        t_ber_pkm: String,
        t_ber_mk: String,
        t_ber_pk_collection: Vec<String>,
        t_bei_pk_policy: String,
    }

    /// The user requests a subkey
    #[ink(event)]
    pub struct Register {
        #[ink(topic)]
        name: Hash,
        #[ink(topic)]
        from: AccountId,
    }

    #[ink(event)]
    pub struct SetAddress {
        #[ink(topic)]
        name: Hash,
        from: AccountId,
        #[ink(topic)]
        old_address: Option<AccountId>,
        #[ink(topic)]
        new_address: AccountId,
    }

    /// Emitted whenever a name is being transferred.
    #[ink(event)]
    pub struct SubkeyTransfer {
        #[ink(topic)]
        name: Hash,
        from: AccountId,
        #[ink(topic)]
        old_owner: Option<AccountId>,
        #[ink(topic)]
        new_owner: AccountId,
    }

    impl TryptoCyber {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new() -> Self {
            let (pk, msk) = rabe::schemes::ac17::setup();
            let pk_string = serde_json::to_string(&pk).unwrap();
            let msk_string = serde_json::to_string(&msk).unwrap();

            Self {
                user_id: "newUser".to_string(),
                account: "address".to_string(),
                t_ber_pkm: pk_string,
                t_ber_mk: msk_string,
                t_ber_pk_collection: vec!["".to_string()],
                t_bei_pk_policy: "".to_string(),
            }
        }

        /// Constructors can delegate to other constructors.
        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new()
        }

        /// Simply returns the current pk of our `pk`.
        #[ink(message)]
        pub fn get_pk(&self) -> String {
            self.t_ber_pkm.clone()
        }

        /// Simply returns the current pk of our `msk`.
        #[ink(message)]
        pub fn get_msk(&self) -> String {
            self.t_ber_mk.clone()
        }

        /// Simply returns the current pk of our `collection`.
        #[ink(message)]
        pub fn get_pk_collection(&self) -> Vec<String> {
            self.t_ber_pk_collection.clone()
        }

        //Build the policy
        #[ink(message)]
        pub fn build_policy(&mut self, num_gates: u32, property_set: String) {
            let policy = crate::generate_circuit(property_set.as_str(), num_gates);
            self.t_bei_pk_policy = policy;
        }

        /// Simply returns the current pk of our `policy`.
        #[ink(message)]
        pub fn get_policy(&self) -> String {
            self.t_bei_pk_policy.clone()
        }
    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// We test if the default constructor does its job.
        // #[ink::test]
        // fn default_works() {
        //     let t_cyber = TryptoCyber::default();
        //     assert_eq!(t_cyber.get(), true);
        // }

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            let mut t_cyber = TryptoCyber::new();
            assert_eq!(t_cyber.get_pk(), "sss");
        }
    }
}
