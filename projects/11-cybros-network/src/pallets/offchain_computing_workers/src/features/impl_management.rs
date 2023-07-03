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
	pub fn do_register_impl(
		impl_id: T::ImplId,
		owner: T::AccountId,
		attestation_method: AttestationMethod,
		deployment_permission: ApplicableScope,
	) -> DispatchResult {
		ensure!(!Impls::<T>::contains_key(&impl_id), Error::<T>::ImplIdTaken);

		let deposit = T::RegisterImplDeposit::get();
		T::Currency::reserve(&owner, deposit)?;

		let impl_info = ImplInfo::<T::ImplId, T::AccountId, BalanceOf<T>> {
			id: impl_id.clone(),
			owner: owner.clone(),
			owner_deposit: deposit,
			attestation_method: attestation_method.clone(),
			deployment_scope: deployment_permission.clone(),
			workers_count: 0,
		};

		Impls::<T>::insert(impl_id, impl_info);
		AccountOwningImpls::<T>::insert(&owner, &impl_id, ());

		Self::deposit_event(
			Event::ImplRegistered {
				owner, attestation_method, impl_id,
				deployment_scope: deployment_permission
			}
		);
		Ok(())
	}

	pub fn do_deregister_impl(
		who: T::AccountId,
		impl_id: T::ImplId
	) -> DispatchResult {
		let impl_info = Impls::<T>::get(&impl_id).ok_or(Error::<T>::ImplNotFound)?;
		Self::ensure_impl_owner(&who, &impl_info)?;
		ensure!(impl_info.workers_count == 0, Error::<T>::ImplStillInUse);

		if let Some(metadata_entry) = ImplMetadata::<T>::take(&impl_id) {
			T::Currency::unreserve(&metadata_entry.depositor, metadata_entry.actual_deposit);
		}

		let _ = ImplBuilds::<T>::clear_prefix(&impl_id, T::MaxImplBuilds::get(), None);
		CounterForImplBuilds::<T>::remove(&impl_info.id);

		Impls::<T>::remove(&impl_id);
		AccountOwningImpls::<T>::remove(&impl_info.owner, &impl_id);

		T::Currency::unreserve(&impl_info.owner, impl_info.owner_deposit);

		Self::deposit_event(Event::ImplDeregistered { impl_id });
		Ok(())
	}

	pub(crate) fn do_update_impl_metadata(
		impl_info: ImplInfo<T::ImplId, T::AccountId, BalanceOf<T>>,
		new_metadata: BoundedVec<u8, T::ImplMetadataLimit>
	) -> DispatchResult {
		ImplMetadata::<T>::try_mutate_exists(impl_info.id, |metadata_entry| {
			let deposit = T::DepositPerByte::get()
				.saturating_mul(((new_metadata.len()) as u32).into())
				.saturating_add(T::ImplMetadataDepositBase::get());

			let old_deposit = metadata_entry.take().map_or(Zero::zero(), |m| m.actual_deposit);
			if deposit > old_deposit {
				T::Currency::reserve(&impl_info.owner, deposit - old_deposit)?;
			} else if deposit < old_deposit {
				T::Currency::unreserve(&impl_info.owner, old_deposit - deposit);
			}

			*metadata_entry = Some(ChainStoredData {
				depositor: impl_info.owner.clone(),
				actual_deposit: deposit,
				surplus_deposit: Zero::zero(),
				data: new_metadata.clone()
			});

			Self::deposit_event(
				Event::ImplMetadataUpdated { impl_id: impl_info.id, metadata: new_metadata.clone() }
			);
			Ok(())
		})
	}

	pub(crate) fn do_remove_impl_metadata(
		impl_info: ImplInfo<T::ImplId, T::AccountId, BalanceOf<T>>,
	) -> DispatchResult {
		let Some(metadata_entry) = ImplMetadata::<T>::get(&impl_info.id) else {
			return Ok(())
		};

		ImplMetadata::<T>::remove(&impl_info.id);

		T::Currency::unreserve(&impl_info.owner, metadata_entry.actual_deposit);

		Self::deposit_event(Event::ImplMetadataRemoved { impl_id: impl_info.id });
		Ok(())
	}

	pub(crate) fn do_update_impl_deployment_permission(
		mut impl_info: ImplInfo<T::ImplId, T::AccountId, BalanceOf<T>>,
		deployment_permission: ApplicableScope,
	) -> DispatchResult {
		let impl_id = impl_info.id;

		impl_info.deployment_scope = deployment_permission.clone();
		Impls::<T>::insert(&impl_id, impl_info);

		Self::deposit_event(Event::<T>::ImplDeploymentScopeUpdated { impl_id, scope: deployment_permission });
		Ok(())
	}

	pub(crate) fn do_register_impl_build(
		impl_info: ImplInfo<T::ImplId, T::AccountId, BalanceOf<T>>,
		impl_build_version: ImplBuildVersion,
		magic_bytes: Option<ImplBuildMagicBytes>
	) -> DispatchResult {
		let impl_id = impl_info.id;
		ensure!(
			!ImplBuilds::<T>::contains_key(&impl_id, &impl_build_version),
			Error::<T>::ImplBuildAlreadyRegistered
		);

		CounterForImplBuilds::<T>::try_mutate(&impl_id, |counter| -> Result<(), DispatchError> {
			ensure!(
				counter <= &mut T::MaxImplBuilds::get(),
				Error::<T>::ImplBuildsLimitExceeded
			);

			*counter += 1;
			Ok(())
		})?;

		let impl_build_info = ImplBuildInfo {
			version: impl_build_version.clone(),
			magic_bytes: magic_bytes.clone(),
			status: ImplBuildStatus::Released,
			workers_count: 0,
		};

		ImplBuilds::<T>::insert(&impl_id, &impl_build_version, impl_build_info);

		Self::deposit_event(Event::<T>::ImplBuildRegistered { impl_id, impl_build_version, magic_bytes });

		Ok(())
	}

	pub(crate) fn do_deregister_impl_build(
		impl_info: ImplInfo<T::ImplId, T::AccountId, BalanceOf<T>>,
		impl_build_version: ImplBuildVersion,
	) -> DispatchResult {
		let impl_id = impl_info.id;
		let impl_build_info = ImplBuilds::<T>::get(&impl_id, &impl_build_version).ok_or(Error::<T>::ImplBuildNotFound)?;
		ensure!(
			impl_build_info.workers_count == 0,
			Error::<T>::ImplBuildStillInUse
		);

		ImplBuilds::<T>::remove(&impl_id, &impl_build_version);
		CounterForImplBuilds::<T>::try_mutate(&impl_id, |counter| -> Result<(), DispatchError> {
			*counter -= 1;
			Ok(())
		})?;

		Self::deposit_event(Event::<T>::ImplBuildDeregistered { impl_id, impl_build_version });

		Ok(())
	}

	pub(crate) fn do_update_impl_build_status(
		impl_id: T::ImplId,
		impl_build_version: ImplBuildVersion,
		status: ImplBuildStatus
	) -> DispatchResult {
		ImplBuilds::<T>::try_mutate(&impl_id, &impl_build_version, |impl_build_info| -> Result<(), DispatchError> {
			let Some(mut info) = impl_build_info.as_mut() else {
				return Err(Error::<T>::ImplBuildNotFound.into())
			};

			info.status = status.clone();

			Ok(())
		})?;

		Self::deposit_event(Event::<T>::ImplBuildStatusUpdated { impl_id, impl_build_version, status });

		Ok(())
	}
}
