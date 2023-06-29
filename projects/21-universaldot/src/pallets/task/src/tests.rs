use core::convert::TryInto;
use crate::TaskStatus;
use crate::{mock::*, Error, Config, ExpiringTasksPerBlock, DyingTasksPerBlock};
use frame_support::traits::fungible::Inspect;
use frame_support::storage::bounded_vec::BoundedVec;
use frame_support::{assert_noop, assert_ok, traits::{UnixTime, Hooks}};
use sp_core::H256;

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Constants and Functions used in TESTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

pub const MILLISEC_PER_BLOCK: u64 = <Test as Config>::MillisecondsPerBlock::get(); 
pub const HOURS : u8 = 40_u8;
pub const BUDGET : u64 = 7_u64;
pub const BUDGET2 : u64 = 10_u64;

fn username() -> BoundedVec<u8, MaxUsernameLen> {
	vec![1u8, 4].try_into().unwrap()
}

fn interests() -> BoundedVec<u8, MaxInterestsLen> {
	vec![1u8, 4].try_into().unwrap()
}

fn title() -> BoundedVec<u8, MaxTitleLen> {
	vec![1u8, 2].try_into().unwrap()
}

fn title2() -> BoundedVec<u8, MaxTitleLen> {
	vec![1u8, 7].try_into().unwrap()
}

fn spec() -> BoundedVec<u8, MaxSpecificationLen> {
	vec![1u8, 3].try_into().unwrap()
}

fn spec2() -> BoundedVec<u8, MaxSpecificationLen> {
	vec![1u8, 4].try_into().unwrap()
}

fn attachments() -> BoundedVec<u8, MaxAttachmentsLen> {
	vec![1u8, 4].try_into().unwrap()
}

fn attachments2() -> BoundedVec<u8, MaxAttachmentsLen> {
	vec![1u8, 3].try_into().unwrap()
}

fn keywords() -> BoundedVec<u8, MaxKeywordsLen> {
	vec![1u8, 5].try_into().unwrap()
}

fn keywords2() -> BoundedVec<u8, MaxKeywordsLen> {
	vec![1u8, 5].try_into().unwrap()
}

fn feedback() -> BoundedVec<u8, MaxFeedbackLen> {
	vec![1u8, 4].try_into().unwrap()
}

fn additional_info() -> BoundedVec<u8, MaxAdditionalInformationLen> {
	vec![1u8, 4].try_into().unwrap()
}

fn insert_ipfs_cid() -> [u8; 46] {
	*b"QmPmN9nrWrJypfbvJLYDNYyL3d7hi1gToQwDHhvtHWcfKZ"
}

fn x() -> [u8; 5] {
	[1, 2, 3, 4, 5]
}
fn y() -> [u8; 5] {
	*b"ABCDE"
}

fn get_deadline(multiple: u64) -> u64 {
	// deadline is current time + 1 hour
	let deadline = <Time as UnixTime>::now() + std::time::Duration::from_millis(3600 * multiple * 1000_u64);
	let deadline_u64 = deadline.as_secs() * 1000_u64;
	assert_eq!(deadline.as_millis(), deadline_u64 as u128);
	deadline_u64
}

fn get_deadline_block(multiple: u64) -> u64 {
	// deadline is current time + 1 hour
	(((get_deadline(multiple) - <Time as UnixTime>::now().as_millis() as u64) as f64 / MILLISEC_PER_BLOCK as f64).floor() as u64) + System::block_number()
}

fn get_dying_deadline_block(multiple: u64) -> u64 {
	get_deadline_block(multiple) + <Test as Config>::TaskLongevityAfterExpiration::get()
}

fn run_to_block(n: u64) {
	Task::on_finalize(System::block_number());
	for b in (System::block_number() + 1)..=n {
		next_block(b);
		if b != n {
			Task::on_finalize(System::block_number());
		}
	}
}

fn next_block(n: u64) {
	Time::set_timestamp(MILLISEC_PER_BLOCK * n);
	System::set_block_number(n);
	Task::on_initialize(n);
}

fn create_organization() -> H256 {
	// Create organization
	let name : BoundedVec<u8, MaxDaoNameLen> = vec![1u8, 10].try_into().unwrap();
	let description : BoundedVec<u8, MaxDescriptionLen> = vec![1u8, 10].try_into().unwrap();
	let vision : BoundedVec<u8, MaxVisionLen> = vec![1u8, 7].try_into().unwrap();
	assert_ok!(Dao::create_organization(Origin::signed(*ALICE), name, description, vision));

	// Return organization identifier from emitted event
	System::events().into_iter().map(|r| r.event)
		.filter_map(|e| {
			if let Event::Dao(inner) = e {
				if let pallet_dao::Event::<Test>::OrganizationCreated(_creator, org_id) = inner {
					return Some(org_id)
				}
			}
			None
		}).last().expect("Last event must be OrganizationCreated")
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  TESTS  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

#[test]
fn create_new_task(){
	new_test_ext().execute_with(|| {
		// Create profile (required by task)
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		let title = title();
		let specification = spec();
		let deadline = get_deadline(1);
		let attachments = attachments();
		let keywords = keywords();
		let organization = Some(create_organization());
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title.clone(), specification.clone(), BUDGET, deadline, attachments.clone(), keywords.clone(), organization, Some(x()), Some(y())));

		// Get task
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("no task found");

		// Verify task initialised with parameters
		assert_eq!(title, task.title);
		assert_eq!(specification, task.specification);
		assert_eq!(BUDGET, task.budget);
		assert_eq!(deadline, task.deadline);
		assert_eq!(attachments, task.attachments);
		assert_eq!(keywords, task.keywords);
		assert_eq!(organization, task.organization);
	});
}

#[test]
fn fund_transfer_on_create_task(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure balance
		assert_eq!(Balances::free_balance(&*ALICE), 1000);

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec() , BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		assert_eq!(Balances::free_balance(&*ALICE), 993);
		assert_eq!(Balances::reserved_balance(&*ALICE), BUDGET);
	});
}

#[test]
fn increase_task_count_when_creating_task(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec() , BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Assert that count is incremented by 1 after task creation
		assert_eq!(Task::task_count(), 1);
	});
}

#[test]
fn increase_task_count_when_creating_two_tasks(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), BUDGET2, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Assert that count is incremented to 2 after task creation
		assert_eq!(Task::task_count(), 2);
	});
}

#[test]
fn cant_own_more_tasks_than_max_tasks(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Create 77 tasks  ExceedMaxTasksOwned
		for _n in 0..MAX_TASKS_OWNED {
			// Ensure new task can be created.
			assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		}

		// Assert that count is incremented to 2 after task creation
		assert_eq!(Task::task_count(), MAX_TASKS_OWNED as u64);

		// Assert that when creating the 77 Task, Error is thrown
		assert_noop!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())), Error::<Test>::ExceedMaxTasksOwned);
	});
}

#[test]
fn assign_task_to_current_owner(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*TED), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure task can be created
		assert_ok!(Task::create_task(Origin::signed(*TED), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get task
		let task_id = Task::tasks_owned(*TED)[0];
		let task = Task::tasks(task_id).expect("should found the task");

		// Ensure task owner
		assert_eq!(task.current_owner, *TED);
	});
}

#[test]
fn verify_inputs_outputs_to_tasks(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*TED), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure task can be created
		let organization = Some(create_organization());
		assert_ok!(Task::create_task(Origin::signed(*TED), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), organization, Some(x()), Some(y())));

		// Get task
		let task_id = Task::tasks_owned(*TED)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		let location = (x(), y());

		// Ensure that task properties are assigned correctly
		assert_eq!(task.current_owner, *TED);
		assert_eq!(task.specification, vec![1u8, 3]);
		assert_eq!(task.budget, BUDGET);
		assert_eq!(task.title, title());
		assert_eq!(task.attachments, attachments());
		assert_eq!(task.keywords, keywords());
		assert_eq!(task.organization, organization);
		assert!(task.location == Some(location))

	});
}

#[test]
fn task_can_be_updated_after_it_is_created(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*TED), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure task can be created
		assert_ok!(Task::create_task(Origin::signed(*TED), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get task
		let task_id = Task::tasks_owned(*TED)[0];
		let task = Task::tasks(task_id).expect("should found the task");

		// assert expected values before change below
		assert_eq!(task.budget, BUDGET);
		assert_eq!(task.organization, None);

		// Ensure task can be updated
		let organization = Some(create_organization());
		assert_ok!(Task::update_task(Origin::signed(*TED), task_id, title2(), spec2(), BUDGET2, get_deadline(1), attachments2(), keywords2(), organization, Some(x()), Some(y())));

		// Get task
		let task_id = Task::tasks_owned(*TED)[0];
		let task = Task::tasks(task_id).expect("should found the task");

		// Ensure that task properties are assigned correctly
		assert_eq!(task.current_owner, *TED);
		assert_eq!(task.budget, BUDGET2);
		assert_eq!(task.title, title2());
		assert_eq!(task.attachments, attachments2());
		assert_eq!(task.keywords, keywords2());
		assert_eq!(task.organization, organization);
	});
}

#[test]
fn check_balance_after_update_task(){
	new_test_ext().execute_with(|| {
		// Get initial balance of account
		let initial_balance_of_sender = Balances::free_balance(&*TED);

		// Create profile and task
		assert_ok!(Profile::create_profile(Origin::signed(*TED), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*TED), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get task identifier and update task with new budget
		let task_id = Task::tasks_owned(*TED)[0];
		assert_ok!(Task::update_task(Origin::signed(*TED), task_id, title2(), spec2(), BUDGET2, get_deadline(1), attachments2(), keywords2(), None, Some(x()), Some(y())));

		// Ensure the new budget is reserved
		let task_id = Task::tasks_owned(*TED)[0];
		let task = Task::tasks(task_id).expect("should find the task");
		
		let new_balance_of_sender = Balances::free_balance(&*TED);
		assert_eq!(new_balance_of_sender + BUDGET2, initial_balance_of_sender);
		assert_eq!(task.budget, BUDGET2);

		// Update task again with previous budget: can use reserved balance here because there is only one task to play with.
		assert_ok!(Task::update_task(Origin::signed(*TED), task_id, title2(), spec2(), BUDGET, get_deadline(1), attachments2(), keywords2(), None, Some(x()), Some(y())));
		let reserved_balance = Balances::reserved_balance(&*TED);
		assert_eq!(reserved_balance, BUDGET);
	});
}

#[test]
fn check_balance_after_complete_task(){
	new_test_ext().execute_with(|| {
		// Create profiles
		assert_ok!(Profile::create_profile(Origin::signed(*TED), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Profile::create_profile(Origin::signed(*BOB), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Get balance of users
		let creator_balance = Balances::balance(&*TED);
		let volunteer_balance = Balances::balance(&*ALICE);

		// Ensure task can be created
		assert_ok!(Task::create_task(Origin::signed(*TED), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get task identifier
		let task_id = Task::tasks_owned(*TED)[0];

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));
		assert_ok!(Task::accept_task(Origin::signed(*TED), task_id));

		// Ensure the escrow account is 0
		let task_account = Task::account_id(&task_id);
		assert_eq!(Balances::balance(&task_account), 0);

		// Ensure the balances are added/subtracted to respective balances
		assert_eq!(Balances::balance(&*BOB), volunteer_balance + BUDGET);
		assert_eq!(Balances::balance(&*TED), creator_balance - BUDGET);
	});
}

#[test]
fn task_can_be_updated_only_by_one_who_created_it(){
	new_test_ext().execute_with(|| {

		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*TED), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure task can be created
		assert_ok!(Task::create_task(Origin::signed(*TED), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get task identifier
		let task_id = Task::tasks_owned(*TED)[0];

		// Throw error when someone other than creator tries to update task
		assert_noop!(Task::update_task(Origin::signed(*ALICE), task_id, title(), spec(), BUDGET2, get_deadline(1), attachments2(), keywords2(), None, Some(x()), Some(y())), Error::<Test>::OnlyInitiatorUpdatesTask);
	});
}

#[test]
fn task_can_be_updated_only_after_it_has_been_created(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*TED), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure task can be created
		assert_ok!(Task::create_task(Origin::signed(*TED), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get task identifier
		let task_id = Task::tasks_owned(*TED)[0];

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Throw error when someone other than creator tries to update task
		assert_noop!(Task::update_task(Origin::signed(*TED), task_id, title(), spec(), BUDGET2, get_deadline(1), attachments2(), keywords2(), None, Some(x()), Some(y())), Error::<Test>::NoPermissionToUpdate);
	});
}

#[test]
fn start_tasks_assigns_new_current_owner(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Profile::create_profile(Origin::signed(*BOB), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure new task is assigned to new current_owner (user 1)
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		assert_eq!(task.current_owner, *ALICE);
		assert_eq!(Task::tasks_owned(*ALICE).len(), 1);

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure when task is started user1 has 0 tasks, and user2 has 1
		assert_eq!(Task::tasks_owned(*ALICE).len(), 0);
		assert_eq!(Task::tasks_owned(*BOB).len(), 1);
	});
}

#[test]
fn start_tasks_assigns_task_to_volunteer(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure new task is assigned to new current_owner (user 1)
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		assert_eq!(task.current_owner, *ALICE);
		assert_eq!(Task::tasks_owned(*ALICE).len(), 1);

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure when task is started it is assigned to volunteer (user 2)
		assert_eq!(task.volunteer, *ALICE);
		assert_eq!(Task::tasks_owned(*BOB).len(), 1);
		assert_eq!(Task::tasks_owned(*ALICE).len(), 0);
	});
}

#[test]
fn completing_tasks_assigns_new_current_owner(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure new task is assigned to new current_owner (user 1)
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		assert_eq!(task.current_owner, *ALICE);
		assert_eq!(Task::tasks_owned(*ALICE).len(), 1);

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure when task is started user1 has 0 tasks, and user2 has 1
		assert_eq!(Task::tasks_owned(*ALICE).len(), 0);
		assert_eq!(Task::tasks_owned(*BOB).len(), 1);

		// Ensure task is completed by current current_owner (user 2)
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));

		// Ensure that the ownership is reversed again
		assert_eq!(task.current_owner, *ALICE);
		assert_eq!(Task::tasks_owned(*ALICE).len(), 1);
		assert_eq!(Task::tasks_owned(*BOB).len(), 0);
	});
}

#[test]
fn the_volunteer_is_different_from_task_creator(){
	new_test_ext().execute_with(|| {
		// Ensure profile can be created
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure the user that created the task can't start working on the same task
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_noop!(Task::start_task(Origin::signed(*ALICE), task_id), Error::<Test>::NoPermissionToStart);
	});
}

#[test]
fn task_can_only_be_started_once(){
	new_test_ext().execute_with(|| {
		// Ensure profile can be created
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure that task can't be started once its started
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));
		assert_noop!(Task::start_task(Origin::signed(*BOB), task_id), Error::<Test>::NoPermissionToStart);
	});
}

#[test]
fn task_can_only_be_finished_by_the_user_who_started_it(){
	new_test_ext().execute_with(|| {
		// Ensure profile can be created
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure that task can't be started once its started
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure that a user who didn't start the task has no permission to complete it
		assert_noop!(Task::complete_task(Origin::signed(*ALICE), task_id), Error::<Test>::NoPermissionToComplete);
	});
}

#[test]
fn task_can_be_removed_by_owner(){
	new_test_ext().execute_with(|| {
		// Ensure profile can be created
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure that task can't be started once its started
		let task_id = Task::tasks_owned(*ALICE)[0];

		// Ensure another user can't remove the task
		assert_noop!(Task::remove_task(Origin::signed(*BOB), task_id), Error::<Test>::NoPermissionToRemove);

		// Ensure the task can be removed
		assert_ok!(Task::remove_task(Origin::signed(*ALICE), task_id));
		assert_eq!(Task::task_count(), 0);
	});
}

#[test]
fn task_can_be_removed_only_when_status_is_created(){
	new_test_ext().execute_with(|| {
		// Ensure profile can be created
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), 7, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure that task can't be started once its started
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure another user can't remove the task
		assert_noop!(Task::remove_task(Origin::signed(*BOB), task_id), Error::<Test>::NoPermissionToRemove);
	});
}

#[test]
fn only_creator_accepts_task(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Profile::create_profile(Origin::signed(*BOB), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure new task is assigned to new current_owner (user 1)
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		assert_eq!(task.current_owner, *ALICE);
		assert_eq!(Task::tasks_owned(*ALICE).len(), 1);

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure when task is started user1 has 0 tasks, and user2 has 1
		assert_eq!(Task::tasks_owned(*ALICE).len(), 0);
		assert_eq!(Task::tasks_owned(*BOB).len(), 1);

		// Ensure task is completed by current current_owner (user 2)
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));

		// Ensure that the ownership is reversed again
		assert_eq!(Task::tasks_owned(*ALICE).len(), 1);
		assert_eq!(Task::tasks_owned(*BOB).len(), 0);

		// Ensure task is accepted by task creator (user 1)
		assert_noop!(Task::accept_task(Origin::signed(*BOB), task_id), Error::<Test>::OnlyInitiatorAcceptsTask);
		assert_ok!(Task::accept_task(Origin::signed(*ALICE), task_id));
	});
}

#[test]
fn accepted_task_is_added_to_completed_task_for_volunteer(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Profile::create_profile(Origin::signed(*BOB), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure task can be created
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure the task can be started, completed and accepted
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));
		assert_ok!(Task::accept_task(Origin::signed(*ALICE), task_id));

		// An accepted task is added as completed task on volunteer's profile.
		let completed_tasks = Profile::completed_tasks(*BOB);
		assert!(completed_tasks.is_some());
		assert_eq!(completed_tasks.unwrap().into_inner(), vec![task_id]);
	});
}

#[test]
fn volunteer_gets_paid_on_task_completion(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Profile::create_profile(Origin::signed(*BOB), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		let task_id = Task::tasks_owned(*ALICE)[0];

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure task is completed by current current_owner (user 2)
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));

		// Ensure User 2 gets funds for completing task after it is accepted by user 1
		assert_eq!(Balances::balance(&*BOB), 1000);
		assert_ok!(Task::accept_task(Origin::signed(*ALICE), task_id));
		assert_eq!(Balances::balance(&*BOB), 1007);
	});
}

#[test]
fn only_started_task_can_be_completed(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Profile::create_profile(Origin::signed(*BOB), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure new task is assigned to new current_owner (user 1)
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		assert_eq!(task.current_owner, *ALICE);
		assert_eq!(Task::tasks_owned(*ALICE).len(), 1);

		// Ensure that a task can't be completed if it has not been started first
		assert_noop!(Task::complete_task(Origin::signed(*BOB), task_id), Error::<Test>::NoPermissionToComplete);

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure task is completed by current current_owner (user 2)
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));
	});
}

#[test]
fn when_task_is_accepted_ownership_is_cleared(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Profile::create_profile(Origin::signed(*BOB), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure new task is assigned to new current_owner (user 1)
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		assert_eq!(task.current_owner, *ALICE);
		assert_eq!(Task::tasks_owned(*ALICE).len(), 1);

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure when task is started user1 has 0 tasks, and user2 has 1
		assert_eq!(Task::tasks_owned(*ALICE).len(), 0);
		assert_eq!(Task::tasks_owned(*BOB).len(), 1);

		// Ensure task is completed by current current_owner (user 2)
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));

		// Ensure that the ownership is reversed again
		assert_eq!(Task::tasks_owned(*ALICE).len(), 1);
		assert_eq!(Task::tasks_owned(*BOB).len(), 0);

		// Ensure task is accepted by task creator (user 1)
		assert_ok!(Task::accept_task(Origin::signed(*ALICE), task_id));

		// Ensure ownership of task is cleared
		assert_eq!(Task::tasks_owned(*ALICE).len(), 0);
		assert_eq!(Task::tasks_owned(*BOB).len(), 0);
	});
}

#[test]
fn decrease_task_count_when_accepting_task(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get task identifier
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_ok!(Task::tasks(task_id).ok_or(()));

		// Accepting task decreases count
		assert_ok!(Task::accept_task(Origin::signed(*ALICE), task_id));
		assert_eq!(Task::task_count(), 0);
	});
}

#[test]
fn task_can_be_rejected_by_creator(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get task identifier
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_ok!(Task::tasks(task_id).ok_or(()));

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure when task is started user1 has 0 tasks, and user2 has 1
		assert_eq!(Task::tasks_owned(*ALICE).len(), 0);
		assert_eq!(Task::tasks_owned(*BOB).len(), 1);

		// Ensure task is completed by current current_owner (user 2)
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));

		// Task is rejected by creator
		assert_ok!(Task::reject_task(Origin::signed(*ALICE), task_id, feedback()));

		// Assert that the status is back in progress and, owner is the volunteer
		let task_id = Task::tasks_owned(*BOB)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		assert_eq!(task.current_owner, *BOB);
		assert_eq!(task.status, TaskStatus::InProgress);
	});
}

#[test]
fn feedback_is_given_when_task_is_rejected(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get task identifier
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_ok!(Task::tasks(task_id).ok_or(()));

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure when task is started user1 has 0 tasks, and user2 has 1
		assert_eq!(Task::tasks_owned(*ALICE).len(), 0);
		assert_eq!(Task::tasks_owned(*BOB).len(), 1);

		// Ensure task is completed by current current_owner (user 2)
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));

		// Task is rejected by creator
		assert_ok!(Task::reject_task(Origin::signed(*ALICE), task_id, feedback()));

		// Assert that the status is back in progress and, owner is the volunteer
		let task_id = Task::tasks_owned(*BOB)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		assert_eq!(task.feedback, Some(feedback()));
	});
}

#[test]
fn increase_profile_reputation_when_task_completed(){
	new_test_ext().execute_with(|| {
		// Profiles necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Profile::create_profile(Origin::signed(*BOB), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Ensure new task is assigned to new current_owner (user 1)
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("should found the task");
		assert_eq!(task.current_owner, *ALICE);

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));

		// Ensure task is completed by current current_owner (user 2)
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));

		// Ensure task is accepted by task creator (user 1)
		assert_ok!(Task::accept_task(Origin::signed(*ALICE), task_id));

		// Expect to find the profiles
		let profile1 = Profile::profiles(*ALICE).expect("should find the profile");
		let profile2 = Profile::profiles(*BOB).expect("should find the profile");

		// Ensure that the reputation has been added to both profiles
		assert_eq!(profile1.reputation, 1);
		assert_eq!(profile2.reputation, 1);
	});
}

#[test]
fn only_add_reputation_when_task_has_been_accepted(){
	new_test_ext().execute_with(|| {
		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get id of task owned
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_ok!(Task::tasks(task_id).ok_or(()));

		// Ensure task can be accepted
		assert_ok!(Task::accept_task(Origin::signed(*ALICE), task_id));

		// Reputation should remain 0 since the task was removed without being completed
		let profile = Profile::profiles(*ALICE).expect("should find the profile");
		assert_eq!(profile.reputation, 2);
	});
}

#[test]
fn delete_task_after_deadline() {
	new_test_ext().execute_with(|| {
		run_to_block(1);

		// Profile is necessary for task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id);
		
		// Ensure task object is created
		assert!(task.is_some());

		run_to_block(get_dying_deadline_block(1));

		let task = Task::tasks(task_id);
		// Ensure task is deleted after deadline has expired
		assert!(task.is_none());
	});
}

#[test]
fn balance_check_after_task_deletion() {
	new_test_ext().execute_with(|| {
		// Create profile
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		let signer_balance = Balances::balance(&*ALICE);

		// Create task
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		
		// Assign balances to task creator and escrow after task creation
		let signer_free_balance = Balances::free_balance(&*ALICE);
		let task_id = Task::tasks_owned(*ALICE)[0];
		let signer_reserved_balance = Balances::reserved_balance(&*ALICE);
		
		// Ensure balances are correct
		assert_eq!(signer_reserved_balance, BUDGET);
		assert_eq!(signer_balance, signer_reserved_balance + signer_free_balance);

		// Ensure task can be removed
		assert_ok!(Task::remove_task(Origin::signed(*ALICE), task_id));
		let signer_free_balance_post_removal = Balances::free_balance(&*ALICE);
		let signer_reserved_balance_post_removal = Balances::reserved_balance(&*ALICE);

		// Ensure balances are correct after task removal
		assert_eq!(signer_balance, signer_free_balance_post_removal);
		assert_eq!(signer_reserved_balance_post_removal, 0);
	});
}

#[test]
fn block_time_is_added_when_task_is_updated() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);

		// Ensure profile is created before task creation
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Ensure new task can be created.
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		// Get id of task owned
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("no task found");

		// Ensure block time of task creation is correct
		assert_eq!(task.created_at, 1);

		// Update task at set block number
		System::set_block_number(3);
		assert_ok!(Task::update_task(Origin::signed(*ALICE), task_id, title2(), spec2(), BUDGET2, get_deadline(1), attachments2(), keywords2(), None, Some(x()), Some(y())));
		let task = Task::tasks(task_id).expect("no task found");
		assert_eq!(task.updated_at, 3);

		// Ensure task is started by new current_owner (user 2)
		assert_ok!(Task::start_task(Origin::signed(*BOB), task_id));
		System::set_block_number(100);
		
		// Ensure task is completed by current current_owner (user 2)
		assert_ok!(Task::complete_task(Origin::signed(*BOB), task_id));
		let task = Task::tasks(task_id).expect("no task found");
		assert_eq!(task.completed_at, 100);
	})
}

#[test]
fn test_multiple_tasks_and_reserve_amounts() {
	new_test_ext().execute_with(|| {
		// Create profile (required by task)
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Create 2 tasks of budgets 7 and 10
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), BUDGET, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title2(), spec2(), BUDGET2, get_deadline(1), attachments2(), keywords2(), None, Some(x()), Some(y())));

		// Assert that the reserved balances add up
		assert_eq!(Balances::reserved_balance(&*ALICE), BUDGET + BUDGET2);

		// Swap around budgets
		let task_id = Task::tasks_owned(*ALICE)[0];
		assert_ok!(Task::update_task(Origin::signed(*ALICE), task_id, title(), spec(), BUDGET2, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));

		assert_eq!(Balances::reserved_balance(&*ALICE), BUDGET2 + BUDGET2);
		assert_ok!(Task::update_task(Origin::signed(*ALICE), task_id, title2(), spec2(), BUDGET, get_deadline(1), attachments2(), keywords2(), None, Some(x()), Some(y())));
		assert_eq!(Balances::reserved_balance(&*ALICE), BUDGET2 + BUDGET);
	})
}
#[test]
fn test_create_insufficient_funds_to_reserve() {
	new_test_ext().execute_with(|| {
		// Create profile (required by task)
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		
		//Create a task with more tokens than the signer has
		assert_noop!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) + 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())), Error::<Test>::NotEnoughBalance);
	})
}

#[test]
fn test_update_insufficient_funds_to_reserve() {
	new_test_ext().execute_with(|| {
		// Create profile (required by task)
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		
		// Create task that should be ok (and get id)
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		let task_id = Task::tasks_owned(*ALICE)[0];

		// Update that task with a balance more than signer has

		assert_noop!(Task::update_task(Origin::signed(*ALICE), task_id, title2(), spec2(), Balances::free_balance(&*ALICE) + 1000, get_deadline(1), attachments2(), keywords2(), None, Some(x()), Some(y())), Error::<Test>::NotEnoughBalance);
	})
}	

#[test]
fn test_create_two_tasks_insufficient_balance() {
	new_test_ext().execute_with(|| {
		// Create profile (required by task)
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));

		// Create a task with an ok balance
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		
		// Create a task with a balance not possible

		assert_noop!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) + 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())), Error::<Test>::NotEnoughBalance);		

	})
}

#[test]
fn tasks_are_moved_to_expiry() {
	new_test_ext().execute_with( || {

		// Setup state;
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec(), Balances::free_balance(&*ALICE), get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		
		let task_id_0 = Task::tasks_owned(*ALICE)[0];
		let task_id_1 = Task::tasks_owned(*ALICE)[1];
		
		// Assert that the tasks have been added to the expiring blocks storage;
		assert!(ExpiringTasksPerBlock::<Test>::get(get_deadline_block(1)).contains(&task_id_0));
		assert!(ExpiringTasksPerBlock::<Test>::get(get_deadline_block(1)).contains(&task_id_1));
	
		// And not the dying blocks storage;
		assert!(!DyingTasksPerBlock::<Test>::get(get_deadline_block(1)).contains(&task_id_1));
	})
}

#[test]
fn tasks_are_moved_to_dying_after_expiry() {
	new_test_ext().execute_with( || {

		// Setup state;
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		
		let task_id_0 = Task::tasks_owned(*ALICE)[0];
		let dying_deadline_block = get_dying_deadline_block(1);
		let deadline_block = get_deadline_block(1);

		// Assert state is correct before expiry;
		assert!(ExpiringTasksPerBlock::<Test>::get(deadline_block).contains(&task_id_0));
		assert!(!DyingTasksPerBlock::<Test>::get(dying_deadline_block).contains(&task_id_0));

		run_to_block(dying_deadline_block - 1);

		// Assert that the expiring task has been moved to dying tasks;
		assert!(!ExpiringTasksPerBlock::<Test>::get(deadline_block).contains(&task_id_0));
		assert!(DyingTasksPerBlock::<Test>::get(dying_deadline_block).contains(&task_id_0));
	})
}

#[test]
fn update_task_updates_block_expiry_with_different_deadline() {
	new_test_ext().execute_with( || {
		
		// Setup state;
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		
		let task_id_0 = Task::tasks_owned(*ALICE)[0];
		let deadline_block_1 = get_deadline_block(1); 
		let deadline_block_2 = get_deadline_block(2); 

		// Assert state is correct and update with new deadline;
		assert!(ExpiringTasksPerBlock::<Test>::get(deadline_block_1).contains(&task_id_0));
		assert_ok!(Task::update_task(Origin::signed(*ALICE), task_id_0, title2(), spec2(), BUDGET2, get_deadline(2), attachments2(), keywords2(), None, Some(x()), Some(y())));		

		// Assert that the expiring task has been added to the new deadline block and removed from the old one;
		assert!(ExpiringTasksPerBlock::<Test>::get(deadline_block_2).contains(&task_id_0));
		assert!(!ExpiringTasksPerBlock::<Test>::get(deadline_block_1).contains(&task_id_0));
	})
}

#[test]
fn dying_tasks_are_removed_after_grace_period() {
	new_test_ext().execute_with( || {
		
		// Setup state;
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		
		let task_id_0 = Task::tasks_owned(*ALICE)[0];
		let dying_deadline_block = get_dying_deadline_block(1);
		
		// Run to block before death and assert its existance;
		run_to_block(dying_deadline_block - 1);
		assert!(DyingTasksPerBlock::<Test>::get(dying_deadline_block).contains(&task_id_0));

		// Run to block of death and assert it does not exits anymore;
		run_to_block(dying_deadline_block);
		assert!(!DyingTasksPerBlock::<Test>::get(dying_deadline_block).contains(&task_id_0));
	})
}

#[test]
fn test_expired_task_revival_status() {
	new_test_ext().execute_with( || {
		// Setup state;
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		
		let task_id = Task::tasks_owned(*ALICE)[0];
		let task = Task::tasks(task_id).expect("no task found");
		let deadline_block = get_deadline_block(1);

		// Assert that the status is ok and run to expiry deadline;
		assert!(task.status == TaskStatus::Created);
		run_to_block(deadline_block + 1);

		// Assert that the status has indeed expired on this block;
		let task = Task::tasks(task_id).expect("no task found");
		assert!(task.status == TaskStatus::Expired);

		// Revive the task;
		let _ = Task::revive_expired_task(Origin::signed(*ALICE), task_id, get_deadline(2));
		let task = Task::tasks(task_id).expect("no task found");

		// Assert that the task state has been updated correctly;
		assert!(task.status == TaskStatus::Created);
		assert!(task.deadline_block.unwrap() == get_deadline_block(2));
		assert!(task.deadline == get_deadline(2));
	})
}

#[test]
fn test_revival_swaps_task_from_dying_to_expired() {
	new_test_ext().execute_with( || {
		// Setup state;
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		
		let task_id = Task::tasks_owned(*ALICE)[0];
		let deadline_block = get_deadline_block(1);
		let dying_deadline_block = get_dying_deadline_block(1);

		// Assert the task exists is expiring storage;
		assert!(ExpiringTasksPerBlock::<Test>::get(deadline_block).contains(&task_id));

		// Run to expiry deadline;
		run_to_block(deadline_block);

		// Assert that the task exists in dying storage;
		assert!(DyingTasksPerBlock::<Test>::get(dying_deadline_block).contains(&task_id));

		// Revive the task;
		let _ = Task::revive_expired_task(Origin::signed(*ALICE), task_id, get_deadline(2));

		// Assert the task exists in expiring storage and not in dying storage;
		assert!(ExpiringTasksPerBlock::<Test>::get(get_deadline_block(2)).contains(&task_id));
		assert!(!DyingTasksPerBlock::<Test>::get(dying_deadline_block).contains(&task_id));
	})
}

#[test]
fn test_only_initiator_can_revive() {
	new_test_ext().execute_with( || {
			// Setup state;
			assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
			assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
			
			let task_id = Task::tasks_owned(*ALICE)[0];
			let deadline_block = get_deadline_block(1);
			
			// Run to expiry deadline;
			run_to_block(deadline_block);

			// Assert Bobo cannot revive as he is not task initiator;
			assert_noop!(Task::revive_expired_task(Origin::signed(*BOB), task_id, get_deadline(2)), Error::<Test>::OnlyInitiatorUpdatesTask);
	
	})
}


#[test]
fn test_revive_task_with_invalid_new_deadline() {
	new_test_ext().execute_with( || {
		// Setup state;
		assert_ok!(Profile::create_profile(Origin::signed(*ALICE), username(), interests(), HOURS, Some(additional_info()), Some(x()), Some(y())));
		assert_ok!(Task::create_task(Origin::signed(*ALICE), title(), spec2(), Balances::free_balance(&*ALICE) - 1000, get_deadline(1), attachments(), keywords(), None, Some(x()), Some(y())));
		
		let task_id = Task::tasks_owned(*ALICE)[0];
		let deadline_block = get_deadline_block(1);
		
		// Run to expiry deadline;
		run_to_block(deadline_block);

		// Assert it does not operate with an invalid deadline;
		assert_noop!(Task::revive_expired_task(Origin::signed(*ALICE), task_id, (<Time as UnixTime>::now().as_millis() - 100000) as u64), Error::<Test>::IncorrectDeadlineTimestamp);
	})
}


