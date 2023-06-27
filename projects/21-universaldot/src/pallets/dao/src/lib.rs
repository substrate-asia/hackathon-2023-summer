// This file is part of Substrate.

// Copyright (C) 2022 UNIVERSALDOT FOUNDATION.
// SPDX-License-Identifier: Apache-2.0

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// 	http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


//! # DAO Pallet
//!
//! ## Version 0.7.0
//!
//! - [`Config`]
//! - [`Pallet`]
//!
//! ## Overview
//!
//! Organizes People with a common Vision to work on projects.
//! This module works as an extension to the Task module since
//! it enables the creation of large projects which collect many tasks.
//!
//! A visionary user is able to propose a Vision for the future.
//! Within the vision, a specified Road-map is create that is broken
//! down into tasks. Thus a DAO is a collection of tasks who are undertaken
//! by people that believe in the vision of the Founder.
//!
//! Users support a Vision by signing a vision document. Signing a vision document enables
//! users to be added to a DAO where they will be able to create/fulfill tasks in
//! support of the overall vision.
//!
//! For completion of tasks, users are rewarded tokens and increased reputation.
//!
//! ## Interface
//!
//! ### Public Functions
//!
//! - `apply_to_organization` - Function used to sign user to a vision associated with
//! an organization. Signing a vision indicates interest that the user are 
//! interested in creating said vision.
//!     Inputs:
//!         - organization_id: OrganizationIdOf<T>
//!
//! - `remove_application_from_organization` - Function used to unsign user 
//! from a vision associated with 
//! an organization. Unsigning a vision indicates that a user is no longer 
//! interested in creating said vision.
//!     Inputs:
//!         - organization_id: OrganizationIdOf<T>
//!
//! - `create_organization` - Function used to create a DAO organization.
//!     Inputs:
//!         - name: BoundedNameOf<T>
//!         - description: BoundedDescriptionOf<T>,
//!         - vision BoundedVisionOf<T>
//!
//! - `transfer_ownership` - Function used to transfer ownership of a DAO organization.
//!     Inputs:
//!         - org_id: OrganizationIdOf<T>
//!         - new_owner: AccountID,
//!
//! - `update_organization` - Function used to update an existing organization.
//! WARNING: this function will only update a value if Some(value) is given.
//! if Some("") is given then the value will be updated to "".
//! None is used to signify the value has not been changed.
//!     Inputs:
//!         - org_id: OrganizationIdOf<T>
//!         - name: Option<BoundedNameOf<T>>
//!         - description: Option<BoundedDescriptionOf<T>>,
//!         - vision: Option<BoundedVisionOf<T>>
//!
//! - `add_members` - Function used for a visionary to add members to his organization.
//!     Inputs:
//!     - org_id: OrganizationIdOf<T>
//!         - account: AccountID
//!
//! - `remove_members` - Function used for a visionary to remove members from his organization.
//!     Inputs:
//!         - org_id: OrganizationIdOf<T>
//!         - account: AccountID
//!
//! - `dissolve_organization` - Function used for a visionary to dissolve his organization.
//!     Inputs:
//!         - org_id: OrganizationIdOf<T>
//!
//! Storage Items:
//!     Vision: Vision document
//!     VisionCount: Number of total visions in the system
//!     Organizations: List of all organizations in the system
//!     OrganizationCount: Total numbers of organizations in the system
//!     Members: List the members of give organizations
//!     MemberOf: Lists which organizations a single member belongs to
//!     ApplicantsToOrganization: Lists who are the users who want to join an organization
//!
//! ## Related Modules
//!

#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::{
		dispatch::DispatchResult,
		pallet_prelude::*,
		sp_runtime::traits::Hash,
		BoundedVec
	};
	use frame_system::pallet_prelude::*;
	use sp_core::crypto::UncheckedFrom;
	use sp_std::vec::Vec;
	use sp_std::vec;
	use scale_info::TypeInfo;
	use crate::weights::WeightInfo;
	use super::*;

	// Account used in Dao Struct
	type AccountOf<T> = <T as frame_system::Config>::AccountId;
	type OrganizationIdOf<T> = <T as frame_system::Config>::Hash;
	
	pub type BoundedDescriptionOf<T> = BoundedVec<u8, <T as Config>::MaxDescriptionLen>;
	pub type BoundedNameOf<T> = BoundedVec<u8, <T as Config>::MaxNameLen>;
	pub type BoundedVisionOf<T> = BoundedVec<u8, <T as Config>::MaxVisionLen>;
	
	type BoundedOrgPerMember<T> = BoundedVec<OrganizationIdOf<T>, <T as Config>::MaxOrganisationsPerMember>;
	type BoundedMemberPerOrg<T> = BoundedVec<<T as frame_system::Config>::AccountId, <T as Config>::MaxMembersPerOrganisation>;
	type BoundedApplicantsPerOrg<T> = BoundedVec<<T as frame_system::Config>::AccountId, <T as Config>::MaxApplicantsToOrganisation>;

	/// Structure used to hold data associated with a vision.
	#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct VisionDoc<T: Config> {
		/// The representation of the vision document.
		pub vision_literal: BoundedVisionOf<T>,
		/// The accountid of the vision_literal creator.
		pub created_by: <T as frame_system::Config>::AccountId,
		/// The accountid of the last updator.
		pub updated_by: <T as frame_system::Config>::AccountId,
		/// The Blocknumber the vision was created on. 
		pub created_on: <T as frame_system::Config>::BlockNumber,
		/// The Blocknumber the vision was updated on. 
		pub updated_on: <T as frame_system::Config>::BlockNumber,
	}

	// Struct for holding Dao information.
	#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct Dao<T: Config> {
		pub name: BoundedNameOf<T>,
		pub description: BoundedDescriptionOf<T>,
		pub owner: AccountOf<T>,
		pub vision: VisionDoc<T>,
		pub created_time: <T as frame_system::Config>::BlockNumber,
		pub last_updated: <T as frame_system::Config>::BlockNumber,
	}

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config + pallet_did::Config  {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;

		/// A bound on description field of Dao struct.
		#[pallet::constant]
		type MaxDescriptionLen: Get<u32> + MaxEncodedLen + TypeInfo;

		/// A bound on name field of Dao struct.
		#[pallet::constant]
		type MaxNameLen: Get<u32> + MaxEncodedLen + TypeInfo;

		/// A bound on vision field of Dao struct.
		#[pallet::constant]
		type MaxVisionLen: Get<u32> + MaxEncodedLen + TypeInfo;

		/// The bound specifying the maximum # of members possible in an org;
		#[pallet::constant]
		type MaxMembersPerOrganisation: Get<u32> + MaxEncodedLen + TypeInfo;
		
		/// The maximum number of organisations a member can be associated with;
		#[pallet::constant]
		type MaxOrganisationsPerMember: Get<u32> + MaxEncodedLen + TypeInfo;

		/// The maximum number of people that agree with the vision of the organisation;
		#[pallet::constant]
		type MaxApplicantsToOrganisation: Get<u32> + MaxEncodedLen + TypeInfo;

		/// WeightInfo provider.
		type WeightInfo: WeightInfo;
	}

	#[pallet::pallet]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);

	#[pallet::storage]
	#[pallet::getter(fn vision_count)]
	/// VisionCount: Get total number of submitted Visions in the system
	pub(super) type VisionCount<T: Config> = StorageValue<_, u64, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn organizations)]
	/// Storage for organizations data, key: hash of Dao struct, Value Dao struct.
	pub(super) type Organizations<T: Config> = StorageMap<_, Twox64Concat, OrganizationIdOf<T>, Dao<T>, OptionQuery>;

	#[pallet::storage]
	#[pallet::getter(fn members)]
	/// Create members of organization storage map with key: Hash and value: BoundedVec<AccountID>
	pub(super) type Members<T: Config> = StorageMap<_, Twox64Concat, T::Hash, BoundedMemberPerOrg<T>, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn organization_count)]
	/// OrganizationCount: Get total number of organizations in the system
	pub(super) type OrganizationCount<T: Config> = StorageValue<_, u64, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn member_of)]
	/// Storage item that indicates which DAO's a user belongs to [AccountID, BoundedVec<OrganisationId>]
	pub(super) type MemberOf<T: Config> = StorageMap<_, Twox64Concat, T::AccountId, BoundedOrgPerMember<T>, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn applicants_to_organization)]
	/// Storage Map to indicate which user agree with a proposed Vision of an Organisation [OrganizationId, BoundedVec[Account]]
	pub(super) type ApplicantsToOrganization<T: Config> = StorageMap<_, Twox64Concat, OrganizationIdOf<T>, BoundedApplicantsPerOrg<T>, ValueQuery>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Vision signed [AccountID, OrganizationId]
		VisionSigned(T::AccountId, OrganizationIdOf<T>),

		/// Vision signed [AccountID, OrganizationId]
		VisionUnsigned(T::AccountId, OrganizationIdOf<T>),

		/// DAO Organization was created [AccountID, OrganisationId]
		OrganizationCreated(T::AccountId, OrganizationIdOf<T>),

		/// DAO Owner changed [old owner id, OrganisationID, new owner id]
		OrganizationOwnerChanged(T::AccountId, OrganizationIdOf<T>, T::AccountId),

		/// DAO Organization updated [owner, OrganisationId]
		OrganizationUpdated(T::AccountId, OrganizationIdOf<T>),

		/// DAO Organization was dissolved [AccountID, OrganisationId]
		OrganizationDissolved(T::AccountId, OrganizationIdOf<T>),

		/// Member has been added to an organization [AccountID, AccountID, OrganisationId]
		MemberAdded(T::AccountId, T::AccountId, OrganizationIdOf<T>),

		/// Member removed from an organization [AccountID, AccountID, OrganisationId]
		MemberRemoved(T::AccountId, T::AccountId, OrganizationIdOf<T>),
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// Error names should be descriptive.
		NoneValue,
		/// Errors should have helpful documentation associated with them.
		StorageOverflow,
		/// The vision has already been created.
		VisionAlreadyExists,
		/// The Vision doesn't exist.
		NoSuchVision,
		/// You are not the owner of the vision.
		NotVisionOwner,
		/// Max limit for Visions reached.
		VisionCountOverflow,
		/// Max limit for Organizations reached.
		OrganizationCountOverflow,
		/// This vision has already been signed.
		AlreadySigned,
		/// You can't unsign from vision that that you haven't signed.
		NotSigned,
		/// No rights to remove. Only Owner can remove an organization
		NotOrganizationOwner,
		/// User is already a member of this organisation.
		AlreadyMember,
		/// The organization doesn't exist.
		InvalidOrganization,
		/// The organization already exists.
		OrganizationAlreadyExists,
		/// You are not a member of this organisation.
		NotMember,
		/// You have reached the maximum number of organisations.
		MaxOrganizationsReached,
		/// You cannot create multiple organisations in the same block.
		AlreadyCreatedOrgThisBlock,
		/// Maximum number of members per organsiation reached.
		MaximumMembersReached,
		/// Maximum applicants reached for this organisation.
		MaximumApplicantsReached,
	}

	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
	#[pallet::call]
	impl<T: Config> Pallet<T>
		where T::AccountId : UncheckedFrom<T::Hash>,
	{	

		/// Function to apply for organisation and sign the vision associated. [origin, org_id]
		#[pallet::weight(<T as Config>::WeightInfo::sign_vision(0))]
		pub fn apply_to_organization(origin: OriginFor<T>, org_id: OrganizationIdOf<T>) -> DispatchResult {

			// Check that the extrinsic was signed and get the signer.
			let who = ensure_signed(origin)?;

			Self::member_signs_vision(&who, org_id)?;

			// Emit an event.
			Self::deposit_event(Event::VisionSigned(who, org_id));

			Ok(())
		}

		/// Function for revoking application to organization and vision associated. [origin, org_id]
		#[pallet::weight(<T as Config>::WeightInfo::unsign_vision(0))]
		pub fn remove_application_from_organization(origin: OriginFor<T>, org_id: OrganizationIdOf<T>) -> DispatchResult {

			// Check that the extrinsic was signed and get the signer.
			let who = ensure_signed(origin)?;

			// Member unsigns from vision
			Self::member_unsigns_vision(&who, org_id)?;

			// Emit an event.
			Self::deposit_event(Event::VisionUnsigned(who, org_id));

			Ok(())
		}

		/// Function for creating an organization [origin, name, description, vision]
		#[pallet::weight(<T as Config>::WeightInfo::create_organization(0))]
		pub fn create_organization(origin: OriginFor<T>, name: BoundedNameOf<T>, description: BoundedDescriptionOf<T>, vision: BoundedVisionOf<T>) -> DispatchResult {

			// Check that the extrinsic was signed and get the signer.
			let who = ensure_signed(origin)?;

			//TODO: Ensure only visionary can create DAOs

			// call function to create org
			let org_id = Self::new_org(&who, name, description, vision)?;
			let org_account : T::AccountId = UncheckedFrom::unchecked_from(org_id);
			<pallet_did::Pallet<T>>::set_owner(&who, &org_account, &who);

			// Emit an event.
			Self::deposit_event(Event::OrganizationCreated(who, org_id));

			Ok(())
		}

		/// Transfer ownership of dao to other user.
		#[pallet::weight(<T as Config>::WeightInfo::transfer_ownership(0))]
		pub fn transfer_ownership(origin: OriginFor<T>, org_id: OrganizationIdOf<T>, new_owner: T::AccountId) -> DispatchResult {
			let who = ensure_signed(origin)?;
			Self::change_owner(&who, org_id, &new_owner)?;
			let org_account : T::AccountId = UncheckedFrom::unchecked_from(org_id);
			
			<pallet_did::Pallet<T>>::set_owner(&who, &org_account, &new_owner);

			// Modify the storage of members to matfch the change of ownership. 
			Self::add_member_to_organization(&new_owner, org_id, &new_owner)?;
			Self::remove_member_from_organization(&new_owner, org_id, &who)?;

			// Emit an event.
			Self::deposit_event(Event::OrganizationOwnerChanged(who, org_id, new_owner));

			Ok(())
		}

		/// Function for updating organization [origin, org_id, option<name>, option<description>,
		/// option<vision>
		#[pallet::weight(<T as Config>::WeightInfo::update_organization(0))]
		pub fn update_organization(origin: OriginFor<T>, org_id: OrganizationIdOf<T>, name: Option<BoundedNameOf<T>>,
			description: Option<BoundedDescriptionOf<T>>, vision: Option<BoundedVisionOf<T>>) -> DispatchResult {
			// Check that the extrinsic was signed and get the signer.
			let who = ensure_signed(origin)?;
			
			Self::update_org(who.clone(), org_id, name, description, vision)?;

			Self::deposit_event(Event::OrganizationUpdated(who, org_id));

			Ok(())
		}

		/// Function for adding member to an organization [origin, org_id, AccountID]
		#[pallet::weight(<T as Config>::WeightInfo::add_members(0))]
		pub fn add_members(origin: OriginFor<T>, org_id: OrganizationIdOf<T>, account: T::AccountId) -> DispatchResult {

			// Check that the extrinsic was signed and get the signer.
			let who = ensure_signed(origin)?;

			// call function to add member to organization
			Self::add_member_to_organization(&who, org_id, &account)?;

			// Emit an event.
			Self::deposit_event(Event::MemberAdded(who, account, org_id));

			Ok(())
		}

		/// Function for removing member from an organization [origin, org_id, AccountID]
		#[pallet::weight(<T as Config>::WeightInfo::remove_members(0))]
		pub fn remove_members(origin: OriginFor<T>, org_id: OrganizationIdOf<T>, account: T::AccountId) -> DispatchResult {

			// Check that the extrinsic was signed and get the signer.
			let who = ensure_signed(origin)?;

			// call function to remove member from organization
			Self::remove_member_from_organization(&who, org_id, &account)?;

			// Emit an event.
			Self::deposit_event(Event::MemberRemoved(who, account, org_id));

			Ok(())
		}

		/// Function for dissolving an organization [origin, org_id]
		#[pallet::weight(<T as Config>::WeightInfo::dissolve_organization(0))]
		pub fn dissolve_organization(origin: OriginFor<T>, org_id: OrganizationIdOf<T>) -> DispatchResult {

			// Check that the extrinsic was signed and get the signer.
			let who = ensure_signed(origin)?;

			// call function to remove organization
			Self::remove_org(&who, org_id)?;

			// Emit an event.
			Self::deposit_event(Event::OrganizationDissolved(who, org_id));

			Ok(())
		}
	}

	// *** Helper functions *** //
	impl<T:Config> Pallet<T> {
		pub fn does_organization_exist(org_id: &OrganizationIdOf<T>) -> bool {
			<Organizations<T>>::contains_key(org_id)
		}

		fn new_org(from_initiator: &T::AccountId, name: BoundedNameOf<T>, description: BoundedDescriptionOf<T>, vision: BoundedVisionOf<T>) -> Result<OrganizationIdOf<T>, DispatchError> {
			let current_block = <frame_system::Pallet<T>>::block_number();
			
			let vision_doc = VisionDoc::<T> {
				vision_literal: vision,
				created_by: from_initiator.clone(),
				updated_by: from_initiator.clone(),
				created_on: current_block,
				updated_on: current_block,
			};
			let dao = Dao::<T> {
				name,
				description,
				owner: from_initiator.clone(),
				vision: vision_doc,
				created_time: current_block,
				last_updated: current_block,
			};
			let org_id = T::Hashing::hash_of(&dao);

			// Ensures duplicate organisations cannot be created
			ensure!(<Organizations<T>>::get(org_id).is_none(), <Error<T>>::OrganizationAlreadyExists);

			// Todo? Ensure an account cannot create multiple orgs in the same block. 

			// Insert Dao struct in Organizations storage
			<Organizations<T>>::insert(org_id, dao);

			// Insert new members into the org storage
			let bounded: BoundedMemberPerOrg<T> = vec![from_initiator.clone()].try_into().expect("will only ever be one person on init; qed");
			<Members<T>>::insert(org_id, bounded);

			// Insert organizations into MemberOf
			let mut organizations_for = <MemberOf<T>>::get(&from_initiator);
			ensure!(organizations_for.try_push(org_id).is_ok(), Error::<T>::MaxOrganizationsReached);

			
			<MemberOf<T>>::set(&from_initiator, organizations_for);

			// Increase organization count
			let new_count = Self::organization_count().checked_add(1).ok_or(<Error<T>>::OrganizationCountOverflow)?;
			<OrganizationCount<T>>::put(new_count);

			Ok(org_id)
		}

		fn change_owner(owner : &T::AccountId, org_id: OrganizationIdOf<T>, new_owner : &T::AccountId) -> Result<(), DispatchError> {

			ensure!(Self::does_organization_exist(&org_id), Error::<T>::InvalidOrganization);

			Self::is_dao_founder(owner, org_id)?;
			Organizations::<T>::try_mutate(&org_id, |ref mut org| {
				if let Some(org) = org {
					org.owner = new_owner.clone();
					org.last_updated = <frame_system::Pallet<T>>::block_number();
					Ok(())
				} else {
					Err(Error::<T>::InvalidOrganization.into())
				}
			})
		}

		fn update_org(owner : T::AccountId, org_id: OrganizationIdOf<T>, name : Option<BoundedNameOf<T>>,
					  description: Option<BoundedDescriptionOf<T>>, vision: Option<BoundedVisionOf<T>>,) -> Result<(), DispatchError> {

			ensure!(Self::does_organization_exist(&org_id), Error::<T>::InvalidOrganization);
			Self::is_dao_founder(&owner, org_id)?;

			let current_block = <frame_system::Pallet<T>>::block_number();
			Organizations::<T>::try_mutate(&org_id, |ref mut org| {
				if let Some(org) = org {
					if let Some(n) = name {
						org.name = n;
					}
					if let Some(d) = description {
						org.description = d;
					}
					if let Some(v) = vision {
						org.vision.vision_literal = v;
						org.vision.updated_on = current_block;
						org.vision.updated_by = owner;
					}

					org.last_updated = current_block;
					Ok(())
				} else {
					Err(Error::<T>::InvalidOrganization.into())
				}
			})
		}

		fn remove_org(from_initiator: &T::AccountId, org_id: OrganizationIdOf<T>) -> Result<(), DispatchError> {

			// check if its DAO original creator
			Self::is_dao_founder(from_initiator, org_id)?;

			// Find current organizations and remove org_id from MemberOf user
			let current_organizations = <Pallet<T>>::member_of(&from_initiator);
			
			// Ensure organizations exists in the list of organizations
			ensure!(current_organizations.iter().any(|a| *a == org_id), Error::<T>::InvalidOrganization);
			
			// Remove Dao struct from Organizations storage
			<Organizations<T>>::remove(org_id);
			<Members<T>>::remove(org_id);

			// Reduce organization count
			let new_count = Self::organization_count().saturating_sub(1);
			<OrganizationCount<T>>::put(new_count);

			// Collect all current organizations			
			let current_organizations = current_organizations.into_iter()
				.filter(|a| *a != org_id)
				.collect::<Vec<OrganizationIdOf<T>>>()
				.try_into()
				.expect("reducing size of boundedvec; qed");
			
			// Update MemberOf
			<MemberOf<T>>::set(&from_initiator, current_organizations);
			Ok(())
		}

		fn add_member_to_organization(from_initiator: &T::AccountId, org_id: OrganizationIdOf<T>, account: &T::AccountId ) -> Result<(), DispatchError> {
			// Check if organization exists
			ensure!(Self::does_organization_exist(&org_id), Error::<T>::InvalidOrganization);

			// check if its DAO original creator
			Self::is_dao_founder(from_initiator, org_id)?;

			let mut members = Self::members(org_id);

			// Check if already a member
			ensure!(!members.contains(account), <Error<T>>::AlreadyMember);

			// Insert account into organization
			ensure!(members.try_push(account.clone()).is_ok(), Error::<T>::MaximumMembersReached);
			<Members<T>>::insert(org_id, &members);

			// Insert organizations into MemberOf
			let mut organizations = Self::member_of(&account);
			ensure!(organizations.try_push(org_id).is_ok(), Error::<T>::MaxOrganizationsReached);

			// Insert account into MemberOf organization
			<MemberOf<T>>::set(&account, organizations);	

			Ok(())
		}

		fn remove_member_from_organization(from_initiator: &T::AccountId, org_id: OrganizationIdOf<T>, account: &T::AccountId ) -> Result<(), DispatchError> {
			// Check if organization exists
			ensure!(Self::does_organization_exist(&org_id), Error::<T>::InvalidOrganization);
			let mut members = <Pallet<T>>::members(org_id);

			// check if its DAO original creator
			Self::is_dao_founder(from_initiator, org_id)?;

			// Find member and remove from Vector
			ensure!( members.iter().any(|a| *a == *account), Error::<T>::NotMember);
			members.retain(|a| *a != *account);

			// Update Organization Members
			<Members<T>>::insert(org_id, members);

			// Find current organizations and remove org_id from MemberOf user
			let mut current_organizations = <Pallet<T>>::member_of(&account);
			ensure!(current_organizations.iter().any(|a| *a == org_id), Error::<T>::InvalidOrganization);

			// Update MemberOf
			current_organizations = current_organizations.into_iter().filter(|a| *a !=
				org_id).collect::<Vec<OrganizationIdOf<T>>>().try_into().expect("reducing size of boundedved; qed");

			// Insert account into MemberOf organization
			<MemberOf<T>>::insert(&account, &current_organizations);

			Ok(())
		}

		fn member_signs_vision(from_initiator: &T::AccountId, org_id: OrganizationIdOf<T>) -> Result<(), DispatchError> {

			// Verify that the specified organization has been created.
			ensure!(Organizations::<T>::contains_key(org_id), Error::<T>::InvalidOrganization);

			let mut members = <Pallet<T>>::applicants_to_organization(&org_id);

			// Ensure not signed already
			ensure!(!members.contains(from_initiator), <Error<T>>::AlreadySigned);
			
			ensure!(members.try_push(from_initiator.clone()).is_ok(), Error::<T>::MaximumApplicantsReached);

			// Update storage.
			<ApplicantsToOrganization<T>>::insert(org_id, members);

			Ok(())
		}

		fn member_unsigns_vision(from_initiator: &T::AccountId, org_id: OrganizationIdOf<T>) -> Result<(), DispatchError> {
			
			// Verify that the specified vision has been created.
			ensure!(Organizations::<T>::contains_key(org_id), Error::<T>::InvalidOrganization);

			let mut members = <Pallet<T>>::applicants_to_organization(org_id);

			// Ensure not signed already
			ensure!(members.iter().any(|a| *a == *from_initiator), Error::<T>::NotSigned);
			
			members.retain(|a| *a != *from_initiator);

			// Update storage.
			<ApplicantsToOrganization<T>>::insert(org_id, members);

			Ok(())
		}

		fn is_dao_founder(from_initiator: &T::AccountId, org_id: OrganizationIdOf<T>) -> Result<bool, DispatchError> {
			let org = Organizations::<T>::get(org_id).ok_or(Error::<T>::InvalidOrganization)?;
			if org.owner == *from_initiator {
				Ok(true)
			} else { Err(Error::<T>::NotOrganizationOwner.into()) }
		}
	}
}