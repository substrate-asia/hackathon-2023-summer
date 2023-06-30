#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://docs.substrate.io/reference/frame-pallets/>
pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;
pub use weights::*;

#[cfg(feature = "std")]
use serde::Serialize;

#[frame_support::pallet]
pub mod pallet {
	use super::*;
	use frame_support::{
		pallet_prelude::{
			ensure, Blake2_128Concat, ConstU32, Decode, DispatchResult, Encode, Get, IsType,
			MaxEncodedLen, RuntimeDebug, StorageMap, TypeInfo,
		},
		traits::{Currency, ExistenceRequirement, WithdrawReasons},
		WeakBoundedVec,
	};
	use frame_system::pallet_prelude::{BlockNumberFor, *};
	use scale_info::prelude::{string::String, vec::Vec};

	#[derive(Encode, Decode, PartialEq, Clone, RuntimeDebug, TypeInfo, MaxEncodedLen)]
	#[cfg_attr(feature = "std", derive(Serialize, Eq))]
	pub enum RecordType {
		A,
		AAAA,
		CNAME,
		MX,
		NS,
		PTR,
	}

	impl From<RecordType> for u8 {
		fn from(t: RecordType) -> Self {
			match t {
				RecordType::A => 1,
				RecordType::AAAA => 2,
				RecordType::CNAME => 3,
				RecordType::MX => 4,
				RecordType::NS => 5,
				RecordType::PTR => 6,
			}
		}
	}

	#[pallet::pallet]
	#[pallet::without_storage_info]
	pub struct Pallet<T>(_);

	#[derive(Decode, Encode, Default, Clone, Debug, PartialEq, Eq, TypeInfo)]
	pub struct RegistrationDetails {
		pub owner_info: String,
		pub domain_aliases: WeakBoundedVec<String, ConstU32<10>>,
	}

	#[derive(Decode, Encode, Default, Clone, Debug, PartialEq, Eq, TypeInfo)]
	pub struct Domain<Address, BlockNumber> {
		pub owner: Address,
		pub regist_details: RegistrationDetails,
		pub expire: BlockNumber,
	}

	type BalanceOf<T> =
		<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

	//pub type BlockNumberOf<T> = <T as frame_system::Config>::BlockNumber;

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
		/// Type representing the weight of this pallet
		type WeightInfo: WeightInfo;

		type Currency: Currency<Self::AccountId>;

		#[pallet::constant]
		type ResisterFee: Get<BalanceOf<Self>>;

		#[pallet::constant]
		type ExpireNumber: Get<BlockNumberFor<Self>>;
	}

	#[pallet::storage]
	pub type DomainRegistry<T: Config> =
		StorageMap<_, Blake2_128Concat, String, Domain<T::AccountId, BlockNumberFor<T>>>;

	#[pallet::storage]
	pub type ARecords<T> = StorageMap<_, Blake2_128Concat, String, String>;

	#[pallet::storage]
	pub type AAAARecords<T> = StorageMap<_, Blake2_128Concat, String, String>;

	#[pallet::storage]
	pub type CnameRecords<T> = StorageMap<_, Blake2_128Concat, String, String>;

	#[pallet::storage]
	pub type MxRecords<T> = StorageMap<_, Blake2_128Concat, String, String>;

	#[pallet::storage]
	pub type NsRecords<T> = StorageMap<_, Blake2_128Concat, String, String>;

	#[pallet::storage]
	pub type PtrRecords<T> = StorageMap<_, Blake2_128Concat, String, String>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		Rigistration { name: String, owner: T::AccountId, expire: BlockNumberFor<T> },
		OwnerShip { name: String, old_owner: T::AccountId, recipient: T::AccountId },
		Renew { name: String, expire: BlockNumberFor<T> },
		CancelDomain { name: String, owner: T::AccountId },
		RigistrationUpdated { name: String },
		DnsRecord { name: String, record_type: u8, value: String },
		DnsRecordRemoved { name: String, record_type: u8 },
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// Error names should be descriptive.
		Existed,
		/// Errors should have helpful documentation associated with them.
		NameNotExisted,
		NotOwner,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::call_index(0)]
		#[pallet::weight(T::WeightInfo::register_domain())]
		pub fn register_domain(
			origin: OriginFor<T>,
			name: String,
			owner_info: String,
			domain_aliases: Vec<String>,
		) -> DispatchResult {
			let owner = ensure_signed(origin)?;
			ensure!(!DomainRegistry::<T>::contains_key(&name), Error::<T>::Existed);
			T::Currency::withdraw(
				&owner,
				T::ResisterFee::get(),
				WithdrawReasons::TRANSFER,
				ExistenceRequirement::KeepAlive,
			)?;

			let regist_details = RegistrationDetails {
				owner_info,
				domain_aliases: WeakBoundedVec::force_from(domain_aliases, None),
			};
			let expire = frame_system::Pallet::<T>::block_number() + T::ExpireNumber::get();
			let domain = Domain::<T::AccountId, BlockNumberFor<T>> {
				owner: owner.clone(),
				regist_details,
				expire,
			};

			DomainRegistry::<T>::insert(name.clone(), domain);
			Self::deposit_event(Event::Rigistration { name, owner, expire });

			Ok(())
		}

		#[pallet::call_index(1)]
		#[pallet::weight(T::WeightInfo::renew_registration())]
		pub fn transfer_ownershit(
			origin: OriginFor<T>,
			name: String,
			recipient: T::AccountId,
		) -> DispatchResult {
			let old_owner = ensure_signed(origin)?;

			DomainRegistry::<T>::mutate_exists(name.clone(), |domain| match domain {
				Some(domain) =>
					if old_owner == domain.owner {
						domain.owner = recipient.clone();
						Self::deposit_event(Event::OwnerShip { name, old_owner, recipient });
						Ok(())
					} else {
						Err(Error::<T>::NotOwner)?
					},
				_ => Err(Error::<T>::NameNotExisted)?,
			})
		}

		#[pallet::call_index(2)]
		#[pallet::weight(T::WeightInfo::renew_registration())]
		pub fn renew_registration(
			origin: OriginFor<T>,
			name: String,
			times: u32,
		) -> DispatchResult {
			let owner = ensure_signed(origin)?;

			DomainRegistry::<T>::mutate_exists(name.clone(), |domain| match domain {
				Some(domain) => {
					T::Currency::withdraw(
						&owner,
						T::ResisterFee::get() * times.into(),
						WithdrawReasons::TRANSFER,
						ExistenceRequirement::KeepAlive,
					)?;
					domain.expire += T::ExpireNumber::get() * times.into();
					Self::deposit_event(Event::Renew { name, expire: domain.expire });
					Ok(())
				},

				_ => Err(Error::<T>::NameNotExisted)?,
			})
		}

		#[pallet::call_index(3)]
		#[pallet::weight(T::WeightInfo::renew_registration())]
		pub fn update_registration(
			origin: OriginFor<T>,
			name: String,
			owner_info: String,
			domain_aliases: Vec<String>,
		) -> DispatchResult {
			let owner = ensure_signed(origin)?;

			DomainRegistry::<T>::mutate_exists(name.clone(), |domain| match domain {
				Some(domain) => {
					ensure!(domain.owner == owner, Error::<T>::NotOwner);
					let regist_details = RegistrationDetails {
						owner_info,
						domain_aliases: WeakBoundedVec::force_from(domain_aliases, None),
					};
					domain.regist_details = regist_details;
					Self::deposit_event(Event::RigistrationUpdated { name });
					Ok(())
				},

				_ => Err(Error::<T>::NameNotExisted)?,
			})
		}

		#[pallet::call_index(4)]
		#[pallet::weight(T::WeightInfo::cancel_domain())]
		pub fn cancel_domain(origin: OriginFor<T>, name: String) -> DispatchResult {
			let who = ensure_signed(origin)?;
			let domain = DomainRegistry::<T>::get(&name).ok_or(Error::<T>::NameNotExisted)?;

			ensure!(domain.owner == who, Error::<T>::NotOwner);
			DomainRegistry::<T>::remove(&name);
			ARecords::<T>::remove(&name);
			AAAARecords::<T>::remove(&name);
			MxRecords::<T>::remove(&name);
			NsRecords::<T>::remove(&name);
			CnameRecords::<T>::remove(&name);
			PtrRecords::<T>::remove(&name);
			Self::deposit_event(Event::CancelDomain { name, owner: who });

			Ok(())
		}

		#[pallet::call_index(5)]
		#[pallet::weight(T::WeightInfo::add_update_dns_record())]
		pub fn add_update_dns_record(
			origin: OriginFor<T>,
			name: String,
			record_type: RecordType,
			value: String,
		) -> DispatchResult {
			let who = ensure_signed(origin)?;

			Self::is_owner(&name, &who)?;
			match record_type {
				RecordType::A => ARecords::<T>::insert(&name, name.clone() + "\n" + &value),
				RecordType::AAAA => AAAARecords::<T>::insert(&name, name.clone() + "\n" + &value),
				RecordType::MX => MxRecords::<T>::insert(&name, name.clone() + "\n" + &value),
				RecordType::NS => NsRecords::<T>::insert(&name, name.clone() + "\n" + &value),
				RecordType::CNAME => CnameRecords::<T>::insert(&name, name.clone() + "\n" + &value),
				RecordType::PTR => PtrRecords::<T>::insert(&name, name.clone() + "\n" + &value),
			}
			Self::deposit_event(Event::DnsRecord { name, record_type: record_type.into(), value });
			Ok(())
		}

		#[pallet::call_index(6)]
		#[pallet::weight(T::WeightInfo::add_update_dns_record())]
		pub fn remove_dns_record(
			origin: OriginFor<T>,
			name: String,
			record_type: RecordType,
		) -> DispatchResult {
			let who = ensure_signed(origin)?;

			Self::is_owner(&name, &who)?;
			match record_type {
				RecordType::A => ARecords::<T>::remove(&name),
				RecordType::AAAA => AAAARecords::<T>::remove(&name),
				RecordType::MX => MxRecords::<T>::remove(&name),
				RecordType::NS => NsRecords::<T>::remove(&name),
				RecordType::CNAME => CnameRecords::<T>::remove(&name),
				RecordType::PTR => PtrRecords::<T>::remove(&name),
			}
			Self::deposit_event(Event::DnsRecordRemoved { name, record_type: record_type.into() });

			Ok(())
		}
	}

	impl<T: Config> Pallet<T> {
		fn is_owner(name: &str, owner: &T::AccountId) -> DispatchResult {
			let domain = DomainRegistry::<T>::get(name).ok_or(Error::<T>::NameNotExisted)?;

			ensure!(domain.owner == *owner, Error::<T>::NotOwner);
			Ok(())
		}
	}
}
