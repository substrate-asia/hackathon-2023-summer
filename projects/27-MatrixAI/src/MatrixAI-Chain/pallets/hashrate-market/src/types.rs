use super::*;

pub type AccountOf<T> = <T as frame_system::Config>::AccountId;
/// The balance type of this pallet.
pub type BalanceOf<T> =
	<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
/// Limited in length by `StringLimit`.
pub type BoundedString<T> = BoundedVec<u8, <T as Config>::StringLimit>;
/// UUID type.
pub type UUID = [u8; 16];

/// MachineStatus holds the current state of the machine.
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, MaxEncodedLen, TypeInfo)]
pub(super) enum MachineStatus {
	/// This machine is idle, not display in the market.
	Idle,
	/// This machine is for rent, display in the market.
	ForRent,
	/// This machine is on lease, not display in the market.
	Renting,
}

#[derive(PartialEq, Eq, Encode, Decode, Clone, RuntimeDebug, MaxEncodedLen, TypeInfo)]
pub struct MachineDetails<BoundedString, Balance> {
	/// The metadata by json format of this machine.
	pub(super) metadata: BoundedString,
	/// The status of this machine.
	pub(super) status: MachineStatus,
	/// The price of this machine.
	pub(super) price: Option<Balance>,
}

/// OrderStatus holds the current state of the order.
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, MaxEncodedLen, TypeInfo)]
pub(super) enum OrderStatus {
	/// This order is in training. The state of the machine is `Renting`.
	Training,
	/// This order was completed successfully. 
	Completed,
	/// This order was failed.
	Failed,
}

#[derive(PartialEq, Eq, Encode, Decode, Clone, RuntimeDebug, MaxEncodedLen, TypeInfo)]
pub struct OrderDetails<AccountId, BoundedString, Balance> {
	/// The buyer of this order.
	pub(super) buyer: AccountId,
	/// The seller of this order.
	pub(super) seller: AccountId,
	/// The machine id of this order.
	pub(super) machine_id: UUID,
	/// The total amount of this order.
	pub(super) total: Balance,
	/// The metadata by json format of this order.
	pub(super) metadata: BoundedString,
	/// The status of this order.
	pub(super) status: OrderStatus,
}
