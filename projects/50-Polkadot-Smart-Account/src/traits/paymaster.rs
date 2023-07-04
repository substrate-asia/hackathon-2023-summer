use crate::core::user_operation::UserOperation;
use crate::core::{env::AAEnvironment, helpers::ValidationData};
use ink::env::Environment;

/// IPaymaster trait定义了一个支付代理合约应该实现的接口，它同意为用户的操作支付gas费用。
/// 支付代理必须持有一定的股份来支付所需的entryPoint的股份和交易的gas费用。
#[ink::trait_definition]
pub trait IPaymaster {
    /// 支付验证：检查支付代理是否同意支付。
    /// 必须验证sender是否是entryPoint。
    /// Revert来拒绝此请求。
    /// 注意，如果此方法更改状态，则bundler将拒绝此方法，除非支付代理受信任（白名单）。
    /// 支付代理使用其存款进行预付，然后在postOp方法返回后获得退款。
    ///
    /// # 参数
    ///
    /// * `user_op` - 用户操作
    /// * `user_op_hash` - 用户请求数据的哈希值。
    /// * `max_cost` - 此交易的最大成本（基于用户操作的最大gas和gas价格）
    ///
    /// # 返回值
    ///
    /// 返回一个元组，包含以下值：
    /// * `context` - 发送到postOp的上下文值，如果不需要postOp则为零长度。
    /// * `validationData` - 此操作的签名和时间范围，与validateUserOperation的返回值相同。
    ///      <20-byte> sigAuthorizer - 如果签名有效，则为0，如果签名失败，则为1，否则为“授权者”合约的地址。
    ///      <6-byte> validUntil - 此操作有效的最后时间戳。0表示“无限期”
    ///      <6-byte> validAfter - 此操作有效的第一个时间戳
    ///      注意，验证代码不能直接使用block.timestamp（或block.number）。
    #[ink(message)]
    fn validate_paymaster_user_op(
        &self,
        user_op: UserOperation<AAEnvironment>,
        user_op_hash: <AAEnvironment as Environment>::Hash,
        max_cost: <AAEnvironment as Environment>::Balance,
    ) -> (Vec<u8>, ValidationData<AAEnvironment>);

    /// 操作后处理程序。
    /// 必须验证sender是否是entryPoint
    ///
    /// # 参数
    ///
    /// * `mode` - 枚举类型，具有以下选项：
    ///      OpSucceeded - 用户操作成功。
    ///      OpReverted  - 用户操作失败。仍需支付gas费用。
    ///      PostOpReverted - 用户操作成功，但导致postOp（在mode = OpSucceeded的情况下）失败。
    ///                       现在这是第二次调用，在用户的操作被故意还原后。
    /// * `context` - validatePaymasterUserOp返回的上下文值
    /// * `actual_gas_cost` - 到目前为止实际使用的gas（不包括此postOp调用）。
    #[ink(message)]
    fn post_op(
        &self,
        mode: PostOpMode,
        context: Vec<u8>,
        actual_gas_cost: <AAEnvironment as Environment>::Balance,
    );
}

/// PostOpMode是一个枚举类型，用于标识postOp方法中的操作模式。
#[derive(Debug, Clone, Copy, PartialEq, Eq, scale::Encode, scale::Decode, Hash)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum PostOpMode {
    /// 用户操作成功
    OpSucceeded,
    /// 用户操作失败。仍需支付gas费用。
    OpReverted,
    /// 用户操作成功，但导致postOp（在mode = OpSucceeded的情况下）失败。 现在这是第二次调用，在用户的操作被故意还原后。
    PostOpReverted,
}
