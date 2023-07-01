use core::convert::TryInto;
use frame_support::storage::bounded_vec::BoundedVec;
use crate::{mock::*, Error};
use frame_support::{assert_noop, assert_ok};


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Constants and Functions used in TESTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

pub const HOURS: u8 = 40_u8;
pub const HOURS2: u8 = 20_u8;


fn username() -> BoundedVec<u8, MaxUsernameLen> {
	vec![1u8, 4].try_into().unwrap()
}

fn username2() -> BoundedVec<u8, MaxUsernameLen> {
	vec![2u8, 4].try_into().unwrap()
}

fn interests() -> BoundedVec<u8, MaxInterestsLen> {
	vec![2u8, 4].try_into().unwrap()
}

fn interests2() -> BoundedVec<u8, MaxInterestsLen> {
	vec![3u8, 4].try_into().unwrap()
}

fn additional_info() -> BoundedVec<u8, MaxAdditionalInformationLen> {
	vec![1u8, 4].try_into().unwrap()
}
fn longitude() -> [u8; 5] {
	[1, 2, 3, 4, 5]
}
fn latitude() -> [u8; 5] {
	*b"ABCDE"
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  TESTS  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

#[test]
fn create_profile_works() {
	new_test_ext().execute_with(|| {

		// Ensure the user can create profile
		assert_ok!(Profile::create_profile(Origin::signed(1), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())));
	});
}

#[test]
fn verify_inputs_outputs_to_profile(){
	new_test_ext().execute_with(|| {

		// Create Profile
		assert_ok!(Profile::create_profile(Origin::signed(10), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())));

		// Get profile for current account
		let profile = Profile::profiles(10).expect("should found the profile");

		// Latitude, Longitude
		let location = (*b"ABCDE", [1, 2, 3, 4, 5]);


		// Ensure that profile properties are assigned correctly
		assert_eq!(profile.name.into_inner(), &[1, 4]);
		assert_eq!(profile.reputation, 0);
		assert_eq!(profile.interests.into_inner(), &[2,4]);
		assert_eq!(profile.available_hours_per_week, 40_u8);
		assert!(profile.location == Some(location));

	});
}

#[test]
fn create_profile_increases_profile_count() {
	new_test_ext().execute_with(|| {

		// Ensure the user can create profile
		assert_ok!(Profile::create_profile(Origin::signed(1), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())));

		// Ensure count has increased to 1
		assert_eq!(Profile::profile_count(), 1);
	});
}

#[test]
fn only_one_profile_per_account_allowed() {
	new_test_ext().execute_with(|| {

		// Ensure the user can create profile
		assert_ok!(Profile::create_profile(Origin::signed(1), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())));

		// Ensure creating another profile by the the same origin throws an error
		assert_noop!(Profile::create_profile(Origin::signed(1), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())), Error::<Test>::ProfileAlreadyCreated );
	});
}

#[test]
fn delete_profile_works() {
	new_test_ext().execute_with(|| {

		// Ensure the user can create profile
		assert_ok!(Profile::create_profile(Origin::signed(1), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())));

		// Ensure that the user can delete their profile
		assert_ok!(Profile::remove_profile(Origin::signed(1)));
	});
}

#[test]
fn delete_profile_decreases_profile_count() {
	new_test_ext().execute_with(|| {

		// Ensure the user can create profile
		assert_ok!(Profile::create_profile(Origin::signed(1), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())));

		// Ensure count is increased when creating profile
		assert_eq!(Profile::profile_count(), 1);

		// Ensure teh user can delete their profile
		assert_ok!(Profile::remove_profile(Origin::signed(1)));

		// Ensure count is reduced when removing profile
		assert_eq!(Profile::profile_count(), 0);
	});
}

#[test]
fn user_can_only_delete_own_profile() {
	new_test_ext().execute_with(|| {

		// Ensure the user can create profile
		assert_ok!(Profile::create_profile(Origin::signed(1), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())));

		// Ensure another user can NOT delete others profile
		assert_noop!(Profile::remove_profile(Origin::signed(2)), Error::<Test>::NoProfileCreated);

		// Ensure count is NOT reduced when removing profile
		assert_eq!(Profile::profile_count(), 1);
	});
}

#[test]
fn user_can_update_profile() {
	new_test_ext().execute_with(|| {

		// Ensure the user can create profile
		assert_ok!(Profile::create_profile(Origin::signed(10), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())));

		// Ensure user can update profile with new interests
		assert_ok!(Profile::update_profile(Origin::signed(10), username2(), interests2(), HOURS2, Some(additional_info()), Some(longitude()), Some(latitude())));

		// Get profile for current account
		let profile = Profile::profiles(10).expect("should found the profile");

		// Ensure count is NOT reduced when removing profile
		assert_eq!(Profile::profile_count(), 1);

		// Ensure that the values have been updated successfully
		assert_eq!(profile.name.into_inner(), &[2, 4]);
		assert_eq!(profile.interests.into_inner(), &[3,4]);
		assert_eq!(profile.available_hours_per_week, 20_u8);

	});
}

#[test]
fn user_can_only_update_own_profile() {
	new_test_ext().execute_with(|| {

		// Ensure the user can create profile
		assert_ok!(Profile::create_profile(Origin::signed(1), username(), interests(), HOURS, Some(additional_info()), Some(longitude()), Some(latitude())));

		// Ensure another user can NOT update others profile.
		assert_noop!(Profile::update_profile(Origin::signed(2), username2(), interests2(), HOURS, Some(additional_info()), None, None), Error::<Test>::NoProfileCreated);
	});
}
