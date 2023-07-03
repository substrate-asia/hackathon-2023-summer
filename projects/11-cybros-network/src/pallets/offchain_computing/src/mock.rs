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

use crate as pallet_offchain_computing;

use frame_support::{
	assert_ok,
	traits::{OnFinalize, OnInitialize},
};
use frame_system::EnsureSigned;
use sp_core::{ConstBool, ConstU128, ConstU16, ConstU32, ConstU64, H256};
use sp_runtime::{
	testing::Header,
	traits::{BlakeTwo256, IdentifyAccount, IdentityLookup, Verify},
	MultiSignature,
};

type UncheckedExtrinsic = frame_system::mocking::MockUncheckedExtrinsic<Test>;
type Block = frame_system::mocking::MockBlock<Test>;

pub(crate) type BlockNumber = u64;
pub(crate) type Balance = u128;

pub(crate) type Signature = MultiSignature;
pub(crate) type AccountPublic = <Signature as Verify>::Signer;
pub(crate) type AccountId = <AccountPublic as IdentifyAccount>::AccountId;

pub(crate) const MILLI_CENTS: Balance = 1_000_000;
pub(crate) const CENTS: Balance = 1_000 * MILLI_CENTS;
pub(crate) const DOLLARS: Balance = 100 * CENTS;

// Configure a mock runtime to test the pallet.
frame_support::construct_runtime!(
	pub struct Test where
		Block = Block,
		NodeBlock = Block,
		UncheckedExtrinsic = UncheckedExtrinsic,
	{
		System: frame_system,
		Balances: pallet_balances,
		Timestamp: pallet_timestamp,
		RandomnessCollectiveFlip: pallet_insecure_randomness_collective_flip,
		OffchainComputingWorkers: pallet_offchain_computing_workers,
		OffchainComputing: pallet_offchain_computing,
	}
);

impl frame_system::Config for Test {
	type BaseCallFilter = frame_support::traits::Everything;
	type BlockWeights = ();
	type BlockLength = ();
	type RuntimeOrigin = RuntimeOrigin;
	type RuntimeCall = RuntimeCall;
	type Index = u64;
	type BlockNumber = BlockNumber;
	type Hash = H256;
	type Hashing = BlakeTwo256;
	type AccountId = AccountId;
	type Lookup = IdentityLookup<Self::AccountId>;
	type Header = Header;
	type RuntimeEvent = RuntimeEvent;
	type BlockHashCount = ConstU64<250>;
	type DbWeight = ();
	type Version = ();
	type PalletInfo = PalletInfo;
	type AccountData = pallet_balances::AccountData<Balance>;
	type OnNewAccount = ();
	type OnKilledAccount = ();
	type SystemWeightInfo = ();
	type SS58Prefix = ConstU16<42>;
	type OnSetCode = ();
	type MaxConsumers = ConstU32<16>;
}

impl pallet_balances::Config for Test {
	type RuntimeEvent = RuntimeEvent;
	type WeightInfo = ();
	type Balance = Balance;
	type DustRemoval = ();
	type ExistentialDeposit = ConstU128<{ 1 * CENTS }>;
	type AccountStore = System;
	type ReserveIdentifier = [u8; 8];
	type RuntimeHoldReason = ();
	type FreezeIdentifier = ();
	type MaxLocks = ();
	type MaxReserves = ();
	type MaxHolds = ();
	type MaxFreezes = ();
}

impl pallet_timestamp::Config for Test {
	type Moment = u64;
	type OnTimestampSet = ();
	type MinimumPeriod = ConstU64<5>;
	type WeightInfo = ();
}

impl pallet_insecure_randomness_collective_flip::Config for Test {}

impl pallet_offchain_computing_workers::Config for Test {
	type RuntimeEvent = RuntimeEvent;
	type Currency = Balances;
	type UnixTime = Timestamp;
	type Randomness = RandomnessCollectiveFlip;
	type ImplId = u32;
	type RegisterImplOrigin = EnsureSigned<Self::AccountId>;
	type RegisterWorkerDeposit = ConstU128<{ 100 * DOLLARS }>;
	type RegisterImplDeposit = ConstU128<{ 1 * DOLLARS }>;
	type ImplMetadataDepositBase = ConstU128<{ 1 * DOLLARS }>;
	type DepositPerByte = ConstU128<{ 1 * CENTS }>;
	type ImplMetadataLimit = ConstU32<50>;
	type MaxImplBuilds = ConstU32<4>;
	type HandleUnresponsivePerBlockLimit = ConstU32<3>;
	type CollectingHeartbeatsDurationInBlocks = ConstU32<6>;
	type MaxWorkerUnresponsiveProtectionInBlocks = ConstU32<6>;
	type DisallowOptOutAttestation = ConstBool<false>;
	type WeightInfo = ();
	type OffchainWorkerLifecycleHooks = ();
}

impl pallet_offchain_computing::Config for Test {
	type RuntimeEvent = RuntimeEvent;
	type OffchainWorkerManageable = OffchainComputingWorkers;
	type Currency = Balances;
	type UnixTime = Timestamp;
	type PoolId = u32;
	type JobId = u32;
	type PolicyId = u32;
	type CreatePoolOrigin = frame_system::EnsureSigned<Self::AccountId>;
	type CreatePoolDeposit = ConstU128<{ 1 * DOLLARS }>;
	type DepositPerJob = ConstU128<{ 1 * DOLLARS }>;
	type MetadataDepositBase = ConstU128<{ 1 * CENTS }>;
	type DepositPerByte = ConstU128<{ 1 * CENTS }>;
	type MaxAssignedJobsPerWorker = ConstU32<8>;
	type MaxSubscribedPoolsPerWorker = ConstU32<8>;
	type MaxPoliciesPerPool = ConstU32<3>;
	type MaxJobsPerPool = ConstU32<100>;
	type MaxWorkersPerPool = ConstU32<100>;
	type MinJobExpiresIn = ConstU64<6>;
	type MaxJobExpiresIn = ConstU64<24>;
	type DefaultJobExpiresIn = ConstU64<18>;
	type PoolMetadataLimit = ConstU32<50>;
	type InputLimit = ConstU32<50>;
	type OutputLimit = ConstU32<50>;
	type ProofLimit = ConstU32<50>;
}

// Build genesis storage according to the mock runtime.
#[allow(unused)]
pub(crate) fn new_test_ext() -> sp_io::TestExternalities {
	let mut t = frame_system::GenesisConfig::default().build_storage::<Test>().unwrap();
	// Customize genesis config here
	t.into()
}

#[allow(unused)]
pub(crate) fn run_to_block(n: BlockNumber) {
	// NOTE that this function only simulates modules of interest. Depending on new pallet may
	// require adding it here.
	assert!(System::block_number() < n);
	while System::block_number() < n {
		let b = System::block_number();

		if System::block_number() > 1 {
			System::on_finalize(System::block_number());
		}
		System::set_block_number(b + 1);
		System::on_initialize(System::block_number());
	}
}

#[allow(unused)]
pub(crate) fn take_events() -> Vec<RuntimeEvent> {
	let events = System::events().into_iter().map(|i| i.event).collect::<Vec<_>>();
	System::reset_events();
	events
}

#[allow(unused)]
pub(crate) fn set_balance(who: AccountId, new_free: Balance, new_reserved: Balance) {
	assert_ok!(
		Balances::force_set_balance(
			RuntimeOrigin::root(),
			who.clone().into(),
			new_free.saturating_add(new_reserved)
		)
	);
	assert_eq!(Balances::free_balance(&who), new_free);
	assert_eq!(Balances::reserved_balance(&who), new_reserved);
}
