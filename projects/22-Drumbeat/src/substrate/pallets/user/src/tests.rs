use crate::{mock::*, Error};
use admeta_common::{AdPreference, TargetTag, ValueRange};
use frame_support::{assert_noop, assert_ok, BoundedVec};
use sp_core::ConstU32;

#[test]
fn add_profile_succeeds() {
	new_test_ext().execute_with(|| {
		// Add new user profile
		assert_ok!(User::add_profile(RuntimeOrigin::signed(1), 20, TargetTag::DeFi, true));
		assert_eq!(User::get_user(1).is_some(), true);
		assert_eq!(User::get_user(1).unwrap().age, 20);
		assert_eq!(User::get_user(1).unwrap().tag, TargetTag::DeFi);
		assert_eq!(User::get_user(1).unwrap().ad_display, true);
		assert_eq!(User::get_user(1).unwrap().matched_ads.len(), 0);
	});
}

#[test]
fn update_profile_succeeds() {
	new_test_ext().execute_with(|| {
		// Add new user profile
		assert_ok!(User::add_profile(RuntimeOrigin::signed(1), 20, TargetTag::DeFi, true));
		assert_eq!(User::get_user(1).is_some(), true);
		assert_eq!(User::get_user(1).unwrap().age, 20);
		assert_eq!(User::get_user(1).unwrap().tag, TargetTag::DeFi);
		assert_eq!(User::get_user(1).unwrap().ad_display, true);
		assert_eq!(User::get_user(1).unwrap().matched_ads.len(), 0);

		// Update user profile
		assert_ok!(User::add_profile(RuntimeOrigin::signed(1), 25, TargetTag::DeFi, false));
		assert_eq!(User::get_user(1).unwrap().age, 25);
		assert_eq!(User::get_user(1).unwrap().ad_display, false);
	});
}

#[test]
fn matching_succeeds() {
	new_test_ext().execute_with(|| {
		// Add new ad proposal
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
		// Approve this ad proposal
		assert_ok!(Ad::approve_ad(RuntimeOrigin::root(), 1, 1));
		assert_eq!(Ad::impression_ads(1, 1).unwrap().approved, true);
		// Add new user profile
		assert_ok!(User::add_profile(RuntimeOrigin::signed(2), 20, TargetTag::DeFi, true));
		assert_eq!(User::get_user(2).unwrap().matched_ads.len(), 0);
		// Check matching result
		run_to_block(4);
		assert_eq!(User::get_user(2).unwrap().matched_ads.len(), 1);
		assert_eq!(User::get_user(2).unwrap().matched_ads[0], (1, 1));
	});
}

#[test]
fn claim_reward_succeeds() {
	new_test_ext().execute_with(|| {
		// Add new ad proposal
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 10000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 18, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_ok!(Ad::propose_ad(
			RuntimeOrigin::signed(1),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			100000000,
			10,
			2000,
			ad_preference
		));
		// Approve this ad proposal
		assert_ok!(Ad::approve_ad(RuntimeOrigin::root(), 1, 1));
		assert_eq!(Ad::impression_ads(1, 1).unwrap().approved, true);
		// Add new user profile
		assert_ok!(User::add_profile(RuntimeOrigin::signed(2), 20, TargetTag::DeFi, true));
		assert_eq!(User::get_user(2).unwrap().matched_ads.len(), 0);
		// Check matching result
		run_to_block(4);
		assert_eq!(User::get_user(2).unwrap().matched_ads.len(), 1);
		assert_eq!(User::get_user(2).unwrap().matched_ads[0], (1, 1));
		// Claim reward
		let old_balance = Balances::free_balance(2);
		assert_ok!(User::claim_reward(RuntimeOrigin::signed(2), 1, 1));
		assert_eq!(User::get_user(2).unwrap().matched_ads.len(), 0);
		assert_eq!(Balances::free_balance(2) - old_balance, 100000000);
	});
}

#[test]
fn claim_reward_fails_with_claiming_unmatched_ads() {
	new_test_ext().execute_with(|| {
		// Add new ad proposal
		let _ = Balances::set_balance(RuntimeOrigin::root(), 1, 10000000000, 0);
		let ad_preference = AdPreference {
			age: ValueRange { min: 18, max: 40 },
			tags: <BoundedVec<TargetTag, ConstU32<4>>>::try_from(vec![TargetTag::DeFi]).unwrap(),
		};
		assert_ok!(Ad::propose_ad(
			RuntimeOrigin::signed(1),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			<BoundedVec<u8, ConstU32<20>>>::try_from(vec![0u8; 5]).unwrap(),
			100000000,
			10,
			2000,
			ad_preference
		));
		// Approve this ad proposal
		assert_ok!(Ad::approve_ad(RuntimeOrigin::root(), 1, 1));
		assert_eq!(Ad::impression_ads(1, 1).unwrap().approved, true);
		// Add new user profile
		assert_ok!(User::add_profile(RuntimeOrigin::signed(2), 20, TargetTag::GameFi, true));
		assert_eq!(User::get_user(2).unwrap().matched_ads.len(), 0);
		// Check matching result
		run_to_block(4);
		assert_eq!(User::get_user(2).unwrap().matched_ads.len(), 0);
		// Claim reward
		assert_noop!(
			User::claim_reward(RuntimeOrigin::signed(2), 1, 1),
			Error::<Test>::AdNotForThisUser
		);
	});
}

#[test]
fn claim_reward_fails_with_user_not_exist() {
	new_test_ext().execute_with(|| {
		// Claim reward
		assert_noop!(
			User::claim_reward(RuntimeOrigin::signed(2), 1, 1),
			Error::<Test>::UserDoesNotExist
		);
	});
}
