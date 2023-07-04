use ink::env::Environment;

/// INonceManager trait定义了管理nonce（一次性密码）的方法。
#[ink::trait_definition]
pub trait INonceManager {
    /// 获取下一个sender的nonce。
    ///
    /// 在给定的key内，nonce值是有序的（从零开始，每个userop增加一次）。
    /// 但是，具有不同key的UserOp可以以任意顺序出现。
    ///
    /// # 参数
    ///
    /// * `sender` - 账户地址
    /// * `key` - 高192位的nonce
    ///
    /// # 返回值
    ///
    /// 返回一个完整的nonce，用于下一个具有该sender的UserOp。
    #[ink(message)]
    fn get_nonce(&self, sender: <Self::Env as Environment>::AccountId, key: [u8; 24]) -> [u8; 32];

    /// 手动增加sender的nonce。
    ///
    /// 此方法仅用于完整性，账户不需要在验证期间或其他地方调用它，
    /// 因为EntryPoint将在任何情况下都会更新nonce。
    /// 可能的用例是使用各种密钥调用它来“初始化”它们的nonce为1，
    /// 以便将来的UserOperations不会为具有给定key的第一个交易额外支付费用。
    ///
    /// # 参数
    ///
    /// * `key` - 高192位的nonce
    #[ink(message)]
    fn increment_nonce(&mut self, key: [u8; 24]);
}
