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
use frame_support::traits::{ConstBool, ConstU128, ConstU32};

impl pallet_offchain_computing_workers::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type Currency = Balances;
	type UnixTime = Timestamp;
	type Randomness = RandomnessCollectiveFlip;
	type ImplId = u32;
	type RegisterImplOrigin = EnsureSigned<Self::AccountId>;
	type RegisterWorkerDeposit = ConstU128<{ 100 * UNITS }>;
	type RegisterImplDeposit = ConstU128<{ 100 * UNITS }>;
	type ImplMetadataDepositBase = ConstU128<{ 1 * UNITS }>;
	type DepositPerByte = ConstU128<{ 1 * CENTS }>;
	type ImplMetadataLimit = ConstU32<2048>; // 2KiB
	type MaxImplBuilds = ConstU32<8>;
	type HandleUnresponsivePerBlockLimit = ConstU32<100>;
	type CollectingHeartbeatsDurationInBlocks = ConstU32<300>; // 30min * 60 / 6
	type MaxWorkerUnresponsiveProtectionInBlocks = ConstU32<300>; // 30min * 60 / 6
	type DisallowOptOutAttestation = ConstBool<false>;
	type WeightInfo = pallet_offchain_computing_workers::weights::SubstrateWeight<Runtime>;
	type OffchainWorkerLifecycleHooks = OffchainComputing;
}
