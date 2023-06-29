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
	use sp_runtime::{traits::AccountIdConversion, ArithmeticError};
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
		pub ipfs_cid: BoundedVec<u8, ConstU32<64>>,
		pub owner: T::AccountId,
	}

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// The maximum length of ipfs cid that can be added.
		#[pallet::constant]
		type MaxArtworkCapacity: Get<u32>;

		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		type Currency: Currency<Self::AccountId>;

		type PalletId: Get<PalletId>;

		#[pallet::constant]
		type ArtworkPrice: Get<BalanceOf<Self>>;
	}

	#[pallet::storage]
	#[pallet::getter(fn artworks)]
	pub type Artworks<T: Config> =
		StorageMap<_, Blake2_128Concat, BoundedVec<u8, ConstU32<64>>, Artwork<T>>;

	#[pallet::storage]
	#[pallet::getter(fn artwork_owner)]
	pub type ArtworkOwned<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		T::AccountId,
		BoundedVec<BoundedVec<u8, ConstU32<64>>, T::MaxArtworkCapacity>,
		ValueQuery,
	>;

	/// Keeps track of the number of Artworks in existence.
	#[pallet::storage]
	pub type CountForArtworks<T: Config> = StorageValue<_, u64, ValueQuery>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// A new artwork was successfully saved.
		ArtworkSaved { owner: T::AccountId, ipfs_cid: BoundedVec<u8, ConstU32<64>> },
		/// A artwork was successfully sold.
		Sold {
			seller: T::AccountId,
			buyer: T::AccountId,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
			price: BalanceOf<T>,
		},
		/// A artwork was successfully transferred.
		Transferred { from: T::AccountId, to: T::AccountId, ipfs_cid: BoundedVec<u8, ConstU32<64>> },
		/// The price of a artwork was successfully set.
		SetPrice { ipfs_cid: BoundedVec<u8, ConstU32<64>>, price: Option<BalanceOf<T>> },
		/// A new artwork was successfully destroyed.
		DestroyArtwork { owner: T::AccountId, ipfs_cid: BoundedVec<u8, ConstU32<64>> },
	}

	#[pallet::error]
	pub enum Error<T> {
		/// An account may only own `MaxArtworkCapacity` artworks.
		TooManyOwned,
		/// This artwork already exists!
		ArtworkAlreadyExist,
		/// This artwork does not exist!
		NoArtwork,
		/// You are not the owner of this artwork.
		NotOwner,
		/// Trying to transfer or buy a artwork from oneself.
		TransferToSelf,
		/// This artwork is not for sale.
		NotForSale,
		/// Ensures that the buying price is greater than the requested price.
		BuyPriceTooLow,
	}

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Save a new unique artwork.
		///
		/// The actual artwork saving is done in the `do_save_artwork()` function.
		#[pallet::call_index(0)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn save_artwork(
			origin: OriginFor<T>,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let who = ensure_signed(origin)?;
			Self::do_save_artwork(who, ipfs_cid)?;

			Ok(())
		}

		/// Directly transfer an artwork to another recipient.
		///
		/// Any account that holds an artwork can send it to another Account. This will reset the
		/// asking price of the artwork, marking it not for sale.
		#[pallet::call_index(1)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn transfer_artwork(
			origin: OriginFor<T>,
			to: T::AccountId,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let from = ensure_signed(origin)?;
			let artwork = Artworks::<T>::get(&ipfs_cid).ok_or(Error::<T>::NoArtwork)?;
			ensure!(artwork.owner == from, Error::<T>::NotOwner);
			Self::do_transfer_artwork(ipfs_cid, to, None)?;

			Ok(())
		}

		/// Buy an artwork for sale.
		/// A front-end should assume that `buy_price` is always equal to the actual price of the
		/// artwork. The buyer will always be charged the actual price of the artwork.
		///
		/// If successful, this method will reset the price of the artwork to `None`, making
		/// it no longer for sale and handle the balance and artwork transfer between the buyer and
		/// seller.
		#[pallet::call_index(2)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn buy_artwork(
			origin: OriginFor<T>,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
			buy_price: BalanceOf<T>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let buyer = ensure_signed(origin)?;
			// Transfer the artwork from seller to buyer as a sale
			Self::do_transfer_artwork(ipfs_cid, buyer, Some(buy_price))?;

			Ok(())
		}

		/// Set the price for an artwork.
		///
		/// Updates artwork price and updates storage.
		#[pallet::call_index(3)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn set_price(
			origin: OriginFor<T>,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
			new_price: Option<BalanceOf<T>>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let sender = ensure_signed(origin)?;

			// Ensure the artwork exists and is called by the artwork owner
			let mut artwork = Artworks::<T>::get(&ipfs_cid).ok_or(Error::<T>::NoArtwork)?;
			ensure!(artwork.owner == sender, Error::<T>::NotOwner);

			// Set the price in storage
			artwork.price = new_price;
			Artworks::<T>::insert(&ipfs_cid, artwork);

			// Deposit a "SetPrice" event.
			Self::deposit_event(Event::SetPrice { ipfs_cid, price: new_price });

			Ok(())
		}

		/// Destroy an artwork and return of down-payment.
		///
		/// Updates storage.
		#[pallet::call_index(4)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn destroy_artwork(
			origin: OriginFor<T>,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let who = ensure_signed(origin)?;
			Self::do_destroy_artwork(who, ipfs_cid)?;

			Ok(())
		}
	}

	impl<T: Config> Pallet<T> {
		fn get_pallet_account_id() -> T::AccountId {
			T::PalletId::get().into_account_truncating()
		}

		// Save a new unique artwork.
		fn do_save_artwork(
			who: T::AccountId,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
		) -> DispatchResult {
			let artwork: Artwork<T> =
				Artwork { price: None, ipfs_cid: ipfs_cid.clone(), owner: who.clone() };

			// Check if the artwork does not already exist in our storage map
			ensure!(!Artworks::<T>::contains_key(&ipfs_cid), Error::<T>::ArtworkAlreadyExist);

			// Performs this operation first as it may fail
			let count = CountForArtworks::<T>::get();
			let new_count = count.checked_add(1).ok_or(ArithmeticError::Overflow)?;

			let artwork_price = T::ArtworkPrice::get();
			T::Currency::transfer(
				&who,
				&Self::get_pallet_account_id(),
				artwork_price,
				ExistenceRequirement::KeepAlive,
			)?;

			Artworks::<T>::insert(ipfs_cid.clone(), artwork);
			ArtworkOwned::<T>::try_append(&who, ipfs_cid.clone())
				.map_err(|_| Error::<T>::TooManyOwned)?;
			CountForArtworks::<T>::put(new_count);

			Self::deposit_event(Event::ArtworkSaved { owner: who, ipfs_cid });
			Ok(())
		}

		// Update storage to transfer artwork
		pub fn do_transfer_artwork(
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
			to: T::AccountId,
			buy_price: Option<BalanceOf<T>>,
		) -> DispatchResult {
			// Get the artwork
			let mut artwork = Artworks::<T>::get(&ipfs_cid).ok_or(Error::<T>::NoArtwork)?;
			let from = artwork.owner;

			ensure!(from != to, Error::<T>::TransferToSelf);
			let mut from_owned = ArtworkOwned::<T>::get(&from);

			// Remove artwork from list of owned artworks.
			if let Some(ind) = from_owned.iter().position(|id| id == &ipfs_cid) {
				from_owned.swap_remove(ind);
			} else {
				return Err(Error::<T>::NoArtwork.into())
			}

			// Add artwork to the list of owned artworks.
			let mut to_owned = ArtworkOwned::<T>::get(&to);
			to_owned.try_push(ipfs_cid.clone()).map_err(|_| Error::<T>::TooManyOwned)?;

			// Mutating state here via a balance transfer.
			// The buyer will always be charged the actual price.
			if let Some(buy_price) = buy_price {
				// Current artwork price if for sale
				if let Some(sale_price) = artwork.price {
					ensure!(buy_price >= sale_price, Error::<T>::BuyPriceTooLow);
					// Transfer the amount from buyer to seller
					T::Currency::transfer(&to, &from, sale_price, ExistenceRequirement::KeepAlive)?;
					// Deposit sold event
					Self::deposit_event(Event::Sold {
						seller: from.clone(),
						buyer: to.clone(),
						ipfs_cid: ipfs_cid.clone(),
						price: sale_price,
					});
				} else {
					// Artwork price is set to `None` and is not for sale
					return Err(Error::<T>::NotForSale.into())
				}
			}

			// Transfer succeeded, update the artwork owner and reset the price to `None`.
			artwork.owner = to.clone();
			artwork.price = None;

			// Write updates to storage
			Artworks::<T>::insert(&ipfs_cid, artwork);
			ArtworkOwned::<T>::insert(&to, to_owned);
			ArtworkOwned::<T>::insert(&from, from_owned);

			Self::deposit_event(Event::Transferred { from, to, ipfs_cid });

			Ok(())
		}

		// Destroy an artwork and return of down-payment.
		pub fn do_destroy_artwork(
			who: T::AccountId,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
		) -> DispatchResult {
			// Ensure the artwork exists and is called by the artwork owner
			let artwork = Artworks::<T>::get(&ipfs_cid).ok_or(Error::<T>::NoArtwork)?;
			ensure!(artwork.owner == who, Error::<T>::NotOwner);

			// Performs this operation first as it may fail
			let count = CountForArtworks::<T>::get();
			let new_count = count.checked_sub(1).ok_or(ArithmeticError::Underflow)?;

			T::Currency::transfer(
				&Self::get_pallet_account_id(),
				&who,
				T::ArtworkPrice::get(),
				ExistenceRequirement::KeepAlive,
			)?;

			Artworks::<T>::remove(ipfs_cid.clone());
			// Remove the ipfs_cid
			ArtworkOwned::<T>::try_mutate(&who, |ipfs_cid_vec| {
				ipfs_cid_vec.retain(|x| *x != ipfs_cid);
				Ok(())
			})
			.map_err(|()| Error::<T>::NoArtwork)?;
			CountForArtworks::<T>::put(new_count);

			// Deposit a "DestroyArtwork" event.
			Self::deposit_event(Event::DestroyArtwork { owner: who, ipfs_cid });

			Ok(())
		}
	}
}
