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

//! Benchmarking setup for pallet-task

use super::*;

#[allow(unused)]
use crate::{
	Pallet as PalletTask,
	Config as ConfigTask,
};
use frame_benchmarking::{account, benchmarks, impl_benchmark_test_suite, whitelisted_caller, vec, Vec};
use frame_system::{RawOrigin};
use frame_support::{
	traits::{Currency, Get},
	BoundedVec,

};
use sp_core::crypto::UncheckedFrom;
use pallet_profile::Pallet as PalletProfile;
use pallet_dao::{
	Pallet as PalletDao,
	BoundedNameOf,
	BoundedDescriptionOf,
	BoundedVisionOf
};
use sp_std::convert::TryInto;

const SEED: u32 = 0;

// Helper function to assert event thrown during verification
fn assert_last_event<T: Config>(generic_event: <T as Config>::Event) {
	frame_system::Pallet::<T>::assert_last_event(generic_event.into());
}


// Helper function to create a profile
fn create_profile<T: Config>()
where T: pallet_profile::Config 
{

	let username = Vec::new();
	let interests = Vec::new();
	let information = Vec::new();
	let available_hours_per_week = 40_u8;
	let x_coord = Some([8u8; 5]);
	let y_coord = Some([8u8; 5]);

	let caller: T::AccountId = whitelisted_caller();
	let _profile = PalletProfile::<T>::create_profile(
		RawOrigin::Signed(caller).into(), username.try_into().unwrap(),
		interests.try_into().unwrap(), available_hours_per_week, Some(information.try_into().unwrap()), x_coord, y_coord
	);

}

// Helper to create organisation, returns OrganizationID
fn create_organisation<T: Config>() -> T::Hash 
where 
	T: pallet_dao::Config,
	T::AccountId: UncheckedFrom<T::Hash>
 {
	let vision: BoundedVisionOf<T> = 
		vec![2u8; (<T as pallet_dao::Config>::MaxVisionLen::get() - 1) as usize]
		.try_into()
		.unwrap(); 
		
	let name: BoundedNameOf<T> =
		vec![0u8; (<T as pallet_dao::Config>::MaxNameLen::get() - 1) as usize]
		.try_into()
		.unwrap();
		
	let description: BoundedDescriptionOf<T> = 
		vec![1u8; (<T as pallet_dao::Config>::MaxDescriptionLen::get() - 1) as usize]
		.try_into()
		.unwrap();

	let _ = PalletDao::<T>::create_organization(RawOrigin::Signed(whitelisted_caller()).into(), name, description, vision);
	PalletDao::<T>::member_of(whitelisted_caller::<T::AccountId>())[0]
}


benchmarks! {
	create_task {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for specification
		let x in 1 .. 2000;
		let title = vec![0u8, s as u8];
		let specification = vec![0u8, s as u8];
		let attachments = vec![0u8, s as u8];
		let keywords = vec![0u8, s as u8];
		let x_coord = Some([8u8; 5]);
		let y_coord = Some([8u8; 5]);


		let budget = <T as pallet::Config>::Currency::total_balance(&caller);

		// Create profile before creating a task
		create_profile::<T>();

	}:
	/* the code to be benchmarked */
	create_task(
		RawOrigin::Signed(caller.clone()), title.try_into().unwrap(),
		specification.try_into().unwrap(), budget, x.into(), attachments.try_into().unwrap(),
		keywords.try_into().unwrap(), None, x_coord, y_coord)

	verify {
		/* verifying final state */
		let caller: T::AccountId = whitelisted_caller();
		let task_id = PalletTask::<T>::tasks_owned(&caller)[0];

		assert_last_event::<T>(Event::<T>::TaskCreated(caller, task_id).into());
	}

	update_task {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for specification
		let x in 1 .. 2000;
		let title = vec![0u8, s as u8];
		
		let specification = vec![0u8, s as u8];
		let budget = <T as pallet::Config>::Currency::total_balance(&caller);
		let attachments = vec![0u8, s as u8];
		let keywords = vec![0u8, s as u8];
		let x_coord = Some([8u8; 5]);
		let y_coord = Some([8u8; 5]);
		
		// Create profile before creating a task
		create_profile::<T>();
		let _ = PalletTask::<T>::create_task(
			RawOrigin::Signed(caller.clone()).into(), title.clone().try_into().unwrap(), specification.clone().try_into().unwrap(), budget,
		 	x.into(), attachments.clone().try_into().unwrap(), keywords.clone().try_into().unwrap(), None, x_coord.clone(), y_coord.clone());
		let hash_task = PalletTask::<T>::tasks_owned(&caller)[0];

	}:
	/* the code to be benchmarked */
	update_task(
		RawOrigin::Signed(caller.clone()), hash_task, title.try_into().unwrap(),
		specification.try_into().unwrap(), budget, x.into(), attachments.try_into().unwrap(),
		keywords.try_into().unwrap(), None, x_coord, y_coord)

	verify {
		/* verifying final state */
		let caller: T::AccountId = whitelisted_caller();
		let hash = PalletTask::<T>::tasks_owned(&caller)[0];

		assert_last_event::<T>(Event::<T>::TaskUpdated(caller, hash).into());
	}

	start_task {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();
		let volunteer: T::AccountId = account("volunteer", 0, SEED);

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for specification
		let x in 1 .. 2000;
		let title = vec![0u8, s as u8];
		let specification = vec![0u8, s as u8];
		let budget = <T as pallet::Config>::Currency::total_balance(&caller);
		let attachments = vec![0u8, s as u8];
		let keywords = vec![0u8, s as u8];
		let x_coord = Some([8u8; 5]);
		let y_coord = Some([8u8; 5]);


		// Create profile before creating a task
		create_profile::<T>();
		let _ = PalletTask::<T>::create_task(
			RawOrigin::Signed(caller.clone()).into(), title.clone().try_into().unwrap(), specification.clone().try_into().unwrap(), budget,
		 	x.into(), attachments.clone().try_into().unwrap(), keywords.clone().try_into().unwrap(), None, x_coord, y_coord);
		let hash_task = PalletTask::<T>::tasks_owned(&caller)[0];

	}: start_task(RawOrigin::Signed(volunteer.clone()), hash_task)
		/* the code to be benchmarked */

	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::TaskAssigned(volunteer, hash_task).into());
	}

	remove_task {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();
		let volunteer: T::AccountId = account("volunteer", 0, SEED);

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for specification
		let x in 1 .. 2000;
		let title = vec![0u8, s as u8];
		let specification = vec![0u8, s as u8];
		let budget = <T as pallet::Config>::Currency::total_balance(&caller);
		let attachments = vec![0u8, s as u8];
		let keywords = vec![0u8, s as u8];
		let x_coord = Some([8u8; 5]);
		let y_coord = Some([8u8; 5]);


		// Create profile before creating a task
		create_profile::<T>();
		let _ = PalletTask::<T>::create_task(
			RawOrigin::Signed(caller.clone()).into(), title.clone().try_into().unwrap(), specification.clone().try_into().unwrap(), budget,
		 	x.into(), attachments.clone().try_into().unwrap(), keywords.clone().try_into().unwrap(), None, x_coord, y_coord);
		let hash_task = PalletTask::<T>::tasks_owned(&caller)[0];

	}: remove_task(RawOrigin::Signed(caller.clone()), hash_task)
		/* the code to be benchmarked */

	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::TaskRemoved(caller, hash_task).into());
	}

	complete_task {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();
		let volunteer: T::AccountId = account("volunteer", 0, SEED);

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for specification
		let x in 1 .. 2000;
		let title = vec![0u8, s as u8];
		let specification = vec![0u8, s as u8];
		let budget = <T as pallet::Config>::Currency::total_balance(&caller);
		let attachments = vec![0u8, s as u8];
		let keywords = vec![0u8, s as u8];
		let x_coord = Some([8u8; 5]);
		let y_coord = Some([8u8; 5]);


		// Create profile before creating a task
		create_profile::<T>();
		let _ = PalletTask::<T>::create_task(
			RawOrigin::Signed(caller.clone()).into(), title.clone().try_into().unwrap(), specification.clone().try_into().unwrap(), budget,
		 	x.into(), attachments.clone().try_into().unwrap(), keywords.clone().try_into().unwrap(), None, x_coord, y_coord);
		let hash_task = PalletTask::<T>::tasks_owned(&caller)[0];
		let _ = PalletTask::<T>::start_task(RawOrigin::Signed(volunteer.clone()).into(), hash_task);

	}: complete_task(RawOrigin::Signed(volunteer.clone()), hash_task)
		/* the code to be benchmarked */

	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::TaskCompleted(volunteer, hash_task).into());
	}

	accept_task {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();
		let volunteer: T::AccountId = whitelisted_caller();

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for specification
		let x in 1 .. 4000;
		let title = vec![0u8, s as u8];
		let specification = vec![0u8, s as u8];
		let budget = <T as pallet::Config>::Currency::total_balance(&caller);
		let attachments = vec![0u8, s as u8];
		let keywords = vec![0u8, s as u8];
		let x_coord = Some([8u8; 5]);
		let y_coord = Some([8u8; 5]);

		// Create profile before creating a task
		create_profile::<T>();
		let _ = PalletTask::<T>::create_task(
			RawOrigin::Signed(caller.clone()).into(), title.clone().try_into().unwrap(), specification.clone().try_into().unwrap(), budget,
		 	x.into(), attachments.clone().try_into().unwrap(), keywords.clone().try_into().unwrap(), None, x_coord, y_coord);
		let hash_task = PalletTask::<T>::tasks_owned(&caller)[0];
		let _ = PalletTask::<T>::start_task(RawOrigin::Signed(volunteer.clone()).into(), hash_task);
		let _ = PalletTask::<T>::complete_task(RawOrigin::Signed(volunteer).into(), hash_task);

	}: accept_task(RawOrigin::Signed(caller.clone()), hash_task)
		/* the code to be benchmarked */

	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::TaskAccepted(caller, hash_task).into());
	}

	reject_task {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();
		let volunteer: T::AccountId = account("volunteer", 0, SEED);

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for specification
		let x in 1 .. 4000;
		let title = vec![0u8, s as u8];
		let specification = vec![0u8, s as u8];
		let feedback = vec![0u8, s as u8];
		let budget = <T as pallet::Config>::Currency::total_balance(&caller);
		let attachments = vec![0u8, s as u8];
		let keywords = vec![0u8, s as u8];
		let feedback = vec![0u8, s as u8];
		let x_coord = Some([8u8; 5]);
		let y_coord = Some([8u8; 5]);

		// Create profile before creating a task
		create_profile::<T>();
		let _ = PalletTask::<T>::create_task(
			RawOrigin::Signed(caller.clone()).into(), title.clone().try_into().unwrap(), specification.clone().try_into().unwrap(), budget,
		 	x.into(), attachments.clone().try_into().unwrap(), keywords.clone().try_into().unwrap(), None, x_coord, y_coord);
		let hash_task = PalletTask::<T>::tasks_owned(&caller)[0];
		let _ = PalletTask::<T>::start_task(RawOrigin::Signed(volunteer.clone()).into(), hash_task);
		let _ = PalletTask::<T>::complete_task(RawOrigin::Signed(volunteer).into(), hash_task);

	}: reject_task(RawOrigin::Signed(caller.clone()), hash_task, feedback.try_into().unwrap())
		/* the code to be benchmarked */

	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::TaskRejected(caller, hash_task).into());
	}

	revive_task {
		/* setup initial state */
		let caller: T::AccountId = whitelisted_caller();
		let volunteer: T::AccountId = account("volunteer", 0, SEED);

		// Populate data fields
		let s in 1 .. u8::MAX.into(); // max bytes for specification
		let x in 1 .. 4000;
		let title = vec![0u8, s as u8];
		let specification = vec![0u8, s as u8];
		let feedback = vec![0u8, s as u8];
		let budget = <T as pallet::Config>::Currency::total_balance(&caller);
		let attachments = vec![0u8, s as u8];
		let keywords = vec![0u8, s as u8];
		let feedback = vec![0u8, s as u8];
		let x_coord = Some([8u8; 5]);
		let y_coord = Some([8u8; 5]);

		
	// Create profile before creating a task
	create_profile::<T>();

	let _ = PalletTask::<T>::create_task(
		RawOrigin::Signed(caller.clone()).into(), title.clone().try_into().unwrap(), specification.clone().try_into().unwrap(), budget,
		 x.into(), attachments.clone().try_into().unwrap(), keywords.clone().try_into().unwrap(), None, x_coord, y_coord);
 	
	let hash_task = PalletTask::<T>::tasks_owned(&caller)[0];
	let mut task = Tasks::<T>::get(hash_task).unwrap();
	task.status = TaskStatus::Expired;
	Tasks::<T>::insert(&hash_task, &task);
	// Swap these around so that revive works
	ExpiringTasksPerBlock::<T>::take(task.deadline_block.unwrap());

	let dying_deadline_block = task.deadline_block.unwrap() + <T as ConfigTask>::TaskLongevityAfterExpiration::get();
	let dying_tasks: BoundedVec<T::Hash, MaximumTasksPerBlock> = vec![hash_task].try_into().unwrap();

	DyingTasksPerBlock::<T>::insert(dying_deadline_block, dying_tasks);
	
	}: 	revive_expired_task(RawOrigin::Signed(caller.clone()), hash_task, x.into())
		/* the code to be benchmarked */

	verify {
		/* verifying final state */
		assert_last_event::<T>(Event::<T>::TaskRevived(caller.clone(), hash_task).into());
	}
}

impl_benchmark_test_suite!(PalletTask, crate::mock::new_test_ext(), crate::mock::Test,);
