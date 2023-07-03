//! # Xcm Module / inspired by ORML xcm

#![cfg_attr(not(feature = "std"), no_std)]
#![allow(clippy::large_enum_variant)]

pub use module::*;

#[frame_support::pallet]
pub mod module {
	use frame_support::{
		pallet_prelude::*,
		traits::{EnsureOrigin, OriginTrait},
	};
	use frame_system::pallet_prelude::*;
	use sp_std::boxed::Box;
	use xcm::{latest::prelude::*, VersionedMultiLocation, VersionedXcm};
	// use xcm::v3::{Junctions, MultiLocation};
	/// the filter account who is allowed to dispatch XCM sends
	use sp_std::marker::PhantomData;
	use xcm_executor::traits::Convert;

	#[derive(PartialEq, Eq, Clone, RuntimeDebug, Encode, Decode, TypeInfo, MaxEncodedLen)]
	pub struct SuccessAIMessage {
		pub current: MultiLocation,
		pub channel_id: u32,
	}
	pub struct ChannelWrapper<Origin, Conversion>(PhantomData<(Origin, Conversion)>);
	impl<Origin: OriginTrait + Clone, Conversion: Convert<Origin, SuccessAIMessage>>
		EnsureOrigin<Origin> for ChannelWrapper<Origin, Conversion>
	where
		Origin::PalletsOrigin: PartialEq,
	{
		type Success = SuccessAIMessage;
		fn try_origin(o: Origin) -> Result<Self::Success, Origin> {
			let o = match Conversion::convert(o) {
				Ok(sam) => return Ok(sam),
				Err(o) => o,
			};

			if o.caller() == Origin::root().caller() {
				Ok(SuccessAIMessage { current: Here.into(), channel_id: 0u32 })
			} else {
				Err(o)
			}
		}

		#[cfg(feature = "runtime-benchmarks")]
		fn try_successful_origin() -> Result<Origin, ()> {
			Ok(Origin::root())
		}
	}
	use pallet_onboard::GetChannelInfo;
	pub struct OriginAIMessageConverter<RuntimeOrigin, COrigin, AccountId>(
		PhantomData<(RuntimeOrigin, COrigin, AccountId)>,
	);
	impl<RuntimeOrigin: OriginTrait + Clone, COrigin: GetChannelInfo<AccountId>, AccountId>
		Convert<RuntimeOrigin, SuccessAIMessage>
		for OriginAIMessageConverter<RuntimeOrigin, COrigin, AccountId>
	where
		RuntimeOrigin::PalletsOrigin:
			From<COrigin> + TryInto<COrigin, Error = RuntimeOrigin::PalletsOrigin>,
	{
		fn convert(o: RuntimeOrigin) -> Result<SuccessAIMessage, RuntimeOrigin> {
			o.try_with_caller(|caller| match caller.try_into() {
				Ok(co) => match co.get_channel_info() {
					Some(channel_info) => Ok(SuccessAIMessage {
						// We do not know the exact logic of delivering channel yet
						current: MultiLocation { parents: 1, interior: Junctions::Here },
						channel_id: channel_info.channel_id,
					}),
					None => Err(co.into()),
				},
				Err(other) => Err(other),
			})
		}
	}

	#[pallet::config]
	pub trait Config: frame_system::Config + pallet_xcm::Config {
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		/// The required origin for sending XCM.
		type ChannelSovereignOrigin: EnsureOrigin<<Self as frame_system::Config>::RuntimeOrigin>;
	}

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// XCM message sent. \[to, message\]
		Sent { to: MultiLocation, message: Xcm<()> },
	}

	#[pallet::error]
	pub enum Error<T> {
		/// The message and destination combination was not recognized as being
		/// reachable.
		Unreachable,
		/// The message and destination was recognized as being reachable but
		/// the operation could not be completed.
		SendFailure,
		/// The version of the `Versioned` value used is not able to be
		/// interpreted.
		BadVersion,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Send an XCM message as parachain sovereign.
		#[pallet::call_index(0)]
		// FIXME: Benchmark send
		#[pallet::weight(Weight::from_parts(100_000_000, 0))]
		pub fn send_ai_xcm(
			origin: OriginFor<T>,
			dest: Box<VersionedMultiLocation>,
			// In future, this message should be replaced with more fixed parameters
			// And the parameters should be determined by aiorigin ChannelWrapper
			message: Box<VersionedXcm<()>>,
		) -> DispatchResult {
			let _ = T::ChannelSovereignOrigin::ensure_origin(origin)?;
			let dest = MultiLocation::try_from(*dest).map_err(|()| Error::<T>::BadVersion)?;
			let message: Xcm<()> = (*message).try_into().map_err(|()| Error::<T>::BadVersion)?;

			// It is pallet_xcm's responsibility to control what message should be allowed
			pallet_xcm::Pallet::<T>::send_xcm(Here, dest, message.clone()).map_err(
				|e| match e {
					SendError::Unroutable => Error::<T>::Unreachable,
					_ => Error::<T>::SendFailure,
				},
			)?;
			Self::deposit_event(Event::Sent { to: dest, message });
			Ok(())
		}
	}
}
