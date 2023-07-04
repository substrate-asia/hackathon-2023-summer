#![cfg_attr(not(feature = "std"), no_std)]
pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
#[cfg(test)]
mod tests;

#[frame_support::pallet]
pub mod pallet {
	use admeta_common::{AdData, TargetTag};
	use codec::{Decode, Encode};
	use frame_support::{
		dispatch::DispatchResult, pallet_prelude::*, traits::Randomness, BoundedVec,
	};
	use frame_system::pallet_prelude::*;
	use scale_info::TypeInfo;
	use sp_runtime::traits::{AtLeast32BitUnsigned, Bounded};
	use sp_std::prelude::*;

	/// This defines user
	#[derive(Encode, Decode, Clone, RuntimeDebug, PartialEq, Eq, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct User<T: Config> {
		pub age: u8,
		pub tag: TargetTag,
		pub level: u8,
		pub ad_display: bool,
		pub matched_ads: BoundedVec<(T::AccountId, T::AdIndex), T::MaxMatchedAds>,
	}

	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
		type Randomness: Randomness<Self::Hash, Self::BlockNumber>;
		type AdData: AdData<Self::BlockNumber, Self::AdIndex, Self::AccountId>;
		type AdIndex: Parameter
			+ MaybeSerializeDeserialize
			+ Bounded
			+ AtLeast32BitUnsigned
			+ Copy
			+ MaxEncodedLen
			+ Default;

		/// Maximum number of matched ads per user
		#[pallet::constant]
		type MaxMatchedAds: Get<u32>;
	}

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	#[pallet::storage]
	#[pallet::getter(fn get_user)]
	pub type Users<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, User<T>, OptionQuery>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		NewUserAdded(T::AccountId),
		UserSetAdDisplay(T::AccountId, bool),
		RewardClaimed(T::AccountId, T::AdIndex),
		RewardNotClaimed(T::AccountId, T::AdIndex),
	}

	#[pallet::error]
	pub enum Error<T> {
		UserAlreadyExists,
		UserDoesNotExist,
		AdNotForThisUser,
		RewardClaimPaymentError,
	}

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		/// Matching happens in every block's on_idle() function, to avoid congestion
		fn on_idle(block_number: T::BlockNumber, remaining_weight: Weight) -> Weight {
			log::info!("on_idle #{:?}, {:?})", block_number, remaining_weight);
			Self::do_matching(block_number);
			// TODO calculate the actual consumed weights
			Weight::from_parts(300 as u64, 64)
		}
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Add a user profile.
		///
		/// The dispatch origin for this call must be `Signed` by the to be added user.
		#[pallet::call_index(0)]
		#[pallet::weight(T::DbWeight::get().reads_writes(0,1).ref_time())]
		pub fn add_profile(
			origin: OriginFor<T>,
			age: u8,
			tag: TargetTag,
			ad_display: bool,
		) -> DispatchResult {
			let who = ensure_signed(origin)?;

			// Check if user exists
			if Users::<T>::contains_key(&who) {
				// Update user profile if user already exists
				Users::<T>::mutate(who.clone(), |user_op| {
					if let Some(user) = user_op {
						user.age = age;
						user.tag = tag;
						user.ad_display = ad_display;
						Self::deposit_event(Event::UserSetAdDisplay(who, ad_display));
						Ok(())
					} else {
						// Here shall never be reached as user profile is proven existing
						Err(Error::<T>::UserDoesNotExist)
					}
				})?;
				Ok(())
			} else {
				let user = User::<T> {
					age,
					tag,
					// User level is set to 0 for self defined users
					level: 0,
					ad_display,
					// try_into() should be always successful
					matched_ads: Vec::new().try_into().unwrap(),
				};
				Users::<T>::insert(who.clone(), user);
				Self::deposit_event(Event::NewUserAdded(who));
				Ok(())
			}
		}

		/// Add a zk user profile.
		///
		/// The dispatch origin for this call must be `Signed` by the to be added user.
		#[pallet::call_index(1)]
		#[pallet::weight(T::DbWeight::get().reads_writes(0,1).ref_time())]
		pub fn add_zk_profile(
			origin: OriginFor<T>,
			age: u8,
			tag: TargetTag,
			level: u8,
			ad_display: bool,
		) -> DispatchResult {
			let who = ensure_signed(origin)?;

			// Check if user exists
			if Users::<T>::contains_key(&who) {
				// Update user profile if user already exists
				Users::<T>::mutate(who.clone(), |user_op| {
					if let Some(user) = user_op {
						user.age = age;
						user.tag = tag;
						user.level = level;
						user.ad_display = ad_display;
						Self::deposit_event(Event::UserSetAdDisplay(who, ad_display));
						Ok(())
					} else {
						// Here shall never be reached as user profile is proven existing
						Err(Error::<T>::UserDoesNotExist)
					}
				})?;
				Ok(())
			} else {
				let user = User::<T> {
					age,
					tag,
					level,
					ad_display,
					// try_into() should be always successful
					matched_ads: Vec::new().try_into().unwrap(),
				};
				Users::<T>::insert(who.clone(), user);
				Self::deposit_event(Event::NewUserAdded(who));
				Ok(())
			}
		}

		/// Claim rewards for certain ads.
		///
		/// The dispatch origin for this call must be `Signed` by the user.
		#[pallet::call_index(2)]
		#[pallet::weight(T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn claim_reward(
			origin: OriginFor<T>,
			proposer: T::AccountId,
			ad_index: T::AdIndex,
		) -> DispatchResult {
			let who = ensure_signed(origin)?;

			Users::<T>::mutate(who.clone(), |user_op| {
				if let Some(user) = user_op {
					let mut ad_claimed = false;

					// TODO Refactor this code, to find the id and remove it instead of iterating
					// the whole vector
					user.matched_ads.retain(|(ad_proposer, ad_id)| {
						// Only the ad_id that equals to ad_index gets removed
						if *ad_proposer == proposer && *ad_id == ad_index {
							ad_claimed = true;
							false
						} else {
							true
						}
					});

					if ad_claimed {
						T::AdData::claim_reward_for_user(proposer, ad_index, who.clone())
							.map_err(|_| Error::<T>::RewardClaimPaymentError)?;
						Self::deposit_event(Event::RewardClaimed(who, ad_index));
						Ok(())
					} else {
						Self::deposit_event(Event::RewardNotClaimed(who, ad_index));
						Err(Error::<T>::AdNotForThisUser)
					}
				} else {
					Err(Error::<T>::UserDoesNotExist)
				}
			})?;

			Ok(())
		}
	}

	impl<T: Config> Pallet<T> {
		/// Do matching for users and ads
		fn do_matching(block_number: T::BlockNumber) {
			for iter in Users::<T>::iter() {
				// Start matching if there is no matched ads and ad_display is true
				if (iter.1.matched_ads.len() as u32) < T::MaxMatchedAds::get() && iter.1.ad_display
				{
					let matched_vec = T::AdData::match_ad_for_user(
						iter.1.age,
						iter.1.tag,
						iter.1.level,
						block_number,
					);

					// Push matched ads to user's matched_ad vector
					Users::<T>::mutate(&iter.0, |user_op| {
						if let Some(user) = user_op {
							for ad in matched_vec {
								if user.matched_ads.contains(&ad) {
									continue;
								} else {
									// Err should never thrown here
									let _ = user.matched_ads.try_push(ad);
								}
								if (iter.1.matched_ads.len() as u32) >= T::MaxMatchedAds::get() {
									break;
								}
							}
						}
					});
				} else {
					continue;
				}
			}
		}
	}
}
