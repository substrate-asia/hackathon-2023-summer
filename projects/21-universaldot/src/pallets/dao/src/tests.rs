use crate::{mock::*, Error};
use frame_support::{assert_noop, assert_ok, BoundedVec};
use sp_core::H256;


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Constants and Functions used in TESTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type OrgEvent = crate::Event<Test>;

fn vision() -> BoundedVec<u8, MaxVisionLen> 
{
	vec![10u8, 50].try_into().expect("too long for config")
}

fn name() -> Vec<u8> {
	vec![1u8, 10]
}

fn bounded_name() -> BoundedVec<u8, MaxDaoNameLen>
{
	name().try_into().unwrap()
}

fn name2() -> Vec<u8> {
	vec![1u8, 12]
}

fn bounded_name2() -> BoundedVec<u8, MaxDaoNameLen>
{
	name2().try_into().unwrap()
}

fn description() -> Vec<u8> {
	vec![1u8, 10]
}

fn bounded_description() -> BoundedVec<u8, MaxDescriptionLen>
{
	description().try_into().unwrap()
}

fn description2() -> Vec<u8> {
	vec![1u8, 12]
}

fn bounded_description2() -> BoundedVec<u8, MaxDescriptionLen>
{
	description2().try_into().unwrap()
}

fn last_event() -> OrgEvent {
	System::events()
		.into_iter()
		.map(|r| r.event)
		.filter_map(|e| {
			if let Event::Dao(inner) = e {
				Some(inner)
			} else {
				None
			}
		})
		.last()
		.expect("Event expected")
}

fn create_organization_1() -> H256 {

	// Ensure organization can be created
	assert_ok!(Dao::create_organization(Origin::signed(*ALICE), bounded_name(), bounded_description(), vision()));

	let event = last_event();
	if let crate::Event::OrganizationCreated(_creator, org_id) = event {
		return org_id;
	} else {
		assert!(false, "Last event must be OrganizationCreated");
		return H256::zero();
	}
}

fn create_organization_2() -> H256 {

	// Ensure organization can be created
	assert_ok!(Dao::create_organization(Origin::signed(*ALICE), bounded_name2(), bounded_description2(), vision()));
	let event = last_event();
	if let crate::Event::OrganizationCreated(_creator, org_id) = event {
		return org_id;
	} else {
		assert!(false, "Last event must be OrganizationCreated");
		return H256::zero();
	}
}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  TESTS  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

#[test]
fn only_organisation_owner_can_remove_vision() {
	new_test_ext().execute_with(|| {
		let org_id = create_organization_1();
		// Assert that alice can change the vision.
		assert_ok!(Dao::update_organization(Origin::signed(*ALICE), org_id, Some(bounded_name()), Some(bounded_description()), Some(vec![12u8; 20].try_into().unwrap())));

		// Assert that Bob cannot.
		assert_noop!(Dao::update_organization(Origin::signed(*BOB), org_id, Some(bounded_name()), Some(bounded_description()), Some(vec![8u8; 10].try_into().unwrap())), Error::<Test>::NotOrganizationOwner);
	});
}

//fn user_can_sign_onto_vision() {
#[test]
fn user_can_unsign_from_vision() {
	new_test_ext().execute_with(|| {

		// Ensure the DAO can create a vision document
		let org_id = create_organization_1();

		// Ensure a user can sign onto vision.
		assert_ok!(Dao::apply_to_organization(Origin::signed(*BOB), org_id));

		// Ensure the length of VisionSigners has increased
		assert_eq!(Dao::applicants_to_organization(org_id).len(), 1);

		// Ensure a user can unsign onto vision.
		assert_ok!(Dao::remove_application_from_organization(Origin::signed(*BOB), org_id));

		// Ensure the length of VisionSigners has increased
		assert_eq!(Dao::applicants_to_organization(org_id).len(), 0);
	});
}

#[test]
fn user_can_sign_onto_vision_if_org_exists() {
	new_test_ext().execute_with(|| {
		let org_id_1 = create_organization_1();
		// Assert that the vision cannot be signed if the given org doesnt exist.		
		assert_noop!(Dao::apply_to_organization(Origin::signed(*ALICE), H256::from([8u8; 32])), Error::<Test>::InvalidOrganization);
		assert_ok!(Dao::apply_to_organization(Origin::signed(*ALICE), org_id_1));
	});
}

#[test]
fn user_cannot_unsign_if_org_does_not_exist() {
	new_test_ext().execute_with(|| {
		let org_id_1 = create_organization_1();

		// Ensure Error is thrown if vision doesn't exist when unsigning
		assert_ok!(Dao::apply_to_organization(Origin::signed(*ALICE), org_id_1));
		assert_noop!(Dao::remove_application_from_organization(Origin::signed(*ALICE), H256::from([8u8; 32])), Error::<Test>::InvalidOrganization);
	});
}

#[test]
fn user_can_sign_onto_vision_only_if_not_signed_previously() {
	new_test_ext().execute_with(|| {
		let org_id = create_organization_1();

		// Ensure Vision can be signed
		assert_ok!(Dao::apply_to_organization(Origin::signed(*BOB), org_id));

		// Ensure Error is thrown if vision is already signed
		assert_noop!(Dao::apply_to_organization(Origin::signed(*BOB), org_id), Error::<Test>::AlreadySigned );
	});
}

#[test]
fn user_can_unsign_from_vision_only_if_signed_previously() {
	new_test_ext().execute_with(|| {
		let org_id = create_organization_1();
		// Ensure Error is thrown if vision has not been signed previously
		assert_noop!(Dao::remove_application_from_organization(Origin::signed(*BOB), org_id), Error::<Test>::NotSigned );
	});
}

#[test]
fn can_create_an_organization() {
	new_test_ext().execute_with(|| {

		// Create organization with members
		let org_id = create_organization_1();
		let members = Dao::members(org_id);

		// Ensure the length of organization is equal to 1, and that member is creater of org.
		assert_eq!(members.len(), 1);
		assert_eq!(Dao::members(org_id)[0], *ALICE);
	});
}

#[test]
fn cant_create_duplicate_organisations() {
	new_test_ext().execute_with(|| {

		// Ensure organization can be created
		assert_ok!(Dao::create_organization(Origin::signed(*ALICE), bounded_name(), bounded_description(), vision()));

		// Ensure that you can't create org with same data in same block
		assert_noop!(Dao::create_organization(Origin::signed(*ALICE), bounded_name(), bounded_description(), vision()), Error::<Test>::OrganizationAlreadyExists);
	});
}

#[test]
fn creating_organization_increases_organization_count() {
	new_test_ext().execute_with(|| {

		// Create organization
		create_organization_1();

		// Ensure organization count is 1
		assert_eq!(Dao::organization_count(), 1);
	});
}

#[test]
fn can_create_multiple_organization() {
	new_test_ext().execute_with(|| {

		// Create 2 organizations
		let org_id_1 = create_organization_1();
		let org_id_2 = create_organization_2();

		// Ensure each has 1 member, the creator
		assert_eq!(Dao::members(org_id_1).len(), 1);
		assert_eq!(Dao::members(org_id_2).len(), 1);

		// Ensure organization count is 2
		assert_eq!(Dao::organization_count(), 2);
	});
}


#[test]
fn can_remove_an_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// Ensure organization can be removed
		assert_ok!(Dao::dissolve_organization(Origin::signed(*ALICE), org_id));

		// Ensure the organization has been removed by checking the length
		assert_eq!(Dao::members(org_id).len(), 0);
	});
}

#[test]
fn removing_organization_decreases_organization_count() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);
		assert_eq!(Dao::organization_count(), 1);

		// Ensure organization can be removed
		assert_ok!(Dao::dissolve_organization(Origin::signed(*ALICE), org_id));

		// Ensure the organization has been removed by checking the length
		assert_eq!(Dao::members(org_id).len(), 0);

		// Ensure organization count is 0
		assert_eq!(Dao::organization_count(), 0);
	});
}

#[test]
fn only_creator_can_remove_their_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// Ensure organization can't be removed by another member. Only creator can remove their own org
		assert_noop!(Dao::dissolve_organization(Origin::signed(*BOB), org_id), Error::<Test>::NotOrganizationOwner);

		// Ensure the organization has not been deleted
		assert_eq!(Dao::members(org_id).len(), 1);

	});
}

#[test]
fn can_add_user_to_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// Ensure users can be added to a DAO
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id, *EVE));

		// Ensure the organization has 2 members (creator abd user4)
		assert_eq!(Dao::members(org_id).len(), 2);

	});
}

#[test]
fn only_creator_can_add_user_to_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// Throw error if another than Creator is trying to add members
		assert_noop!(Dao::add_members(Origin::signed(*BOB), org_id, *EVE), Error::<Test>::NotOrganizationOwner);
	});
}


#[test]
fn can_only_add_members_if_not_already_in_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// Throw error if another than Creator is trying to add members
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id, *BOB));

		// Ensure adding existing member throws an error
		assert_noop!(Dao::add_members(Origin::signed(*ALICE), org_id, *BOB), Error::<Test>::AlreadyMember);
	});
}

#[test]
fn organization_exists_check_before_adding_user_to_org() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// dissolve_organization
		assert_ok!(Dao::dissolve_organization(Origin::signed(*ALICE), org_id));

		// Throw error if org_id is not found
		assert_noop!(Dao::add_members(Origin::signed(*ALICE), org_id, *EVE), Error::<Test>::InvalidOrganization);
	});
}

#[test]
fn only_creator_can_remove_users_from_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// Ensure users can be added to a DAO
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id, *EVE));

		// When user 2 who didn't create organization tries to remove user, throw error
		assert_noop!(Dao::remove_members(Origin::signed(*BOB), org_id, *EVE), Error::<Test>::NotOrganizationOwner);

	});
}

#[test]
fn organization_exists_check_before_removing_user_from_org() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// Ensure users can be added to a DAO
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id, *EVE));

		// dissolve_organization
		assert_ok!(Dao::dissolve_organization(Origin::signed(*ALICE), org_id));

		// Ensure error is thrown when removing members from non-existing organization
		assert_noop!(Dao::remove_members(Origin::signed(*ALICE), org_id, *EVE), Error::<Test>::InvalidOrganization);
	});
}

#[test]
fn can_remove_users_from_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// Ensure users can be added to a DAO
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id, *EVE));
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id, *JOHN));

		// User can be removed from organization
		assert_ok!(Dao::remove_members(Origin::signed(*ALICE), org_id, *EVE));

		// Validate Ensure length of users in org is 2
		assert_eq!(Dao::members(org_id).len(), 2);

	});
}

#[test]
fn can_only_remove_users_that_belong_to_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();

		// Ensure the length of organization is equal to 1
		assert_eq!(Dao::members(org_id).len(), 1);

		// Ensure users can be added to a DAO
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id, *EVE));

		// Ensure length of users in org is 2
		assert_eq!(Dao::members(org_id).len(), 2);

		// Ensure error is thrown if user is not in organization
		assert_noop!(Dao::remove_members(Origin::signed(*ALICE), org_id, *JOHN), Error::<Test>::NotMember);

	});
}

#[test]
fn user_can_view_organization_it_belongs_to_member_of() {
	new_test_ext().execute_with(|| {

		// Create 2 organizations
		let org_id_1 = create_organization_1();
		let org_id_2 = create_organization_2();

		// Ensure each organization was created successfully
		assert_eq!(Dao::members(org_id_1).len(), 1);
		assert_eq!(Dao::members(org_id_2).len(), 1);

		// Ensure users can be added to a DAO
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id_1, *EVE));
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id_2, *EVE));

		// Ensure EVE belongs to two organizations
		assert_eq!(Dao::member_of(*EVE).len(), 2);

	});
}

#[test]
fn user_can_be_removed_from_organization_it_belongs_to_member_of() {
	new_test_ext().execute_with(|| {

		// Create 2 organizations
		let org_id_1 = create_organization_1();
		let org_id_2 = create_organization_2();

		// Ensure each organization was created successfully
		assert_eq!(Dao::members(org_id_1).len(), 1);
		assert_eq!(Dao::members(org_id_2).len(), 1);

		// Ensure user 4 is member of 0 organizations
		assert_eq!(Dao::member_of(*EVE).len(), 0);

		// Ensure user 4 can be added to a DAO
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id_1, *EVE));
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id_2, *EVE));

		// Ensure the user 4 is member of 2 organizations
		assert_eq!(Dao::member_of(*EVE).len(), 2);

		// User can be removed from organization
		assert_ok!(Dao::remove_members(Origin::signed(*ALICE), org_id_1, *EVE));

		// Ensure user 4 belongs to 1 organizations
		assert_eq!(Dao::member_of(*EVE).len(), 1);

	});
}

#[test]
fn user_can_not_be_removed_from_organization_that_does_not_exist() {
	new_test_ext().execute_with(|| {

		// Create organizations
		let org_id_1 = create_organization_1();
		let org_id_2 = create_organization_2();

		// Ensure each organization was created successfully
		assert_eq!(Dao::members(org_id_1).len(), 1);
		assert_eq!(Dao::members(org_id_2).len(), 1);

		// Ensure user EVE is member of 0 organizations
		assert_eq!(Dao::member_of(*EVE).len(), 0);

		// Ensure user EVE can be added to 1 organizations
		assert_ok!(Dao::add_members(Origin::signed(*ALICE), org_id_1, *EVE));

		// Ensure the user EVE is member of 1 organizations
		assert_eq!(Dao::member_of(*EVE).len(), 1);

		// Throws error when attempting to remove user from non-existing organization
		let hash = sp_core::H256::zero();
		assert_noop!(Dao::remove_members(Origin::signed(*BOB), hash, *EVE), Error::<Test>::InvalidOrganization);

		// Ensure user EVE belongs to 1 organizations
		assert_eq!(Dao::member_of(*EVE).len(), 1);

	});
}


#[test]
fn can_update_an_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();
		System::set_block_number(5);

		// Ensure organization can be updated
		assert_ok!(Dao::update_organization(Origin::signed(*ALICE), org_id, Some(bounded_name()), Some(bounded_description()), None));
		assert_eq!(Dao::member_of(*ALICE)[0], org_id);
		let event = last_event();

		// Ensure the last event is correct
		match event {
			crate::Event::OrganizationUpdated(_creater, _org_id ) => {
			},
			_ => {assert!(false, "Last event must be OrganizationUpdated");}
		}

	});
}

#[test]
fn only_owner_can_update_an_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();
		System::set_block_number(5);

		// Ensure only owner can update organization
		assert_noop!(Dao::update_organization(Origin::signed(*EVE), org_id, Some(bounded_name()), Some(bounded_description()), None), Error::<Test>::NotOrganizationOwner);
	});
}

#[test]
fn can_transfer_ownership_of_an_organization() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();
		System::set_block_number(5);

		// Ensure ownership can be transferred from one to another user
		assert_ok!(Dao::transfer_ownership(Origin::signed(*ALICE), org_id, *EVE));

		// Ensure last event is correct
		let event = last_event();
		match event {
			crate::Event::OrganizationOwnerChanged(_creater, _org_id, _new_owner ) => {
			},
			_ => {assert!(false, "Last event must be OrganizationOwnerChanged");}
		}

		// Ensure only owner can change org
		System::set_block_number(7);
		assert_noop!(Dao::update_organization(Origin::signed(*ALICE), org_id, Some(bounded_name()), Some(bounded_description()), None), Error::<Test>::NotOrganizationOwner);

	});
}

#[test]
fn owner_can_not_transfer_ownership_to_itself() {
	new_test_ext().execute_with(|| {

		// Create organization
		let org_id = create_organization_1();
		System::set_block_number(5);

		// Ensure user can't transfer ownership to itself
		assert_noop!(Dao::transfer_ownership(Origin::signed(*EVE), org_id, *EVE), Error::<Test>::NotOrganizationOwner);

	});
}

#[test]
fn test_org_is_retained_when_multiple_orgs_created() {
	new_test_ext().execute_with(|| {
		// ALICE creates 2 organizations. 
		let _org_id_1 = create_organization_1();
		let _org_id_2 = create_organization_2();

		// Assert ALICE is a member of 2 Daos + 2 exist
		assert!(Dao::member_of(*ALICE).len() == 2);
		assert!(Dao::organization_count() == 2);
	});
}

#[test]
fn test_members_are_mutated_on_ownership_transfer() {
	new_test_ext().execute_with(|| {
		let org_id_1 = create_organization_1();

		// Assert state is correctly setup;
		assert!(Dao::member_of(*ALICE).len() == 1);
		assert_eq!(Dao::members(org_id_1)[0], *ALICE);
		assert!(Dao::organizations(org_id_1).unwrap().owner == *ALICE);

		// Transfer ownership to BOB;
		let _ = Dao::transfer_ownership(Origin::signed(*ALICE), org_id_1, *BOB);

		// Assert Alice is no longer a member of the org;
		assert!(Dao::member_of(*ALICE).len() == 0);

		// Assert Bob is now a member of the organisation,
		// Organisations members have been updated
		// and Bob is the new owner;
		assert_eq!(Dao::members(org_id_1)[0], *BOB);
		assert!(Dao::member_of(*BOB).len() == 1);
		assert!(Dao::organizations(org_id_1).unwrap().owner == *BOB);

		assert!(Dao::organization_count() == 1);
	});
}
