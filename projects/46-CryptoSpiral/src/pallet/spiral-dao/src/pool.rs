use crate::{ensure_unique_assets, AssetBalance, BalanceOf, Config, Error};
use frame_support::pallet_prelude::*;
use frame_support::sp_runtime::traits::*;
use sp_std::{collections::btree_map::BTreeMap, fmt::Debug, prelude::*};

/// A generic Pool wrapper around different kinds of swap pools.
///
/// Allows to add new variants of pools simply by adding an additional variant in the enum without needing to migrate the storage.
#[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub enum Pool<T: Config> {
    /// A pool with equal weight constant product of 2 assets.
    BasicPool(BasicPool<T>),
}

impl<T: Config> Pool<T> {
    /// Adds the amounts of assets to liquidity pool and returns number of shares that this user receives.
    ///
    /// Updates amount to amount kept in the pool.
    pub fn add_liquidity(
        &mut self,
        account: &T::AccountId,
        asset_amounts: &mut BTreeMap<T::AssetId, BalanceOf<T>>,
    ) -> Result<BalanceOf<T>, Error<T>> {
        match self {
            Pool::BasicPool(inner) => inner.add_liquidity(account, asset_amounts),
        }
    }

    pub fn get_deposited_account_id(
        &mut self,
    ) -> Result<T::AccountId, Error<T>> {
        match self {
            Pool::BasicPool(inner) => Ok(inner.deposited_account_id.clone()),
        }
    }


    pub fn remove_liquidity(
        &mut self,
        account: &T::AccountId,
        shares: BalanceOf<T>,
        min_amounts: Vec<AssetBalance<T::AssetId, BalanceOf<T>>>,
    ) -> Result<Vec<AssetBalance<T::AssetId, BalanceOf<T>>>, Error<T>> {
        match self {
            Pool::BasicPool(inner) => inner.remove_liquidity(account, shares, min_amounts),
        }
    }

    pub fn swap(
        &mut self,
        asset_in: &T::AssetId,
        amount_in: BalanceOf<T>,
        asset_out: &T::AssetId,
        min_amount_out: BalanceOf<T>,
        exchange_account: Option<&T::AccountId>,
        referral_account: Option<&T::AccountId>,
    ) -> Result<BalanceOf<T>, Error<T>> {
        match self {
            Pool::BasicPool(inner) => inner.swap(
                asset_in,
                amount_in,
                asset_out,
                min_amount_out,
                exchange_account,
                referral_account,
            ),
        }
    }

    /// Returns balance in outcome one will receive if swap `asset_amount_in` of
    /// `asset_in` for `asset_out`.
    pub fn get_return(
        &self,
        asset_in: &T::AssetId,
        amount_in: BalanceOf<T>,
        asset_out: &T::AssetId,
    ) -> Result<BalanceOf<T>, Error<T>> {
        match self {
            Pool::BasicPool(inner) => inner.get_return(asset_in, amount_in, asset_out),
        }
    }

    /// Returns the balance of the account in the pool
    pub fn share_balances(&self, account_id: &T::AccountId) -> Option<&BalanceOf<T>> {
        match self {
            Pool::BasicPool(inner) => inner.share_balances(account_id),
        }
    }

    /// The total number of shares in this pool.
    pub fn total_share_supply(&self) -> &BalanceOf<T> {
        match self {
            Pool::BasicPool(inner) => inner.total_share_supply(),
        }
    }

    /// Returns list of assets in this pool.
    pub fn assets(&self) -> impl Iterator<Item = &T::AssetId> {
        match self {
            Pool::BasicPool(inner) => inner.assets(),
        }
    }

    /// Returns given pool's total fee.
    pub fn get_fee(&self) -> &BalanceOf<T> {
        match self {
            Pool::BasicPool(inner) => inner.get_fee(),
        }
    }
}

/// The volume of a swap for a given asset
#[derive(Clone, PartialEq, Eq, Encode, Decode, Default, Debug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct SwapVolume<Balance> {
    pub input: Balance,
    pub output: Balance,
}

/// Basic information about a pool
#[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct PoolInfo<AssetId, Balance> {
    /// List of assets in the pool and their balance
    pub asset_ids_to_amounts: BTreeMap<AssetId, Balance>,
    /// Fee charged for swap.
    pub total_fee: Balance,
    /// Total number of shares.
    pub shares_total_supply: Balance,
}

impl<T: Config> From<Pool<T>> for PoolInfo<T::AssetId, BalanceOf<T>> {
    fn from(pool: Pool<T>) -> Self {
        match pool {
            Pool::BasicPool(pool) => Self {
                asset_ids_to_amounts: pool.asset_ids_to_amounts,
                total_fee: pool.total_fee,
                shares_total_supply: pool.shares_total_supply,
            },
        }
    }
}

/// A basic "Uniswap" inspired implementation of a pool, that maintains constant product
/// between balances of all the assets provided.
///
/// Liquidity providers receive shares when depositing, the shares then can be burnt to
/// withdraw pool's assets proportionally.
#[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct BasicPool<T: Config> {

    //  相当于智能合约里的合约 账号
    pub deposited_account_id: T::AccountId,//   

    /// List of assets in the pool and their balance
    pub asset_ids_to_amounts: BTreeMap<T::AssetId, BalanceOf<T>>,
    /// Volumes accumulated by this pool.
    pub volumes: BTreeMap<T::AssetId, SwapVolume<BalanceOf<T>>>,
    /// Fee charged for swap (gets divided by the config's FeeDivisor param).
    pub total_fee: BalanceOf<T>,
    /// Portion of the fee going to exchange.
    pub exchange_fee: BalanceOf<T>,
    /// Portion of the fee going to referral.
    pub referral_fee: BalanceOf<T>,
    /// Shares of the pool by liquidity providers.
    pub shares: BTreeMap<T::AccountId, BalanceOf<T>>,
    /// Total number of shares.
    pub shares_total_supply: BalanceOf<T>,
}

impl<T: Config> BasicPool<T> {
    pub fn new(
        deposited_account_id: T::AccountId,
        asset_ids: Vec<T::AssetId>,
        total_fee: BalanceOf<T>,
        exchange_fee: BalanceOf<T>,
        referral_fee: BalanceOf<T>,
    ) -> Result<Self, Error<T>> {
        ensure!(
            total_fee < T::FeeDivisor::get() && (exchange_fee + referral_fee) <= total_fee,
            Error::<T>::PoolFeeTooLarge
        );

        let asset_ids_len = asset_ids.len();
        let asset_ids_to_amounts: BTreeMap<_, _> = asset_ids
            .iter()
            .map(|id| (id.clone(), BalanceOf::<T>::zero()))
            .collect();

        ensure!(
            asset_ids_to_amounts.len() == asset_ids_len,
            Error::<T>::DuplicateAsset
        );

        // needs at least 2 different asset types
        ensure!(
            asset_ids_to_amounts.len() > 1,
            Error::<T>::InvalidPoolAssets
        );

        Ok(Self {
            deposited_account_id, 
            volumes: asset_ids
                .into_iter()
                .map(|id| (id, SwapVolume::default()))
                .collect(),
            asset_ids_to_amounts,
            total_fee,
            exchange_fee,
            referral_fee,
            shares: BTreeMap::new(),
            shares_total_supply: BalanceOf::<T>::zero(),
        })
    }

    /// Returns the balance of the account in the pool
    pub fn share_balances(&self, account_id: &T::AccountId) -> Option<&BalanceOf<T>> {
        self.shares.get(account_id)
    }

    /// The total number of shares in this pool.
    pub fn total_share_supply(&self) -> &BalanceOf<T> {
        &self.shares_total_supply
    }

    /// Returns list of assets in this pool.
    pub fn assets(&self) -> impl Iterator<Item = &T::AssetId> {
        self.asset_ids_to_amounts.keys()
    }

    /// Returns given pool's total fee.
    pub fn get_fee(&self) -> &BalanceOf<T> {
        &self.total_fee
    }

    /// Returns balance in outcome one will receive if swap `asset_amount_in` of
    /// `asset_in` for `asset_out`.
    pub fn get_return(
        &self,
        asset_in: &T::AssetId,
        amount_in: BalanceOf<T>,
        asset_out: &T::AssetId,
    ) -> Result<BalanceOf<T>, Error<T>> {
        let in_balance = self
            .asset_ids_to_amounts
            .get(asset_in)
            .ok_or(Error::<T>::AssetNotFound)?;
        let out_balance = self
            .asset_ids_to_amounts
            .get(asset_out)
            .ok_or(Error::<T>::AssetNotFound)?;

        ensure!(
            *in_balance > BalanceOf::<T>::zero()
                && *out_balance > BalanceOf::<T>::zero()
                && asset_in != asset_out
                && amount_in > BalanceOf::<T>::zero(),
            Error::<T>::NotEnoughBalance
        );

        // TODO safe math
        let amount_with_fee = amount_in * (T::FeeDivisor::get() - self.total_fee);
        Ok(amount_with_fee * *out_balance / (T::FeeDivisor::get() * *in_balance + amount_with_fee))
    }

    /// Removes given number of shares from the pool and returns amounts to the parent.
    pub fn remove_liquidity(
        &mut self,
        account: &T::AccountId,
        shares: BalanceOf<T>,
        min_amounts: Vec<AssetBalance<T::AssetId, BalanceOf<T>>>,
    ) -> Result<Vec<AssetBalance<T::AssetId, BalanceOf<T>>>, Error<T>> {
        let prev_shares_amount = self
            .shares
            .get_mut(account)
            .ok_or(Error::<T>::AccountNotFound)?;

        ensure!(*prev_shares_amount >= shares, Error::<T>::NotEnoughBalance);

        let min_asset_amounts = ensure_unique_assets(min_amounts)?;

        let mut result = Vec::with_capacity(min_asset_amounts.len());

        for (asset, asset_balance) in &mut self.asset_ids_to_amounts {
            let amount = asset_balance
                .checked_mul(&shares)
                .unwrap()
                .checked_div(&self.shares_total_supply)
                .unwrap();

            // if min amounts set, check that at least `min_amount` is available
            if let Some(min_amount) = min_asset_amounts.get(asset) {
                ensure!(amount >= *min_amount, Error::<T>::NotEnoughBalance);
            }
            *asset_balance -= amount;
            result.push(AssetBalance::new(asset.clone(), amount));
        }

        if *prev_shares_amount == shares {
            // all shares withdrawn
            self.shares.remove(account);
        } else {
            *prev_shares_amount -= shares;
        }

        self.shares_total_supply -= shares;
        Ok(result)
    }

    /// Adds the amounts of assets to liquidity pool and returns number of shares that
    /// the given user receives.
    /// Updates amount to amount kept in the pool.
    ///
    /// Fails if the provided asset deposits don't match with the assets configured for this pool.
    pub fn add_liquidity(
        &mut self,
        account: &T::AccountId,
        provided_asset_amounts: &mut BTreeMap<T::AssetId, BalanceOf<T>>,
    ) -> Result<BalanceOf<T>, Error<T>> {
        // make sure all the provided asset amounts match with the assets registered in this pool
        ensure!(
            provided_asset_amounts.len() == self.asset_ids_to_amounts.len(),
            Error::<T>::InvalidLiquidityDeposit
        );
        ensure!(
            provided_asset_amounts
                .iter()
                .all(|(asset_id, amount)| !amount.is_zero()
                    && self.asset_ids_to_amounts.contains_key(asset_id)),
            Error::<T>::InvalidLiquidityDeposit
        );

        let shares = if self.shares_total_supply == BalanceOf::<T>::zero() {
            // no shares minted yet
            for (asset, asset_balance) in &mut self.asset_ids_to_amounts {
                let provided_asset_liquidity = provided_asset_amounts
                    .get(asset)
                    .expect("We already checked that this is included; qed");
                *asset_balance += *provided_asset_liquidity;
            }
            T::InitSharesSupply::get()
        } else {
            // calculate fair supply
            let mut fair_supply = BalanceOf::<T>::max_value();

           
            for (asset, asset_balance) in &self.asset_ids_to_amounts {
                let provided_asset_liquidity = provided_asset_amounts
                    .get(asset)
                    .expect("We already checked that this is included; qed");
                // SAFETY: dividing by `asset_balance` can't by dividing by zero,
                //  because we made sure at least one account deposited liquidity (>0) beforehand.
                // TODO: make this safe
                fair_supply = fair_supply.min(
                    provided_asset_liquidity
                        .checked_mul(&self.shares_total_supply)
                        .unwrap()
                        .checked_div(asset_balance)
                        .unwrap(),
                );
            }             
            for (asset, asset_balance) in &mut self.asset_ids_to_amounts {
                // TODO: make this safe
                let amount = asset_balance
                    .checked_mul(&fair_supply)
                    .unwrap()
                    .checked_div(&self.shares_total_supply)
                    .unwrap();
                *asset_balance += amount;
                *provided_asset_amounts
                    .get_mut(asset)
                    .expect("We already checked that this is included; qed") = amount;
            }
            fair_supply
        };

        self.mint_shares(account, shares);
        Ok(shares)
    }

    /// Mint new shares for given user.
    fn mint_shares(&mut self, account_id: &T::AccountId, shares: BalanceOf<T>) {
        if shares.is_zero() {
            return;
        }
        self.shares_total_supply += shares;
        self.add_to_account(account_id.clone(), shares);
    }

    /// add given shares to the user's balance
    fn add_to_account(&mut self, account: T::AccountId, shares: BalanceOf<T>) {
        let value = self.shares.entry(account).or_insert(BalanceOf::<T>::zero());
        *value += shares;
    }

    /// Swap `asset_amount_in` of `asset_in` asset into `asset_out` and return how much was received.
    /// Assuming that `asset_amount_in` was already received from the origin sender.
    ///
    /// The optional `exchange_account` account will receive the configured fees as shares.
    pub fn swap(
        &mut self,
        asset_in: &T::AssetId,
        amount_in: BalanceOf<T>,
        asset_out: &T::AssetId,
        min_amount_out: BalanceOf<T>,
        exchange_account: Option<&T::AccountId>,
        referral_account: Option<&T::AccountId>,
    ) -> Result<BalanceOf<T>, Error<T>> {
        let amount_out = self.get_return(asset_in, amount_in, asset_out)?;

        // can't withdraw less that demanded
        ensure!(amount_out >= min_amount_out, Error::<T>::NotEnoughBalance);

        let asset_balance_in = self
            .asset_ids_to_amounts
            .get(asset_in)
            .ok_or(Error::<T>::AssetNotFound)?;

        let asset_balance_out = self
            .asset_ids_to_amounts
            .get(asset_out)//feng  这里有bug，改过来了，原来是asset_in
            .ok_or(Error::<T>::AssetNotFound)?;

        // constant-product invariant (x*y=k price curve)
        let prev_cp_invariant = uint_sqrt(*asset_balance_in * *asset_balance_out)
            .ok_or(Error::<T>::NotEnoughBalance)?;

        // adjust asset balances
        let new_asset_balance_in = *asset_balance_in + amount_in;
        let new_asset_balance_out = *asset_balance_out - amount_out;

        let new_cp_invariant = uint_sqrt(new_asset_balance_in * new_asset_balance_out)
            .ok_or(Error::<T>::NotEnoughBalance)?;

        // TODO invariant can not decrease, so this should never fail?
        ensure!(
            new_cp_invariant >= prev_cp_invariant,
            Error::<T>::InvalidCurveInvariant
        );

        let num = (new_cp_invariant - prev_cp_invariant) * self.shares_total_supply;

        if let Some(exchange_account) = exchange_account {
            // pay fees into the exchanges account, in pct. of the provider rewards.
            if !self.exchange_fee.is_zero() && num > BalanceOf::<T>::zero() {
                let denom = new_cp_invariant * self.total_fee / self.exchange_fee;
                self.mint_shares(exchange_account, num / denom);
            }
        }

        // if there is a referral, also pay it its percentage of provider rewards
        if let Some(referral_account) = referral_account {
            if !self.referral_fee.is_zero() && num > BalanceOf::<T>::zero() {
                let denom = new_cp_invariant * self.total_fee / self.referral_fee;
                self.mint_shares(referral_account, num / denom);
            }
        }

        // update the balances
        self.asset_ids_to_amounts
            .insert(asset_in.clone(), new_asset_balance_in);
        self.asset_ids_to_amounts
            .insert(asset_out.clone(), new_asset_balance_out);

        // update volumes
        let vol = self.volumes.entry(asset_in.clone()).or_default();
        vol.input += amount_in;
        vol.output += amount_out;

        Ok(amount_out)
    }
}

/// Compute `n`'s square root with Newton's method of integer square root.
///
/// Finds the greatest uint less than or equal to the square root of n.
pub fn uint_sqrt<T: AtLeast32BitUnsigned + Copy>(n: T) -> Option<T> {
    let mut estimate = (n + T::one()).checked_shr(1)?;
    let mut result = n;
    while estimate < result {
        result = estimate;
        estimate = (n / estimate + estimate).checked_shr(1)?;
    }
    Some(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_uint_sqrt() {
        assert_eq!(Some(0), uint_sqrt(0u64));
        assert_eq!(Some(2), uint_sqrt(4u64));
        assert_eq!(Some(8), uint_sqrt(64u64));
        assert_eq!(Some(8), uint_sqrt(80u64));
        assert_eq!(Some(9), uint_sqrt(81u64));
    }
}