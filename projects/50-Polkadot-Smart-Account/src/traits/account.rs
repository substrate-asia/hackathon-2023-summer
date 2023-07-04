use crate::core::{env::AAEnvironment, helpers::ValidationData, user_operation::UserOperation};
use ink::env::Environment;

/// `IAccount` trait 定义了一个账户的接口。
#[ink::trait_definition]
pub trait IAccount {
    /// 验证用户操作的签名和随机数。
    ///
    /// 当此验证成功时，`entryPoint` 会执行对接收者的调用。
    /// 签名验证失败应该返回 `SIG_VALIDATION_FAILED` (1)。
    /// 这允许进行“模拟调用”，即在没有有效签名的情况下进行调用。
    /// 其他失败（例如，随机数不匹配或签名格式无效）应该仍然回滚以表示失败。
    ///
    /// 必须验证调用者是 `entryPoint`。
    /// 必须验证签名和随机数。
    ///
    /// # Arguments
    ///
    /// * `user_op` - 要执行的操作。
    /// * `user_op_hash` - 用户请求数据的哈希值。可以用作签名的基础。
    /// * `missing_account_funds` - 在 `entryPoint` 中账户存款的缺少资金。
    ///     这是转移到发送者（`entryPoint`）的最低金额，以便能够进行调用。
    ///     超额部分作为未来调用的存款保留在 `entryPoint` 中。
    ///     可以使用 `entryPoint.withdrawTo()` 随时提取。
    ///     如果请求中有支付主体（或当前存款足够高），则此值将为零。
    ///
    /// # Returns
    ///
    /// 打包的 ValidationData 结构。使用 `_packValidationData` 和 `_unpackValidationData` 进行编码和解码
    ///
    /// * `sig_authorizer` - 0 表示签名有效，1 表示标记签名失败，否则为一个“授权者”合约的地址。
    /// * `valid_until` - 此操作有效的最后时间戳。对于“无限期”，为 0。
    /// * `valid_after` - 此操作有效的第一个时间戳。
    ///
    /// 如果一个账户不使用时间范围，则仅为签名失败返回 `SIG_VALIDATION_FAILED` 值（1）。
    ///
    /// 注意，验证代码不能直接使用 `block.timestamp`（或 `block.number`）。
    #[ink(message)]
    fn validate_user_op(
        &self,
        user_op: UserOperation<AAEnvironment>,
        user_op_hash: Hash<AAEnvironment>,
        missing_account_funds: Balance<AAEnvironment>,
    ) -> ValidationData<AAEnvironment>;
}
type Hash<E> = <E as Environment>::Hash;
type Balance<E> = <E as Environment>::Balance;
