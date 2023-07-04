use core::fmt::Debug;

use ink::env::{
    hash::{CryptoHash, Keccak256},
    Environment,
};
use ink::primitives::Hash;
use scale::{Decode, Encode};

/// 返回从 validateUserOp 获得的数据。
///
/// validateUserOp 返回一个 uint256，它由 `_packedValidationData` 创建并由 `_parseValidationData` 解析。
///
/// # Arguments
///
/// * `aggregator` - 聚合器地址，用于验证签名。
/// * `valid_after` - 此 UserOp 的有效开始时间戳。
/// * `valid_until` - 此 UserOp 的有效截止时间戳。
#[derive(Clone, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct ValidationData<E: Environment> {
    pub aggregator: Aggregator<E>,
    pub valid_after: E::Timestamp,
    pub valid_until: E::Timestamp,
}

impl<E: core::fmt::Debug> core::fmt::Debug for ValidationData<E>
where
    E: Environment,
    E::Timestamp: core::fmt::Debug,
    E::AccountId: core::fmt::Debug,
{
    fn fmt(&self, f: &mut core::fmt::Formatter) -> core::fmt::Result {
        let ValidationData {
            aggregator,
            valid_after,
            valid_until,
        } = self;
        f.debug_struct("ValidationData")
            .field("aggregator", &aggregator)
            .field("valid_after", &valid_after)
            .field("valid_until", &valid_until)
            .finish()
    }
}

/// 如果为 `address(0)`，则表示账户自己验证了签名；如果为 `address(1)`，则表示账户未能验证签名。
#[derive(Clone, Encode, Decode, Debug)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum Aggregator<E: Environment> {
    VerifiedBySelf,
    VerifiedBy(E::AccountId),
    FailedVerification,
}

// 相交账户和支付主管的时间范围。
pub fn intersect_time_range<E: Environment>(
    account_validation_data: ValidationData<E>,
    paymaster_validation_data: ValidationData<E>,
) -> ValidationData<E> {
    let aggregator = if let Aggregator::<E>::VerifiedBySelf = account_validation_data.aggregator {
        paymaster_validation_data.aggregator
    } else {
        account_validation_data.aggregator
    };
    let valid_after = account_validation_data
        .valid_after
        .max(paymaster_validation_data.valid_after);
    let valid_until = account_validation_data
        .valid_until
        .min(paymaster_validation_data.valid_until);
    ValidationData {
        aggregator,
        valid_after,
        valid_until,
    }
}

/// 计算一个字节数组的 Keccak256 哈希值。
pub fn keccak256(input: &[u8]) -> Hash {
    let mut hash = [0u8; 32];
    Keccak256::hash(input, &mut hash);
    Hash::from(hash)
}
