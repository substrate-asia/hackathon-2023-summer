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

pub mod model;
pub use model::{AiModel,AiPost};
pub use pallet::*;

use frame_support::{dispatch::DispatchResult,
					traits::{Currency,ExistenceRequirement},
					pallet_prelude::*,traits::{ReservableCurrency}};
use frame_system::pallet_prelude::*;
use sp_std::vec::Vec;
use sp_std::vec;
use frame_support::sp_runtime::traits::Convert;
use frame_support::traits::Time;


type BalanceOf<T> =
<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

#[frame_support::pallet]
pub mod pallet {

	use super::*;
	use frame_support::traits::Time;

	#[pallet::pallet]
	#[pallet::without_storage_info]
	pub struct Pallet<T>(_);

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
		/// Type representing the weight of this pallet
		type WeightInfo: WeightInfo;

		/// The currency trait.
		type Currency: ReservableCurrency<Self::AccountId>;

		/// digital transfer amount
		type NumberToBalance: Convert<u128, BalanceOf<Self>>;
		/// timestamp
		type Time: Time;
	}

	// The pallet's runtime storage items.
	// https://docs.substrate.io/main-docs/build/runtime-storage/
	#[pallet::storage]
	#[pallet::getter(fn something)]
	// Learn more about declaring storage items:
	// https://docs.substrate.io/main-docs/build/runtime-storage/#declaring-storage-items
	pub type Something<T> = StorageValue<_, u32>;


	//所有的模型 map
	#[pallet::storage]
	#[pallet::getter(fn ai_models)]
	pub(super) type AiModels<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		Vec<u8>,	// hash
		AiModel<T::BlockNumber, <<T as Config>::Time as Time>::Moment, T::AccountId>,	//model
		OptionQuery,
	>;

	//所有的模型的hash map
	#[pallet::storage]
	#[pallet::getter(fn ai_model_hash)]
	pub(super) type AiModelHash<T: Config> = StorageValue<_, Vec<Vec<u8>>>;

	// 个人用户下的模型列表
	#[pallet::storage]
	#[pallet::getter(fn user_models)]
	pub(super) type UserModels<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		T::AccountId,		//userAccountId
		Vec<Vec<u8>>,		// array model hash
		OptionQuery,
	>;

	// 模型下载的支付历史（谁支付过这个模型）
	#[pallet::storage]
	#[pallet::getter(fn model_paid)]
	pub(super) type ModelPaid<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		Vec<u8>,				// model hash
		Vec<T::AccountId>,		// accountId
		OptionQuery,
	>;

	// 个人购买过的模型）
	#[pallet::storage]
	#[pallet::getter(fn user_paid)]
	pub(super) type UserPaid<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		T::AccountId,		// model hash
		Vec<Vec<u8>>,		// accountId
		OptionQuery,
	>;

	// 所有的Post 列表
	#[pallet::storage]
	#[pallet::getter(fn ai_posts)]
	pub(super) type AiPosts<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		Vec<u8>,								// post uuid
		AiPost<T::BlockNumber, <<T as Config>::Time as Time>::Moment, T::AccountId>,	// model post
		OptionQuery,
	>;

	// Model Post(帖子） map
	#[pallet::storage]
	#[pallet::getter(fn model_post)]
	pub(super) type ModelPost<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		Vec<u8>,			// model hash
		Vec<Vec<u8>>,		// post uuid
		OptionQuery,
	>;

	// 用户 Post(帖子） map
	#[pallet::storage]
	#[pallet::getter(fn user_post)]
	pub(super) type UserPost<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		T::AccountId,		//userAccountId
		Vec<Vec<u8>>,		//post uuid
		OptionQuery,
	>;




	// Pallets use events to inform users when important changes are made.
	// https://docs.substrate.io/main-docs/build/events-errors/
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Event documentation should end with an array that provides descriptive names for event
		/// parameters. [something, who]
		SomethingStored { something: u32, who: T::AccountId },
		ModelCreated{hash: Vec<u8>, who: T::AccountId },
		PostCreated{uuid: Vec<u8>, who: T::AccountId },
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// Error names should be descriptive.
		NoneValue,
		/// Errors should have helpful documentation associated with them.
		StorageOverflow,
	}

	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// An example dispatchable that takes a singles value as a parameter, writes the value to
		/// storage and emits an event. This function must be dispatched by a signed extrinsic.
		#[pallet::call_index(0)]
		#[pallet::weight(T::WeightInfo::do_something())]
		pub fn do_something(origin: OriginFor<T>, something: u32) -> DispatchResult {
			// Check that the extrinsic was signed and get the signer.
			// This function will return an error if the extrinsic is not signed.
			// https://docs.substrate.io/main-docs/build/origins/
			let who = ensure_signed(origin)?;

			// Update storage.
			<Something<T>>::put(something);

			// Emit an event.
			Self::deposit_event(Event::SomethingStored { something, who });
			// Return a successful DispatchResultWithPostInfo
			Ok(())
		}

		/// An example dispatchable that may throw a custom error.
		#[pallet::call_index(1)]
		#[pallet::weight(T::WeightInfo::cause_error())]
		pub fn cause_error(origin: OriginFor<T>) -> DispatchResult {
			let _who = ensure_signed(origin)?;

			// Read a value from storage.
			match <Something<T>>::get() {
				// Return an error if the value has not been set.
				None => return Err(Error::<T>::NoneValue.into()),
				Some(old) => {
					// Increment the value read from storage; will error in the event of overflow.
					let new = old.checked_add(1).ok_or(Error::<T>::StorageOverflow)?;
					// Update the value in storage with the incremented result.
					<Something<T>>::put(new);
					Ok(())
				},
			}
		}


		/// 创建模型
		#[pallet::call_index(2)]
		#[pallet::weight(T::WeightInfo::do_something())]
		pub fn create_ai_model(origin: OriginFor<T>,
							   hash: Vec<u8>,
							   name: Vec<u8>,
							   filename: Vec<u8>,
							   link: Vec<u8>,
							   images: Vec<Vec<u8>>,
							   image_links: Vec<Vec<u8>>,
							   download_price: u128,
							   size: u128,
							   comment: Vec<u8>

		) -> DispatchResult {
			// Check that the extrinsic was signed and get the signer.
			// This function will return an error if the extrinsic is not signed.
			// https://docs.substrate.io/main-docs/build/origins/
			let who = ensure_signed(origin)?;

			let block_number = <frame_system::Pallet<T>>::block_number();
			let now_timestamp: <<T as Config>::Time as Time>::Moment = T::Time::now();

			ensure!(!AiModels::<T>::contains_key(hash.clone()),Error::<T>::StorageOverflow);

			let ai_model= AiModel::new(
				hash.clone(),
				name,
				filename,
				link,
				images,
				image_links,
				download_price,
				size,
				comment,
				who.clone(),
				block_number,
				now_timestamp
			);
			AiModels::<T>::insert(hash.clone(),ai_model);

			Self::do_insert_user_model(who.clone(),hash.clone());
			Self::do_insert_ai_model_hash(hash.clone());
			Self::do_insert_user_paid(hash.clone(),who.clone());

			Self::deposit_event(Event::ModelCreated { hash, who });

			// Return a successful DispatchResultWithPostInfo
			Ok(())
		}

		/// 创建模型下的（post）
		#[pallet::call_index(3)]
		#[pallet::weight(T::WeightInfo::do_something())]
		pub fn create_ai_image(
			origin: OriginFor<T>,
			model_hash: Vec<u8>,
			uuid: Vec<u8>,
			name: Vec<u8>,
			images: Vec<Vec<u8>>,
			image_links: Vec<Vec<u8>>,
			comment: Vec<u8>
		) -> DispatchResult{
			// Check that the extrinsic was signed and get the signer.
			// This function will return an error if the extrinsic is not signed.
			// https://docs.substrate.io/main-docs/build/origins/
			let who = ensure_signed(origin)?;

			let block_number = <frame_system::Pallet<T>>::block_number();
			let now_timestamp: <<T as Config>::Time as Time>::Moment = T::Time::now();

			ensure!(!AiPosts::<T>::contains_key(uuid.clone()),Error::<T>::StorageOverflow);

			let ai_model_post = AiPost::new(
				model_hash.clone(),
				uuid.clone(),
				name,
				images,
				image_links,
				comment,
				who.clone(),
				block_number,
				now_timestamp
			);

			Self::do_insert_ai_post(uuid.clone(), ai_model_post);
			Self::do_insert_user_post(who.clone(), uuid.clone());
			Self::do_insert_model_post(model_hash.clone(), uuid.clone());

			Self::deposit_event(Event::PostCreated { uuid, who });

			// Return a successful DispatchResultWithPostInfo
			Ok(())
		}

		/// 购买模型
		#[pallet::call_index(4)]
		#[pallet::weight(T::WeightInfo::do_something())]
		pub fn buy_model(
			origin: OriginFor<T>,
			model_hash: Vec<u8>,
		)-> DispatchResult{
			let who = ensure_signed(origin)?;

			ensure!(AiModels::<T>::contains_key(model_hash.clone()),Error::<T>::StorageOverflow);

			let model = AiModels::<T>::get(model_hash.clone()).unwrap();

			T::Currency::transfer(
				&who,
				&model.account_id,
				T::NumberToBalance::convert(model.download_price),
				ExistenceRequirement::AllowDeath,
			)?;
			Self::do_insert_user_paid(model_hash,who);
			Ok(())
		}

	}


}

impl<T: Config> Pallet<T> {

	//sort 0倒序 1正序
	// pub fn page_user_order(account_id: T::AccountId, page: u64, size: u64, sort: u8) -> Page<T::BlockNumber, <<T as Config>::Time as Time>::Moment,T::AccountId, AiPost<T::BlockNumber, <<T as Config>::Time as Time>::Moment,T::AccountId>> {
	// 	let uuid_vec = UserPost::<T>::get(account_id.clone()).unwrap();
	// 	let total = uuid_vec.clone().len() as u64;
	// 	let page = if page == 0 { 1 } else { page };
	// 	let begin = if (page - 1) * size >= total && page >= 2 {
	// 		(page - 2) * size
	// 	} else if (page - 1) * size >= total && page < 2  {
	// 		0
	// 	} else {
	// 		(page - 1) * size
	// 	};
	// 	let end = if page * size > total{ total } else { page * size };
	// 	let post_list = Self::get_ai_post_list(uuid_vec.clone(), begin, end, sort);
	// 	Page::new(post_list, page, size, total)
	//
	// }
	//
	// pub fn get_ai_post_list(mut uuid_vec: Vec<Vec<u8>>, begin: u64, end: u64, sort: u8 ) -> Vec<AiPost<T::BlockNumber, <<T as Config>::Time as Time>::Moment,T::AccountId>> {
	// 	let mut post_vec = Vec::<AiPost<T::BlockNumber, <<T as Config>::Time as Time>::Moment,T::AccountId>>::new();
	// 	let mut reversed_uuid_vec: Vec<Vec<u8>>;
	// 	if sort == 1 {
	// 		reversed_uuid_vec = uuid_vec.iter().rev().cloned().collect();
	// 	} else {
	// 		reversed_uuid_vec = uuid_vec;
	// 	}
	// 	let begin = if begin == 0 { 0 } else { begin - 1 };
	// 	let uuids = reversed_uuid_vec.get(begin..end).unwrap();
	// 	for uuid in uuids.iter() {
	// 		let ai_post = AiPosts::<T>::get(uuid).unwrap();
	// 		post_vec.push(ai_post);
	// 	}
	// 	post_vec
	// }

	// associate user and order number
	pub fn do_insert_user_model(who: T::AccountId, hash: Vec<u8>) {
		let mut account_peer_map: Vec<Vec<u8>>;

		if UserModels::<T>::contains_key(who.clone()) {
			account_peer_map = UserModels::<T>::get(who.clone()).unwrap();
		} else {
			account_peer_map = Vec::new();
		}

		account_peer_map.push(hash.clone());
		let reversed_account_peer_map: Vec<Vec<u8>> = account_peer_map.iter().rev().cloned().collect();

		UserModels::<T>::insert(who.clone(), reversed_account_peer_map);
	}

	pub fn do_insert_ai_model_hash(hash: Vec<u8>) {
		AiModelHash::<T>::mutate(|ai_model_hash| {
			if let Some(data) = ai_model_hash {
				data.insert(0, hash);
			} else {
				*ai_model_hash = Some(vec![hash]);
			}
		});
	}

	pub fn do_insert_ai_post(post_uuid: Vec<u8>, ai_post: AiPost<T::BlockNumber, <<T as Config>::Time as Time>::Moment,T::AccountId>) {
		AiPosts::<T>::insert(&post_uuid, &ai_post);
	}

	pub fn do_insert_user_post(who: T::AccountId, uuid: Vec<u8>) {
		let mut uuid_vec: Vec<Vec<u8>>;

		if UserPost::<T>::contains_key(who.clone()) {
			uuid_vec = UserPost::<T>::get(who.clone()).unwrap();
		} else {
			uuid_vec = Vec::new();
		}
		uuid_vec.push(uuid.clone());
		let reversed_uuid_vec: Vec<Vec<u8>> = uuid_vec.iter().rev().cloned().collect();

		UserPost::<T>::insert(who.clone(), reversed_uuid_vec);
	}

	pub fn do_insert_model_post(hash: Vec<u8>, uuid: Vec<u8>) {
		let mut uuid_vec: Vec<Vec<u8>>;

		if ModelPost::<T>::contains_key(hash.clone()) {
			uuid_vec = ModelPost::<T>::get(hash.clone()).unwrap();
		} else {
			uuid_vec = Vec::new();
		}
		uuid_vec.push(uuid.clone());
		let reversed_uuid_vec: Vec<Vec<u8>> = uuid_vec.iter().rev().cloned().collect();

		ModelPost::<T>::insert(hash.clone(), reversed_uuid_vec);
	}

	pub fn do_insert_user_paid(hash: Vec<u8>, who: T::AccountId) {
		let mut paid_map: Vec<T::AccountId>;

		if ModelPaid::<T>::contains_key(hash.clone()) {
			paid_map = ModelPaid::<T>::get(hash.clone()).unwrap();
		} else {
			paid_map = Vec::new();
		}

		if let Err(index) = paid_map.binary_search(&who) {
			paid_map.insert(index, who.clone());
		}

		ModelPaid::<T>::insert(hash.clone(), paid_map);


		let mut user_map: Vec<Vec<u8>>;

		if UserPaid::<T>::contains_key(who.clone()) {
			user_map = UserPaid::<T>::get(who.clone()).unwrap();
		} else {
			user_map = Vec::new();
		}

		user_map.push(hash.clone());
		let reversed_user_map: Vec<Vec<u8>> = user_map.iter().rev().cloned().collect();

		UserPaid::<T>::insert(who,reversed_user_map);
	}

}


