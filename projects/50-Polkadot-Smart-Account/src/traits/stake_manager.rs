use ink::env::Environment;
use scale::{Decode, Encode};

use crate::core::env::AAEnvironment;

/// 存款信息。
#[derive(Debug, Clone, PartialEq, Eq, Hash, Encode, Decode, Default)]
#[cfg_attr(
    feature = "std",
    derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
)]
pub struct DepositInfo<E: Environment> {
    /// 实际存款金额。
    pub deposit: E::Balance,
    /// 是否已进行抵押。
    pub staked: bool,
    /// 为此实体抵押的实际以太币金额。
    pub stake: E::Balance,
    /// 抵押在可取回前需要的最短时间（秒）。
    pub unstake_delay_sec: E::Timestamp,
    /// 如果已锁定，则调用 `withdraw_stake` 的第一个块时间戳。如果未锁定，则为零。
    pub withdraw_time: E::Timestamp,
}

/// 用于 `get_stake_info` 和 `simulate_validation` 的 API 结构体。
#[derive(Debug, Clone, PartialEq, Eq, Hash, Encode, Decode)]
pub struct StakeInfo<E: Environment> {
    /// 抵押的以太币金额。
    pub stake: E::Balance,
    /// 抵押在可取回前需要的延迟时间（秒）。
    pub unstake_delay_sec: E::Timestamp,
}

/// 用于管理存款和抵押的特性定义。
#[ink::trait_definition]
pub trait IStakeManager {
    /// 返回给定账户的存款信息。
    ///
    /// # Arguments
    ///
    /// * `account`：要获取存款信息的账户 ID。
    ///
    /// # Returns
    ///
    /// 给定账户的完整存款信息。
    #[ink(message)]
    fn get_deposit_info(
        &self,
        account: <AAEnvironment as Environment>::AccountId,
    ) -> DepositInfo<AAEnvironment>;

    /// 返回给定账户的余额，用于支付燃气费。
    ///
    /// # Arguments
    ///
    /// * `account`：要获取余额的账户 ID。
    ///
    /// # Returns
    ///
    /// 给定账户的余额。
    #[ink(message)]
    fn balance_of(
        &self,
        account: <Self::Env as Environment>::AccountId,
    ) -> <Self::Env as Environment>::Balance;

    /// 向给定账户添加存款。
    ///
    /// # Arguments
    ///
    /// * `account`：要添加存款的账户 ID。
    #[ink(message, payable)]
    fn deposit_to(&mut self, account: <AAEnvironment as Environment>::AccountId);

    /// 向具有给定延迟的账户添加抵押。
    ///
    /// 任何待处理的取回操作将被取消。
    ///
    /// # Arguments
    ///
    /// * `unstake_delay_sec`：抵押在可取回前需要的新延迟时间（秒）。
    #[ink(message, payable)]
    fn add_stake(&mut self, unstake_delay_sec: <AAEnvironment as Environment>::Timestamp);

    /// 尝试取消抵押。
    ///
    /// 可以在取回延迟期结束后取回抵押金额。
    #[ink(message)]
    fn unlock_stake(&mut self);

    /// 从已取消抵押的抵押中取回金额。
    ///
    /// 必须先调用 `unlock_stake` 并等待取回延迟期结束。
    ///
    /// # Arguments
    ///
    /// * `withdraw_address`：要发送取回金额的地址。
    #[ink(message, payable)]
    fn withdraw_stake(&mut self, withdraw_address: <AAEnvironment as Environment>::AccountId);

    /// 从存款中取回金额。
    ///
    /// # Arguments
    ///
    /// * `withdraw_address`：要发送取回金额的地址。
    /// * `withdraw_amount`：要取回的金额。
    #[ink(message, payable)]
    fn withdraw_to(
        &mut self,
        withdraw_address: <AAEnvironment as Environment>::AccountId,
        withdraw_amount: <AAEnvironment as Environment>::Balance,
    );
}
