#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

mod coin_price;

#[frame_support::pallet]
pub mod pallet {
	use crate::coin_price::CoinPriceInfo;
	pub use frame_support::pallet_prelude::*;
	use frame_support::{
		traits::{Currency, ExistenceRequirement},
		PalletId,
	};
	pub use frame_system::pallet_prelude::*;
	use sp_core::offchain::Duration;
	use sp_runtime::{offchain::http, traits::AccountIdConversion, ArithmeticError};
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
		// Collateral fee, `None` assumes not for collateral
		pub collateral_fee: Option<BalanceOf<T>>,
		// Collateral period, sustain for collateral_period blocks,
		// `None` assumes not for collateral
		pub collateral_period: Option<u8>,
		// Collateral interest rate, represented by a percent sign,
		// `None` assumes not for collateral.
		pub collateral_interest_rate: Option<u8>,
		// Ipfs cid, unique identification of the artwork
		pub ipfs_cid: BoundedVec<u8, ConstU32<64>>,
		// The owner of artwork
		pub owner: T::AccountId,
		// To whom artwork was collateral.
		pub collateral_for: Option<T::AccountId>,
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
	#[pallet::getter(fn artwork_owned)]
	pub type ArtworkOwned<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		T::AccountId,
		BoundedVec<BoundedVec<u8, ConstU32<64>>, T::MaxArtworkCapacity>,
		ValueQuery,
	>;

	/// Keeps track of the number of Artworks in existence.
	#[pallet::storage]
	#[pallet::getter(fn count_for_artworks)]
	pub type CountForArtworks<T: Config> = StorageValue<_, u64, ValueQuery>;

	/// Real-time artwork price to create an artwork or destroy an artwork.
	#[pallet::storage]
	#[pallet::getter(fn real_time_artwork_price)]
	pub type RealTimeArtworkPrice<T: Config> = StorageValue<_, BalanceOf<T>, OptionQuery>;

	/// Artwork available for loan.
	#[pallet::storage]
	#[pallet::getter(fn artworks_on_loan)]
	pub type ArtworksOnLoan<T: Config> =
		StorageMap<_, Blake2_128Concat, BoundedVec<u8, ConstU32<64>>, ()>;

	/// Artwork available for sale.
	#[pallet::storage]
	#[pallet::getter(fn artworks_on_sale)]
	pub type ArtworksOnSale<T: Config> =
		StorageMap<_, Blake2_128Concat, BoundedVec<u8, ConstU32<64>>, ()>;

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
		/// The collateral info of a artwork was successfully set.
		ArtworkStartToLoan {
			owner: T::AccountId,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
			collateral_fee: BalanceOf<T>,
			collateral_period: u8,
			collateral_interest_rate: u8,
		},
		/// Artwork was successfully canceled to loan.
		ArtworkCancelLoan { owner: T::AccountId, ipfs_cid: BoundedVec<u8, ConstU32<64>> },
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
		/// Collateral fee must bigger than 0.
		CollateralFeeMustBiggerThanZero,
		/// Collateral period must bigger than 0.
		PeriodMustBiggerThanZero,
		/// Collateral interest rate must bigger than 100. It is represented by a percent sign.
		InterestRateMustBiggerThan100,
		/// Artwork has bean loaned.
		ArtworkHasBeanLoaned,
	}

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		fn offchain_worker(_block_number: T::BlockNumber) {
			if let Ok(coin) = Self::fetch_coin_price_info() {
				log::info!("OCW ==> coin price info: {:?}", coin);
				let price = sp_std::str::from_utf8(&coin.price)
					.map_err(|_| {
						log::warn!("No UTF8 body");
						http::Error::Unknown
					})
					.unwrap();
				RealTimeArtworkPrice::<T>::set(Some(price.parse::<u8>().unwrap().into()));
			} else {
				log::info!("OCW ==> Error while fetch coin price info!");
			}
		}
	}

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

			// Updates `ArtworksOnSale` storage.
			match new_price {
				None => ArtworksOnSale::<T>::remove(&ipfs_cid),
				Some(_) => ArtworksOnSale::<T>::insert(&ipfs_cid, ()),
			}

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

		/// Lend artwork out.
		///
		/// Updates storage.
		#[pallet::call_index(5)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn provide_artwork_loan(
			origin: OriginFor<T>,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
			collateral_fee: BalanceOf<T>,
			collateral_period: u8,
			collateral_interest_rate: u8,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let sender = ensure_signed(origin)?;

			// Ensure the artwork exists and is called by the artwork owner
			let mut artwork = Artworks::<T>::get(&ipfs_cid).ok_or(Error::<T>::NoArtwork)?;
			ensure!(artwork.owner == sender, Error::<T>::NotOwner);
			ensure!(collateral_fee > 0u8.into(), Error::<T>::CollateralFeeMustBiggerThanZero);
			ensure!(collateral_period > 0, Error::<T>::PeriodMustBiggerThanZero);
			ensure!(collateral_interest_rate > 100, Error::<T>::InterestRateMustBiggerThan100);

			// Set the collateral info in storage
			artwork.collateral_fee = Some(collateral_fee);
			artwork.collateral_period = Some(collateral_period);
			artwork.collateral_interest_rate = Some(collateral_interest_rate);
			Artworks::<T>::insert(&ipfs_cid, artwork);
			ArtworksOnLoan::<T>::insert(&ipfs_cid, ());

			// Deposit a "ArtworkStartToLoan" event.
			Self::deposit_event(Event::ArtworkStartToLoan {
				owner: sender,
				ipfs_cid,
				collateral_fee,
				collateral_period,
				collateral_interest_rate,
			});

			Ok(())
		}

		/// Cancel lend funds out.
		///
		/// Updates storage.
		#[pallet::call_index(6)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn cancel_loan(
			origin: OriginFor<T>,
			ipfs_cid: BoundedVec<u8, ConstU32<64>>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let sender = ensure_signed(origin)?;

			// Ensure the artwork exists and is called by the artwork owner
			let mut artwork = Artworks::<T>::get(&ipfs_cid).ok_or(Error::<T>::NoArtwork)?;
			ensure!(artwork.owner == sender, Error::<T>::NotOwner);
			ensure!(artwork.collateral_for == None, Error::<T>::ArtworkHasBeanLoaned);

			// Update the artwork collateral info to `None`.
			artwork.collateral_fee = None;
			artwork.collateral_period = None;
			artwork.collateral_interest_rate = None;
			Artworks::<T>::insert(&ipfs_cid, artwork);
			ArtworksOnLoan::<T>::remove(&ipfs_cid);

			// Deposit a "ArtworkCancelLoan" event.
			Self::deposit_event(Event::ArtworkCancelLoan { owner: sender, ipfs_cid });

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
			let artwork: Artwork<T> = Artwork {
				price: None,
				collateral_fee: None,
				collateral_period: None,
				ipfs_cid: ipfs_cid.clone(),
				owner: who.clone(),
				collateral_interest_rate: None,
				collateral_for: None,
			};

			// Check if the artwork does not already exist in our storage map
			ensure!(!Artworks::<T>::contains_key(&ipfs_cid), Error::<T>::ArtworkAlreadyExist);

			// Performs this operation first as it may fail
			let count = CountForArtworks::<T>::get();
			let new_count = count.checked_add(1).ok_or(ArithmeticError::Overflow)?;

			T::Currency::transfer(
				&who,
				&Self::get_pallet_account_id(),
				Self::pledge_artwork_price(),
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
			// When artwork is transferred, artwork cannot be pledged.
			ensure!(artwork.collateral_for == None, Error::<T>::ArtworkHasBeanLoaned);
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

			// Transfer succeeded, update the artwork owner and reset the price and collateral info
			// to `None`.
			artwork.owner = to.clone();
			artwork.price = None;
			artwork.collateral_fee = None;
			artwork.collateral_period = None;
			artwork.collateral_interest_rate = None;
			artwork.collateral_for = None;

			// Write updates to storage.
			Artworks::<T>::insert(&ipfs_cid, artwork);
			ArtworkOwned::<T>::insert(&to, to_owned);
			ArtworkOwned::<T>::insert(&from, from_owned);
			ArtworksOnSale::<T>::remove(&ipfs_cid);
			ArtworksOnLoan::<T>::remove(&ipfs_cid);

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
			// When artwork is transferred, artwork cannot be pledged.
			ensure!(artwork.collateral_for == None, Error::<T>::ArtworkHasBeanLoaned);

			// Performs this operation first as it may fail
			let count = CountForArtworks::<T>::get();
			let new_count = count.checked_sub(1).ok_or(ArithmeticError::Underflow)?;

			T::Currency::transfer(
				&Self::get_pallet_account_id(),
				&who,
				Self::pledge_artwork_price(),
				ExistenceRequirement::KeepAlive,
			)?;

			Artworks::<T>::remove(ipfs_cid.clone());
			// Remove the ipfs_cid
			ArtworkOwned::<T>::try_mutate(&who, |ipfs_cid_vec| {
				ipfs_cid_vec.retain(|x| *x != ipfs_cid);
				Ok(())
			})
			.map_err(|()| Error::<T>::NoArtwork)?;

			// Write updates to storage
			CountForArtworks::<T>::put(new_count);
			ArtworksOnSale::<T>::remove(&ipfs_cid);
			ArtworksOnLoan::<T>::remove(&ipfs_cid);

			// Deposit a "DestroyArtwork" event.
			Self::deposit_event(Event::DestroyArtwork { owner: who, ipfs_cid });

			Ok(())
		}

		// Fetch coin price info by ocw
		fn fetch_coin_price_info() -> Result<CoinPriceInfo, http::Error> {
			// prepare for send request
			let deadline = sp_io::offchain::timestamp().add(Duration::from_millis(1_000));
			// TODO btc for now and our currency later
			let request =
				http::Request::get("https://data.binance.com/api/v3/avgPrice?symbol=BTCUSDT");
			let pending = request
				.add_header("User-Agent", "Substrate-Offchain-Worker")
				.deadline(deadline)
				.send()
				.map_err(|_| http::Error::IoError)?;
			let response =
				pending.try_wait(deadline).map_err(|_| http::Error::DeadlineReached)??;
			if response.code != 200 {
				log::warn!("Unexpected status code: {}", response.code);
				return Err(http::Error::Unknown)
			}
			let body = response.body().collect::<Vec<u8>>();
			let body_str = sp_std::str::from_utf8(&body).map_err(|_| {
				log::warn!("No UTF8 body");
				http::Error::Unknown
			})?;

			// parse the response str
			let coin_price: CoinPriceInfo =
				serde_json::from_str(body_str).map_err(|_| http::Error::Unknown)?;

			Ok(coin_price)
		}

		// Fetch the artwork price to create an artwork or destroy an artwork.
		fn pledge_artwork_price() -> BalanceOf<T> {
			if let Some(coin) = RealTimeArtworkPrice::<T>::get() {
				coin
			} else {
				T::ArtworkPrice::get()
			}
		}
	}
}
