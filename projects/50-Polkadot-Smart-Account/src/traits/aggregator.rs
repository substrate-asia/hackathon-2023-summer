use crate::core::{env::AAEnvironment, user_operation::UserOperation};

#[ink::trait_definition]
pub trait IAggregator {
    /// 验证聚合签名。
    ///
    /// 如果聚合签名与给定操作列表不匹配，则回滚。
    ///
    /// # Arguments
    ///
    /// * `user_ops` - 给定的操作列表。
    /// * `signature` - 聚合签名。
    #[ink(message)]
    fn validate_signatures(&self, user_ops: Vec<UserOperation<AAEnvironment>>, signature: Vec<u8>);

    /// 验证单个用户操作的签名。
    ///
    /// 该方法应在 `EntryPoint.simulateValidation()` 返回后由 `bundler` 调用（回滚）。
    /// 首先它验证用户操作上的签名。然后返回用于创建时使用的数据。
    ///
    /// # Arguments
    ///
    /// * `user_op` - 从用户接收到的用户操作。
    ///
    /// # Returns
    ///
    /// 在调用 `handle` 时放入用户操作的签名字段中的值（通常为空，除非账户和聚合器支持某种“多签”）。
    #[ink(message)]
    fn validate_user_op_signature(&self, user_op: UserOperation<AAEnvironment>) -> Vec<u8>;

    /// 将多个签名聚合为单个值。
    ///
    /// 此方法在链外调用，用于计算处理操作时传递的签名。
    /// `bundler` 可能使用优化的自定义代码执行此聚合。
    ///
    /// # Arguments
    ///
    /// * `user_ops` - 收集签名的 `UserOperations` 数组。
    ///
    /// # Returns
    ///
    /// 聚合签名。
    #[ink(message)]
    fn aggregate_signatures(&self, user_ops: Vec<UserOperation<AAEnvironment>>) -> Vec<u8>;
}
