// This file is part of Substrate.

// Copyright UNIVERSALDOT FOUNDATION
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

//! Benchmarking setup for pallet-profile

use super::*;

#[allow(unused)]
use crate::Pallet as PalletProfile;
use frame_benchmarking::{benchmarks, impl_benchmark_test_suite, whitelisted_caller, vec};
use frame_system::RawOrigin;
use sp_std::convert::TryInto;

use frame_support::{
	traits::{Currency},
	sp_runtime::traits::Hash
};

// Helper function to assert event thrown during verification
fn assert_last_event<T: Config>(generic_event: <T as Config>::Event) {
	frame_system::Pallet::<T>::assert_last_event(generic_event.into());
}


// This creates an `Profile` object.
fn create_profile_info<T: Config>(_num_fields: u32) -> Profile<T> {

	let s: u8 = u8::MAX;
	let interests = vec![0u8, s as u8];
	let username = vec![0u8, s as u8];
	let available_hours_per_week = 40_u8;

	let caller: T::AccountId = whitelisted_caller();
	let balance = T::Currency::free_balance(&caller);

	Profile {
		profile_id: T::Hashing::hash_of(b"hello world! i love beans"),
		owner: caller,
		name: username.try_into().unwrap(),
		interests: interests.try_into().unwrap(),
		reputation: u32::MAX,
		available_hours_per_week,
		additional_information: None,
		location: None,
	}
}


benchmarks! {
	create_profile {
		/* setup initial state */

		let caller: T::AccountId = whitelisted_caller();

		// Populate data fields
		let x in 1 .. 100;  // # of profiles
		let s in 1 .. u8::MAX.into(); // max bytes for interests
		let interests = vec![0u8, s as u8];
		let username = vec![0u8, s as u8];
		let additional_information = vec![0_u8; 5000];
		let available_hours_per_week = 40_u8;
		let x_coord = [8u8; 5];
		let y_coord = [8u8; 5];

	}: create_profile(RawOrigin::Signed(caller), username.try_into().unwrap(),
	interests.try_into().unwrap(), available_hours_per_week, Some(additional_information.try_into().unwrap()), Some(x_coord), Some(y_coord))

	verify {
		/* verifying final state */
		let caller: T::AccountId = whitelisted_caller();
		assert_last_event::<T>(Event::<T>::ProfileCreated { who: caller }.into());
	}

	update_profile {
		/* setup initial state */
		let create_account_caller: T::AccountId = whitelisted_caller();
		let update_account_caller: T::AccountId = whitelisted_caller();

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for interests
		let interests = vec![0u8, s as u8];
		let username = vec![0u8, s as u8];
		let available_hours_per_week = 40_u8;
		let additional_information = vec![0_u8; 5000];
		let x_coord = [8u8; 5];
		let y_coord = [8u8; 5];


		// before we update profile, profile must be created
		let _ = PalletProfile::<T>::create_profile(RawOrigin::Signed(create_account_caller).into(), username.clone().try_into().unwrap(), interests.clone().try_into().unwrap(), 
			available_hours_per_week, Some(additional_information.clone().try_into().unwrap()), Some(x_coord), Some(y_coord));

	}: update_profile(RawOrigin::Signed(update_account_caller), username.try_into().unwrap(), interests.try_into().unwrap(), available_hours_per_week, Some(additional_information.try_into().unwrap()), Some(x_coord), Some(y_coord))

	verify {
		/* verifying final state */
		let caller: T::AccountId = whitelisted_caller();
		assert_last_event::<T>(Event::<T>::ProfileUpdated { who: caller }.into());
	}

	remove_profile {
		/* setup initial state */
		let create_account_caller: T::AccountId = whitelisted_caller();
		let delete_account_caller: T::AccountId = whitelisted_caller();

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for interests
		let interests = vec![0u8, s as u8];
		let username = vec![0u8, s as u8];
		let available_hours_per_week = 40_u8;
		let additional_information = vec![0_u8; 5000];
		let x_coord = [8u8; 5];
		let y_coord = [8u8; 5];


		// before we delete profile, profile must be created
		let _ = PalletProfile::<T>::create_profile(RawOrigin::Signed(create_account_caller).into(), username.try_into().unwrap(), interests.try_into().unwrap(), 
			available_hours_per_week, Some(additional_information.try_into().unwrap()), Some(x_coord), Some(y_coord));

	}: remove_profile(RawOrigin::Signed(delete_account_caller))

	verify {
		/* verifying final state */
		let caller: T::AccountId = whitelisted_caller();
		assert_last_event::<T>(Event::<T>::ProfileDeleted { who: caller }.into());
	}
}

impl_benchmark_test_suite!(PalletProfile, crate::mock::new_test_ext(), crate::mock::Test,);
