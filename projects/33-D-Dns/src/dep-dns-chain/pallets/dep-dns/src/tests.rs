#[cfg(test)]
use crate::{mock::*, Error};
use frame_support::{assert_noop, assert_ok, traits::Currency};

#[test]
fn it_should_register_domain_successfully() {
	new_test_ext().execute_with(|| {
		let account_id = 1;
		let domain = "example".to_string();
		let domain_alias = vec!["alias".to_string()];
		let owner_info = "Owner Information".to_string();

		// Provide initial balance for account
		let _ = Balances::deposit_creating(&1, 1000);

		// Dispatch a signed extrinsic for domain registration
		assert_ok!(DepDNS::register_domain(
			RuntimeOrigin::signed(account_id),
			domain.clone(),
			owner_info.clone(),
			domain_alias.clone()
		));
	});
}

#[test]
fn it_should_not_register_domain_if_exists() {
	new_test_ext().execute_with(|| {
		// Ensure the expected error is thrown when no value is present.
		System::set_block_number(1);

		let account_id = 1;
		let domain = "example".to_string();
		let domain_alias = vec!["alias".to_string()];
		let owner_info = "Owner Information".to_string();

		let _ = Balances::deposit_creating(&account_id, 2000);

		assert_ok!(DepDNS::register_domain(
			RuntimeOrigin::signed(account_id),
			domain.clone(),
			owner_info.clone(),
			domain_alias.clone()
		));
		assert_noop!(
			DepDNS::register_domain(
				RuntimeOrigin::signed(account_id),
				domain.clone(),
				owner_info.clone(),
				domain_alias.clone()
			),
			Error::<Test>::Existed
		);
	});
}

#[test]
fn it_should_transfer_ownership() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);

		let old_owner = 1;
		let new_owner = 2;
		let domain = "example".to_string();
		let domain_alias = vec!["alias".to_string()];
		let owner_info = "Owner Information".to_string();

		let _ = Balances::deposit_creating(&old_owner, 1000);
		assert_ok!(DepDNS::register_domain(
			RuntimeOrigin::signed(old_owner),
			domain.clone(),
			owner_info.clone(),
			domain_alias.clone()
		));

		assert_ok!(DepDNS::transfer_ownershit(
			RuntimeOrigin::signed(old_owner),
			domain.clone(),
			new_owner
		));
	});
}
