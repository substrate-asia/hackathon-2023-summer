#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
	pub use frame_support::pallet_prelude::*;
	use frame_support::{
		traits::{Currency, ExistenceRequirement},
		PalletId,
	};
	pub use frame_system::pallet_prelude::*;
	use sp_runtime::traits::AccountIdConversion;
	pub use sp_std::prelude::*;

	const STORAGE_VERSION: StorageVersion = StorageVersion::new(1);
	type BalanceOf<T> =
		<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

	#[pallet::pallet]
	#[pallet::storage_version(STORAGE_VERSION)]
	pub struct Pallet<T>(PhantomData<T>);

	#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct Artwork<T: Config> {
		// `None` assumes not for sale
		pub price: Option<BalanceOf<T>>,
		pub ipfs_cid: BoundedVec<u8, T::MaxCidLength>,
		pub owner: T::AccountId,
	}

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// The maximum length of ipfs cid that can be added.
		#[pallet::constant]
		type MaxCidLength: Get<u32>;

		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		type Currency: Currency<Self::AccountId>;

		type PalletId: Get<PalletId>;

		#[pallet::constant]
		type ArtworkPrice: Get<BalanceOf<Self>>;
	}

	#[pallet::storage]
	#[pallet::getter(fn artworks)]
	pub type Artworks<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, Artwork<T>>;

	#[pallet::storage]
	#[pallet::getter(fn artwork_owner)]
	pub type ArtworkOwner<T: Config> =
		StorageMap<_, Blake2_128Concat, BoundedVec<u8, T::MaxCidLength>, T::AccountId>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		ArtworkCreated { owner: T::AccountId, ipfs_cid: BoundedVec<u8, T::MaxCidLength> },
	}

	#[pallet::error]
	pub enum Error<T> {
		ProofAlreadyExist,
		ClaimTooLang,
		ClaimNotExist,
		NotClaimOwner,
	}

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::call_index(0)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn create_artwork(
			origin: OriginFor<T>,
			ipfs_cid: BoundedVec<u8, T::MaxCidLength>,
		) -> DispatchResult {
			let who = ensure_signed(origin)?;

			let artwork: Artwork<T> =
				Artwork { price: None, ipfs_cid: ipfs_cid.clone(), owner: who.clone() };
			let artwork_price = T::ArtworkPrice::get();
			T::Currency::transfer(
				&who,
				&Self::get_pallet_account_id(),
				artwork_price,
				ExistenceRequirement::KeepAlive,
			)?;

			Artworks::<T>::insert(&who, artwork);
			ArtworkOwner::<T>::insert(&ipfs_cid, &who);

			Self::deposit_event(Event::ArtworkCreated { owner: who, ipfs_cid });
			Ok(())
		}
	}

	impl<T: Config> Pallet<T> {
		fn get_pallet_account_id() -> T::AccountId {
			T::PalletId::get().into_account_truncating()
		}
	}
}
