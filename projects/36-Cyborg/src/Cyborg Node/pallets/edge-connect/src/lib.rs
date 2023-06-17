//! Pallet Edge Connect
//!
//! - [`Config`]
//! - [`Call`]
//! - [`Pallet`]
//! - [`Error`]
//! - [`Event`]
//! - [`Storage`]
//!
//! ## Overview
//!
//! Edge Connect is a pallet that allows users to create and remove connections between Cyborg
//! blockchain and external edge servers.
//!
//! ## Interface
//!
//! ### Dispatchable Functions
//!
//! * `create_connection` - Creates a connection between Cyborg blockchain and an external edge
//!   server.
//! * `send_command` - Sends a command to CyberHub.
//! * `receive_response` - Receives a response from CyberHub.
//! * `remove_connection` - Removes a connection between Cyborg blockchain and an external edge
//!   server.

#![cfg_attr(not(feature = "std"), no_std)]

use codec::{
	Decode, Encode,
	alloc::string::ToString,
};
use frame_support::{traits::Get, ensure};
use frame_system::{
	self as system,
	offchain::{
		AppCrypto, CreateSignedTransaction, SendSignedTransaction, SendUnsignedTransaction,
		SignedPayload, Signer, SigningTypes, SubmitTransaction,
	},
};
use scale_info::prelude::string::String;
use sp_core::crypto::KeyTypeId;
use sp_runtime::{
	offchain::{
		http,
		storage::{MutateStorageError, StorageRetrievalError, StorageValueRef},
		Duration,
	},
	traits::Zero,
	transaction_validity::{InvalidTransaction, TransactionValidity, ValidTransaction},
	RuntimeDebug, BoundedVec,
};
use sp_std::vec::Vec;

// #[cfg(test)]
// mod tests;

pub const KEY_TYPE: KeyTypeId = KeyTypeId(*b"edge");

const UNSIGNED_TXS_PRIORITY: u64 = 100;

pub mod crypto {
	use super::KEY_TYPE;
	use sp_core::sr25519::Signature as Sr25519Signature;
	use sp_runtime::{
		app_crypto::{app_crypto, sr25519},
		traits::Verify,
		MultiSignature, MultiSigner,
	};
	app_crypto!(sr25519, KEY_TYPE);

	pub struct TestAuthId;

	impl frame_system::offchain::AppCrypto<MultiSigner, MultiSignature> for TestAuthId {
		type RuntimeAppPublic = Public;
		type GenericSignature = sp_core::sr25519::Signature;
		type GenericPublic = sp_core::sr25519::Public;
	}

	// implemented for mock runtime in test
	impl frame_system::offchain::AppCrypto<<Sr25519Signature as Verify>::Signer, Sr25519Signature>
		for TestAuthId
	{
		type RuntimeAppPublic = Public;
		type GenericSignature = sp_core::sr25519::Signature;
		type GenericPublic = sp_core::sr25519::Public;
	}
}

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
	use super::*;
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: CreateSignedTransaction<Call<Self>> + frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		/// The overarching dispatch call type.
		type RuntimeCall: From<Call<Self>>;
		/// The identifier type for an offchain worker.

		/// Authority ID used for offchain worker
		type AuthorityId: AppCrypto<Self::Public, Self::Signature>;

		// Configuration parameters

		/// A grace period after we send transaction.
		///
		/// To avoid sending too many transactions, we only attempt to send one
		/// every `GRACE_PERIOD` blocks. We use Local Storage to coordinate
		/// sending between distinct runs of this offchain worker.
		#[pallet::constant]
		type GracePeriod: Get<Self::BlockNumber>;

		/// Number of blocks of cooldown after unsigned transaction is included.
		///
		/// This ensures that we only accept unsigned transactions once, every `UnsignedInterval`
		/// blocks.
		#[pallet::constant]
		type UnsignedInterval: Get<Self::BlockNumber>;

		/// A configuration for base priority of unsigned transactions.
		///
		/// This is exposed so that it can be tuned for particular runtime, when
		/// multiple pallets send unsigned transactions.
		#[pallet::constant]
		type UnsignedPriority: Get<TransactionPriority>;

		/// Max number of commands sent per request
		#[pallet::constant]
		type MaxCommand: Get<u32>;

		/// Maximum number of responses received per request
		#[pallet::constant]
		type MaxResponses: Get<u32>;

		/// The maximum length of a response string.
		#[pallet::constant]
		type MaxStringLength: Get<u32>;
	}

	// The pallet's hooks for offchain worker
	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		fn offchain_worker(block_number: T::BlockNumber) {
			log::info!("Hello from offchain workers!");

			let signer = Signer::<T, T::AuthorityId>::all_accounts();
			if !signer.can_sign() {
				log::error!("No local accounts available");
				return
			}

			// Import `frame_system` and retrieve a block hash of the parent block.
			let parent_hash = <system::Pallet<T>>::block_hash(block_number - 1u32.into());
			log::debug!("Current block: {:?} (parent hash: {:?})", block_number, parent_hash);

			let response: String = Self::fetch_response().unwrap_or_else(|e| {
				log::error!("fetch_response error: {:?}", e);
				"Failed".into()
			});
			log::info!("Response: {}", response);

			// This will send both signed and unsigned transactions
			// depending on the block number.
			// Usually it's enough to choose one or the other.
			let should_send = Self::choose_transaction_type(block_number);
			let res = match should_send {
				TransactionType::Signed => Self::fetch_response_and_send_signed(),
				TransactionType::UnsignedForAny =>
					Self::fetch_response_and_send_unsigned_for_any_account(block_number),
				TransactionType::UnsignedForAll =>
					Self::fetch_response_and_send_unsigned_for_all_accounts(block_number),
				TransactionType::Raw => Self::fetch_response_and_send_raw_unsigned(block_number),
				TransactionType::None => Ok(()),
			};
			if let Err(e) = res {
				log::error!("Error: {}", e);
			}
		}
	}

	// Public part of the pallet.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Create connection
		#[pallet::call_index(0)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn create_connection(origin: OriginFor<T>, connection: u32) -> DispatchResult {
			// Check that the extrinsic was signed and get the signer.
			let who = ensure_signed(origin)?;

			// Check that the connection does not already exist.
			ensure!(!<Connection<T>>::exists(), Error::<T>::ConnectionAlreadyExists);

			// Update storage.
			<Connection<T>>::put(connection);

			// Emit an event.
			Self::deposit_event(Event::ConnectionCreated { connection, who });

			// Return a successful DispatchResult
			Ok(())
		}

		// TODO:
		// Create functions for:
		// 1. send command
		#[pallet::call_index(1)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn send_command(origin: OriginFor<T>, command: String) -> DispatchResult {
			// Retrieve the signer and check it is valid.
			let who = ensure_signed(origin)?;

			// Check that the connection exists.
			ensure!(<Connection<T>>::exists(), Error::<T>::ConnectionDoesNotExist);

			// Make sure the `command` == `ping`
			ensure!(command == "ping", Error::<T>::InvalidCommand);

			// Convert the command to BoundedVec<u8, T::MaxStringLength>
			let command_bounded_vec: BoundedVec<u8, T::MaxStringLength> = 
				command.clone().into_bytes().try_into().map_err(|_| Error::<T>::CommandTooLong)?;

			// Create the command tuple (Option<T::AccountId>, BoundedVec<u8, T::MaxStringLength>)
			let command_tuple = (Some(who.clone()), command_bounded_vec);

			// Try to get the current commands
			let mut current_commands = <Commands<T>>::get();

			// Try to push the new command tuple, if there's room
			if !current_commands.try_push(command_tuple).is_ok() {
				return Err(Error::<T>::TooManyCommands.into());
			}

			// Update the storage.
			<Commands<T>>::put(current_commands);

			// Emit an event.
			Self::deposit_event(Event::CommandSent { command, who });

			// Return a successful DispatchResult
			Ok(())
		}

		#[pallet::call_index(2)]
		#[pallet::weight({0})]
		/// Submit new response to the list.
		///
		/// This method is a public function of the module and can be called from within
		/// a transaction. It appends given `response` to current list of responses.
		/// The `offchain worker` will create, sign & submit a transaction that
		/// calls this function passing the response.
		///
		/// The transaction needs to be signed (see `ensure_signed`) check, so that the caller
		/// pays a fee to execute it.
		/// This makes sure that it's not easy (or rather cheap) to attack the chain by submitting
		/// excessive transactions.
		pub fn submit_response(origin: OriginFor<T>, response: String) -> DispatchResult {
			// Retrieve the signer and check it is valid.
			let who = ensure_signed(origin)?;

			// Check that the connection exists.
			ensure!(<Connection<T>>::exists(), Error::<T>::ConnectionDoesNotExist);

			// Submit response received from CyberHub
			Self::add_response(Some(who), response);

			// Return a successful DispatchResult
			Ok(().into())
		}

		/// Submit new response to the list via unsigned transaction.
		///
		/// Works exactly like the `submit_response` function, but since we allow sending the
		/// transaction without a signature, and hence without paying any fees,
		/// we need a way to make sure that only some transactions are accepted.
		/// This function can be called only once every `T::UnsignedInterval` blocks.
		/// Transactions that call that function are de-duplicated on the pool level
		/// via `validate_unsigned` implementation and also are rendered invalid if
		/// the function has already been called in current "session".
		///
		/// It's important to specify `weight` for unsigned calls as well, because even though
		/// they don't charge fees, we still don't want a single block to contain unlimited
		/// number of such transactions.
		///
		/// This example is not focused on correctness of the oracle itself, but rather its
		/// purpose is to showcase offchain worker capabilities.
		#[pallet::call_index(3)]
		#[pallet::weight(0)]
		pub fn submit_response_unsigned(
			origin: OriginFor<T>,
			_block_number: T::BlockNumber,
			response: String,
		) -> DispatchResultWithPostInfo {
			// This ensures that the function can only be called via unsigned transaction.
			ensure_none(origin)?;
			// Add the response to the on-chain list, but mark it as coming from an empty address.
			Self::add_response(None, response);
			// now increment the block number at which we expect next unsigned transaction.
			let current_block = <system::Pallet<T>>::block_number();
			<NextUnsignedAt<T>>::put(current_block + T::UnsignedInterval::get());
			Ok(().into())
		}

		#[pallet::call_index(4)]
		#[pallet::weight(0)]
		pub fn submit_response_unsigned_with_signed_payload(
			origin: OriginFor<T>,
			response_payload: ResponsePayload<T::Public, T::BlockNumber>,
			_signature: T::Signature,
		) -> DispatchResultWithPostInfo {
			// This ensures that the function can only be called via unsigned transaction.
			ensure_none(origin)?;
			// Add the response to the on-chain list, but mark it as coming from an empty address.
			Self::add_response(None, response_payload.response);
			// now increment the block number at which we expect next unsigned transaction.
			let current_block = <system::Pallet<T>>::block_number();
			<NextUnsignedAt<T>>::put(current_block + T::UnsignedInterval::get());
			Ok(().into())
		}

		// 3. remove_connection
		#[pallet::call_index(5)]
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1).ref_time())]
		pub fn remove_connection(origin: OriginFor<T>, connection: u32) -> DispatchResult {
			// Check that the extrinsic was signed and get the signer.
			let who = ensure_signed(origin)?;

			// Check that the connection exists.
			ensure!(<Connection<T>>::exists(), Error::<T>::ConnectionDoesNotExist);

			// Update storage.
			<Connection<T>>::kill();

			// Emit an event.
			Self::deposit_event(Event::ConnectionRemoved { connection, who });

			// Return a successful DispatchResult
			Ok(())
		}
	}

	// The pallet's runtime storage items.
	#[pallet::storage]
	#[pallet::getter(fn connection)]
	pub type Connection<T> = StorageValue<_, u32, ValueQuery>;

	/// A vector of recently submitted commands.
	#[pallet::storage]
	#[pallet::getter(fn commands)]
	pub type Commands<T: Config> =
		StorageValue<_, BoundedVec<(Option<T::AccountId>, BoundedVec<u8, T::MaxStringLength>), T::MaxCommand>, ValueQuery>;


	/// A vector of recently submitted responses.
	#[pallet::storage]
	#[pallet::getter(fn responses)]
	pub(super) type Responses<T: Config> =
		StorageValue<_, BoundedVec<(Option<T::AccountId>, BoundedVec<u8, T::MaxStringLength>), T::MaxResponses>, ValueQuery>;

	/// Defines the block when next unsigned transaction will be accepted.
	///
	/// To prevent spam of unsigned (and unpayed!) transactions on the network,
	/// we only allow one transaction every `T::UnsignedInterval` blocks.
	/// This storage entry defines when new transaction is going to be accepted.
	#[pallet::storage]
	#[pallet::getter(fn next_unsigned_at)]
	pub(super) type NextUnsignedAt<T: Config> = StorageValue<_, T::BlockNumber, ValueQuery>;

	// Pallets use events to inform users when important changes are made.
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Event documentation should end with an array that provides descriptive names for event
		/// parameters. [connection, who]
		ConnectionCreated { connection: u32, who: T::AccountId },
		/// Event documentation should end with an array that provides descriptive names for event
		/// parameters. [connection, who]
		ConnectionRemoved { connection: u32, who: T::AccountId },
		/// Event generated when a new command is sent to CyberHub.
		/// [command, who]
		CommandSent { command: String, who: T::AccountId },
		/// Event generated when a response is received from CyberHub.
		/// [response, maybe_who]
		NewResponse { response: String, maybe_who: Option<T::AccountId> },
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// Returned if the connection already exists.
		ConnectionAlreadyExists,
		/// Returned if the connection does not exist.
		ConnectionDoesNotExist,
		/// Returned if the response is too large.
		ResponseTooLarge,
		/// Return error if the command is not valid.
		InvalidCommand,
		/// Returned if the command is too long.
		CommandTooLong,
		/// Returned if the command are too many.
		TooManyCommands,
	}

	#[pallet::validate_unsigned]
	impl<T: Config> ValidateUnsigned for Pallet<T> {
		type Call = Call<T>;

		/// Validate unsigned call to this module.
		///
		/// By default unsigned transactions are disallowed, but implementing the validator
		/// here we make sure that some particular calls (the ones produced by offchain worker)
		/// are being whitelisted and marked as valid.
		fn validate_unsigned(_source: TransactionSource, call: &Self::Call) -> TransactionValidity {
			let valid_tx = |provide| ValidTransaction::with_tag_prefix("ocw-edge:")
				.priority(UNSIGNED_TXS_PRIORITY)
				.and_provides([&provide])
				.longevity(3)
				.propagate(true)
				.build();

			match call {
				Call::submit_response_unsigned { block_number: _block_number, response: _response } => valid_tx(b"submit_number_unsigned".to_vec()),
				Call::submit_response_unsigned_with_signed_payload {
					ref response_payload,
					ref signature
				} => {
					if !SignedPayload::<T>::verify::<T::AuthorityId>(response_payload, signature.clone()) {
						return InvalidTransaction::BadProof.into();
					}
					valid_tx(b"submit_number_unsigned_with_signed_payload".to_vec())
				},
				_ => InvalidTransaction::Call.into(),
			}
		}
	}
}

/// Payload used by this crate to hold response 
/// data required to submit a transaction.
#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, scale_info::TypeInfo)]
pub struct ResponsePayload<Public, BlockNumber> {
	block_number: BlockNumber,
	response: String,
	public: Public,
}

impl<T: SigningTypes> SignedPayload<T> for ResponsePayload<T::Public, T::BlockNumber> {
	fn public(&self) -> T::Public {
		self.public.clone()
	}
}

enum TransactionType {
	Signed,
	UnsignedForAny,
	UnsignedForAll,
	Raw,
	None,
}

impl<T: Config> Pallet<T> {
	/// Chooses which transaction type to send.
	///
	/// This function serves mostly to showcase `StorageValue` helper
	/// and local storage usage.
	///
	/// Returns a type of transaction that should be produced in current run.
	fn choose_transaction_type(block_number: T::BlockNumber) -> TransactionType {
		/// A friendlier name for the error that is going to be returned in case we are in the grace
		/// period.
		const RECENTLY_SENT: () = ();

		// Start off by creating a reference to Local Storage value.
		// Since the local storage is common for all offchain workers, it's a good practice
		// to prepend your entry with the module name.
		let val = StorageValueRef::persistent(b"example_ocw::last_send");
		// The Local Storage is persisted and shared between runs of the offchain workers,
		// and offchain workers may run concurrently. We can use the `mutate` function, to
		// write a storage entry in an atomic fashion. Under the hood it uses `compare_and_set`
		// low-level method of local storage API, which means that only one worker
		// will be able to "acquire a lock" and send a transaction if multiple workers
		// happen to be executed concurrently.
		let res = val.mutate(|last_send: Result<Option<T::BlockNumber>, StorageRetrievalError>| {
			match last_send {
				// If we already have a value in storage and the block number is recent enough
				// we avoid sending another transaction at this time.
				Ok(Some(block)) if block_number < block + T::GracePeriod::get() =>
					Err(RECENTLY_SENT),
				// In every other case we attempt to acquire the lock and send a transaction.
				_ => Ok(block_number),
			}
		});

		// The result of `mutate` call will give us a nested `Result` type.
		// The first one matches the return of the closure passed to `mutate`, i.e.
		// if we return `Err` from the closure, we get an `Err` here.
		// In case we return `Ok`, here we will have another (inner) `Result` that indicates
		// if the value has been set to the storage correctly - i.e. if it wasn't
		// written to in the meantime.
		match res {
			// The value has been set correctly, which means we can safely send a transaction now.
			Ok(block_number) => {
				// We will send different transactions based on a random number.
				// Note that this logic doesn't really guarantee that the transactions will be sent
				// in an alternating fashion (i.e. fairly distributed). Depending on the execution
				// order and lock acquisition, we may end up for instance sending two `Signed`
				// transactions in a row. If a strict order is desired, it's better to use
				// the storage entry for that. (for instance store both block number and a flag
				// indicating the type of next transaction to send).
				let transaction_type = block_number % 4u32.into();
				if transaction_type == Zero::zero() {
					TransactionType::Signed
				} else if transaction_type == T::BlockNumber::from(1u32) {
					TransactionType::UnsignedForAny
				} else if transaction_type == T::BlockNumber::from(2u32) {
					TransactionType::UnsignedForAll
				} else {
					TransactionType::Raw
				}
			},
			// We are in the grace period, we should not send a transaction this time.
			Err(MutateStorageError::ValueFunctionFailed(RECENTLY_SENT)) => TransactionType::None,
			// We wanted to send a transaction, but failed to write the block number (acquire a
			// lock). This indicates that another offchain worker that was running concurrently
			// most likely executed the same logic and succeeded at writing to storage.
			// Thus we don't really want to send the transaction, knowing that the other run
			// already did.
			Err(MutateStorageError::ConcurrentModification(_)) => TransactionType::None,
		}
	}

	/// A helper function to fetch the response and send signed transaction.
	fn fetch_response_and_send_signed() -> Result<(), &'static str> {
		let signer = Signer::<T, T::AuthorityId>::all_accounts();
		if !signer.can_sign() {
			return Err(
				"No local accounts available. Consider adding one via `author_insertKey` RPC.",
			)
		}
		// Make an external HTTP request to fetch the current response.
		// Note this call will block until response is received.
		let response = Self::fetch_response().map_err(|_| "Failed to fetch response")?;

		// Clone the response for use in the closure.
		let response_clone = response.clone();

		// Using `send_signed_transaction` associated type we create and submit a transaction
		// representing the call, we've just created.
		// Submit signed will return a vector of results for all accounts that were found in the
		// local keystore with expected `KEY_TYPE`.
		let results = signer.send_signed_transaction(|_account| {
			// Clone the response_clone before moving it into the closure
			let response_in_closure = response_clone.clone();
			Call::submit_response { response: response_in_closure }
		});		

		for (acc, res) in &results {
			match res {
				Ok(()) => log::info!("[{:?}] Submitted response: {}", acc.id, response),
				Err(e) => log::error!("[{:?}] Failed to submit transaction: {:?}", acc.id, e),
			}
		}

		Ok(())
	}

	/// A helper function to fetch the response and send a raw unsigned transaction.
	fn fetch_response_and_send_raw_unsigned(block_number: T::BlockNumber) -> Result<(), &'static str> {
		// Make sure we don't fetch the response if unsigned transaction is going to be rejected
		// anyway.
		let next_unsigned_at = <NextUnsignedAt<T>>::get();
		if next_unsigned_at > block_number {
			return Err("Too early to send unsigned transaction")
		}

		// Make an external HTTP request to fetch the current response.
		// Note this call will block until response is received.
		let response = Self::fetch_response().map_err(|_| "Failed to fetch response")?;

		// Received response is wrapped into a call to `submit_response_unsigned` public function of this
		// pallet. This means that the transaction, when executed, will simply call that function
		// passing `response` as an argument.
		let call = Call::submit_response_unsigned { block_number, response };

		// Now let's create a transaction out of this call and submit it to the pool.
		// Here we showcase two ways to send an unsigned transaction / unsigned payload (raw)
		//
		// By default unsigned transactions are disallowed, so we need to whitelist this case
		// by writing `UnsignedValidator`. Note that it's EXTREMELY important to carefuly
		// implement unsigned validation logic, as any mistakes can lead to opening DoS or spam
		// attack vectors. See validation logic docs for more details.
		//
		SubmitTransaction::<T, Call<T>>::submit_unsigned_transaction(call.into())
			.map_err(|()| "Unable to submit unsigned transaction.")?;

		Ok(())
	}

	/// A helper function to fetch the response, sign payload and send an unsigned transaction
	fn fetch_response_and_send_unsigned_for_any_account(
		block_number: T::BlockNumber,
	) -> Result<(), &'static str> {
		// Make sure we don't fetch the response if unsigned transaction is going to be rejected
		// anyway.
		let next_unsigned_at = <NextUnsignedAt<T>>::get();
		if next_unsigned_at > block_number {
			return Err("Too early to send unsigned transaction")
		}

		// Make an external HTTP request to fetch the current response.
		// Note this call will block until response is received.
		let response = Self::fetch_response().map_err(|_| "Failed to fetch response")?;

		// -- Sign using any account
		let (_, result) = Signer::<T, T::AuthorityId>::any_account()
			.send_unsigned_transaction(
				|account| {
					let response_in_closure = response.clone();
					ResponsePayload { response: response_in_closure, block_number, public: account.public.clone() }
				},
				|payload, signature| Call::submit_response_unsigned_with_signed_payload {
					response_payload: payload,
					signature,
				},
			)
			.ok_or("No local accounts accounts available.")?;
		result.map_err(|()| "Unable to submit transaction")?;

		Ok(())
	}

	/// A helper function to fetch the response, sign payload and send an unsigned transaction
	fn fetch_response_and_send_unsigned_for_all_accounts(
		block_number: T::BlockNumber,
	) -> Result<(), &'static str> {
		// Make sure we don't fetch the response if unsigned transaction is going to be rejected
		// anyway.
		let next_unsigned_at = <NextUnsignedAt<T>>::get();
		if next_unsigned_at > block_number {
			return Err("Too early to send unsigned transaction")
		}

		// Make an external HTTP request to fetch the current response.
		// Note this call will block until response is received.
		let response = Self::fetch_response().map_err(|_| "Failed to fetch response")?;

		// -- Sign using all accounts
		let transaction_results = Signer::<T, T::AuthorityId>::all_accounts()
			.send_unsigned_transaction(
				|account| {
					let response_in_closure = response.clone();
					ResponsePayload { response: response_in_closure, block_number, public: account.public.clone() }
				},
				|payload, signature| Call::submit_response_unsigned_with_signed_payload {
					response_payload: payload,
					signature,
				},
			);
		for (_account_id, result) in transaction_results.into_iter() {
			if result.is_err() {
				return Err("Unable to submit transaction")
			}
		}

		Ok(())
	}

	/// Fetches the current response from remote URL and returns it as a string.
	// TODO: change http to websocket
	fn fetch_response() -> Result<String, http::Error> {
		// We want to keep the offchain worker execution time reasonable, so we set a hard-coded
		// deadline to 3s to complete the external call.
		// You can also wait idefinitely for the response, however you may still get a timeout
		// coming from the host machine.
		let deadline = sp_io::offchain::timestamp().add(Duration::from_millis(3_000));
		// Initiate an external HTTP GET request.
		// This is using high-level wrappers from `sp_runtime`, for the low-level calls that
		// you can find in `sp_io`. The API is trying to be similar to `reqwest`, but
		// since we are running in a custom WASM execution environment we can't simply
		// import the library here.
		let request = http::Request::get("http://127.0.0.1:8080/block");
		// We set the deadline for sending of the request, note that awaiting response can
		// have a separate deadline. Next we send the request, before that it's also possible
		// to alter request headers or stream body content in case of non-GET requests.
		let pending = request.deadline(deadline).send().map_err(|_| http::Error::IoError)?;

		// The request is already being processed by the host, we are free to do anything
		// else in the worker (we can send multiple concurrent requests too).
		// At some point however we probably want to check the response though,
		// so we can block current thread and wait for it to finish.
		// Note that since the request is being driven by the host, we don't have to wait
		// for the request to have it complete, we will just not read the response.
		let response = pending.try_wait(deadline).map_err(|_| http::Error::DeadlineReached)??;
		// Let's check the status code before we proceed to reading the response.
		if response.code != 200 {
			log::warn!("Unexpected status code: {}", response.code);
			return Err(http::Error::Unknown)
		}

		// Next we want to fully read the response body and collect it to a vector of bytes.
		// Note that the return object allows you to read the body in chunks as well
		// with a way to control the deadline.
		let body = response.body().collect::<Vec<u8>>();

		// Create a str slice from the body.
		let body_str = sp_std::str::from_utf8(&body).map_err(|_| {
			log::warn!("No UTF8 body");
			http::Error::Unknown
		})?;

		log::info!("fetch_response: {}", body_str);

		let response = body_str.to_string();

		match response.len() {
			0 => Err(http::Error::Unknown),
			_ => Ok(response),
		}
	}

	/// 

	/// Add new response to the list.
	fn add_response(maybe_who: Option<T::AccountId>, response: String) {
		log::info!("Adding response to the list: {}", response);

		// Convert the string to a byte vector.
		let response_bytes = response.into_bytes();

		// Ensure the length doesn't exceed the maximum length.
		let bounded_response = match BoundedVec::try_from(response_bytes) {
			Ok(bounded) => bounded,
			Err(_) => {
				log::warn!("Response is too long. It has been ignored.");
				return;
			},
		};
		
		// Get the current list of responses.
		let mut responses = Responses::<T>::get();

		// Attempt to append the new response to the list.
		match responses.try_push((maybe_who.clone(), bounded_response.clone())) {
			Ok(_) => {
				// Update the storage.
				Responses::<T>::put(responses);
	
				// Emit an event that new response has been received.
				Self::deposit_event(Event::NewResponse { maybe_who, response: String::from_utf8(bounded_response.into()).unwrap() });
			},
			Err(_) => {
				log::warn!("Unable to add response. Maximum number of responses reached.");
			},
		}
		
	}
}
