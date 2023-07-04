use crate::{mock::*, Error};
use admeta_common::{AdPreference, TargetTag, ValueRange};
use frame_support::{assert_noop, assert_ok, error::BadOrigin, BoundedVec};
use sp_core::ConstU32;

#[test]
fn create_ad_proposal_succeeds() {
	new_test_ext().execute_with(|| {
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 1000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 8, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_ok!(Ad::propose_ad(
			RuntimeOrigin::signed(1),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			10,
			100,
			2000,
			ad_preference
		));
		// Reserved balance should be 20 + 1*5 + 10*100 = 1025
		assert_eq!(Balances::reserved_balance(1), 1025);
		// ad_index starts from 1
		assert_eq!(Ad::ad_count().is_some(), true);
		assert_eq!(Ad::ad_count(), Some(1));
		assert_eq!(Ad::impression_ads(1, 1).is_some(), true);
		assert_eq!(Ad::impression_ads(1, 1).unwrap().approved, false);
	});
}

#[test]
fn create_ad_proposal_fails_with_insufficient_balance() {
	new_test_ext().execute_with(|| {
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 100, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 8, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_noop!(
			Ad::propose_ad(
				RuntimeOrigin::signed(1),
				<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
				<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
				<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
				10,
				100,
				2000,
				ad_preference
			),
			Error::<Test>::InsufficientProposalBalance
		);
	});
}

#[test]
fn create_ad_proposal_fails_with_invalid_ad_preference() {
	new_test_ext().execute_with(|| {
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 1000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 48, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_noop!(
			Ad::propose_ad(
				RuntimeOrigin::signed(1),
				<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
				<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
				<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
				10,
				100,
				2000,
				ad_preference
			),
			Error::<Test>::InvalidAdPreference
		);
	});
}

#[test]
fn approve_ad_succeeds() {
	new_test_ext().execute_with(|| {
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 1000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 18, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_ok!(Ad::propose_ad(
			RuntimeOrigin::signed(1),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			10,
			100,
			2000,
			ad_preference
		));

		assert_eq!(Ad::impression_ads(1, 1).unwrap().approved, false);
		assert_ok!(Ad::approve_ad(RuntimeOrigin::root(), 1, 1));
		assert_eq!(Ad::impression_ads(1, 1).unwrap().approved, true);
	});
}

#[test]
fn approve_ad_fails_with_bad_origin() {
	new_test_ext().execute_with(|| {
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 1000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 18, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_ok!(Ad::propose_ad(
			RuntimeOrigin::signed(1),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			10,
			100,
			2000,
			ad_preference
		));

		assert_noop!(Ad::approve_ad(RuntimeOrigin::signed(1), 1, 1), BadOrigin);
	});
}

#[test]
fn approve_ad_fails_with_invalid_index() {
	new_test_ext().execute_with(|| {
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 1000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 18, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_ok!(Ad::propose_ad(
			RuntimeOrigin::signed(1),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			10,
			100,
			2000,
			ad_preference
		));

		assert_noop!(Ad::approve_ad(RuntimeOrigin::root(), 1, 3), Error::<Test>::InvalidAdIndex);
	});
}

#[test]
fn reject_ad_succeeds() {
	new_test_ext().execute_with(|| {
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 1000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 18, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_ok!(Ad::propose_ad(
			RuntimeOrigin::signed(1),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			10,
			100,
			2000,
			ad_preference
		));

		// Reserved balance should be 20 + 1*5 + 10*100 = 1025
		assert_eq!(Balances::reserved_balance(1), 1025);
		assert_eq!(Ad::impression_ads(1, 1).is_none(), false);

		assert_ok!(Ad::reject_ad(RuntimeOrigin::root(), 1, 1));

		// Reserved bond 25 should be slashed, and reserved ad costs shall be unreserved
		assert_eq!(Balances::free_balance(1), 1000000000 - 25);
		assert_eq!(Balances::reserved_balance(1), 0);
		assert_eq!(Ad::impression_ads(1, 1).is_none(), true);
	});
}

#[test]
fn reject_ad_fails_with_bad_origin() {
	new_test_ext().execute_with(|| {
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 1000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 18, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_ok!(Ad::propose_ad(
			RuntimeOrigin::signed(1),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			10,
			100,
			2000,
			ad_preference
		));

		assert_noop!(Ad::reject_ad(RuntimeOrigin::signed(1), 1, 1), BadOrigin);
	});
}

#[test]
fn reject_ad_fails_with_invalid_index() {
	new_test_ext().execute_with(|| {
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 1000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 18, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_ok!(Ad::propose_ad(
			RuntimeOrigin::signed(1),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			10,
			100,
			2000,
			ad_preference
		));

		assert_noop!(Ad::reject_ad(RuntimeOrigin::root(), 1, 3), Error::<Test>::InvalidAdIndex);
	});
}
