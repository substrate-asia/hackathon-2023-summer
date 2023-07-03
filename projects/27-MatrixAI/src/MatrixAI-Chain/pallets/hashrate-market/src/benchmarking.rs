//! Benchmarking setup for pallet-hashrate-market
#![cfg(feature = "runtime-benchmarks")]
use super::*;

#[allow(unused)]
use crate::Pallet as HashrateMarket;
use frame_benchmarking::v2::*;
use frame_system::RawOrigin;
use frame_support::sp_runtime::traits::Bounded;

#[benchmarks]
mod benchmarks {
	use super::*;

	const MACHINE_ID: UUID = [1u8; 16];
	const ORDER_ID: UUID = [2u8; 16];

	#[benchmark]
	fn add_machine() {
		let caller: T::AccountId = whitelisted_caller();
		let metadata: BoundedString<T> = vec![0u8; 100].try_into().unwrap();
		
		#[extrinsic_call]
		_(RawOrigin::Signed(caller.clone()), MACHINE_ID, metadata);

		assert!(Machine::<T>::get(&caller, &MACHINE_ID).is_some());
	}

	#[benchmark]
	fn remove_machine() {
		let caller: T::AccountId = whitelisted_caller();
		let metadata: BoundedString<T> = vec![0u8; 100].try_into().unwrap();
		let _ = HashrateMarket::<T>::add_machine(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, metadata);
		
		#[extrinsic_call]
		_(RawOrigin::Signed(caller.clone()), MACHINE_ID);

		assert!(Machine::<T>::get(&caller, &MACHINE_ID).is_none());
	}

	#[benchmark]
	fn make_offer() {
		let caller: T::AccountId = whitelisted_caller();
		let metadata: BoundedString<T> = vec![0u8; 100].try_into().unwrap();
		let _ = HashrateMarket::<T>::add_machine(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, metadata);
		
		#[extrinsic_call]
		_(RawOrigin::Signed(caller.clone()), MACHINE_ID, 10u32.into());

		assert_eq!(Machine::<T>::get(&caller, &MACHINE_ID).unwrap().price, Some(10u32.into()));
	}

	#[benchmark]
	fn cancel_offer() {
		let caller: T::AccountId = whitelisted_caller();
		let metadata: BoundedString<T> = vec![0u8; 100].try_into().unwrap();
		let _ = HashrateMarket::<T>::add_machine(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, metadata);
		let _ = HashrateMarket::<T>::make_offer(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, 10u32.into());

		#[extrinsic_call]
		_(RawOrigin::Signed(caller.clone()), MACHINE_ID);

		assert!(Machine::<T>::get(&caller, &MACHINE_ID).unwrap().price.is_none());
	}

	#[benchmark]
	fn place_order() {
		let caller: T::AccountId = whitelisted_caller();
		let metadata: BoundedString<T> = vec![0u8; 100].try_into().unwrap();
		let _ = HashrateMarket::<T>::add_machine(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, metadata.clone());
		let _ = HashrateMarket::<T>::make_offer(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, 10u32.into());
		let buyer: T::AccountId = whitelisted_caller();
		T::Currency::make_free_balance_be(&buyer, BalanceOf::<T>::max_value());

		#[extrinsic_call]
		_(RawOrigin::Signed(buyer), ORDER_ID, caller, MACHINE_ID, metadata, 80u32.into());

		assert!(Order::<T>::get(&ORDER_ID).is_some());
	}

	#[benchmark]
	fn order_completed() {
		let caller: T::AccountId = whitelisted_caller();
		let metadata: BoundedString<T> = vec![0u8; 100].try_into().unwrap();
		let _ = HashrateMarket::<T>::add_machine(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, metadata.clone());
		let _ = HashrateMarket::<T>::make_offer(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, 10u32.into());
		let buyer: T::AccountId = whitelisted_caller();
		T::Currency::make_free_balance_be(&buyer, BalanceOf::<T>::max_value());
		let _ = HashrateMarket::<T>::place_order(
			RawOrigin::Signed(buyer).into(), ORDER_ID, caller.clone(), MACHINE_ID, metadata.clone(), 80u32.into()
		);

		#[extrinsic_call]
		_(RawOrigin::Signed(caller), ORDER_ID, metadata);

		assert_eq!(Order::<T>::get(&ORDER_ID).unwrap().status, OrderStatus::Completed);
	}

	#[benchmark]
	fn order_failed() {
		let caller: T::AccountId = whitelisted_caller();
		let metadata: BoundedString<T> = vec![0u8; 100].try_into().unwrap();
		let _ = HashrateMarket::<T>::add_machine(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, metadata.clone());
		let _ = HashrateMarket::<T>::make_offer(RawOrigin::Signed(caller.clone()).into(), MACHINE_ID, 10u32.into());
		let buyer: T::AccountId = whitelisted_caller();
		T::Currency::make_free_balance_be(&buyer, BalanceOf::<T>::max_value());
		let _ = HashrateMarket::<T>::place_order(
			RawOrigin::Signed(buyer).into(), ORDER_ID, caller.clone(), MACHINE_ID, metadata.clone(), 80u32.into()
		);

		#[extrinsic_call]
		_(RawOrigin::Signed(caller), ORDER_ID, metadata);

		assert_eq!(Order::<T>::get(&ORDER_ID).unwrap().status, OrderStatus::Failed);
	}

	impl_benchmark_test_suite!(HashrateMarket, crate::mock::new_test_ext(), crate::mock::Test);
}
