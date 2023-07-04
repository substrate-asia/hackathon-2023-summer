use crate::*;
use frame_benchmarking::{benchmarks, whitelisted_caller};
use frame_system::RawOrigin;

fn assert_last_event<T: Config>(generic_event: <T as Config>::RuntimeEvent) {
	frame_system::Pallet::<T>::assert_last_event(generic_event.into());
}

benchmarks! {
	save_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::ArtworkSaved{owner: caller, ipfs_cid}.into())
	}

	transfer_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
		let to: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), to.clone(), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::Transferred{from: caller, to, ipfs_cid}.into())
	}

	buy_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
		let to: T::AccountId = whitelisted_caller();
		let price = 100u32;
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone(), price.into())
	verify {
		assert_last_event::<T>(Event::Transferred{from: caller, to, ipfs_cid}.into())
	}

	update_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
		let to: T::AccountId = whitelisted_caller();
		let price = 100u32;
		let collateral_period = 10u8;
		let collateral_interest_rate = None;
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone(), Some(price.into()), Some(collateral_period), collateral_interest_rate)
	verify {
		assert_last_event::<T>(Event::ArtworkUpdated{
				ipfs_cid,
				price: Some(price.into()),
				collateral_period: Some(collateral_period),
				collateral_interest_rate: None,
			}.into())
	}

	destroy_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::DestroyArtwork{owner: caller, ipfs_cid}.into())
	}

	start_lend_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::ArtworkStartToLoan{owner: caller, ipfs_cid}.into())
	}

	cancel_lend_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::ArtworkCancelLoan{owner: caller, ipfs_cid}.into())
	}

	borrow_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_eq!(ArtworksOnLoan::<T>::get(&ipfs_cid), None);
	}

	set_real_time_artwork_price {
		let caller: T::AccountId = whitelisted_caller();
		let price = 100u32.into();
	}: _(RawOrigin::Signed(caller.clone()), Some(price))
	verify {
		assert_eq!(RealTimeArtworkPrice::<T>::get(), Some(price));
	}

	automatic_lend_over {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
		let block_number: T::BlockNumber = 1u8.into();
	}: _(RawOrigin::Signed(caller.clone()), block_number, ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::ArtworkLoanOver{ipfs_cid, block_number}.into());
	}

	start_to_pawn_artwork_for_token {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::ArtworkCancelLoan{owner: caller, ipfs_cid}.into())
	}

	start_to_sell {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::ArtworkStartToSell{owner: caller, ipfs_cid}.into())
	}

	cancel_pawn_artwork_for_token {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::ArtworkCancelPawn{owner: caller, ipfs_cid}.into())
	}

	cancel_sale_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::ArtworkCancelSale{owner: caller, ipfs_cid}.into())
	}

	provide_token_loan {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert!(ArtworksExpireBlockForPawn::<T>::get(&ipfs_cid).is_some());
	}

	redemption_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())

	automatic_redemption_artwork {
		let d in 0 .. 64;
		let ipfs_cid = BoundedVec::try_from(vec![0; d as usize]).unwrap();
		let caller: T::AccountId = whitelisted_caller();
	}: _(RawOrigin::Signed(caller.clone()), ipfs_cid.clone())
	verify {
		assert_last_event::<T>(Event::ArtworkPawnOver{ipfs_cid}.into())
	}

	impl_benchmark_test_suite!(ArtworkModule, crate::mock::new_test_ext(), crate::mock::Test);
}
