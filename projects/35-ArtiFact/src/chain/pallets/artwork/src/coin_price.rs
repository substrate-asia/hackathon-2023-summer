use codec::{Decode, Encode};
use core::fmt;
use frame_support::inherent::Vec;
use serde::{Deserialize, Deserializer};
use scale_info::TypeInfo;

#[derive(Deserialize, Encode, Decode, Clone, PartialEq, Eq, TypeInfo)]
pub(crate) struct CoinPriceInfo {
	mins: u32,
	#[serde(deserialize_with = "de_string_to_bytes")]
	pub(crate) price: Vec<u8>,
}


impl fmt::Debug for CoinPriceInfo {
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
		write!(
			f,
			"{{ mins: {}, price: {} }}",
			&self.mins,
			sp_std::str::from_utf8(&self.price).map_err(|_| fmt::Error)?
		)
	}
}

pub fn de_string_to_bytes<'de, D>(de: D) -> Result<Vec<u8>, D::Error>
	where
		D: Deserializer<'de>,
{
	let s: &str = Deserialize::deserialize(de)?;
	Ok(s.as_bytes().to_vec())
}
