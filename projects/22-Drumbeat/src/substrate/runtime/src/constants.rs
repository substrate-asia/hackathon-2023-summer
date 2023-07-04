pub mod currency {
	use crate::Balance;

	/// Currency units
	pub const UNIT: Balance = 1_000_000_000_000;
	pub const DOLLARS: Balance = UNIT; // 1_000_000_000_000
	pub const CENTS: Balance = DOLLARS / 100; // 10_000_000_000
	pub const MILLICENTS: Balance = CENTS / 1_000; // 10_000_000

	/// Function used in some fee configurations
	pub const fn deposit(items: u32, bytes: u32) -> Balance {
		items as Balance * DOLLARS + (bytes as Balance) * 100 * MILLICENTS
	}
}
