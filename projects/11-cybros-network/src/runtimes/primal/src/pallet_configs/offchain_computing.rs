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
use frame_system::EnsureSigned;
use frame_support::traits::{
	ConstU32, ConstU64, ConstU128,
};

impl pallet_offchain_computing::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type OffchainWorkerManageable = OffchainComputingWorkers;
	type Currency = Balances;
	type UnixTime = Timestamp;
	type PoolId = u32;
	type JobId = u32;
	type PolicyId = u32;
	type CreatePoolOrigin = EnsureSigned<Self::AccountId>;
	type CreatePoolDeposit = ConstU128<{ 1 * UNITS }>;
	type DepositPerJob = ConstU128<{ 1 * UNITS }>;
	type MetadataDepositBase = ConstU128<{ 1 * CENTS }>;
	type DepositPerByte = ConstU128<{ 1 * CENTS }>;
	type MaxAssignedJobsPerWorker = ConstU32<8>;
	type MaxSubscribedPoolsPerWorker = ConstU32<8>;
	type MaxPoliciesPerPool = ConstU32<8>;
	type MaxJobsPerPool = ConstU32<1000>;
	type MaxWorkersPerPool = ConstU32<100>;
	type MinJobExpiresIn = ConstU64<600>; // ~ 10 min
	type MaxJobExpiresIn = ConstU64<86400>; // ~ 1 day
	type DefaultJobExpiresIn = ConstU64<3600>; // ~ 1 hour
	type PoolMetadataLimit = ConstU32<2048>; // 2KiB
	type InputLimit = ConstU32<2048>; // 2KiB
	type OutputLimit = ConstU32<2048>; // 2KiB
	type ProofLimit = ConstU32<2048>; // 2KiB
}
