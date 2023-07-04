#![cfg_attr(not(feature = "std"), no_std)]
pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::{
		dispatch::DispatchResultWithPostInfo, pallet_prelude::*, traits::ReservableCurrency,
	};
	use frame_system::pallet_prelude::*;
	use scale_info::TypeInfo;
	use sp_runtime::{traits::AtLeast32BitUnsigned, RuntimeDebug};
	use sp_std::prelude::*;

	use frame_support::codec::{Decode, Encode, MaxEncodedLen};

	/// Origin for the onboard module.
	#[derive(PartialEq, Eq, Clone, RuntimeDebug, Encode, Decode, TypeInfo, MaxEncodedLen)]
	#[codec(mel_bound(AccountId: MaxEncodedLen))]
	pub enum RawOrigin<AccountId> {
		/// channel id with sovereign account info. It can be more complex channel info in future
		Channels(u32, AccountId),
	}
	/// Retrieve the channel info from origin.
	pub trait GetChannelInfo<AccountId> {
		/// Returns `Some` `Backing` if `self` represents a fractional/groupwise backing of some
		/// implicit motion. `None` if it does not.
		fn get_channel_info(&self) -> Option<ChannelInfo<AccountId>>;
	}

	/// Channel Info
	#[derive(Encode, Decode, MaxEncodedLen, TypeInfo, PartialEq, Eq, Clone, Debug)]
	pub struct ChannelInfo<'a, AccountId: 'a> {
		/// Channel id
		pub channel_id: u32,
		/// The admin aacount
		pub sovereign_account: &'a AccountId,
	}

	impl<AccountId> GetChannelInfo<AccountId> for RawOrigin<AccountId> {
		fn get_channel_info(&self) -> Option<ChannelInfo<AccountId>> {
			match self {
				RawOrigin::Channels(n, a) =>
					Some(ChannelInfo { channel_id: *n, sovereign_account: a }),
				_ => None,
			}
		}
	}

	pub type RoundIndex = u32;
	#[derive(Copy, Clone, PartialEq, Eq, Encode, Decode, MaxEncodedLen, RuntimeDebug, TypeInfo)]
	// The current round index and transition information
	pub struct RoundInfo<BlockNumber> {
		// Current round index
		pub current: RoundIndex,
		// The first block of the current round
		pub first: BlockNumber,
		// The length of the current round in number of blocks
		pub length: u32,
	}
	impl<
			B: Copy
				+ sp_std::ops::Add<Output = B>
				+ sp_std::ops::Sub<Output = B>
				+ From<u32>
				+ PartialOrd,
		> RoundInfo<B>
	{
		pub fn new(current: RoundIndex, first: B, length: u32) -> RoundInfo<B> {
			RoundInfo { current, first, length }
		}
		// Check if the round should be updated
		pub fn should_update(&self, now: B) -> bool {
			now - self.first >= self.length.into()
		}
		// New round
		pub fn update(&mut self, now: B) {
			self.current = self.current.saturating_add(1u32);
			self.first = now;
		}
	}
	impl<
			B: Copy
				+ sp_std::ops::Add<Output = B>
				+ sp_std::ops::Sub<Output = B>
				+ From<u32>
				+ PartialOrd,
		> Default for RoundInfo<B>
	{
		fn default() -> RoundInfo<B> {
			RoundInfo::new(1u32, 1u32.into(), 20u32)
		}
	}

	#[derive(Copy, Clone, PartialEq, Eq, Encode, Decode, MaxEncodedLen, RuntimeDebug, TypeInfo)]
	pub struct ChannelSetting<AccountId> {
		// Using on chain token for fee payment
		pub on_chain_payment: bool,
		// The number of xcm message left
		pub xcm_message_cap: u128,
		// reference period index last updated
		pub reference_index: RoundIndex,
		// The size limit of local message storage from external resource
		pub local_storage_cap: u128,
		// If disabled status
		pub disabled: bool,
		// Sovereign account,
		pub admin: AccountId,
	}

	// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// The runtime origin type.
		type RuntimeOrigin: From<RawOrigin<Self::AccountId>>;
		// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		// A unique id representing a single channel
		type ChannelId: Default
			+ Copy
			+ PartialEq
			+ core::fmt::Debug
			+ codec::FullCodec
			+ AtLeast32BitUnsigned
			+ From<u64>
			+ TypeInfo
			+ MaxEncodedLen;

		// Currency mechanism
		type Currency: ReservableCurrency<Self::AccountId>;

		// The origin who can set the admin account
		type SetAdminOrigin: EnsureOrigin<<Self as frame_system::Config>::RuntimeOrigin>;

		// Minimum number of blocks per round
		#[pallet::constant]
		type MinBlocksPerRound: Get<u32>;
		// Default number of blocks per round at genesis
		#[pallet::constant]
		type DefaultBlocksPerRound: Get<u32>;
	}

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	/// Origin for the pallet.
	#[pallet::origin]
	pub type Origin<T> = RawOrigin<<T as frame_system::Config>::AccountId>;

	// The setting of AI info channel
	#[pallet::storage]
	#[pallet::getter(fn something)]
	pub(crate) type Channels<T: Config> =
		StorageMap<_, Twox64Concat, T::ChannelId, ChannelSetting<T::AccountId>, OptionQuery>;

	#[pallet::storage]
	#[pallet::getter(fn round)]
	// Current round index and next round scheduled transition
	pub type Round<T: Config> = StorageValue<_, RoundInfo<T::BlockNumber>, ValueQuery>;

	// The reward pool admin account
	// The reason why such an account is needed (other than just using ROOT) is for
	// fast processing of reward proposals, imagine later when sudo is removed
	#[pallet::storage]
	#[pallet::getter(fn admin)]
	pub type Admin<T: Config> = StorageValue<_, T::AccountId, OptionQuery>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		// Started new round.
		NewRound {
			starting_block: T::BlockNumber,
			round: RoundIndex,
		},
		// Admin acccount was changed, the \[ old admin \] is provided
		AdminChanged {
			old_admin: Option<T::AccountId>,
		},
		/// Set blocks per round
		BlocksPerRoundSet {
			current_round: RoundIndex,
			first_block: T::BlockNumber,
			old: u32,
			new: u32,
		},
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		CannotSetBelowMin,
		NoWritingSameValue,
	}

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		fn on_initialize(n: T::BlockNumber) -> Weight {
			let mut round = <Round<T>>::get();
			if round.should_update(n) {
				// mutate round
				round.update(n);
				<Round<T>>::put(round);
				Self::deposit_event(Event::NewRound {
					starting_block: round.first,
					round: round.current,
				});
			}
			Weight::zero()
		}
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		// Change the admin account
		// similar to sudo.set_key, the old account will be supplied in event
		#[pallet::call_index(0)]
		#[pallet::weight(Weight::from_parts(10_000, 0))]
		pub fn set_admin(origin: OriginFor<T>, new: T::AccountId) -> DispatchResultWithPostInfo {
			T::SetAdminOrigin::ensure_origin(origin)?;
			Self::deposit_event(Event::AdminChanged { old_admin: Self::admin() });
			<Admin<T>>::put(new);
			// Do not pay a fee
			Ok(Pays::No.into())
		}

		// Quick set up channel setting
		// No logic of regulation yet
		// TODO need further implement
		#[pallet::call_index(1)]
		#[pallet::weight(Weight::from_parts(10_000, 0))]
		pub fn initialize_channel(
			_origin: OriginFor<T>,
			channel_id: T::ChannelId,
			channel_info: ChannelSetting<T::AccountId>,
		) -> DispatchResultWithPostInfo {
			Channels::<T>::insert(channel_id, channel_info);
			Ok(().into())
		}

		// Set round config
		#[pallet::call_index(2)]
		#[pallet::weight(Weight::from_parts(10_000, 0))]
		// Set blocks per round
		// - if called with `new` less than length of current round, will transition immediately
		// in the next block
		pub fn set_blocks_per_round(origin: OriginFor<T>, new: u32) -> DispatchResultWithPostInfo {
			frame_system::ensure_root(origin)?;
			ensure!(new >= T::MinBlocksPerRound::get(), Error::<T>::CannotSetBelowMin);
			let mut round = <Round<T>>::get();
			let (now, first, old) = (round.current, round.first, round.length);
			ensure!(old != new, Error::<T>::NoWritingSameValue);
			round.length = new;
			<Round<T>>::put(round);
			Self::deposit_event(Event::BlocksPerRoundSet {
				current_round: now,
				first_block: first,
				old,
				new,
			});
			Ok(().into())
		}
	}
}
