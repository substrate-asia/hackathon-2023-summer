use crate as pallet_dao;
use frame_support::parameter_types;
use frame_system as system;
use codec::{Encode, MaxEncodedLen};
use once_cell::sync::Lazy;
use scale_info::TypeInfo;
use sp_core::{sr25519, H256};
use sp_runtime::{
	testing::Header,
	traits::{BlakeTwo256, IdentityLookup},
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
		Balances: pallet_balances::{Pallet, Call, Storage, Event<T>},
		Timestamp: pallet_timestamp::{Pallet, Call, Storage, Inherent},
		Did: pallet_did::{Pallet, Call, Storage, Event<T>},
		Dao: pallet_dao::{Pallet, Call, Storage, Event<T>},
		Profile: pallet_profile::{Pallet, Call, Storage, Event<T>},
	}
);
pub type Moment = u64;
parameter_types! {
	pub const BlockHashCount: u64 = 250;
	pub const SS58Prefix: u8 = 42;
}

pub static ALICE : Lazy<sr25519::Public> = Lazy::new(||{sr25519::Public::from_raw([1u8; 32])});
pub static BOB : Lazy<sr25519::Public> = Lazy::new(||{sr25519::Public::from_raw([2u8; 32])});
pub static EVE : Lazy<sr25519::Public> = Lazy::new(||{sr25519::Public::from_raw([3u8; 32])});
pub static JOHN : Lazy<sr25519::Public> = Lazy::new(||{sr25519::Public::from_raw([4u8; 32])});

impl system::Config for Test {
	type BaseCallFilter = frame_support::traits::Everything;
	type BlockWeights = ();
	type BlockLength = ();
	type DbWeight = ();
	type Origin = Origin;
	type Call = Call;
	type Index = u64;
	type BlockNumber = u64;
	type Hash = H256;
	type Hashing = BlakeTwo256;
	type AccountId = sr25519::Public;
	type Lookup = IdentityLookup<Self::AccountId>;
	type Header = Header;
	type Event = Event;
	type BlockHashCount = BlockHashCount;
	type Version = ();
	type PalletInfo = PalletInfo;
	type AccountData = pallet_balances::AccountData<u64>;
	type OnNewAccount = ();
	type OnKilledAccount = ();
	type SystemWeightInfo = ();
	type SS58Prefix = SS58Prefix;
	type OnSetCode = ();
	type MaxConsumers = ConstU32<16>;
}

impl pallet_timestamp::Config for Test {
	type Moment =  Moment;
	type OnTimestampSet = ();
	type MinimumPeriod = ();
	type WeightInfo = ();
}

parameter_types! {
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxDelegateTypeLen: u32 = 64;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxNameLen: u32 = 64;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxValueLen: u32 = 64;
}

impl pallet_did::Config for Test {
	type Event = Event;
	type DelegateType = ();
	type MaxDelegateTypeLen = MaxDelegateTypeLen;
	type MaxNameLen = MaxNameLen;
	type MaxValueLen = MaxValueLen;
	type Public = sr25519::Public;
	type Signature = sr25519::Signature;
	type Time = Timestamp;
	type WeightInfo = ();
}

parameter_types! {
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxDescriptionLen: u32 = 64;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxDaoNameLen: u32 = 64;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxVisionLen: u32 = 64;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxMembersPerOrganisation: u32 = 150;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxOrganisationsPerMember: u32 = 150;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxApplicantsToOrganisation: u32 = 150;
}

impl pallet_dao::Config for Test {
	type Event = Event;
	type MaxDescriptionLen = MaxDescriptionLen;
	type MaxNameLen = MaxDaoNameLen;
	type MaxVisionLen = MaxVisionLen;
	type MaxMembersPerOrganisation = MaxMembersPerOrganisation;
	type MaxOrganisationsPerMember = MaxOrganisationsPerMember;
	type MaxApplicantsToOrganisation = MaxApplicantsToOrganisation;

	type WeightInfo = ();
}

parameter_types! {
	// One can owned at most 77 tasks
	pub const MaxTasksOwned: u32 = 77;
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
	type ReserveIdentifier = [u8; 8];
	type MaxLocks = ();
	type MaxReserves = ();
	type Balance = u64;
	type Event = Event;
	type DustRemoval = ();
	type ExistentialDeposit = ExistentialDeposit;
	type AccountStore = System;
	type WeightInfo = ();
}

// Build genesis storage according to the mock runtime.
pub fn new_test_ext() -> sp_io::TestExternalities {
	let storage = system::GenesisConfig::default().build_storage::<Test>().unwrap();
	let mut ext = sp_io::TestExternalities::new(storage);
	ext.execute_with(|| System::set_block_number(1));
	ext
}