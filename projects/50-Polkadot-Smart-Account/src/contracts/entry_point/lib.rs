#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod entry_point {

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct EntryPoint {
        /// Stores a single `bool` value on the storage.
        value: bool,
    }

    // TODO：等`event2.0`合并发布之后，转移到`traits`下
    /// 每个成功请求之后发出的事件
    #[ink(event)]
    pub struct UserOperationEvent {
        /// 请求的唯一标识符（哈希其整个内容，除了签名）。
        #[ink(topic)]
        pub user_op_hash: [u8; 32],
        /// 生成此请求的帐户。
        #[ink(topic)]
        pub sender: AccountId,
        /// 如果非空，则为支付此请求的支付账户。
        #[ink(topic)]
        pub paymaster: AccountId,
        /// 请求中使用的nonce。
        pub nonce: Hash,
        /// 如果发送方的事务成功，则为true，反之为false。
        pub success: bool,
        /// 此UserOperation的实际付款金额（由帐户或支付账户支付）。
        pub actual_gas_cost: Balance,
        /// 此UserOperation使用的总气体量（包括preVerification、creation、validation和execution）。
        pub actual_gas_used: Balance,
    }

    /// 账户 "sender" 被部署。
    #[ink(event)]
    pub struct AccountDeployed {
        /// 部署此账户的userOp。将跟随UserOperationEvent。
        #[ink(topic)]
        pub user_op_hash: [u8; 32],
        /// 被部署的账户
        #[ink(topic)]
        pub sender: AccountId,
        /// 用于部署此账户的工厂（在 initCode 中）
        pub factory: AccountId,
        /// 此 UserOp 所使用的支付账户
        pub paymaster: AccountId,
    }

    /// 如果 UserOperation "callData" 返回非零长度，则发出的事件
    #[ink(event)]
    pub struct UserOperationRevertReason {
        /// 请求的唯一标识符。
        #[ink(topic)]
        pub user_op_hash: [u8; 32],
        /// 此请求的发送方
        #[ink(topic)]
        pub sender: AccountId,
        /// 请求中使用的nonce
        pub nonce: Hash,
        /// "callData" 的（已还原的）调用返回字节。
        pub revert_reason: Vec<u8>,
    }

    /// 在执行循环之前由 handleOps() 发出的事件。
    /// 在此事件之前发出的任何事件都属于验证。
    #[ink(event)]
    pub struct BeforeExecution {}

    /// 在此包中使用的签名聚合器。
    #[ink(event)]
    pub struct SignatureAggregatorChanged {
        /// 签名聚合器
        #[ink(topic)]
        pub aggregator: AccountId,
    }

    impl EntryPoint {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(init_value: bool) -> Self {
            Self { value: init_value }
        }

        /// Constructor that initializes the `bool` value to `false`.
        ///
        /// Constructors can delegate to other constructors.
        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new(Default::default())
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
        pub fn get(&self) -> bool {
            self.value
        }
    }
}
