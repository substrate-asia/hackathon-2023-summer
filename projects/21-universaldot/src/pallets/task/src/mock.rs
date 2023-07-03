
use crate as pallet_task;
use frame_support::{parameter_types, PalletId};
use frame_system as system;
use scale_info::TypeInfo;
use codec::{Encode, MaxEncodedLen};
use frame_support::once_cell::sync::Lazy;
use sp_core::{sr25519, H256};
use sp_runtime::{
	testing::Header,
	traits::{BlakeTwo256, IdentityLookup},
	BuildStorage,
	traits::ConstU32
};

type UncheckedExtrinsic = frame_system::mocking::MockUncheckedExtrinsic<Test>;
type Block = frame_system::mocking::MockBlock<Test>;
type BlockNumber = u64;
/// Change this to adjust the block time.
pub const MILLISECS_PER_BLOCK: u64 = 6000;

// Configure a mock runtime to test the pallet.
frame_support::construct_runtime!(
	pub enum Test where
		Block = Block,
		NodeBlock = Block,
		UncheckedExtrinsic = UncheckedExtrinsic,
	{
		System: frame_system::{Pallet, Call, Config, Storage, Event<T>},
		Balances: pallet_balances::{Pallet, Call, Storage, Config<T>, Event<T>},
		Did: pallet_did::{Pallet, Call, Storage, Event<T>},
		Dao: pallet_dao::{Pallet, Call, Storage, Event<T>},
		Profile: pallet_profile::{Pallet, Call, Storage, Event<T>},
		Time: pallet_timestamp::{Pallet, Call, Storage, Inherent},
		Task: pallet_task::{Pallet, Call, Storage, Event<T>},
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
	type Origin = Origin;
	type Call = Call;
	type Index = u64;
	type BlockNumber = BlockNumber;
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

pub type Moment = u64;
impl pallet_timestamp::Config for Test {
	type Moment =  Moment;
	type OnTimestampSet = ();
	type MinimumPeriod = ();
	type WeightInfo = ();
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

parameter_types! {
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxDescriptionLen: u32 = 64;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxDaoNameLen: u32 = 64;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxVisionLen: u32 = 64;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxMemberOfLen: u32 = 64;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxMembersPerOrganisation: u32 = 100;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxOrganisationsPerMember: u32 = 100;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxApplicantsToOrganisation: u32 = 100;
}

impl pallet_dao::Config for Test {
	type Event = Event;
	type MaxDescriptionLen = MaxDescriptionLen;
	type MaxNameLen = MaxDaoNameLen;
	type MaxVisionLen = MaxVisionLen;
	type WeightInfo = ();
	type MaxMembersPerOrganisation = MaxMembersPerOrganisation;
	type MaxOrganisationsPerMember = MaxOrganisationsPerMember;
	type MaxApplicantsToOrganisation = MaxApplicantsToOrganisation;
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
	type Time = Time;
	type WeightInfo = ();
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
	type Currency = Balances;
	type WeightInfo = ();
	type MaxUsernameLen = MaxUsernameLen;
	type MaxInterestsLen = MaxInterestsLen;
	type MaxAdditionalInformationLen = MaxAdditionalInformationLen;
	type MaxCompletedTasksLen = MaxCompletedTasksLen;
}

// One can own at most 77 tasks
pub(crate) const MAX_TASKS_OWNED: u32 = 77;

parameter_types! {
	pub const MaxTasksOwned: u32 = MAX_TASKS_OWNED;
	pub TestPalletID : PalletId = PalletId(*b"task_pal");
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxTitleLen: u32 = 256;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxSpecificationLen: u32 = 256;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxAttachmentsLen: u32 = 5000;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxFeedbackLen: u32 = 5000;
	#[derive(TypeInfo, MaxEncodedLen, Encode)]
	pub const MaxKeywordsLen: u32 = 100;
	// 100 blocks longevity
	pub const TaskLongevityAfterExpiration: BlockNumber = 100;
	pub const MilisPerBlock: u64 = MILLISECS_PER_BLOCK; 
}

impl pallet_task::Config for Test {
	type Event = Event;
	type Currency = Balances;
	type Organization = Test;
	type MaxTasksOwned = MaxTasksOwned;
	type Time = Time;
	type WeightInfo = ();
	type PalletId = TestPalletID;
	type MaxTitleLen = MaxTitleLen;
	type MaxSpecificationLen = MaxSpecificationLen;
	type MaxAttachmentsLen = MaxAttachmentsLen;
	type MaxFeedbackLen = MaxFeedbackLen;
	type MaxKeywordsLen = MaxKeywordsLen;
	type MillisecondsPerBlock = MilisPerBlock;
	type TaskLongevityAfterExpiration = TaskLongevityAfterExpiration;
}

impl pallet_task::traits::Organization<H256> for Test {
	fn exists(id: &H256) -> bool {
		Dao::does_organization_exist(id)
	}
}

pub static ALICE : Lazy<sr25519::Public> = Lazy::new(||{sr25519::Public::from_raw([1u8; 32])});
pub static BOB : Lazy<sr25519::Public> = Lazy::new(||{sr25519::Public::from_raw([2u8; 32])});
pub static TED : Lazy<sr25519::Public> = Lazy::new(||{sr25519::Public::from_raw([10u8; 32])});

pub(crate) fn new_test_ext() -> sp_io::TestExternalities {
	let mut t = frame_system::GenesisConfig::default().build_storage::<Test>().unwrap();
	GenesisConfig {
		balances: BalancesConfig {
			balances: vec![(*ALICE,  1000), (*BOB,  1000), (*TED, 1000)]
		},
		..Default::default()
	}
		.assimilate_storage(&mut t)
		.unwrap();

	let mut ext = sp_io::TestExternalities::new(t);
	ext.execute_with(|| System::set_block_number(1));
	ext
}