use super::*;
use crate::{mock::*, Event};
use frame_support::assert_ok;

#[test]
fn faucet_top_up_works() {
	new_test_ext().execute_with(|| {
        Balances::make_free_balance_be(&1, BalanceOf::<Test>::max_value());
		assert_ok!(Sminer::faucet_top_up(RuntimeOrigin::signed(1), 100 * FAUCET_VALUE));
        System::assert_last_event(RuntimeEvent::Sminer(Event::FaucetTopUpMoney { 
            acc: 1,
        }));
	});
}

#[test]
fn faucet_works() {
	new_test_ext().execute_with(|| {
        Balances::make_free_balance_be(&1, BalanceOf::<Test>::max_value());
        assert_ok!(Sminer::faucet_top_up(RuntimeOrigin::signed(1), 100 * FAUCET_VALUE));
		assert_ok!(Sminer::faucet(RuntimeOrigin::signed(1), 2));
        System::assert_last_event(RuntimeEvent::Sminer(Event::DrawFaucetMoney()));
	});
}
