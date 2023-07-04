#![cfg_attr(not(feature = "std"), no_std)]
#![allow(unused_imports)]

use scale_info::TypeInfo;
use sp_io::storage;
use sp_runtime::{traits::Hash, RuntimeDebug, Permill};
use sp_std::{marker::PhantomData, prelude::*, result};

use frame_support::{
    codec::{Decode, Encode, MaxEncodedLen},
    dispatch::{
        DispatchError, DispatchResult, DispatchResultWithPostInfo, Dispatchable, GetDispatchInfo,
        Pays, PostDispatchInfo,
    },
    ensure, impl_ensure_origin_with_arg_ignoring_arg,
    traits::{
        Currency,
        tokens::{AssetId,Balance},
        Backing, ChangeMembers, EnsureOrigin, EnsureOriginWithArg, Get, GetBacking,
        InitializeMembers, StorageVersion,
    },
    weights::Weight,
};
#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;

#[cfg(any(feature = "try-runtime", test))]
use sp_runtime::TryRuntimeError;



pub mod weights;

pub use pallet::*;
pub use weights::WeightInfo;

const LOG_TARGET: &str = "runtime::cprv";
type Round = u32;


#[derive(Encode, Decode,MaxEncodedLen, Clone, PartialEq, RuntimeDebug, TypeInfo)]
pub struct Proof<AccountId> {
    proof_index: u32,
    model_index: u32,
    account_id: AccountId,
    compression_rate: u32,
}

#[derive(Encode, Decode,MaxEncodedLen, Clone, PartialEq, RuntimeDebug, TypeInfo)]
pub struct Verification<AccountId> {
    proof_index: u32,
    verify_success_account: Vec<AccountId>,
    verify_failed_account: Vec<AccountId>,
}

#[derive(Encode, Decode,MaxEncodedLen, Clone, PartialEq, RuntimeDebug, TypeInfo)]
pub struct RewardRatio<AccountId> {
    account: AccountId,
    ratio: Permill,
}



#[frame_support::pallet]
pub mod pallet {
    use super::*;
    use frame_support::{
        pallet_prelude::*,
        traits::{
            fungible::{Inspect as InspectFungible, Mutate as MutateFungible},
            fungibles::{Create, Inspect, Mutate},
        },
    };

    use frame_system::pallet_prelude::*;
    use sp_runtime::{Permill, Saturating};
    use sp_runtime::traits::{CheckedMul, IntegerSquareRoot};

    #[pallet::pallet]
    #[pallet::without_storage_info]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {

        /// The overarching event type.
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;


        type Balance: Balance;

        /// The time-out for reward
        #[pallet::constant]
        type RoundDuration: Get<Self::BlockNumber>;


        /// The max number of compression validator
        #[pallet::constant]
        type MaxValidatorNum: Get<u32>;

        #[pallet::constant]
        type MinVerifyProofValidatorNum: Get<u32>;

        #[pallet::constant]
        type RewardPerRound: Get<Self::Balance>;


        type AssetId: AssetId + PartialOrd;

        type Assets: Inspect<Self::AccountId, AssetId = Self::AssetId, Balance = Self::Balance>
        + Mutate<Self::AccountId>;

        /// Type representing the weight of this pallet
        type WeightInfo: WeightInfo;

    }

    #[pallet::storage]
    #[pallet::getter(fn validators)]
    pub type Validators<T: Config> = StorageValue<_, Vec<T::AccountId>, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn unverify_proofs)]
    pub type UnVerifyProofs<T: Config> = StorageValue<_, Vec<Proof<T::AccountId>>, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn verifications)]
    pub type Verifications<T: Config> = StorageMap<_, Blake2_128Concat, u32, Verification<T::AccountId>, OptionQuery>;

    #[pallet::storage]
    #[pallet::getter(fn verified_proofs)]
    pub type VerifiedProofs<T: Config> = StorageMap<_, Blake2_128Concat, Round, Vec<Proof<T::AccountId>>, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn reward_ratio_per_round)]
    pub type RewardRatioPerRound<T: Config> = StorageMap<_, Blake2_128Concat, Round, Vec<RewardRatio<T::AccountId>>, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn proof_count)]
    pub type ProofCount<T: Config> = StorageValue<_, u32, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn best_proofs)]
    pub type BestCompressionRate<T: Config> = StorageMap<_, Blake2_128Concat, Round, u32, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn current_round)]
    pub type CurrentRound<T: Config> = StorageValue<_, Round, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn reward_asset_id)]
    pub type RewardAssetId<T: Config> = StorageValue<_, T::AssetId>;


    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        Submitted(T::AccountId, u32),

        Registered(T::AccountId),

        VerifySuccess(u32),

        VerifyFailed(u32),

        Reward(T::AccountId, T::Balance),
    }

    #[pallet::error]
    pub enum Error<T> {

        ValidatorAlreadyRegistered,

        ValidatorNotRegistered,

        LessThanBestCompressionRate,

        NoneUnVerifyProofs,

        TooManyValidators,

    }

    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {

        fn on_initialize(_now: BlockNumberFor<T>) -> Weight {

            T::DbWeight::get().reads(1)
        }

        fn on_finalize(_n: BlockNumberFor<T>) {

            if _n > T::BlockNumber::default() && _n % T::RoundDuration::get() == T::BlockNumber::default() {
                let current_round = <CurrentRound<T>>::get();
                let best_compression_rate = <BestCompressionRate<T>>::get(current_round);
                let mut proofs = <VerifiedProofs<T>>::get(current_round);

                proofs.retain(|proof| proof.compression_rate > best_compression_rate);
                let mut rate_sum = 0;
                for proof in &proofs {
                    rate_sum = rate_sum + ( proof.compression_rate - best_compression_rate );
                }

                //计算奖励的比率
                let mut ratios = <RewardRatioPerRound<T>>::get(current_round);
                for proof in proofs {
                    let ratio = Permill::from_rational(proof.compression_rate - best_compression_rate, rate_sum);
                    let reward_ratio = RewardRatio {
                        account: proof.account_id,
                        ratio: ratio
                    };
                    ratios.push(reward_ratio);

                }
                <RewardRatioPerRound<T>>::insert(current_round, ratios); //在哪里给奖励币RewardRatioPerRound?

                //round数增加1
                <CurrentRound<T>>::mutate(|i| *i += 1 );
            }
        }
    }

    #[pallet::call(weight(<T as Config>::WeightInfo))]
    impl<T: Config> Pallet<T> {

        #[pallet::call_index(0)]
        pub fn register_validator(origin: OriginFor<T>) -> DispatchResult {
            let sender = ensure_signed(origin)?;

            // 获取当前存储的验证者列表
            let mut validators = <Validators<T>>::get();

            // 确保发送者不是已注册的验证者
            ensure!(!validators.contains(&sender), Error::<T>::ValidatorAlreadyRegistered);

            ensure!(validators.len() < T::MaxValidatorNum::get() as usize, Error::<T>::TooManyValidators);

            // 将发送者添加到验证者列表中
            validators.push(sender.clone());

            // 更新存储的验证者列表
            <Validators<T>>::put(validators);

            Self::deposit_event(Event::Registered(sender));

            Ok(())
        }

        #[pallet::call_index(1)]
        pub fn submit_proof(origin: OriginFor<T>, model_index: u32, compression_rate: u32) -> DispatchResult {
            let sender = ensure_signed(origin)?;

            let validators = <Validators<T>>::get();
            ensure!(validators.contains(&sender), Error::<T>::ValidatorNotRegistered);
            let round = <CurrentRound<T>>::get();
            let best_compression_rate = <BestCompressionRate<T>>::get(round);
            ensure!(best_compression_rate < compression_rate, Error::<T>::LessThanBestCompressionRate);

            let proof_count = <ProofCount<T>>::get();
            // 创建新的 Proof 结构体
            let proof = Proof {
                proof_index: proof_count,  //make sure proof_count only increases
                model_index: model_index,
                account_id: sender.clone(),
                compression_rate,
            };
            let mut proofs = <UnVerifyProofs<T>>::get();
            proofs.push(proof);
            // 将提交的 proof 存储到存储项中
            <UnVerifyProofs<T>>::put(proofs);
            <ProofCount<T>>::mutate(|i| *i += 1);
            Self::deposit_event(Event::Submitted(sender, proof_count));
            Ok(())
        }


        #[pallet::call_index(2)]
        pub fn validate_proof(origin: OriginFor<T>, proof_index: u32, result: bool) -> DispatchResult {
            let sender = ensure_signed(origin)?;

            let validators = <Validators<T>>::get();
            ensure!(validators.contains(&sender), Error::<T>::ValidatorNotRegistered);
            let mut proofs = <UnVerifyProofs<T>>::get();

            let min_validator_count = T::MinVerifyProofValidatorNum::get();

            //验证成功或失败的节点达到指定数量后，将Proof从待验证的列表中移除，若验证成功的节点数达标，将Proof存入验证成功的列表
            if let Some(mut verification) = <Verifications<T>>::get(&proof_index) {
                if result {
                    verification.verify_success_account.push(sender);
                    if verification.verify_success_account.len() >= min_validator_count as usize {

                        if let Some(index) = proofs.iter().position(|proof| proof.proof_index == proof_index) {
                            let removed_proof = proofs.remove(index);

                            //存储proof到当前轮次的已验证集合
                            let round = <CurrentRound<T>>::get();
                            let mut verified_proofs = <VerifiedProofs<T>>::get(round);
                            verified_proofs.push(removed_proof);
                            <VerifiedProofs<T>>::insert(round, verified_proofs);
                        }

                        Self::deposit_event(Event::VerifySuccess(proof_index));
                    }
                } else {
                    verification.verify_failed_account.push(sender);
                    if verification.verify_failed_account.len() >= min_validator_count as usize {
                        proofs.retain(|proof| proof.proof_index != proof_index);
                    }

                    Self::deposit_event(Event::VerifyFailed(proof_index));
                }
                <UnVerifyProofs<T>>::put(proofs);
                return Ok(())
            }

            //verification没有查到，说明是第一个提交验证的节点，创建verification,存入存储
            let mut verification = Verification {
                proof_index: proof_index,
                verify_success_account: Vec::new(),
                verify_failed_account: Vec::new(),
            };


            if result {
                verification.verify_success_account.push(sender);
                if min_validator_count == 1 {
                    if let Some(index) = proofs.iter().position(|proof| proof.proof_index == proof_index) {
                        let removed_proof = proofs.remove(index);

                        //存储proof到当前轮次的已验证集合
                        let round = <CurrentRound<T>>::get();
                        let mut verified_proofs = <VerifiedProofs<T>>::get(round);
                        verified_proofs.push(removed_proof);
                        <VerifiedProofs<T>>::insert(round, verified_proofs);
                    }

                    Self::deposit_event(Event::VerifySuccess(proof_index));
                }
            } else {
                verification.verify_failed_account.push(sender);

                if min_validator_count == 1 {
                    proofs.retain(|proof| proof.proof_index != proof_index);
                    Self::deposit_event(Event::VerifyFailed(proof_index));
                }
            }
            

            <Verifications<T>>::insert(proof_index, verification);
            Ok(())
        }


        #[pallet::call_index(3)]
        pub fn do_reward(origin: OriginFor<T>, round: Round) -> DispatchResult {
            let reward = T::RewardPerRound::get();
            let reward_ratios = <RewardRatioPerRound<T>>::get(round);
            let asset_id = <RewardAssetId<T>>::get().unwrap();
            for reward_ratio in reward_ratios {
                let _ = T::Assets::mint_into(asset_id.clone(), &reward_ratio.account, reward_ratio.ratio * reward );
                Self::deposit_event(Event::Reward(reward_ratio.account, reward_ratio.ratio * reward ));
            }
            Ok(())
        }

        #[pallet::call_index(4)]
        pub fn set_reward_asset_id(origin: OriginFor<T>, asset_id: T::AssetId) -> DispatchResult {
            ensure_root(origin)?;
            <RewardAssetId<T>>::put(asset_id);
            Ok(())
        }
    }
}
