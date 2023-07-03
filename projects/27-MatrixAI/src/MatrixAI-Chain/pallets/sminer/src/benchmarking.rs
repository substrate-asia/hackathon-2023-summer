//! Benchmarking setup for pallet-hashrate-market
#![cfg(feature = "runtime-benchmarks")]
use super::*;

#[allow(unused)]
use crate::Pallet as Sminer;
use frame_benchmarking::v2::*;
use frame_system::RawOrigin;
use frame_support::sp_runtime::traits::Bounded;

#[benchmarks]
mod benchmarks {
	use super::*;

	#[benchmark]
	fn faucet_top_up() {
		let caller: T::AccountId = whitelisted_caller();
		T::Currency::make_free_balance_be(&caller, BalanceOf::<T>::max_value());
		let award: BalanceOf::<T> = (100 * FAUCET_VALUE).try_into().ok().unwrap();

		#[extrinsic_call]
		_(RawOrigin::Signed(caller.clone()), award);

		let reward_pot = T::PalletId::get().into_account_truncating();
		assert_eq!(T::Currency::free_balance(&reward_pot), award);
	}

	#[benchmark]
	fn faucet() {
		let caller: T::AccountId = whitelisted_caller();
		T::Currency::make_free_balance_be(&caller, BalanceOf::<T>::max_value());
		let award: BalanceOf::<T> = (100 * FAUCET_VALUE).try_into().ok().unwrap();
		let _ = Sminer::<T>::faucet_top_up(RawOrigin::Signed(caller.clone()).into(), award);
		let alice: AccountOf<T> = account("alice", 0, 0);
		
		#[extrinsic_call]
		_(RawOrigin::Signed(caller), alice.clone());

		assert_eq!(T::Currency::free_balance(&alice), FAUCET_VALUE.try_into().ok().unwrap());
	}

	impl_benchmark_test_suite!(Sminer, crate::mock::new_test_ext(), crate::mock::Test);
}
