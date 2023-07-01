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

//! Benchmarking setup for pallet-dao

use super::*;
#[allow(unused)]
use crate::Pallet as PalletDao;
use frame_benchmarking::{account, benchmarks, impl_benchmark_test_suite, whitelisted_caller, vec};
use frame_system::RawOrigin;
use frame_support::traits::Get;
use sp_core::crypto::UncheckedFrom;
const SEED: u32 = 1;

// Helper function to assert event thrown during verification
fn assert_last_event<T: Config>(generic_event: <T as Config>::Event) {
	frame_system::Pallet::<T>::assert_last_event(generic_event.into());
}

benchmarks! {
	where_clause { where
		T::AccountId: UncheckedFrom<T::Hash>,
	}
	sign_vision {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();
		
		let s in 1 .. u8::MAX.into();
		let name = vec![0u8, s as u8].try_into().unwrap();
		let description = vec![0u8, s as u8].try_into().unwrap();
		let vision = vec![0u8, s as u8].try_into().unwrap();

		let _org = PalletDao::<T>::create_organization(RawOrigin::Signed(caller.clone()).into(), name, description, vision);
		
		let org_id = PalletDao::<T>::member_of(&caller)[0];

	}: apply_to_organization(RawOrigin::Signed(caller.clone()), org_id)
	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::VisionSigned (caller, org_id).into());
	}

	unsign_vision {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();
		let s in 1 .. u8::MAX.into();
		let name = vec![0u8, s as u8].try_into().unwrap();
		let description = vec![0u8, s as u8].try_into().unwrap();
		let vision = vec![0u8, s as u8].try_into().unwrap();

		let _org = PalletDao::<T>::create_organization(RawOrigin::Signed(caller.clone()).into(), name, description, vision);
		
		let org_id = PalletDao::<T>::member_of(&caller)[0];
		
		// Create vision before removing
		let _ = PalletDao::<T>::apply_to_organization(RawOrigin::Signed(caller.clone()).into(), org_id);

	}: remove_application_from_organization(RawOrigin::Signed(caller.clone()), org_id)
	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::VisionUnsigned (caller, org_id).into());
	}

	create_organization {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();

		// These utilise the config of the pallet for worst case benchmark scenario
		// as using something less than max may be less costly than expected.
		// they dynamically change with the runtime logic.
		let vision: BoundedVisionOf<T> = 
		vec![2u8; (<T as pallet::Config>::MaxVisionLen::get() - 1) as usize]
		.try_into()
		.unwrap(); 
		
		let name: BoundedNameOf<T> =
		vec![0u8; (<T as pallet::Config>::MaxNameLen::get() - 1) as usize]
		.try_into()
		.unwrap();
		
		let description: BoundedDescriptionOf<T> = 
		vec![1u8; (<T as pallet::Config>::MaxDescriptionLen::get() - 1) as usize]
		.try_into()
		.unwrap();

	}: create_organization(RawOrigin::Signed(caller.clone()), name, description, vision)
	verify {
		// let hash = PalletDao::<T>::get_hash_for_dao(&caller, &name, &description, &vision, 1_u32.into(), 1_u32.into());
		let hash = PalletDao::<T>::member_of(&caller)[0];
		assert_last_event::<T>(Event::<T>::OrganizationCreated(caller, hash).into())
	}

	update_organization {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();
		
		let vision: BoundedVisionOf<T> = 
		vec![2u8; (<T as pallet::Config>::MaxVisionLen::get() - 1) as usize]
		.try_into()
		.unwrap(); 
		
		let name: BoundedNameOf<T> =
		vec![0u8; (<T as pallet::Config>::MaxNameLen::get() - 1) as usize]
		.try_into()
		.unwrap();
		
		let description: BoundedDescriptionOf<T> = 
		vec![1u8; (<T as pallet::Config>::MaxDescriptionLen::get() - 1) as usize]
		.try_into()
		.unwrap();
		
		let _org = PalletDao::<T>::create_organization(RawOrigin::Signed(caller.clone()).into(), name.clone(), description.clone(), vision.clone());
		let org_id = PalletDao::<T>::member_of(&caller)[0];

	}: update_organization(RawOrigin::Signed(caller.clone()), org_id, Some(name), Some(description), Some(vision))
	verify {
		let hash = PalletDao::<T>::member_of(&caller)[0];
		assert_last_event::<T>(Event::<T>::OrganizationUpdated(caller, hash).into())
	}

	transfer_ownership {
		/* setup initial state */
		let first_owner: T::AccountId = whitelisted_caller();
		let new_owner: T::AccountId = account("new owner", 0, SEED);
		
		let s in 1 .. u8::MAX.into();
		let name = vec![0u8, s as u8].try_into().unwrap();
		let description = vec![0u8, s as u8].try_into().unwrap();
		let vision = vec![0u8, s as u8].try_into().unwrap();

		let _ = PalletDao::<T>::create_organization(RawOrigin::Signed(first_owner.clone()).into(), name, description, vision);
		let org_id = PalletDao::<T>::member_of(&first_owner)[0];

	}: transfer_ownership(RawOrigin::Signed(first_owner.clone()), org_id, new_owner.clone())
	verify {
		let hash = PalletDao::<T>::member_of(&new_owner)[0];
		assert_last_event::<T>(Event::<T>::OrganizationOwnerChanged(first_owner.clone(), hash, new_owner).into())
	}

	dissolve_organization {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();

		let s in 1 .. u8::MAX.into();
		let name = vec![0u8, s as u8].try_into().unwrap();
		let description = vec![0u8, s as u8].try_into().unwrap();
		let vision = vec![0u8, s as u8].try_into().unwrap();

		// Create organization before dissolving it
		let _ = PalletDao::<T>::create_organization(RawOrigin::Signed(caller.clone()).into(), name, description, vision);
		// let org_id = PalletDao::<T>::get_hash_for_dao(&caller, &name, &description, &vision, 0_u32.into(), 0_u32.into());
		let org_id = PalletDao::<T>::member_of(&caller)[0];

	}: dissolve_organization(RawOrigin::Signed(caller.clone()), org_id)
		/* the code to be benchmarked */

	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::OrganizationDissolved(caller, org_id).into())
	}

	add_members {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();

		let s in 1 .. u8::MAX.into();
		let name = vec![0u8, s as u8].try_into().unwrap();
		let description = vec![0u8, s as u8].try_into().unwrap();
		let vision = vec![0u8, s as u8].try_into().unwrap();

		// Create account for member
		let account: T::AccountId = account("member", s, SEED);

		// Create organization before adding members to it
		let _ = PalletDao::<T>::create_organization(RawOrigin::Signed(caller.clone()).into(), name, description, vision);
		// let org_id = PalletDao::<T>::get_hash_for_dao(&caller, &name, &description, &vision, 0_u32.into(), 0_u32.into());
		let org_id = PalletDao::<T>::member_of(&caller)[0];

	}: add_members(RawOrigin::Signed(caller.clone()), org_id, account.clone())
		/* the code to be benchmarked */
	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::MemberAdded (caller, account, org_id).into());
	}

	remove_members {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();

		let s in 1 .. u8::MAX.into();
		let name = vec![0u8, s as u8].try_into().unwrap();
		let description = vec![0u8, s as u8].try_into().unwrap();
		let vision = vec![0u8, s as u8].try_into().unwrap();

		// Create account for member
		let u:u32 = 7;
		let account: T::AccountId = account("member", u, SEED);

		// Create organization before adding members to it
		let _ = PalletDao::<T>::create_organization(RawOrigin::Signed(caller.clone()).into(), name, description, vision);
		// let org_id = PalletDao::<T>::get_hash_for_dao(&caller, &name, &description, &vision, 0_u32.into(), 0_u32.into());
		let org_id = PalletDao::<T>::member_of(&caller)[0];
		let _ = PalletDao::<T>::add_members(RawOrigin::Signed(caller.clone()).into(), org_id, account.clone());
		assert_eq!(PalletDao::<T>::members(org_id).len(), 2);

	}: remove_members(RawOrigin::Signed(caller.clone()), org_id, account.clone() )
		/* the code to be benchmarked */
	verify {
		/* verifying final state */
		assert_eq!(PalletDao::<T>::members(org_id).len(), 1);
		assert_last_event::<T>(Event::<T>::MemberRemoved (caller, account, org_id).into());
	}
}

impl_benchmark_test_suite!(PalletDao, crate::mock::new_test_ext(), crate::mock::Test,);