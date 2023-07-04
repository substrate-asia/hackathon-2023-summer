#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Decode, Encode, MaxEncodedLen};
use frame_support::{pallet_prelude::*, traits::ConstU32, BoundedVec};
use scale_info::TypeInfo;
use sp_std::prelude::*;

pub trait AdData<BlockNumberType, AdIndexType, AccountIdType> {
	fn match_ad_for_user(
		age: u8,
		tag: TargetTag,
		level: u8,
		block_number: BlockNumberType,
	) -> Vec<(AccountIdType, AdIndexType)>;
	fn claim_reward_for_user(
		proposer: AccountIdType,
		ad_index: AdIndexType,
		user: AccountIdType,
	) -> DispatchResult;
}

#[derive(Encode, Decode, Clone, RuntimeDebug, PartialEq, Eq, TypeInfo, MaxEncodedLen)]
pub struct ValueRange {
	pub min: u8,
	pub max: u8,
}

impl ValueRange {
	/// Check if min value is less or equal to max value
	pub fn self_check(&self) -> bool {
		self.min <= self.max
	}
	/// Check if the given value is in range
	pub fn is_in_range(&self, v: u8) -> bool {
		v >= self.min && v <= self.max
	}
}

#[derive(Encode, Decode, Clone, RuntimeDebug, PartialEq, Eq, TypeInfo, MaxEncodedLen)]
pub enum TargetTag {
	DeFi,
	GameFi,
	NFT,
	Metaverse,
	OnChainData,
}

/// This struct specifies what kinds of conditions the target group should fulfill
#[derive(Encode, Decode, Clone, RuntimeDebug, PartialEq, Eq, TypeInfo, MaxEncodedLen)]
pub struct AdPreference {
	pub age: ValueRange,
	// A vec of the tags required for the targeting group
	pub tags: BoundedVec<TargetTag, ConstU32<4>>, // Max 4 tags bounded
	// The minimal level required for the targeting group
	pub min_level: u8,
}
