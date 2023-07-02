#![cfg(feature = "runtime-benchmarks")]
use super::*;

#[allow(unused)]
use crate::Pallet as DepDNS;
use frame_benchmarking::v2::*;
use frame_support::traits::Currency;
use frame_system::RawOrigin;

type BalanceOf<T> =
	<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

#[benchmarks]
mod benchmarks {
	use super::*;
	use codec::alloc::string::ToString;

	fn funded_account<T: Config>(caller: &T::AccountId, value: BalanceOf<T>) {
		T::Currency::make_free_balance_be(&caller, value);
	}

	#[benchmark]
	fn register_domain() {
		let caller: T::AccountId = whitelisted_caller();
		funded_account::<T>(&caller, 1000000u32.into());
		#[extrinsic_call]
		register_domain(
			RawOrigin::Signed(caller),
			"a.cn".to_string(),
			"a.cn".to_string(),
			vec!["alias".to_string()],
		);

		assert_eq!(DomainRegistry::<T>::contains_key("a.cn"), true);
	}

	#[benchmark]
	fn renew_registration() {
		let caller: T::AccountId = whitelisted_caller();
		funded_account::<T>(&caller, 1000000u32.into());
		let _ = Pallet::<T>::register_domain(
			RawOrigin::Signed(caller.clone()).into(),
			"a.cn".to_string(),
			"a.cn".to_string(),
			vec!["alias".to_string()],
		);

		#[extrinsic_call]
		renew_registration(RawOrigin::Signed(caller), "a.cn".to_string(), 10);

		assert!(DomainRegistry::<T>::contains_key("a.cn"));
	}

	#[benchmark]
	fn add_update_dns_record() {
		let caller: T::AccountId = whitelisted_caller();
		funded_account::<T>(&caller, 1000000u32.into());
		let _ = Pallet::<T>::register_domain(
			RawOrigin::Signed(caller.clone()).into(),
			"a.cn".to_string(),
			"a.cn".to_string(),
			vec!["alias".to_string()],
		);
		#[extrinsic_call]
		add_update_dns_record(
			RawOrigin::Signed(caller),
			"a.cn".to_string(),
			RecordType::A,
			"1.1.1.1".to_string(),
		);
		assert!(ARecords::<T>::contains_key("a.cn"));
	}

	#[benchmark]
	fn cancel_domain() {
		let caller: T::AccountId = whitelisted_caller();
		funded_account::<T>(&caller, 1000000u32.into());
		let _ = Pallet::<T>::register_domain(
			RawOrigin::Signed(caller.clone()).into(),
			"a.cn".to_string(),
			"a.cn".to_string(),
			vec!["alias".to_string()],
		);

		let _ = Pallet::<T>::add_update_dns_record(
			RawOrigin::Signed(caller.clone()).into(),
			"a.cn".to_string(),
			RecordType::A,
			"1.1.1.1".to_string(),
		);
		#[extrinsic_call]
		cancel_domain(RawOrigin::Signed(caller), "a.cn".to_string());
		assert!(!ARecords::<T>::contains_key("a.cn"));
		assert!(!DomainRegistry::<T>::contains_key("a.cn"));
	}
	impl_benchmark_test_suite!(DepDNS, crate::mock::new_test_ext(), crate::mock::Test);
}
