// This file is part of Cybros.

// Copyright (C) Jun Jiang.
// SPDX-License-Identifier: GPL-3.0-or-later

// Cybros is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Cybros is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Cybros.  If not, see <http://www.gnu.org/licenses/>.

use crate::*;
use frame_support::pallet_prelude::*;
use sp_runtime::{
	traits::Zero,
	Saturating
};

impl<T: Config> Pallet<T> {
	pub(crate) fn do_create_job(
		pool_info: PoolInfo<T::PoolId, T::AccountId, BalanceOf<T>, ImplIdOf<T>>,
		policy_info: JobPolicy<T::PolicyId, T::BlockNumber>,
		job_id: T::JobId,
		beneficiary: T::AccountId,
		depositor: T::AccountId,
		impl_spec_version: ImplSpecVersion,
		auto_destroy_after_processed: bool,
		input_data: Option<BoundedVec<u8, T::InputLimit>>,
		now: u64,
		expires_in: Option<u64>,
	) -> DispatchResult {
		ensure!(
			impl_spec_version >= pool_info.min_impl_spec_version &&
			impl_spec_version <= pool_info.max_impl_spec_version,
			Error::<T>::UnsupportedImplSpecVersion
		);

		let expires_in = expires_in.unwrap_or(T::DefaultJobExpiresIn::get());
		ensure!(expires_in >= T::MinJobExpiresIn::get(), Error::<T>::ExpiresInTooSmall);
		ensure!(expires_in <= T::MaxJobExpiresIn::get(), Error::<T>::ExpiresInTooLarge);

		ensure!(!Jobs::<T>::contains_key(&pool_info.id, &job_id), Error::<T>::JobIdTaken);

		let input_deposit = T::DepositPerByte::get()
			.saturating_mul(((input_data.as_ref().map(|x| x.len()).unwrap_or_default()) as u32).into());
		let job_deposit = T::DepositPerJob::get();

		let total_deposit = input_deposit.saturating_add(job_deposit);
		T::Currency::reserve(&depositor, total_deposit)?;

		let expires_at = now + expires_in;
		let job = JobInfo::<T::JobId, T::PolicyId, T::AccountId, BalanceOf<T>> {
			id: job_id.clone(),
			policy_id: policy_info.id.clone(),
			depositor: depositor.clone(),
			deposit: job_deposit,
			beneficiary: beneficiary.clone(),
			impl_spec_version,
			auto_destroy_after_processed,
			status: JobStatus::Pending,
			result: None,
			expires_at,
			created_at: now,
			assignee: None,
			assigned_at: None,
			processing_at: None,
			ended_at: None,
		};
		Jobs::<T>::insert(&pool_info.id, &job_id, job);

		if let Some(input_data) = input_data.clone() {
			let input = ChainStoredData::<T::AccountId, BalanceOf<T>, T::InputLimit> {
				depositor: depositor.clone(),
				actual_deposit: input_deposit,
				surplus_deposit: Zero::zero(),
				data: input_data.clone(),
			};
			JobInputs::<T>::insert(&pool_info.id, &job_id, input);
		}

		let mut new_pool_info = pool_info.clone();
		new_pool_info.jobs_count += 1;
		Pools::<T>::insert(&pool_info.id, new_pool_info);

		let mut new_policy_info = policy_info.clone();
		new_policy_info.jobs_count += 1;
		JobPolicies::<T>::insert(&pool_info.id, &policy_info.id, new_policy_info);

		AssignableJobs::<T>::insert((pool_info.id.clone(), impl_spec_version.clone(), job_id.clone()), ());
		AccountBeneficialJobs::<T>::insert((beneficiary.clone(), pool_info.id.clone(), job_id.clone()), ());

		Self::deposit_event(Event::JobCreated {
			pool_id: pool_info.id,
			job_id,
			policy_id: policy_info.id,
			depositor,
			beneficiary,
			impl_spec_version,
			auto_destroy_after_processed,
			input: input_data,
			expires_in
		});
		Ok(())
	}

	pub(crate) fn do_destroy_job(
		who: T::AccountId,
		pool_id: T::PoolId,
		job_id: T::JobId,
		force: bool
	) -> DispatchResult {
		let job = Jobs::<T>::get(&pool_id, &job_id).ok_or(Error::<T>::JobNotFound)?;

		if !force {
			Self::ensure_job_beneficiary_or_depositor(&who, &job)?;
		}

		ensure!(
			match job.status {
				JobStatus::Pending | JobStatus::Processed | JobStatus::Discarded => true,
				_ => false
			},
			Error::<T>::JobIsProcessing
		);

		Self::do_actual_destroy_job(pool_id, job, who)
	}

	pub(crate) fn do_destroy_expired_job(
		pool_id: T::PoolId,
		job_id: T::JobId,
		destroyer: T::AccountId,
		now: u64
	) -> DispatchResult {
		let job = Jobs::<T>::get(&pool_id, &job_id).ok_or(Error::<T>::JobNotFound)?;
		Self::ensure_job_expired(&job, now)?;

		Self::do_actual_destroy_job(pool_id, job, destroyer)?;

		Ok(())
	}

	fn do_actual_destroy_job(
		pool_id: T::PoolId,
		job: JobInfo<T::JobId, T::PolicyId, T::AccountId, BalanceOf<T>>,
		destroyer: T::AccountId
	) -> DispatchResult {
		let job_id = job.id;

		T::Currency::unreserve(&job.depositor, job.deposit);
		if let Some(input_entry) = JobInputs::<T>::take(&pool_id, &job_id) {
			let deposit = input_entry.actual_deposit.saturating_add(input_entry.surplus_deposit);
			T::Currency::unreserve(&input_entry.depositor, deposit);
		}
		if let Some(output_entry) = JobOutputs::<T>::take(&pool_id, &job_id) {
			let deposit = output_entry.actual_deposit.saturating_add(output_entry.surplus_deposit);
			T::Currency::unreserve(&output_entry.depositor, deposit);
		}
		if let Some(proof_entry) = JobProofs::<T>::take(&pool_id, &job_id) {
			let deposit = proof_entry.actual_deposit.saturating_add(proof_entry.surplus_deposit);
			T::Currency::unreserve(&proof_entry.depositor, deposit);
		}

		Jobs::<T>::remove(&pool_id, &job_id);

		Pools::<T>::try_mutate_exists(&pool_id, |pool_info| -> Result<(), DispatchError> {
			let Some(pool_info) = pool_info else {
				return Err(Error::<T>::PoolNotFound.into())
			};

			pool_info.jobs_count -= 1;

			Ok(())
		})?;

		JobPolicies::<T>::try_mutate_exists(&pool_id, &job.policy_id, |policy_info| -> Result<(), DispatchError> {
			let Some(policy_info) = policy_info else {
				return Err(Error::<T>::PoolNotFound.into())
			};

			policy_info.jobs_count -= 1;

			Ok(())
		})?;

		if job.status == JobStatus::Pending {
			AssignableJobs::<T>::remove((pool_id.clone(), job.impl_spec_version.clone(), job_id.clone()));
		} else if job.status == JobStatus::Processing || job.status == JobStatus::Discarded {
			if let Some(worker) = &job.assignee {
				CounterForWorkerAssignedJobs::<T>::try_mutate(&worker, |counter| -> Result<(), DispatchError> {
					*counter -= 1;
					Ok(())
				})?;
			}
		}
		AccountBeneficialJobs::<T>::remove((job.beneficiary.clone(), pool_id.clone(), job_id.clone()));

		Self::deposit_event(Event::JobDestroyed { pool_id, job_id, destroyer });
		Ok(())
	}
}
