use crate as pallet_profile;
use codec::{Encode, MaxEncodedLen};
use frame_support::parameter_types;
use frame_system as system;
use scale_info::TypeInfo;
use sp_core::H256;
use sp_runtime::{
	testing::Header,
	traits::{BlakeTwo256, IdentityLookup},
	BuildStorage,
	traits::ConstU32
};


type UncheckedExtrinsic = frame_system::mocking::MockUncheckedExtrinsic<Test>;
type Block = frame_system::mocking::MockBlock<Test>;

// Configure a mock runtime to test the pallet.
frame_support::construct_runtime!(
	pub enum Test where
		Block = Block,
		NodeBlock = Block,
		UncheckedExtrinsic = UncheckedExtrinsic,
	{
		System: frame_system::{Pallet, Call, Config, Storage, Event<T>},
		Profile: pallet_profile::{Pallet, Call, Storage, Event<T>},
		Balances: pallet_balances::{Pallet, Call, Storage, Config<T>, Event<T>},
	}
);

parameter_types! {
	pub const BlockHashCount: u64 = 250;
	pub const SS58Prefix: u8 = 42;
}

impl system::Config for Test {
	type AccountData = pallet_balances::AccountData<u64>;
	type AccountId = u128;
	type BaseCallFilter = frame_support::traits::Everything;
	type BlockHashCount = BlockHashCount;
	type BlockLength = ();
	type BlockNumber = u64;
	type BlockWeights = ();
	type Call = Call;
	type DbWeight = ();
	type Event = Event;
	type Hash = H256;
	type Hashing = BlakeTwo256;
	type Header = Header;
	type Index = u64;
	type Lookup = IdentityLookup<Self::AccountId>;
	type OnKilledAccount = ();
	type OnNewAccount = ();
	type OnSetCode = ();
	type Origin = Origin;
	type PalletInfo = PalletInfo;
	type SS58Prefix = SS58Prefix;
	type SystemWeightInfo = ();
	type Version = ();
	type MaxConsumers = ConstU32<16>;
}

parameter_types! {
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxUsernameLen: u32 = 256;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxInterestsLen: u32 = 256;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxAdditionalInformationLen: u32 = 5000;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxCompletedTasksLen: u32 = 100;
}

impl pallet_profile::Config for Test {
	type Event = Event;
	type Currency =  Balances;
	type WeightInfo = ();
	type MaxUsernameLen = MaxUsernameLen;
	type MaxInterestsLen = MaxInterestsLen;
	type MaxAdditionalInformationLen = MaxAdditionalInformationLen;
	type MaxCompletedTasksLen = MaxCompletedTasksLen;
}

parameter_types! {
	pub const ExistentialDeposit: u64 = 1;
}

impl pallet_balances::Config for Test {
	type AccountStore = System;
	type Balance = u64;
	type DustRemoval = ();
	type Event = Event;
	type ExistentialDeposit = ExistentialDeposit;
	type MaxLocks = ();
	type MaxReserves = ();
	type ReserveIdentifier = [u8; 8];
	type WeightInfo = ();
}

// Build genesis storage according to the mock runtime.
pub(crate) fn new_test_ext() -> sp_io::TestExternalities {
	let mut t = frame_system::GenesisConfig::default().build_storage::<Test>().unwrap();
	GenesisConfig {
		balances: BalancesConfig {
			balances: vec![(1,  10), (2,  10)]
		},
		..Default::default()
	}
		.assimilate_storage(&mut t)
		.unwrap();

	let mut ext = sp_io::TestExternalities::new(t);
	ext.execute_with(|| System::set_block_number(1));
	ext
}