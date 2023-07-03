#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;
pub use weights::*;

mod types;
use types::*;

use frame_support::{
	pallet_prelude::*,
	traits::{
		Currency, ReservableCurrency,
		ExistenceRequirement::KeepAlive,
	},
};

#[frame_support::pallet]
pub mod pallet {
	use super::*;
	use frame_system::pallet_prelude::*;

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// The overarching event type.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		/// The currency mechanism.
		type Currency: ReservableCurrency<Self::AccountId>;

		/// The maximum length of a machine metadata stored on-chain.
		#[pallet::constant]
		type StringLimit: Get<u32>;

		/// Weight information for extrinsics in this pallet.
		type WeightInfo: WeightInfo;
	}

	/// Details of a machine.
	#[pallet::storage]
	pub(super) type Machine<T: Config> = StorageDoubleMap<
		_,
		Blake2_128Concat,
		AccountOf<T>,
		Blake2_128Concat,
		UUID,
		MachineDetails<BoundedString<T>, BalanceOf<T>>,
	>;

	/// Details of a order.
	#[pallet::storage]
	pub(super) type Order<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		UUID,
		OrderDetails<AccountOf<T>, BoundedString<T>, BalanceOf<T>>,
	>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// A machine was added.
		MachineAdded { owner: AccountOf<T>, id: UUID, metadata: BoundedString<T> },
		/// A machine was removed.
		MachineRemoved { owner: AccountOf<T>, id: UUID },
		/// A machine was removed.
		OfferMaked { owner: AccountOf<T>, id: UUID, price: BalanceOf<T> },
		/// A machine was removed.
		OfferCanceled { owner: AccountOf<T>, id: UUID },
		/// An order was placed.
		OrderPlaced { 
			order_id: UUID,
			buyer: AccountOf<T>,
			seller: AccountOf<T>,
			machine_id: UUID,
			total: BalanceOf<T>,
			metadata: BoundedString<T>,
		},
		/// An order was completed successfully.
		OrderCompleted { order_id: UUID, buyer: AccountOf<T>, seller: AccountOf<T> },
		/// An order was failed.
		OrderFailed { order_id: UUID, buyer: AccountOf<T>, seller: AccountOf<T> },
	}

	#[pallet::error]
	pub enum Error<T> {
		/// A string is too long.
		StringTooLong,
		/// The machine/order already exists.
		AlreadyExists,
		/// The given machine/order ID is unknown.
		Unknown,
		/// The machine status is not the expected status.
		IncorrectStatus,
		/// The signing account has no permission to do the operation.
		NoPermission,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::call_index(0)]
		#[pallet::weight(T::WeightInfo::add_machine())]
		pub fn add_machine(origin: OriginFor<T>, id: UUID, metadata: BoundedString<T>) -> DispatchResult {
			let who = ensure_signed(origin)?;
			ensure!(!Machine::<T>::contains_key(&who, &id), Error::<T>::AlreadyExists);

			Machine::<T>::insert(
				&who,
				&id,
				MachineDetails {
					metadata: metadata.clone(),
					status: MachineStatus::Idle,
					price: None,
				},
			);

			Self::deposit_event(Event::<T>::MachineAdded { owner: who, id, metadata });
			Ok(())
		}

		#[pallet::call_index(1)]
		#[pallet::weight(T::WeightInfo::remove_machine())]
		pub fn remove_machine(origin: OriginFor<T>, id: UUID) -> DispatchResult {
			let who = ensure_signed(origin)?;
			let machine = Machine::<T>::get(&who, &id).ok_or(Error::<T>::Unknown)?;
			ensure!(machine.status != MachineStatus::Renting, Error::<T>::IncorrectStatus);

			Machine::<T>::remove(&who, &id);

			Self::deposit_event(Event::<T>::MachineRemoved { owner: who, id });
			Ok(())
		}

		#[pallet::call_index(2)]
		#[pallet::weight(T::WeightInfo::make_offer())]
		pub fn make_offer(origin: OriginFor<T>, id: UUID, price: BalanceOf<T>) -> DispatchResult {
			let who = ensure_signed(origin)?;

			Machine::<T>::try_mutate(&who, &id, |maybe_details| {
				let details = maybe_details.as_mut().ok_or(Error::<T>::Unknown)?;
				ensure!(details.status == MachineStatus::Idle, Error::<T>::IncorrectStatus);

				details.status = MachineStatus::ForRent;
				details.price = Some(price);

				Self::deposit_event(Event::<T>::OfferMaked { owner: who.clone(), id, price });
				Ok(())
			})
		}

		#[pallet::call_index(3)]
		#[pallet::weight(T::WeightInfo::cancel_offer())]
		pub fn cancel_offer(origin: OriginFor<T>, id: UUID) -> DispatchResult {
			let who = ensure_signed(origin)?;

			Machine::<T>::try_mutate(&who, &id, |maybe_details| {
				let details = maybe_details.as_mut().ok_or(Error::<T>::Unknown)?;
				ensure!(details.status == MachineStatus::ForRent, Error::<T>::IncorrectStatus);

				details.status = MachineStatus::Idle;
				details.price = None;

				Self::deposit_event(Event::<T>::OfferCanceled { owner: who.clone(), id });
				Ok(())
			})
		}

		#[pallet::call_index(4)]
		#[pallet::weight(T::WeightInfo::place_order())]
		pub fn place_order(
			origin: OriginFor<T>,
			order_id: UUID,
			seller: AccountOf<T>,
			machine_id: UUID,
			metadata: BoundedString<T>,
			total: BalanceOf<T>,
		)-> DispatchResult {
			let who = ensure_signed(origin)?;
			ensure!(!Order::<T>::contains_key(&order_id), Error::<T>::AlreadyExists);

			Machine::<T>::try_mutate(seller.clone(), &machine_id, |maybe_details| {
				let details = maybe_details.as_mut().ok_or(Error::<T>::Unknown)?;
				ensure!(details.status == MachineStatus::ForRent, Error::<T>::IncorrectStatus);

				T::Currency::reserve(&who, total)?;

				details.status = MachineStatus::Renting;

				Order::<T>::insert(
					&order_id,
					OrderDetails {
						buyer: who.clone(),
						seller: seller.clone(),
						machine_id,
						total,
						metadata: metadata.clone(),
						status: OrderStatus::Training,
					},
				);
	
				Self::deposit_event(Event::<T>::OrderPlaced {
					order_id,
					buyer: who,
					seller,
					machine_id,
					total,
					metadata,
				});
				Ok(())
			})
		}

		#[pallet::call_index(5)]
		#[pallet::weight(T::WeightInfo::order_completed())]
		pub fn order_completed(origin: OriginFor<T>, order_id: UUID, metadata: BoundedString<T>)-> DispatchResult {
			let who = ensure_signed(origin)?;

			Order::<T>::try_mutate(&order_id, |maybe_order| {
				let order = maybe_order.as_mut().ok_or(Error::<T>::Unknown)?;
				ensure!(who == order.seller, Error::<T>::NoPermission);
				ensure!(order.status == OrderStatus::Training, Error::<T>::IncorrectStatus);

				Machine::<T>::try_mutate(&order.seller, &order.machine_id, |maybe_machine| -> DispatchResult {
					let machine = maybe_machine.as_mut().ok_or(Error::<T>::Unknown)?;
					ensure!(machine.status == MachineStatus::Renting, Error::<T>::IncorrectStatus);
					machine.status = MachineStatus::ForRent;
					Ok(())
				})?;

				order.metadata = metadata;
				order.status = OrderStatus::Completed;
				T::Currency::unreserve(&order.buyer, order.total);
				T::Currency::transfer(&order.buyer, &order.seller, order.total, KeepAlive)?;

				Self::deposit_event(Event::<T>::OrderCompleted { order_id, buyer: order.buyer.clone(), seller: order.seller.clone() });
				Ok(())
			})
		}

		#[pallet::call_index(6)]
		#[pallet::weight(T::WeightInfo::order_failed())]
		pub fn order_failed(origin: OriginFor<T>, order_id: UUID, metadata: BoundedString<T>)-> DispatchResult {
			let who = ensure_signed(origin)?;

			Order::<T>::try_mutate(&order_id, |maybe_order| {
				let order = maybe_order.as_mut().ok_or(Error::<T>::Unknown)?;
				ensure!(who == order.seller, Error::<T>::NoPermission);
				ensure!(order.status == OrderStatus::Training, Error::<T>::IncorrectStatus);

				Machine::<T>::try_mutate(&order.seller, &order.machine_id, |maybe_machine| -> DispatchResult {
					let machine = maybe_machine.as_mut().ok_or(Error::<T>::Unknown)?;
					ensure!(machine.status == MachineStatus::Renting, Error::<T>::IncorrectStatus);
					machine.status = MachineStatus::ForRent;
					Ok(())
				})?;

				order.metadata = metadata;
				order.status = OrderStatus::Failed;
				T::Currency::unreserve(&order.buyer, order.total);

				Self::deposit_event(Event::<T>::OrderFailed { order_id, buyer: order.buyer.clone(), seller: order.seller.clone() });
				Ok(())
			})
		}
	}
}
