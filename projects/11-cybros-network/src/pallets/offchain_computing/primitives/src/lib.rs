// This file is part of Cybros.

// Copyright (C) Jun Jiang.
// SPDX-License-Identifier: GPL-3.0-or-later WITH Classpath-exception-2.0

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

#![cfg_attr(not(feature = "std"), no_std)]

use scale_codec::{Decode, Encode, MaxEncodedLen};
use scale_info::TypeInfo;
use sp_std::prelude::*;
use frame_support::{
	pallet_prelude::BoundedVec,
	traits::Get,
	RuntimeDebug,
};

use base_primitives::ImplSpecVersion;

/// Generic data that stored on-chain
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, Default, TypeInfo, MaxEncodedLen)]
#[scale_info(skip_type_params(DataLimit))]
#[codec(mel_bound(AccountId: MaxEncodedLen, Balance: MaxEncodedLen))]
pub struct ChainStoredData<AccountId, Balance, DataLimit: Get<u32>> {
	/// The depositor
	pub depositor: AccountId,
	/// The balance deposited for this data.
	///
	/// This pays for the data stored in this struct.
	pub actual_deposit: Balance,
	pub surplus_deposit: Balance,
	/// General information concerning this collection. Limited in length by `StringLimit`. This
	/// will generally be either a JSON dump or the hash of some JSON which can be found on a
	/// hash-addressable global publication system such as IPFS.
	pub data: BoundedVec<u8, DataLimit>,
}

#[derive(Clone, Decode, Encode, MaxEncodedLen, Eq, PartialEq, RuntimeDebug, TypeInfo, Default)]
pub enum ApplicableScope {
	/// Only the owner could create jobs.
	#[default]
	Owner,
	/// Anyone could create jobs.
	Public,
	// TODO:
	// /// Only a user in allow list could create jobs.
	// AllowList,
}

#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub struct JobPolicy<PoolId, BlockNumber> {
	/// Policy's id
	pub id: PoolId,
	/// This policy is available to use
	pub availability: bool,
	/// Who can applicable with the policy
	pub applicable_scope: ApplicableScope,
	// TODO：rates strategy
	// TODO: allow create scheduled job and rule
	/// When the policy starts.
	pub start_block: Option<BlockNumber>,
	/// When the policy ends.
	pub end_block: Option<BlockNumber>,
	pub jobs_count: u32,
}

// TODO: Rates strategy (bound to JobPolicy), e.g. Pay a constant or by duration of processing fee for each job, pay to worker or the owner
// TODO: WorkerPolicy: How to slashing, max processing duration, and etc.

/// Information about a pool.
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub struct PoolInfo<PoolId, AccountId, Balance, ImplId> {
	/// Pool's id
	pub id: PoolId,
	/// Pool's owner.
	pub owner: AccountId,
	/// The total balance deposited by the owner for all the storage data associated with this
	/// pool. Used by `destroy`.
	pub owner_deposit: Balance,
	/// The implementation id
	pub impl_id: ImplId,
	/// Allow to create new job
	pub create_job_availability: bool,
	pub min_impl_spec_version: ImplSpecVersion,
	pub max_impl_spec_version: ImplSpecVersion,
	/// The total number of outstanding job policies of this pool.
	pub job_policies_count: u32,
	/// The total number of outstanding jobs of this pool.
	pub jobs_count: u32,
	/// The total number of outstanding workers of this pool.
	pub workers_count: u32,
}

#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub enum JobStatus {
	/// Initial status, the job is pending to be processed
	Pending,
	/// The worker is processing the job
	Processing,
	/// Ending status, the worker processed the job
	Processed,
	/// Ending status, the worker can't process the job (e.g. force offline)
	Discarded,
}

#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub enum JobResult {
	///  and report success
	Success,
	/// Ending status, the worker processed the item and report failed
	Fail,
	/// Ending status, the error occurred when processing the job, the error not relates to the worker itself
	Error,
	/// Ending status, the error occurred when processing the job, the error relates to the worker itself
	Panic,
}

// TODO: Idea: JobType: info will copy to Job, advanceable, creatable, minimum_deposit (more than actual will save to surplus_deposit)

#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub struct JobInfo<JobId, PolicyId, AccountId, Balance> {
	pub id: JobId,
	pub policy_id: PolicyId,
	pub depositor: AccountId,
	pub deposit: Balance,
	pub beneficiary: AccountId,
	/// The implementation spec version
	pub impl_spec_version: ImplSpecVersion,
	pub auto_destroy_after_processed: bool,
	pub status: JobStatus,
	pub result: Option<JobResult>,
	/// This is soft expiring time, which means even the job has expired,
	/// worker can still process it, and earning from it,
	/// But other can destroy the job
	pub expires_at: u64,
	pub created_at: u64,
	pub assignee: Option<AccountId>,
	pub assigned_at: Option<u64>,
	pub processing_at: Option<u64>,
	pub ended_at: Option<u64>,
}
