use crate::core::{env::AAEnvironment, user_operation::UserOperation};
use crate::traits::aggregator::IAggregator;
use crate::traits::stake_manager::StakeInfo;
use ink::codegen::TraitCallForwarder;
use ink::env::Environment;
use scale::{Decode, Encode};

#[derive(Debug, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum Error<E: Environment> {
    /// handleOps 调用失败产生的错误,用于识别失败的操作。
    ///  若 simulateValidation 成功通过,则 handleOps 不存在失败的可能。
    ///   
    /// - `op_index` - 失败操作在数组中的索引(在 simulateValidation 中总是为 0)
    /// - `reason` - 失败原因
    ///   字符串以 "AAmn" 开头,其中 "m" 代表分类:  
    ///      1 - fabric 失败
    ///      2 - account 失败
    ///      3 - paymaster 失败
    ///    这样则可以归类到正确的实体。
    ///    
    /// 应该在宕机下的 handleOps 模拟中捕获,不应该在链上产生。
    /// 有助于防范批处理器或 paymaster/factory/account回滚攻击,或用于故障排除。
    FailedOp { op_index: u64, reason: String },
    /// 签名聚合器无法验证它生成的聚合签名时的错误情况。     
    SignatureValidationFailed { aggregator: E::AccountId },

    /// simulateValidation 的成功结果。
    ///   
    /// - `return_info` 返回值(gas 和时间范围)
    /// - `sender_info` 发送者的质押信息
    /// - `factory_info` 工厂的质押信息(如果有)
    /// - `paymaster_info` 交付方的质押信息(如果有)
    ValidationResult {
        return_info: ReturnInfo<E>,
        sender_info: StakeInfo<E>,
        factory_info: StakeInfo<E>,
        paymaster_info: StakeInfo<E>,
    },

    /// simulateValidation 的成功结果,如果用户返回了一个签名聚合器
    ///     
    /// - `return_info` 返回值(gas 和时间范围)
    /// - `sender_info`  发送者的质押信息
    /// - `factory_info` 工厂的质押信息(如果有)   
    /// - `paymaster_info`  交付方的质押信息(如果有)
    /// - `aggregator_info`  签名聚合信息(如果用户需要签名聚合器)    
    ///      捆绑器必须使用它验证签名,否则拒绝 UserOperation。
    ValidationResultWithAggregation {
        return_info: ReturnInfo<E>,
        sender_info: StakeInfo<E>,
        factory_info: StakeInfo<E>,
        paymaster_info: StakeInfo<E>,
        aggregator_info: AggregatorStakeInfo<E>,
    },

    /// getSenderAddress 的返回值    
    SenderAddressResult { sender: E::AccountId },

    /// simulateHandleOp 的返回值        
    ExecutionResult {
        pre_op_gas: E::Balance,
        paid: E::Balance,
        valid_after: E::Timestamp,
        valid_until: E::Timestamp,
        target_success: bool,
        target_result: Vec<u8>,
    },
}

pub type AggregatorRef<E> = <<ink::reflect::TraitDefinitionRegistry<E> as IAggregator> ::__ink_TraitInfo as TraitCallForwarder>::Forwarder;
/// 为每个聚合器处理的 UserOps     
#[derive(Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct UserOpsPerAggregator<E: Environment> {
    /// 用户操作            
    pub user_ops: UserOperation<E>,

    /// 聚合器地址      
    pub aggregator: AggregatorRef<E>,

    /// 聚合签名   
    pub signature: Vec<u8>,
}

/// 模拟过程中返回的 gas 和值
///
/// - `pre_op_gas` 验证时消耗的 gas(包括 preValidationGas)    
/// - `prefund` 所需预存款
/// - `sig_failed`  validateUserOp(或 paymaster) 的签名检查失败
/// - `valid_after` 第一个该 UserOp 有效的时间戳(合并 account 和 paymaster 的时间范围)
/// - `valid_until` 最后一个该 UserOp 有效的时间戳(合并 account 和 paymaster 的时间范围)
/// - `paymaster_context`  validatePaymasterUserOp 返回(用于传递给 postOp)
#[derive(Debug, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct ReturnInfo<E: Environment> {
    pub pre_op_gas: E::Balance,

    pub prefund: E::Balance,

    pub sig_failed: bool,

    pub valid_after: E::Timestamp,

    pub valid_until: E::Timestamp,

    pub paymaster_context: Vec<u8>,
}

/// 返回的聚合签名信息
///
/// - `aggregator` 账户返回的聚合器  
/// - `stake_info` 其当前质押  
#[derive(PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct AggregatorStakeInfo<E: Environment> {
    pub aggregator: E::AccountId,

    pub stake_info: StakeInfo<E>,
}

impl<E: core::fmt::Debug> core::fmt::Debug for AggregatorStakeInfo<E>
where
    E: Environment,
    E::AccountId: core::fmt::Debug,
    StakeInfo<E>: core::fmt::Debug,
{
    fn fmt(&self, f: &mut core::fmt::Formatter) -> core::fmt::Result {
        let AggregatorStakeInfo {
            aggregator,
            stake_info,
        } = self;
        f.debug_struct("AggregatorStakeInfo")
            .field("aggregator", &aggregator)
            .field("stake_info", &stake_info)
            .finish()
    }
}

#[ink::trait_definition]
pub trait IEntryPoint {
    /// 执行一批 UserOperation。
    /// 不使用签名聚合器。    
    /// 如果任何账户需要聚合器(即,在执行 simulateValidation 时返回了聚合器),则必须使用 handleAggregatedOps()。
    ///  
    /// - `ops` 要执行的操作    
    /// - `beneficiary` 用于接收费用的地址
    #[ink(message, payable)]
    fn handle_ops(
        &self,
        ops: Vec<UserOperation<AAEnvironment>>,
        beneficiary: <AAEnvironment as Environment>::AccountId,
    );
    /// 使用聚合器执行一批 UserOperation     
    ///  
    /// - `ops_per_aggregator` 按聚合器分组的操作(或地址(0) 用于没有聚合器的账户)
    /// - `beneficiary` 用于接收费用的地址
    #[ink(message)]
    fn handle_aggregated_ops(
        &self,
        ops_per_aggregator: Vec<UserOpsPerAggregator<AAEnvironment>>,
        beneficiary: <AAEnvironment as Environment>::AccountId,
    );
    /// 生成请求 ID  - 该请求的唯一标识符。   
    ///  请求 ID 是 userOp 的内容(除签名外)、入口点以及链 ID 的哈希。
    #[ink(message)]
    fn get_user_op_hash(&self, user_op: UserOperation<AAEnvironment>) -> [u8; 32];
    /// 模拟 account.validateUserOp 和 paymaster.validatePaymasterUserOp 的调用。    
    /// @dev 此方法总是回滚,成功结果为 ValidationResult 错误。其他错误为失败。
    /// @dev 节点还必须验证它是否使用了禁用的操作码,并且它没有引用账户数据外部的存储。    
    ///  
    /// - `userOp` 要验证的用户操作
    #[ink(message)]
    fn simulate_validation(&self, user_op: UserOperation<AAEnvironment>);
}
