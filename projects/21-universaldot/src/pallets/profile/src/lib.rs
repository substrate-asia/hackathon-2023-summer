// This file is part of Substrate.

// Copyright (C) 2022 UNIVERSALDOT FOUNDATION.
// SPDX-License-Identifier: Apache-2.0

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// 	http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


//! # Profile Pallet
//!
//! ## Version: 0.7.0
//!
//! - [`Config`]
//! - [`Pallet`]
//!
//! ## Overview
//!
//! The Profile Pallet creates a user profile per AccountID.
//! The Profile is used to enrich the AccountID information with user specific
//! metadata such as personal interests, name, reputation, etc.
//!
//! ## Interface
//!
//! ### Public Functions
//!
//! - `create_profile` - Function used to create a new user profile.
//!     Requirements:
//!     1. Each account can create a single Profile.
//!     2. Profiles are mandatory for creating Tasks.
//!     Inputs:
//!         - username: BoundedVec,
//!         - interests: BoundedVec,
//!         - available_hours_per_week: u8,
//!         - additional_information
//!			- x: Option<[u8; 5]>: The NAD system x coord
//!			- y: Option<[u8; 5]>: The NAD system y coord
//!
//! - `update_profile` - Function used to update an already existing user profile.
//!     Inputs:
//!         - username: BoundedVec,
//!         - interests: BoundedVec,
//!         - available_hours_per_week: u8,
//!         - additional_information
//!			- x: Option<[u8; 5]>: The NAD system x coord
//!			- y: Option<[u8; 5]>: The NAD system y coord

//!
//! - `remove_profile` - Function used to delete an existing user profile.
//!     Inputs:
//!         No Inputs
//!
//! Storage Items:
//!     Profiles: Stores profile Information
//!     ProfileCount: Counts the total number of Profiles
//!     CompletedTasks: Stores the completed Tasks history for a Profile
//!
//! ## Related Modules
//!


#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::{dispatch::DispatchResult, storage::bounded_vec::BoundedVec, pallet_prelude::*};
	use frame_system::pallet_prelude::*;
	use frame_support::sp_runtime::traits::Hash;
	use frame_support::traits::Currency;
	use scale_info::TypeInfo;
	use crate::weights::WeightInfo;


	// Account, Balance are used in Profile Struct
	type AccountOf<T> = <T as frame_system::Config>::AccountId;
	type NadLocation = ([u8; 5], [u8; 5]);

	// Struct for holding Profile information.
	#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct Profile<T: Config> {
		pub owner: AccountOf<T>,
		pub name: BoundedVec<u8, T::MaxUsernameLen>,
		pub interests: BoundedVec<u8, T::MaxInterestsLen>,
		pub reputation: u32,
		pub available_hours_per_week: u8,
		pub additional_information: Option<BoundedVec<u8, T::MaxAdditionalInformationLen>>,
		/// Longitude, Latitude 
		pub location: Option<NadLocation>,
		pub profile_id: T::Hash,
	}

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;

		/// The Currency handler for the Profile pallet.
		type Currency: Currency<Self::AccountId>;

		/// WeightInfo provider.
		type WeightInfo: WeightInfo;

		/// A bound on name field of Profile struct.
		#[pallet::constant]
		type MaxUsernameLen: Get<u32> + MaxEncodedLen + TypeInfo;

		/// A bound on interests field of Profile struct.
		#[pallet::constant]
		type MaxInterestsLen: Get<u32> + MaxEncodedLen + TypeInfo;

		/// A bound on additional information for Profile struct.
		#[pallet::constant]
		type MaxAdditionalInformationLen: Get<u32> + MaxEncodedLen + TypeInfo;

		/// A bound on number of completed tasks for Profile.
		#[pallet::constant]
		type MaxCompletedTasksLen: Get<u32> + MaxEncodedLen + TypeInfo;
	}

	#[pallet::pallet]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);

	#[pallet::storage]
	#[pallet::getter(fn profile_count)]
	/// Storage Value that counts the total number of Profiles
	pub(super) type ProfileCount<T: Config> = StorageValue<_, u32, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn profiles)]
	/// Stores a Profile unique properties in a StorageMap.
	pub(super) type Profiles<T: Config> = StorageMap<_, Twox64Concat, T::AccountId, Profile<T>>;

	#[pallet::storage]
	#[pallet::getter(fn completed_tasks)]
	/// Stores list of completed tasks for a profile.
	pub(super) type CompletedTasks<T: Config> = StorageMap<_, Twox64Concat, T::AccountId, BoundedVec<T::Hash, T::MaxCompletedTasksLen> >;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Profile was successfully created.
		ProfileCreated { who: T::AccountId },

		/// Profile was successfully deleted.
		ProfileDeleted { who: T::AccountId },

		/// Profile was successfully updated.
		ProfileUpdated { who: T::AccountId },

		/// A task completed by profile
		TaskCompletedByProfile { who: T::AccountId, task: T::Hash },

		/// A task archived from completed tasks storage.
		TaskArchivedFromProfileStorage { who: T::AccountId, task: T::Hash }
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// Reached maximum number of profiles.
		ProfileCountOverflow,
		/// One Account can only create a single profile.
		ProfileAlreadyCreated,
		/// This Account has not yet created a profile.
		NoProfileCreated,
		/// Completed task storage reached its bound.
		CompletedTasksStorageFull,
	}

	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
	#[pallet::call]
	impl<T: Config> Pallet<T> {

		/// Dispatchable call that enables every new actor to create personal profile in storage.
		#[pallet::weight(<T as Config>::WeightInfo::create_profile(0,0))]
		pub fn create_profile(origin: OriginFor<T>, username: BoundedVec<u8, T::MaxUsernameLen>, interests: BoundedVec<u8, T::MaxInterestsLen>, available_hours_per_week: u8,
			additional_information : Option<BoundedVec<u8, T::MaxAdditionalInformationLen>>, x: Option<[u8; 5]>, y: Option<[u8; 5]>) -> DispatchResult {

			// Check that the extrinsic was signed and get the signer.
			let account = ensure_signed(origin)?;

			// Call helper function to generate Profile Struct
			let _profile_id = Self::generate_profile(&account, username, interests,
				 available_hours_per_week, additional_information, x, y)?;

			// Emit an event.
			Self::deposit_event(Event::ProfileCreated{ who:account });

			Ok(())
		}

		/// Dispatchable call that ensures user can update existing personal profile in storage.
		#[pallet::weight(<T as Config>::WeightInfo::update_profile(0))]
		pub fn update_profile(origin: OriginFor<T>, username: BoundedVec<u8, T::MaxUsernameLen>, interests: BoundedVec<u8, T::MaxInterestsLen>, available_hours_per_week: u8,
			additional_information : Option<BoundedVec<u8, T::MaxAdditionalInformationLen>>, x: Option<[u8; 5]>, y: Option<[u8; 5]>) -> DispatchResult {

			// Check that the extrinsic was signed and get the signer.
			let account = ensure_signed(origin)?;

			// Since Each account can have one profile, we call into generate profile again
			let _profile_id = Self::change_profile(&account, username, interests,
				available_hours_per_week, additional_information, x, y)?;

			// Emit an event.
			Self::deposit_event(Event::ProfileUpdated{ who: account });

			Ok(())
		}

		/// Dispatchable call that enables every new actor to delete profile from storage.
		#[pallet::weight(<T as Config>::WeightInfo::remove_profile(0))]
		pub fn remove_profile(origin: OriginFor<T>) -> DispatchResult {

			// Check that the extrinsic was signed and get the signer.
			let account = ensure_signed(origin)?;

			// Call helper function to delete profile
			Self::delete_profile(&account)?;

			// Emit an event.
			Self::deposit_event(Event::ProfileDeleted{ who : account});

			Ok(())
		}
	}

	// ** Helper internal functions ** //
	impl<T:Config> Pallet<T> {
		// Generates initial Profile.
		pub fn generate_profile(
			owner: &T::AccountId, name: BoundedVec<u8, T::MaxUsernameLen>, interests: BoundedVec<u8, T::MaxInterestsLen>, available_hours_per_week: u8,
			additional_information: Option<BoundedVec<u8, T::MaxAdditionalInformationLen>>,
			x: Option<[u8; 5]>, y: Option<[u8; 5]>) 
			-> Result<T::Hash, DispatchError> {

			// Check if profile already exists for owner
			ensure!(!Profiles::<T>::contains_key(&owner), Error::<T>::ProfileAlreadyCreated);

			let mut location: Option<NadLocation> = None;
			if x.is_some() && y.is_some() {
				location = Some((y.unwrap(), x.unwrap()));
			}			

			// Populate Profile struct
			let mut profile = Profile::<T> {
				owner: owner.clone(),
				name,
				interests,
				reputation: 0,
				available_hours_per_week,
				additional_information,
				location,
				profile_id: T::Hashing::hash_of(&12345),
			};

			// Get hash of profile
			let profile_id: T::Hash = T::Hashing::hash_of(&profile);
			profile.profile_id = profile_id.clone();

			// Insert profile into HashMap
			<Profiles<T>>::insert(owner, profile);

			// Initialize completed tasks list with default value.
			<CompletedTasks<T>>::insert(owner, BoundedVec::default());

			// Increase profile count
			let new_count = Self::profile_count().checked_add(1).ok_or(<Error<T>>::ProfileCountOverflow)?;
			<ProfileCount<T>>::put(new_count);

			Ok(profile_id)
		}

		// Changes existing profile
		pub fn change_profile(
			owner: &T::AccountId, new_username: BoundedVec<u8, T::MaxUsernameLen>,
			new_interests: BoundedVec<u8, T::MaxInterestsLen>, new_available_hours_per_week: u8,
			new_additional_information: Option<BoundedVec<u8, T::MaxAdditionalInformationLen>>,
			x: Option<[u8; 5]>, y: Option<[u8; 5]>)
			-> Result<T::Hash, DispatchError> {

			// Ensure that only owner can update profile
			let mut profile = Self::profiles(owner).ok_or(<Error<T>>::NoProfileCreated)?;
			let profile_id = &profile.profile_id;
			
			profile.interests = new_interests;
			profile.name = new_username;
			profile.available_hours_per_week = new_available_hours_per_week;
			profile.additional_information = new_additional_information;

			let mut location: Option<NadLocation> = None;
			if x.is_some() && y.is_some() {
				location = Some((y.unwrap(), x.unwrap()));
			}

			profile.location = location;

			// Insert profile into HashMap
			<Profiles<T>>::insert(owner, &profile);

			// Return hash of profileID
			Ok(profile_id.clone())
		}

		// Public function that deletes a user profile
		pub fn delete_profile(owner: &T::AccountId) -> Result<(), DispatchError> {

			// Ensure that only creator of profile can delete it
			Self::profiles(owner).ok_or(<Error<T>>::NoProfileCreated)?;

			// Remove profile from storage
			<Profiles<T>>::remove(owner);

			// Reduce profile count
			let new_count = Self::profile_count().saturating_sub(1);
			<ProfileCount<T>>::put(new_count);

			Ok(())
		}

		// Public function that adds reputation to a profile
		pub fn add_reputation(owner: &T::AccountId) -> Result<(), DispatchError> {

			// Get current profile
			let mut profile = Self::profiles(owner).ok_or(<Error<T>>::NoProfileCreated)?;

			// Increase reputation
			profile.increase_reputation();

			// Insert into storage a new profile
			<Profiles<T>>::insert(owner, profile);

			Ok(())
		}

		// Public function that check if user has a profile
		pub fn has_profile(owner: &T::AccountId) -> Result<bool, DispatchError>  {

			// Check if an account has a profile
			Self::profiles(owner).ok_or(<Error<T>>::NoProfileCreated)?;

			Ok(true)
		}

		pub fn add_task_to_completed_tasks(owner: &T::AccountId, task: T::Hash) -> Result<(),
		DispatchError> {
			<CompletedTasks<T>>::mutate(owner, |completed_tasks| -> Result<(), DispatchError> {
				if let Some(ct) = completed_tasks {
					ct.try_push(task).map_err(|_|
						// TODO: Instead of throwing an error, we have to clear up older history.
						Error::<T>::CompletedTasksStorageFull.into())
				} else {
					Ok(())
				}
			})
		}

	}

	// Change the reputation on a Profile (TODO MVP2: Improve reputation functions)
	impl<T:Config> Profile<T> {
		pub fn increase_reputation(&mut self) {
			self.reputation += 1;
		}

		pub fn decrease_reputation(&mut self) {
			self.reputation -= 1;
		}
	}


}