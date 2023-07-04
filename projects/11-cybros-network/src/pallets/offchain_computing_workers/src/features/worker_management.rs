// This file is part of Cybros.

// Copyright (C) Jun Jiang.
// SPDX-License-Identifier: GPL-3.0-or-later

// Cybros is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Cybros is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Cybros.  If not, see <http://www.gnu.org/licenses/>.

use crate::*;
use frame_support::pallet_prelude::*;

impl<T: Config> Pallet<T> {
	pub(crate) fn do_register_worker(
		owner: T::AccountId,
		worker: T::AccountId,
		impl_id: T::ImplId,
		initial_balance: BalanceOf<T>
	) -> DispatchResult {
		ensure!(owner != worker, Error::<T>::InvalidOwner);

		let deposit = T::RegisterWorkerDeposit::get();
		ensure!(
			initial_balance.saturating_add(T::Currency::free_balance(&worker)) > deposit.saturating_add(T::Currency::minimum_balance()),
			Error::<T>::InitialBalanceTooLow
		);

		ensure!(!Workers::<T>::contains_key(&worker), Error::<T>::AlreadyRegistered);

		let mut impl_info = Impls::<T>::get(&impl_id).ok_or(Error::<T>::ImplNotFound)?;
		impl_info.workers_count += 1;
		Impls::<T>::insert(&impl_id, impl_info);

		let worker_info = WorkerInfo {
			account: worker.clone(),
			owner: owner.clone(),
			deposit,
			status: WorkerStatus::Registered,
			impl_id: impl_id.clone(),
			impl_spec_version: None,
			impl_build_version: None,
			attestation_method: None,
			attestation_expires_at: None,
			attested_at: None,
			last_sent_heartbeat_at: None,
			uptime_started_at: None,
			uptime: None,
		};

		<T as Config>::Currency::transfer(&owner, &worker, initial_balance, ExistenceRequirement::KeepAlive)?;
		if !deposit.is_zero() {
			<T as Config>::Currency::reserve(&worker, deposit)?;
		}

		Workers::<T>::insert(&worker, worker_info);
		AccountOwningWorkers::<T>::insert(&owner, &worker, ());

		Self::deposit_event(Event::<T>::WorkerRegistered { worker, owner, impl_id });
		Ok(())
	}

	pub(crate) fn do_deregister_worker(
		owner: T::AccountId,
		worker: T::AccountId
	) -> DispatchResult {
		let worker_info = Workers::<T>::get(&worker).ok_or(Error::<T>::WorkerNotFound)?;
		Self::ensure_owner(&owner, &worker_info)?;
		ensure!(
			worker_info.status == WorkerStatus::Offline || worker_info.status == WorkerStatus::Registered,
			Error::<T>::WorkerNotOffline
		);
		ensure!(
			T::OffchainWorkerLifecycleHooks::can_deregister(&worker),
			Error::<T>::DeregisterBlocked
		);

		let deposit = worker_info.deposit;
		if !deposit.is_zero() {
			// The upper limit is the actual reserved, so it is OK
			<T as Config>::Currency::unreserve(&worker, deposit);
		}
		<T as Config>::Currency::transfer(
			&worker,
			&owner,
			<T as Config>::Currency::free_balance(&worker),
			ExistenceRequirement::AllowDeath,
		)?;

		let mut impl_info = Impls::<T>::get(&worker_info.impl_id).ok_or(Error::<T>::ImplNotFound)?;
		impl_info.workers_count -= 1;
		Impls::<T>::insert(&worker_info.impl_id, impl_info);

		Workers::<T>::remove(&worker);
		AccountOwningWorkers::<T>::remove(&owner, &worker);

		Self::deposit_event(Event::<T>::WorkerDeregistered { worker, force: false });
		Ok(())
	}
}
