use super::*;

pub type AccountOf<T> = <T as frame_system::Config>::AccountId;
/// The balance type of this pallet.
pub type BalanceOf<T> =
	<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
pub type BlockNumberOf<T> = <T as frame_system::Config>::BlockNumber;

// The custom struct for storing info of storage FaucetRecord.
#[derive(PartialEq, Eq, Encode, Default, Decode, Clone, RuntimeDebug, MaxEncodedLen, TypeInfo)]
pub struct FaucetRecord<BlockNumber> {
	pub(super) last_claim_time: BlockNumber,
}
