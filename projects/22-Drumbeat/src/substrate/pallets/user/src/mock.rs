use crate as pallet_user;
use frame_support::{
	parameter_types,
	traits::{ConstU32, ConstU64, OnFinalize, OnIdle, OnInitialize},
	weights::Weight,
};
use frame_support_test::TestRandomness;
use frame_system as system;
use sp_core::H256;
use sp_runtime::{
	testing::Header,
	traits::{BlakeTwo256, IdentityLookup},
};
use system::EnsureRoot;

type UncheckedExtrinsic = frame_system::mocking::MockUncheckedExtrinsic<Test>;
type Block = frame_system::mocking::MockBlock<Test>;

pub type Balance = u64;
pub type AdIndexType = u32;

// Configure a mock runtime to test the pallet.
frame_support::construct_runtime!(
	pub enum Test where
		Block = Block,
		NodeBlock = Block,
		UncheckedExtrinsic = UncheckedExtrinsic,
	{
		System: frame_system::{Pallet, Call, Config, Storage, Event<T>},
		Balances: pallet_balances::{Pallet, Call, Storage, Config<T>, Event<T>},
		Ad: pallet_ad::{Pallet, Call, Storage, Event<T>},
		User: pallet_user::{Pallet, Call, Storage, Event<T>},
	}
);

parameter_types! {
	pub const BlockHashCount: u64 = 250;
	pub const SS58Prefix: u8 = 42;
}

impl system::Config for Test {
	type BaseCallFilter = frame_support::traits::Everything;
	type BlockWeights = ();
	type BlockLength = ();
	type DbWeight = ();
	type RuntimeOrigin = RuntimeOrigin;
	type RuntimeCall = RuntimeCall;
	type Index = u64;
	type BlockNumber = u64;
	type Hash = H256;
	type Hashing = BlakeTwo256;
	type AccountId = u64;
	type Lookup = IdentityLookup<Self::AccountId>;
	type Header = Header;
	type RuntimeEvent = RuntimeEvent;
	type BlockHashCount = BlockHashCount;
	type Version = ();
	type PalletInfo = PalletInfo;
	type AccountData = pallet_balances::AccountData<u64>;
	type OnNewAccount = ();
	type OnKilledAccount = ();
	type SystemWeightInfo = ();
	type SS58Prefix = SS58Prefix;
	type OnSetCode = ();
	type MaxConsumers = frame_support::traits::ConstU32<16>;
}
parameter_types! {
	pub const ExistentialDeposit: u64 = 1;
}
impl pallet_balances::Config for Test {
	type MaxLocks = ();
	type MaxReserves = ();
	type ReserveIdentifier = [u8; 8];
	type Balance = Balance;
	type RuntimeEvent = RuntimeEvent;
	type DustRemoval = ();
	type ExistentialDeposit = ExistentialDeposit;
	type AccountStore = System;
	type WeightInfo = ();
	type FreezeIdentifier = ();
	type HoldIdentifier = ();
	type MaxFreezes = ();
	type MaxHolds = ();
}

impl pallet_ad::Config for Test {
	type RuntimeEvent = RuntimeEvent;
	type AdIndex = AdIndexType;
	type ApproveOrigin = EnsureRoot<Self::AccountId>;
	type RejectOrigin = EnsureRoot<Self::AccountId>;
	type OnSlash = ();
	type Randomness = TestRandomness<Self>;
	type Currency = Balances;
	type MaxAdDataLength = ConstU32<20>;
	type AdDepositBase = ConstU64<20>;
	type AdDepositPerByte = ConstU64<1>;
	type MaxAdTags = ConstU32<2>;
}
impl pallet_user::Config for Test {
	type RuntimeEvent = RuntimeEvent;
	type AdData = Ad;
	type AdIndex = AdIndexType;
	type Randomness = TestRandomness<Self>;
	type MaxMatchedAds = ConstU32<2>;
}

// Build genesis storage according to the mock runtime.
pub fn new_test_ext() -> sp_io::TestExternalities {
	let mut t = frame_system::GenesisConfig::default().build_storage::<Test>().unwrap();
	pallet_balances::GenesisConfig::<Test> {
		// Total issuance will be 200 with treasury account initialized at ED.
		balances: vec![(0, 100), (1, 98), (2, 1)],
	}
	.assimilate_storage(&mut t)
	.unwrap();
	t.into()
}

pub fn run_to_block(n: u64) {
	while System::block_number() < n {
		if System::block_number() > 1 {
			Ad::on_finalize(System::block_number());
			User::on_finalize(System::block_number());
			System::on_finalize(System::block_number());
		}
		System::set_block_number(System::block_number() + 1);
		System::on_initialize(System::block_number());
		User::on_initialize(System::block_number());
		User::on_idle(System::block_number(), Weight::from_ref_time(10_000_000 as u64));
		Ad::on_initialize(System::block_number());
		Ad::on_idle(System::block_number(), Weight::from_ref_time(10_000_000 as u64));
	}
}
