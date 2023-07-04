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
	use admeta_common::{AdData, AdPreference, TargetTag};
	use codec::{Decode, Encode, MaxEncodedLen};
	use frame_support::{
		dispatch::DispatchResult,
		pallet_prelude::*,
		traits::{BalanceStatus, Currency, OnUnbalanced, Randomness, ReservableCurrency},
	};
	use frame_system::pallet_prelude::*;
	use scale_info::TypeInfo;
	use sp_runtime::traits::{AtLeast32BitUnsigned, Bounded, Saturating};
	use sp_std::prelude::*;

	pub type BlockNumberOf<T> = <T as frame_system::Config>::BlockNumber;
	pub type BalanceOf<T> =
		<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
	pub type NegativeImbalanceOf<T> = <<T as Config>::Currency as Currency<
		<T as frame_system::Config>::AccountId,
	>>::NegativeImbalance;

	pub type GeneralData<T> = BoundedVec<u8, <T as Config>::MaxAdDataLength>;

	/// This defines impression ads, which pays by CPI
	#[derive(Encode, Decode, Clone, RuntimeDebug, PartialEq, Eq, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct ImpressionAd<T: Config> {
		/// The account who proposed this ad
		pub proposer: T::AccountId,
		/// The URL where this ad's metadata stores
		pub metadata: GeneralData<T>,
		/// The target URL where it redirects to when user clicks this ad
		pub target: GeneralData<T>,
		/// The title of this ad
		pub title: GeneralData<T>,
		/// The bond reserved for this ad
		pub bond: BalanceOf<T>,
		/// The cost per impression (CPI)
		pub cpi: BalanceOf<T>,
		/// The total number of impressions in this ad
		pub amount: u32,
		/// The end block of this ad
		pub end_block: BlockNumberOf<T>,
		/// The preference of target group
		pub preference: AdPreference,
		/// The approval status
		pub approved: bool,
	}

	// TODO ClickAd, ActionAd will be implemented

	#[pallet::config]
	pub trait Config: frame_system::Config {
		type AdIndex: Parameter
			+ MaybeSerializeDeserialize
			+ Bounded
			+ AtLeast32BitUnsigned
			+ Copy
			+ MaxEncodedLen
			+ Default;

		/// Origin from which approvals must come.
		type ApproveOrigin: EnsureOrigin<Self::RuntimeOrigin>;

		/// Origin from which rejections must come.
		type RejectOrigin: EnsureOrigin<Self::RuntimeOrigin>;

		/// Handler for the unbalanced decrease when slashing for a rejected proposal.
		type OnSlash: OnUnbalanced<NegativeImbalanceOf<Self>>;

		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		/// Currency for balance reserving and unreserving operations
		type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;

		type Randomness: Randomness<Self::Hash, Self::BlockNumber>;

		/// Maximum acceptable Ad metadata length
		#[pallet::constant]
		type MaxAdDataLength: Get<u32>;

		/// Maximum num of tags per Ad
		#[pallet::constant]
		type MaxAdTags: Get<u32>;

		/// The base deposit amount of an ad proposal
		#[pallet::constant]
		type AdDepositBase: Get<BalanceOf<Self>>;

		/// The deposit amount per byte of an ad's metadata
		#[pallet::constant]
		type AdDepositPerByte: Get<BalanceOf<Self>>;
	}

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	/// Number of ad proposals that have been made.
	#[pallet::storage]
	#[pallet::getter(fn ad_count)]
	pub type AdCount<T: Config> = StorageValue<_, T::AdIndex, OptionQuery>;

	#[pallet::storage]
	#[pallet::getter(fn impression_ads)]
	// TODO Optimize the storage usage, as hashmap is not the optimal and scalable solution
	/// Impression ads storage
	pub type ImpressionAds<T: Config> = StorageDoubleMap<
		_,
		Blake2_128Concat,
		T::AccountId,
		Blake2_128Concat,
		T::AdIndex,
		ImpressionAd<T>,
		OptionQuery,
	>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// New advertising proposal created
		NewAdProposal(T::AccountId, T::AdIndex),

		/// Ad proposal approved
		AdProposalApproved(T::AccountId, T::AdIndex),

		/// Ad proposal rejected
		AdProposalRejected(T::AccountId, T::AdIndex),

		/// New user added
		NewUserAdded(T::AccountId),

		/// Ad display enabled/disabled by users
		UserSetAdDisplay(T::AccountId, bool),

		/// Ad reward claimed
		RewardClaimed(T::AccountId, T::AdIndex),

		/// Ad reward not claimed
		RewardNotClaimed(T::AccountId, T::AdIndex),
	}

	#[pallet::error]
	pub enum Error<T> {
		AdDoesNotExist,
		AdCountOverflow,
		InvalidAdPreference,
		InsufficientProposalBalance,
		InvalidAdIndex,
		UserAlreadyExists,
		UserDoesNotExist,
		AdNotForThisUser,
		AdPaymentError,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Create an ad proposal.
		///
		/// The dispatch origin for this call must be `Signed` by the proposer.
		/// - 'ad_url': The URL which links to the ad metadata(usually an image stored on IPFS)
		/// - 'target_url': The jump link of this ad proposal
		/// - 'title': Title of this ad
		/// - 'cpi': Cost per impression of this ad
		/// - 'amount': The total duplications of this ad
		/// - 'end_block': The expiration time of this ad in Block height
		/// - 'ad_preference': The preferred target group of this ad
		#[pallet::call_index(0)]
		#[pallet::weight(T::DbWeight::get().reads_writes(2,1).ref_time())]
		pub fn propose_ad(
			origin: OriginFor<T>,
			ad_url: GeneralData<T>,
			target_url: GeneralData<T>,
			title: GeneralData<T>,
			cpi: BalanceOf<T>,
			amount: u32,
			end_block: BlockNumberOf<T>,
			ad_preference: AdPreference,
		) -> DispatchResult {
			let who = ensure_signed(origin)?;

			Self::create_proposal(
				who,
				ad_url,
				target_url,
				title,
				cpi,
				amount,
				end_block,
				ad_preference,
			)?;

			Ok(())
		}
		/// Approve an ad proposal.
		///
		/// The dispatch origin for this call must be `Signed` by the ApproveOrigin.
		#[pallet::call_index(1)]
		#[pallet::weight(T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn approve_ad(
			origin: OriginFor<T>,
			proposer: T::AccountId,
			ad_index: T::AdIndex,
		) -> DispatchResult {
			T::ApproveOrigin::ensure_origin(origin)?;

			// Set approved to true
			ImpressionAds::<T>::mutate(proposer.clone(), ad_index, |ad_op| {
				if let Some(ad) = ad_op {
					ad.approved = true;
					Self::deposit_event(Event::AdProposalApproved(proposer, ad_index));
					Ok(())
				} else {
					Err(Error::<T>::InvalidAdIndex)
				}
			})?;

			Ok(())
		}
		/// Reject an ad proposal.
		///
		/// The dispatch origin for this call must be `Signed` by the RejectOrigin.
		#[pallet::call_index(2)]
		#[pallet::weight(T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn reject_ad(
			origin: OriginFor<T>,
			proposer: T::AccountId,
			ad_index: T::AdIndex,
		) -> DispatchResult {
			T::RejectOrigin::ensure_origin(origin)?;

			// Slash the bond and unreserve the ad payment
			let ad = Self::impression_ads(&proposer, ad_index).ok_or(Error::<T>::InvalidAdIndex)?;
			let imbalance = T::Currency::slash_reserved(&ad.proposer, ad.bond).0;
			T::OnSlash::on_unbalanced(imbalance);
			let ad_cost = ad.cpi * ad.amount.into();
			T::Currency::unreserve(&ad.proposer, ad_cost);
			// Remove this proposal
			ImpressionAds::<T>::remove(&proposer, ad_index);
			Self::deposit_event(Event::AdProposalRejected(proposer, ad_index));

			Ok(())
		}
	}

	impl<T: Config> AdData<T::BlockNumber, T::AdIndex, T::AccountId> for Pallet<T> {
		fn match_ad_for_user(
			age: u8,
			tag: TargetTag,
			level: u8,
			block_number: T::BlockNumber,
		) -> Vec<(T::AccountId, T::AdIndex)> {
			let mut matched_vec = Vec::new();
			for ad in ImpressionAds::<T>::iter() {
				if ad.2.preference.age.is_in_range(age)
					&& ad.2.preference.tags.contains(&tag)
					&& ad.2.preference.min_level <= level
					&& ad.2.amount > 0 && ad.2.approved
					&& ad.2.end_block >= block_number
				{
					// Decrease the total amount of this ad by 1
					ImpressionAds::<T>::mutate(&ad.0, &ad.1, |ad_op| {
						if let Some(ad) = ad_op {
							ad.amount -= 1;
						}
					});
					matched_vec.push((ad.0, ad.1));
				}
			}
			matched_vec
		}

		fn claim_reward_for_user(
			proposer: T::AccountId,
			ad_index: T::AdIndex,
			user: T::AccountId,
		) -> DispatchResult {
			if let Some(ad) = Self::impression_ads(proposer, ad_index) {
				let ad_proposer = ad.proposer;
				T::Currency::repatriate_reserved(&ad_proposer, &user, ad.cpi, BalanceStatus::Free)
					.map_err(|_| Error::<T>::AdPaymentError)?;
				Ok(())
			} else {
				Err(Error::<T>::AdDoesNotExist)?
			}
		}
	}

	impl<T: Config> Pallet<T> {
		/// Calculate the next ad index
		fn next_ad_id() -> Result<T::AdIndex, Error<T>> {
			match Self::ad_count() {
				Some(id) => {
					// Ensure id won't overflow
					ensure!(id < T::AdIndex::max_value(), Error::<T>::AdCountOverflow);
					Ok(id.saturating_add(T::AdIndex::from(1u8)))
				},
				// Start count from 1
				None => Ok(T::AdIndex::min_value().saturating_add(T::AdIndex::from(1u8))),
			}
		}
		/// Create an ad proposal
		fn create_proposal(
			who: T::AccountId,
			ad_url: GeneralData<T>,
			target_url: GeneralData<T>,
			title: GeneralData<T>,
			cpi: BalanceOf<T>,
			amount: u32,
			end_block: BlockNumberOf<T>,
			ad_preference: AdPreference,
		) -> Result<(), Error<T>> {
			ensure!(ad_preference.age.self_check(), Error::<T>::InvalidAdPreference);

			let ad_index = Self::next_ad_id()?;

			let bond =
				T::AdDepositBase::get() + T::AdDepositPerByte::get() * (ad_url.len() as u32).into();

			let ad_cost = cpi * amount.into();

			T::Currency::reserve(&who, bond + ad_cost)
				.map_err(|_| Error::<T>::InsufficientProposalBalance)?;

			let ad = ImpressionAd::<T> {
				proposer: who.clone(),
				metadata: ad_url,
				target: target_url,
				title,
				bond,
				cpi,
				amount,
				end_block,
				preference: ad_preference,
				approved: false,
			};

			ImpressionAds::<T>::insert(&who, ad_index, ad);
			AdCount::<T>::put(ad_index);

			Self::deposit_event(Event::NewAdProposal(who, ad_index));

			Ok(())
		}
	}
}
