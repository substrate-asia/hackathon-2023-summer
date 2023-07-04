use ink::{env::Environment, primitives::Hash};
use scale::Encode;

use super::helpers::keccak256;

/// `UserOperation` 结构体定义了一个用户操作。
#[derive(scale::Encode, scale::Decode, Clone, Hash, Debug)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct UserOperation<E: Environment> {
    /// 发送人的账户 ID。
    pub sender: E::AccountId,
    /// 用户操作的随机数。
    pub nonce: u64,
    /// 要在合约上创建的代码的字节数组。
    pub init_code: Vec<u8>,
    /// 要调用的方法的字节数组。
    pub call_data: Vec<u8>,
    /// 调用此用户操作时可用的燃料量。
    pub call_gas_limit: E::Balance,
    /// 用于验证此用户操作的燃料量。
    pub verification_gas_limit: E::Balance,
    /// 在验证之前执行的燃料量。
    pub pre_verification_gas: E::Balance,
    /// 最高可支付的燃料价格。
    pub max_fee_per_gas: E::Balance,
    /// 最高优先级燃料价格。
    pub max_priority_fee_per_gas: E::Balance,
    /// 付款人和数据的哈希值。
    pub paymaster_and_data: Vec<u8>,
    /// 用户操作的签名。
    pub signature: Vec<u8>,
}

impl<E: Environment> UserOperation<E> {
    /// 计算用户操作的燃料价格。
    pub fn gas_price(&self) -> E::Balance {
        let max_fee_per_gas = self.max_fee_per_gas;
        let max_priority_fee_per_gas = self.max_priority_fee_per_gas;

        if max_fee_per_gas == max_priority_fee_per_gas {
            max_fee_per_gas
        } else {
            max_fee_per_gas.min(max_priority_fee_per_gas) // TODO: + basefee
        }
    }

    /// 打包一个 `EnvUserOperation` 为字节数组。
    pub fn pack(&self) -> Vec<u8> {
        UserOperationPack::<E> {
            sender: self.sender.clone(),
            nonce: self.nonce,
            init_code: keccak256(&self.init_code),
            call_data: keccak256(&self.call_data),
            call_gas_limit: self.call_gas_limit,
            verification_gas_limit: self.verification_gas_limit,
            pre_verification_gas: self.pre_verification_gas,
            max_fee_per_gas: self.max_fee_per_gas,
            max_priority_fee_per_gas: self.max_priority_fee_per_gas,
            paymaster_and_data: keccak256(&self.paymaster_and_data),
        }
        .encode()
    }

    /// 计算一个 `EnvUserOperation` 的哈希值。
    pub fn hash(&self) -> Hash {
        keccak256(&Self::pack(self))
    }
}

/// `UserOperationPack` 结构体定义了一个打包了用户操作的结构体。
#[derive(scale::Encode, scale::Decode)]
struct UserOperationPack<E: Environment> {
    sender: E::AccountId,
    nonce: u64,
    init_code: Hash,
    call_data: Hash,
    call_gas_limit: E::Balance,
    verification_gas_limit: E::Balance,
    pre_verification_gas: E::Balance,
    max_fee_per_gas: E::Balance,
    max_priority_fee_per_gas: E::Balance,
    paymaster_and_data: Hash,
}
