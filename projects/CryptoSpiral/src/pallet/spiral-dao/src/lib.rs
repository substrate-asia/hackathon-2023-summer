// 代码参考  https://github.com/mattsse/substrate-exchange-xcmp
// Edit this file to define custom logic or remove it if it is not needed.
// Learn more about FRAME and the core library of Substrate FRAME pallets:
// <https://substrate.dev/docs/en/knowledgebase/runtime/frame>
#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;

mod pool;
mod dao;


pub use pallet::*;
use scale_info::TypeInfo;


#[frame_support::pallet]
pub mod pallet {
	use sp_std::{convert::TryInto, vec::Vec, collections::btree_map::BTreeMap, fmt::Debug, prelude::*};	
	use frame_support::{dispatch::DispatchResult, pallet_prelude::*,
        traits::{
            Currency, ReservableCurrency, WithdrawReasons, ExistenceRequirement, Time, 
            tokens::{ DepositConsequence, WithdrawConsequence, BalanceStatus as Status},
        } 
    };
	use frame_system::{pallet_prelude::*, RawOrigin};
	use sp_runtime::{ traits::{AtLeast32BitUnsigned, StaticLookup, One, Zero, CheckedSub, CheckedAdd, CheckedMul, CheckedDiv, TrailingZeroInput},	};
	
    use crate::pool::{BasicPool, Pool, PoolInfo};
    use crate::dao::{UnionDao, Dao, DaoStatus, UnionTask, TaskStatus};

    use pallet_multisig::WeightInfo;
    use pallet_dao_collective::Instance4;
    use sp_io::hashing::blake2_256;


    
       

	 /// Represents supported assets in the exchange, either native currency or a representation for assets from other parachains
	 #[derive(Encode, Decode, Clone, Copy, PartialEq, Eq, Debug)]
	 pub enum Asset<AssetId: Default + Debug + Ord + Copy> {
		 Native,
		 ParachainAsset(AssetId),
	 }
 
	 /// Represents asset balances
	 pub type BalanceOf<T> =
        //<T as pallet_assets::Config>::Balance;
		 <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
 
	 /// Represents an asset and its balance
	 #[derive(Encode, Decode, PartialEq, Eq, Clone, Default, Debug, TypeInfo)]
     #[scale_info(skip_type_params(T))]
	 pub struct AssetBalance<AssetId, Balance> {
		 /// the asset to deposit
		 pub asset: AssetId,
		 /// The amount to deposit
		 pub amount: Balance,
	 }
    

	impl<AssetId, Balance> AssetBalance<AssetId, Balance> {
        pub fn new(asset: AssetId, amount: Balance) -> Self {
            Self { asset, amount }
        }
    }

    /// Makes sure only unique assets are in a list of assets and their balances
    pub fn ensure_unique_assets<T: Config>(
        assets: Vec<AssetBalance<T::AssetId, BalanceOf<T>>>,
    ) -> Result<BTreeMap<T::AssetId, BalanceOf<T>>, Error<T>> {
        let assets_len = assets.len();
        let asset_set: BTreeMap<_, _> = assets.into_iter().map(|x| (x.asset, x.amount)).collect();
        if asset_set.len() == assets_len {
            Ok(asset_set)
        } else {
            Err(Error::<T>::DuplicateAsset)
        }
    }


	/// Single asset swap action, represents some `amount` of `asset_in` is being exchanged to `asset_out`
    #[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
    #[scale_info(skip_type_params(T))]
    pub struct AssetSwap<AssetId, Balance, PoolId> {
        /// Pool which should be used for swapping.
        pub pool_id: PoolId,
        /// Asset to swap from.
        pub asset_in: AssetId,
        /// Amount to exchange.
        ///
        /// If amount_in is None, it will take amount_out from previous step.
        /// Will fail if amount_in is None on the first step.
        pub amount_in: Option<Balance>,
        /// Asset to swap into.
        pub asset_out: AssetId,
        /// Required minimum amount of asset_out.
        pub min_amount_out: Balance,
    }

    /// Information about a completed `AssetSwap`
    #[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
    #[scale_info(skip_type_params(T))]
    pub struct AssetSwapInfo<AssetId, Balance, PoolId> {
        /// The pool the swap occurred
        pub pool_id: PoolId,
        /// Asset to swap from.
        pub asset_in: AssetId,
        /// Amount to exchange.
        ///
        /// The amount exchanged
        pub amount_in: Balance,
        /// Asset to swap into.
        pub asset_out: AssetId,
        /// Swapped amount of asset_out.
        pub amount_out: Balance,
    }

   

    /// Information about the main's administrators
    #[derive(Encode, Decode, Clone, Debug, TypeInfo)]
    #[scale_info(skip_type_params(T))]
    pub struct DaoCouncil<T: Config> {
        /// Balance of native network currency sent to the exchange
        pub threshold: Option<u64>,
        pub site_count: u64, //席位数量
        //pub account_id_min: Option<T::AccountId>,//没位置的时候，你只能跟最后一个人比。如果最后一个人变化了，你就先 把最后人的先更新。       
        /// Amounts of various admins in this dao.
        pub admins: BTreeMap<T::AccountId, <T as pallet_assets::Config>::Balance>,
    }


    impl<T: Config> Default for DaoCouncil<T> {
        fn default() -> Self {
            Self {
                threshold: Option::None,
                site_count: 0,
                //account_id_min: Option::None,
                admins: BTreeMap::new(),
            }
        }
    }



    /// Mapping from vpn to owner.
    #[pallet::storage]
    #[pallet::getter(fn dao_councils)]
    pub type DaoCouncils<T: Config> = StorageMap<_, Blake2_128Concat, T::DaoId, Option<DaoCouncil<T>>, ValueQuery>;


    #[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
    #[scale_info(skip_type_params(T))]
    pub struct AppAdvertise<T:Config> {          
        pub id: T::DaoId,//本身的ID？        
        pub owner_id: T::AccountId,//owner, 如果是union ,则是union对应的account_id
        pub union_id: Option<T::DaoId>, //如果owner不是union ower, 则为none
        pub asset_id: Option<T::AssetId>,
        pub tag: Vec<u8>,   
        pub area: Vec<u8>,
        pub ver: u32,        
        pub ext_1: Vec<u8>,
        pub ext_2: Vec<u8>,
        pub body: Vec<u8>,      
        pub status: u32,          
    }


    /// Mapping from vpn to owner.
	#[pallet::storage]
	#[pallet::getter(fn app_advertise_owner)]
	pub type AppAdvertiseOwner<T: Config> = StorageMap<_, Blake2_128Concat, T::DaoId, T::AccountId, OptionQuery>;


	#[pallet::storage]
	#[pallet::getter(fn task_action_payed)]
	pub type TaskActionPayed<T: Config> = StorageMap<
        _, 
        Blake2_128Concat, 
        T::AccountId, 
        Vec<(T::TaskId, u64, BalanceOf<T>)>,//action-code 的列表
        OptionQuery,
    >;


	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
    pub trait Config: frame_system::Config  + pallet_multisig::Config + pallet_assets::Config + pallet_dao_collective::Config<Instance4>  + pallet_nftvpn::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;  
		
		 /// The dispatch origin that owns this exchange and is able to (un)register new pools.
		 type ExchangeAdmin: EnsureOrigin<<Self as frame_system::Config>::RuntimeOrigin>;

          /// Origin from which the next tabled referendum may be forced. This is a normal
		/// "super-majority-required" referendum.
		type ExternalOrigin: EnsureOrigin<<Self as frame_system::Config>::RuntimeOrigin, Success=Option<u64>>;
        

        //type VetoOrigin: EnsureOrigin<<Self as frame_system::Config>::RuntimeOrigin, Success=Self::AccountId>;
        type VetoOrigin: EnsureOrigin<<Self as frame_system::Config>::RuntimeOrigin, Success=(Option<u64>, Self::AccountId)>;
        


         /// Identifier for a dao
         type DaoId: Member + Parameter + Copy + AtLeast32BitUnsigned + From<u64>;

         type TaskId: Member + Parameter + Copy + AtLeast32BitUnsigned + From<u128>;

		 /// Identifier for a pool
		 type PoolId: Member + Parameter + Copy + AtLeast32BitUnsigned + From<u64>;
 
		 type MaxPoolLimit: Get<u64>;
         
         type MinSubDaoId: Get<u64>;

         /// The minimum amount required to keep an account open.
		 #[pallet::constant]
		 type ExistentialDeposit: Get<BalanceOf<Self>>;
 
		 /// Representation of Assets
		 type Asset2Id: Member + Parameter + Default + Ord + MaybeSerializeDeserialize;
 
		 /// Main currency
		 type Currency: Currency<Self::AccountId>;

         /// Runtime hooks to external pallet using treasury to compute spend funds.
	     //type SpendFunds: SpendFunds<Self, I>;
 
		 /// The fee divisor
		 type FeeDivisor: Get<BalanceOf<Self>>;
 
		 /// Exchange fee, that goes to exchange itself
		 type ExchangeFee: Get<BalanceOf<Self>>;
 
		 /// Referral fee, that goes to referrer in the call
		 type ReferralFee: Get<BalanceOf<Self>>;
 
		 /// Minimum amount of native currency to execute add/remove liquidity operations
		 type MinNativeAssetAmount: Get<BalanceOf<Self>>;
 
		 /// Minimum parachain asset amount execute add/remove liquidity operations.
		 type MinParachainAssetAmount: Get<BalanceOf<Self>>;
 
		 /// Initial shares supply on deposit of liquidity.
		 type InitSharesSupply: Get<BalanceOf<Self>>;

         type WeightInfo: pallet_multisig::WeightInfo;

         type Time: Time;

	}

	#[pallet::pallet]
    #[pallet::without_storage_info]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);


    #[pallet::storage]
    #[pallet::getter(fn daos)]
    /// A list of all the available daos
    pub type Daos<T: Config> = StorageMap<_, Blake2_128Concat, T::DaoId, UnionDao<T>>;


    
    #[pallet::storage]
    #[pallet::getter(fn key_daos)]
    /// 一次币同时只能有一个活动的dao
    pub type KeyDaos<T: Config> = StorageMap<_, Blake2_128Concat, T::AssetId, T::DaoId>;
    

    #[pallet::storage]
    #[pallet::getter(fn dao_count)]
    /// The total number of daos currently stored in the map.
    ///
    /// Because the map does not store its size, we store it separately
    pub type DaoCount<T: Config> = StorageValue<_, u64>;//todo shuld be u128


    #[pallet::storage]
    #[pallet::getter(fn tasks)]
    /// A list of all the available daos
    pub type Tasks<T: Config> = StorageMap<_, Blake2_128Concat, T::TaskId, UnionTask<T>>;


	#[pallet::storage]
    #[pallet::getter(fn taskActions)]
    /// A list of all the actions of every advertise 
    pub type TaskActions<T: Config> = StorageMap<_, Blake2_128Concat, T::DaoId, Vec<u8> >;


    	
	#[pallet::storage]
	pub type TaskRecentList<T: Config> = StorageMap<_, Blake2_128Concat, T::DaoId, Vec<T::TaskId>>;

    #[pallet::storage]
    #[pallet::getter(fn task_count)]
    pub type TaskCount<T: Config> = StorageValue<_, u128>;//todo shuld be u128

    #[pallet::storage]
    #[pallet::getter(fn task_nounces)]
    /// A list of all the available daos
    pub type TaskNounces<T: Config> = StorageMap<_, Blake2_128Concat, Vec<u8>, u64>;




    #[pallet::storage]
    #[pallet::getter(fn app_advertises)]
    /// A list of all the available daos
    pub type AppAdvertises<T: Config> = StorageMap<_, Blake2_128Concat, T::DaoId, AppAdvertise<T>>;

    

    #[pallet::storage]
    #[pallet::getter(fn app_advertise_count)]
    /// The total number of daos currently stored in the map.
    ///
    /// Because the map does not store its size, we store it separately
    pub type AppAdvertiseCount<T: Config> = StorageValue<_, u64>;



    #[pallet::storage]
    /// The account that should get payed for every trade
    pub type ExchangeAccount<T: Config> = StorageValue<_, T::AccountId>;

    #[pallet::storage]
    #[pallet::getter(fn pools)]
    /// A list of all the available pools
    pub type Pools<T: Config> = StorageMap<_, Blake2_128Concat, T::PoolId, Pool<T>>;


    #[pallet::storage]
    #[pallet::getter(fn key_pools)]
    /// A list of all the available pools
    pub type KeyPools<T: Config> = StorageMap<_, Blake2_128Concat, (T::AssetId, T::AssetId), T::PoolId>;

    #[pallet::storage]
    #[pallet::getter(fn pool_count)]
    /// The total number of pools currently stored in the map.
    ///
    /// Because the map does not store its size, we store it separately
    pub type PoolCount<T: Config> = StorageValue<_, u64>;



	#[pallet::genesis_config]
    pub struct GenesisConfig<T: Config> {
        //pub allowed_assets: Vec<T::AssetId>,
        pub exchange_account: Option<T::AccountId>,
    }


	#[cfg(feature = "std")]
    impl<T: Config> Default for GenesisConfig<T> {
        fn default() -> Self {
            Self {
                //allowed_assets: Default::default(),
                exchange_account: Default::default(),
            }
        }
    }

    #[pallet::genesis_build]
    impl<T: Config> GenesisBuild<T> for GenesisConfig<T> {
        fn build(&self) {
            if let Some(acc) = self.exchange_account.clone() {
                ExchangeAccount::<T>::put(acc);
            }
            /*
            for asset in self.allowed_assets.iter() {
                AllowedAssets::<T>::insert(asset.clone(), ());
            }*/
        }
    }

    #[cfg(feature = "std")]
    impl<T: Config> GenesisConfig<T> {
        /// Direct implementation of `GenesisBuild::build_storage`.
        ///
        /// Kept in order not to break dependency.
        pub fn build_storage(&self) -> Result<frame_support::sp_runtime::Storage, String> {
            <Self as GenesisBuild<T>>::build_storage(self)
        }

        /// Direct implementation of `GenesisBuild::assimilate_storage`.
        ///
        /// Kept in order not to break dependency.
        pub fn assimilate_storage(
            &self,
            storage: &mut frame_support::sp_runtime::Storage,
        ) -> Result<(), String> {
            <Self as GenesisBuild<T>>::assimilate_storage(self, storage)
        }
    }



	/// Pallets use events to inform users when important changes are made.
    // https://substrate.dev/docs/en/knowledgebase/runtime/events
    #[pallet::event]
    //#[pallet::metadata(T::AccountId = "AccountId", T::PoolId = "Pool", T::AssetId = "Asset")]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {

        AppAdvertiseAdded{id: T::DaoId,  owner: T::AccountId, owner_union: Option<T::DaoId>, asset_id: Option<T::AssetId>, tag: Vec<u8>, area: Vec<u8>, info: Vec<u8>},


        AppAdvertiseUpdated{id: T::DaoId, info: Vec<u8>},
		AppAdvertiseActionsUpdated{id: T::DaoId, actions: Vec<u8>},
        AppAdvertiseOwnerUpdated{id: T::DaoId, owner: T::AccountId, owner_union: Option<T::DaoId>,},

        /// Added a new pool. [creator, pool identifier, assets in pool]
        DaoAdded{who: T::AccountId, dao_id: T::DaoId, my_asset_id: T::AssetId, deposited_account_id: T::AccountId},
        DaoAppended{who: T::AccountId, dao_id: T::DaoId, my_asset_id: T::AssetId},
        DaoDeadlineUpdated{dao_id: T::DaoId, deadline: T::BlockNumber},

        TaskAppended{who: T::AccountId, dao_id: T::DaoId, task_id: T::TaskId, my_asset_id: T::AssetId},
        TaskReward{who: T::AccountId, dao_id: T::DaoId, tee_account_id: T::AccountId, amount_fact: BalanceOf<T>},
        TaskActionPayed{ who: T::AccountId, dao_id: T::DaoId, task_id: T::TaskId, action_code: u64, amount: BalanceOf<T> },


        DaoAssetToMined{who: T::AccountId, dao_id: T::DaoId, amount_fact: BalanceOf<T>},

        DaoFinished{who: T::AccountId, dao_id: T::DaoId, my_asset_id: T::AssetId},

        DaoAborted{who: T::AccountId, dao_id: T::DaoId, my_asset_id: T::AssetId},

        /// Amounts of assets deposited into a pool [account, added liquidity]
        AddedLiquidity(T::AccountId, Vec<AssetBalance<T::AssetId, BalanceOf<T>>>),

        /// Amounts of assets withdrawn from a pool [account, removed liquidity]
        RemovedLiquidity(T::AccountId, Vec<AssetBalance<T::AssetId, BalanceOf<T>>>),

        /// Added a new pool. [creator, pool identifier, assets in pool]
        PoolAdded(T::AccountId, T::PoolId, Vec<T::AssetId>),

        /// Swapped a set of assets [account, asset swaps]
        Swapped(
            T::AccountId,
            Vec<AssetSwapInfo<T::AssetId, BalanceOf<T>, T::PoolId>>,
        ),

        /// Registered an asset in the user's account deposit [owner, asset identifiers]
        RegisteredAssets(T::AccountId, Vec<T::AssetId>),

        /// Unregistered an asset from a user's account [owner, asset identifiers]
        UnRegisteredAssets(T::AccountId, Vec<T::AssetId>),

        /// Withdrawn user deposits [owner, asset, balance]
        WithDrawn(T::AccountId, T::AssetId, BalanceOf<T>),

        /// Deposited into user's account [owner, asset, balance]
        Deposited(T::AccountId, T::AssetId, BalanceOf<T>),

        /// Deposited into user's account [previous account, new account]
        SetExchangeAccount(Option<T::AccountId>, T::AccountId),

        /// Fired when a new asset was activated on this exchange [asset id]
        AssetActivated(T::AssetId),

        /// Fired when a new user is registered [account id]
        UserRegistered(T::AccountId),



    }
	

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// Error names should be descriptive.
		NoneValue,
		/// Errors should have helpful documentation associated with them.
        StorageOverflow,
        /// Maximum amount of pools issued
        PoolLimitReached,
        /// Thrown when the user doesn't have enough balance in his account
        NotEnoughBalance,
        /// Thrown when the user is not registered yet
        AccountNotFound,
        /// Thrown when the asset is not found
        AssetNotFound,
        /// Thrown when the asset is not allowed
        AssetNotAllowed,
        /// Thrown when an asset is already registered
        DuplicateAsset,
        /// Thrown when an asset can't be unregistered because balance is non zero
        NonZeroBalance,
        /// Thrown when no matching pool was found
        PoolNotFound,
        /// Thrown when a liquidity deposit doesn't correspond with the assets registered in a pool
        InvalidLiquidityDeposit,
        /// Thrown when a new pool can not be initiated because the fee is too large
        PoolFeeTooLarge,
        /// Thrown when a pool can not be initiated because too few asset types were supplied
        InvalidPoolAssets,
        /// Thrown only when the `T::PoolId` type was configured to produce duplicate values
        /// for different counter inputs `T::PollId : From<u64>`
        InvalidPoolId,
        /// Thrown when the invariant after a swap is larger than before
        // TODO can this even happen?
        InvalidCurveInvariant,
        /// Thrown when no initial swap amount in was set in a series of asset swap actions
        MissingSwapAmountIn,



        ArgOverflow,
        ArgConflict,

        AppAdvertiseNotFound,

        RequireOwner,

        DaoNotFound,

        DaoDuplicated,

        DaoAliveDuplicated,

        DaoDeadlineReached,

        DaoDeadlineNotReached,

        DaoMaxReached,

        DaoMinReached,

        //DaoSubDaoIDTooSmall,

        DaoIdTooLarge,

        DaoMinNotReached,

        DaoStatusInvalid,

        FirstDaoStatusInvalid,

        //必需保留10%到池子中
        DaoKeepForPoolNeed10,

        //已经有pool的就不再keep了
        DaoKeepForExistPoolMust00,

        FirstDaoIdNeeded,

        DaoAbortVoidlated,
       
        TaskNotFound,
        NounceNotFound,
        ErrorTeeAccountId,
        TaskVpnCreateNotFound, 
        TaskActionDuplicte,
        InvalidTaskAction,

        Unknown,
	}

    
	#[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {}


	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
	#[pallet::call]
	impl<T: Config> Pallet<T> {       



		/// 加入一个推广社群“议会”
		/// 需要是投资者
		/// 我们修改了substrate collective pallet ,让他可以支持动态生成多个，而不是全局在代码里配置 
        #[pallet::weight(10_000)]
        pub fn union_dao_council_join(
            origin: OriginFor<T>,
            dao_id: T::DaoId,
            //account_id_min: T::AccountId,
            
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin)?;


            let  mut dao = Daos::<T>::get(&dao_id).ok_or(Error::<T>::DaoNotFound)?;
            let  (my_asset_id, deposited_account_id) = 
                (dao.my_asset_id.clone(),   dao.deposited_account_id.clone() );

            let my_asset_id_u32: u32 = TryInto::<u32>::try_into(my_asset_id.clone()).ok().unwrap();
            let dao_id_u64: u64 = dao_id.try_into().ok().unwrap();//好像必需经过中间u64转换
            let my_asset_id_u64: u64 = my_asset_id_u32.into();

            ensure!(my_asset_id_u64 == dao_id_u64, Error::<T>::FirstDaoIdNeeded);

            //let app_advertise_exist = AppAdvertises::<T>::get(&dao_id).ok_or(Error::<T>::AppAdvertiseNotFound)?;
            let mut dao_council = DaoCouncils::<T>::get(&dao_id).unwrap_or_default();
            //排序。。
           

            //end 排序。。

            //取得资格需要对应的钱，要把在active dao里的钱也算进去       
            let mut investors: BTreeMap<T::AccountId, BalanceOf<T>> = match KeyDaos::<T>::get(my_asset_id.clone())   {
                //Some(dao_id) => dao.investors.clone(),
                Some(active_dao_id) => Daos::<T>::get(&active_dao_id).unwrap().investors.clone(),
                None => BTreeMap::new(), 
            };  
            let mut asset_balance = pallet_assets::Pallet::<T>::balance(my_asset_id, &who);   

            let value_indao : BalanceOf<T>  = *investors.entry(who.clone()).or_default();
            let value_indao: T::Balance = TryInto::<u128>::try_into(value_indao).ok().unwrap().try_into().ok().unwrap(); 
            asset_balance = asset_balance + value_indao;
            ensure!(asset_balance > <T as pallet_assets::Config>::Balance::zero(), Error::<T>::NotEnoughBalance);
           


            let old_count: u32 = dao_council.admins.len().try_into().unwrap();

            if dao_council.admins.len() >=<T as pallet_dao_collective::Config<Instance4>>::MaxMembers::get().try_into().unwrap() {//必需ban一个人下来。
                let mut balance_min: T::Balance = asset_balance.clone();
                let mut account_id_min: T::AccountId = who.clone();
                for (account_t, banlance_t) in  dao_council.admins.clone() {
                    //let asset_balance_t: u128 = pallet_assets::Pallet::<T>::balance(asset_id, account_t).try_into().unwrap_or(0u128);
                    //顺带更新一下每个的钱。。。 
                    let mut asset_balance_t = pallet_assets::Pallet::<T>::balance(my_asset_id, &account_t);

                    let value_indao : BalanceOf<T>  = *investors.entry(account_t.clone()).or_default();
                    let value_indao: T::Balance = TryInto::<u128>::try_into(value_indao).ok().unwrap().try_into().ok().unwrap(); 
                    asset_balance_t = asset_balance_t + value_indao;

                    dao_council.admins.insert(account_t.clone(), asset_balance_t.clone());

                    if asset_balance_t < balance_min  {
                        account_id_min = account_t;
                        balance_min = asset_balance_t;
                    }  
                    
                }                
                
                ensure!(account_id_min != who, Error::<T>::NotEnoughBalance);
                dao_council.admins.remove(&account_id_min);                
            }

            dao_council.admins.insert(who.clone(), asset_balance);

            let members: Vec<T::AccountId> = dao_council.admins.keys().cloned().collect();

           
            pallet_dao_collective::Pallet::<T, Instance4>::do_set_dao_members(Option::Some(dao_id.clone().try_into().ok().unwrap()), members, Option::None, old_count)?;
            
            
            DaoCouncils::<T>::insert(dao_id, Some(dao_council));

            Ok(().into())

            
        }

        /// 创新广告落地页，刚创新的时候是属于个人的，但他也可转让给一个推广社群来维护.
        #[pallet::weight(10_000)]
        pub fn app_advertise_create(
            origin: OriginFor<T>,
            //dao_id: T::DaoId,
            union_id: Option<T::DaoId>,//所有者，可以是某个account 也可以是某个union
            asset_id: Option<T::AssetId>,
            tag: Vec<u8>,
            area: Vec<u8>,
            ver: u32,
            ext_1: Vec<u8>,
            ext_2: Vec<u8>,
            body: Vec<u8>,
            
        ) -> DispatchResultWithPostInfo {
            
            let who = ensure_signed(origin.clone())?;
            
            ensure!(
                tag.len()>0 && tag.len()<100 && area.len()<100 && ext_1.len()<100 && ext_2.len()<100  && body.len() < 2000,
                Error::<T>::ArgOverflow
            );
          
            if let Some(asset_id_value) = asset_id {
                //let asset_id_from = asset_id.clone().unwrap_or_default();            
                //增加币种  
                ensure!(
                    pallet_assets::Pallet::<T>::maybe_total_supply(asset_id_value.clone()) == Option::None,
                    Error::<T>::AssetNotFound
                );   
                //ensure!(owner == who, Error::<T>::RequireOwner);
            }

            let new_account_id: T::AccountId = match union_id {//其实也并不是所有人都有“来源信息”，像最初始的管理者就没有
				Option::Some(union_id_value) =>{  		
                    let mut dao = Daos::<T>::get(&union_id_value.clone()).ok_or(Error::<T>::DaoNotFound)?;
                    dao.deposited_account_id.clone()
                    //deposited_account_id
				},
				Option::None =>{  
                    who
				}
			};


              
            let mut app_advertise_count = AppAdvertiseCount::<T>::get().unwrap_or_default();
            // increment counter and insert  
            ensure!(app_advertise_count != u64::max_value(), Error::<T>::ArgOverflow);

            let app_advertise_id = T::DaoId::from(app_advertise_count);
            let app_advertise = AppAdvertise{ id: app_advertise_id.into(), union_id, owner_id: new_account_id.clone(), asset_id: asset_id, tag:tag.clone(), area:area.clone(), ver:ver, ext_1:ext_1, ext_2:ext_2, body:body.clone(), status:0 };
         
            AppAdvertiseCount::<T>::put(app_advertise_count+1);
            AppAdvertises::<T>::insert(app_advertise_id, app_advertise);
            AppAdvertiseOwner::<T>::insert(app_advertise_id, new_account_id.clone());

            Self::deposit_event(Event::AppAdvertiseAdded{id: app_advertise_id,  owner: new_account_id, owner_union: union_id, asset_id: asset_id, tag: tag, area: area, info: body});

            Ok(().into())

        }


        #[pallet::weight(10_000)]
        pub fn app_advertise_owner_update(
            origin: OriginFor<T>,
            id: T::DaoId,
            owner_id: Option<T::AccountId>,//与 union_id  二选一
            union_id: Option<T::DaoId>,//可以转给一个union_dao 或 个人,  但目前 转给dao 后就不能再转给个人了         
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin)?;     
            
            //some code have been removed here for it is just under test
			//but it exist in the released binary for test
            Ok(().into())
        }


        /// 更新广告落地页，注意如果这个广告落地而属于一个社群，再创建方需要是社群的集体账号.
		/// 我们修改了substrate collective pallet ,让他可以支持动态生成多个，而不是全局在代码里配置 
        #[pallet::weight(10_000)]
        pub fn app_advertise_update(
            origin: OriginFor<T>,
            id: T::DaoId,
            //union_id: T::DaoId,
            //tag: Vec<u8>,//不能修改，建议重新建立一个
            //area: Vec<u8>,
            ver: u32,
            ext_1: Vec<u8>,
            ext_2: Vec<u8>,
            body: Vec<u8>,
            
        ) -> DispatchResultWithPostInfo {
            
            ensure!(
                ext_1.len()<100 && ext_2.len()<100  && body.len() < 2000,
                Error::<T>::ArgOverflow
            );

            let app_advertise_exist = AppAdvertises::<T>::get(&id).ok_or(Error::<T>::AppAdvertiseNotFound)?;

            match app_advertise_exist.union_id.clone() {
				Option::Some(union_id_value) =>{
                    let union_id_org = T::ExternalOrigin::ensure_origin(origin)?;
                    let union_id_value_u64: u64 = TryInto::<u64>::try_into(union_id_value).ok().unwrap();
                    ensure!(union_id_value_u64 == union_id_org.unwrap(), Error::<T>::RequireOwner);
				},
				Option::None =>{
                    let who = ensure_signed(origin)?;
                    if let Some(owner) = AppAdvertiseOwner::<T>::get(id) {
                        ensure!(owner == who, Error::<T>::RequireOwner);
                    }    
                }
			}   

            let app_advertise = AppAdvertise{ id: id, union_id:app_advertise_exist.union_id, owner_id:app_advertise_exist.owner_id, asset_id:app_advertise_exist.asset_id, tag:app_advertise_exist.tag.clone(), area:app_advertise_exist.area.clone(), ver:ver, ext_1:ext_1, ext_2:ext_2, body:body.clone(), status:0 };
         
            AppAdvertises::<T>::insert(id, app_advertise);

            Self::deposit_event(Event::AppAdvertiseUpdated{id, info: body});

            Ok(().into())

        }



		#[pallet::weight(0)]
		pub fn put_advertise_allowed_actions(
            origin: OriginFor<T>,
            id: T::DaoId,
            actionlist_json: Vec<u8>) -> DispatchResultWithPostInfo {	

           log::warn!(
                target: "runtime::put_advertise_allowed_actions",
                "00000 ({:?})",
                actionlist_json.clone(),
            ); 
                
            ensure!(
                actionlist_json.len()<1000,
                Error::<T>::ArgOverflow
            );
            

            let app_advertise_exist = AppAdvertises::<T>::get(&id).ok_or(Error::<T>::AppAdvertiseNotFound)?;

            match app_advertise_exist.union_id.clone() {
				Option::Some(union_id_value) =>{
                    let union_id_org = T::ExternalOrigin::ensure_origin(origin)?;
                    //let (union_id_org, _) = T::VetoOrigin::ensure_origin(origin)?;
                    let union_id_value_u64: u64 = TryInto::<u64>::try_into(union_id_value).ok().unwrap();
                    ensure!(union_id_value_u64 == union_id_org.unwrap(), Error::<T>::RequireOwner);
				},
				Option::None =>{
                    let who = ensure_signed(origin)?;
                    if let Some(owner) = AppAdvertiseOwner::<T>::get(id) {
                        ensure!(owner == who, Error::<T>::RequireOwner);
                    }    
                }
			}   

			// Update storage.
            TaskActions::<T>::insert(id.clone(), actionlist_json.clone());

            Self::deposit_event(Event::AppAdvertiseActionsUpdated{id, actions: actionlist_json.clone()});
            
			Ok(().into())

		}



        /// 创建一个推广社群，创建社群的时候，同时会发起一次众筹.
		/// 创建社群的时候，同时会产生一个当前社群的代币，用于他们自身的治理
        #[pallet::weight(10_000)]
        pub fn union_dao_create(
            origin: OriginFor<T>,
            desp: Vec<u8>,
            my_asset_id: T::AssetId,
            pay_asset_id: Option<T::AssetId>,  //可能是推广本APP，这时用的是none.     或叫 pay_asset_id      
            deadline: T::BlockNumber,
            //rate: u128,
            min: BalanceOf<T>,
            max: BalanceOf<T>,            
            keep_rate: u128,
            //existential: BalanceOf<T>,
            mint: BalanceOf<T>,
            stak_account_id: T::AccountId,
            app_advertise_id: Option<T::DaoId>,
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin.clone())?;

            let rate: u128 = 100;//一比一配置
            //let keep_rate = 80;//默认进入国库锁定比例为80%， 然后mint出对应币，
            //最后用户获得mint出来的币（与国库对应）（mint出来的币与返回的币自动放进流动挖矿）及返回的20%的币。
            // keep_rate 最低不能低于50%， 不然就会无法计算

            ensure!(
                keep_rate >= 50 && keep_rate<= 100,
                Error::<T>::ArgOverflow
            );  
            
            ensure!(
                keep_rate <= 90,
                Error::<T>::DaoKeepForPoolNeed10
            );

            let my_asset_id_u32: u32 = TryInto::<u32>::try_into(my_asset_id.clone()).ok().unwrap();

            ensure!(
                my_asset_id_u32 > 0u32,//pool池里 0 是系统的币，会跟这个0冲突，所以就不让增加0编号了
                Error::<T>::ArgOverflow
            );

            ensure!(
                u64::from(my_asset_id_u32) < T::MinSubDaoId::get(),// 1000_000_000_000 到 10_000_000_000_000_000_000  给到subdaoId
                Error::<T>::DaoIdTooLarge
            );
            
            match pay_asset_id.clone() {
				Option::Some(asset_id_value) =>{
                     // make sure all assets are supporter
                    ensure!(
                        pallet_assets::Pallet::<T>::maybe_total_supply(asset_id_value) != Option::None,
                        Error::<T>::AssetNotFound
                    );
				},
				Option::None =>{

				}
			}              
            
            //增加币种  
            ensure!(
                pallet_assets::Pallet::<T>::maybe_total_supply(my_asset_id.clone()) == Option::None,
                Error::<T>::AssetNotAllowed
            );    
            
            //目前一个币种同时只能有一个活的Dao
            ensure!(
                !KeyDaos::<T>::contains_key(&my_asset_id),
                Error::<T>::DaoAliveDuplicated
            );
            

            let dao_id: u64 = TryInto::<u32>::try_into(my_asset_id.clone()).ok().unwrap().into();
            let dao_deposited_account_id = Self::dao_account_id(&vec![who.clone()], dao_id);
            let dao_id: T::DaoId = dao_id.try_into().ok().unwrap();


            ensure!(
                desp.len()<200,
                Error::<T>::ArgOverflow
            );
            

            ensure!(
                max > mint,
                Error::<T>::DaoMaxReached
            );

            
            let current_block = <frame_system::Module<T>>::block_number();
            ensure!(
                deadline > current_block,
                Error::<T>::DaoDeadlineReached
            );

            ensure!(
                !Daos::<T>::contains_key(&dao_id),
                Error::<T>::DaoDuplicated
            );

            //todo check min max 
            //todo check keep_rate

            // ensure we have still capacity for a new pool
            //let mut dao_count = DaoCount::<T>::get().unwrap_or_default();


            //todo add time
            let now_timestamp = <T as Config>::Time::now();  
            //pub UpdatedBy get(fn updated_by): map hasher(blake2_128_concat) T::AccountId => (T::AccountId, T::BlockNumber, <<T as Config>::Time as Time>::Moment);
            //<UpdatedBy<T>>::insert(&identity, (who, now_block_number, now_timestamp));

            // create a new pool with all the fees and assets
            let dao = UnionDao::new(
                desp,
                my_asset_id.clone(),
                pay_asset_id.clone(),                
                deadline,
                rate,
                min,
                max,
                keep_rate,
                stak_account_id,
                dao_deposited_account_id.clone(),
                now_timestamp,

            )?;

            // increment counter and insert            

            
            Daos::<T>::insert(dao_id, dao);     
            KeyDaos::<T>::insert(my_asset_id.clone(), dao_id.clone());
            Self::deposit_event(Event::DaoAdded{who: who.clone(), dao_id: dao_id.clone(), my_asset_id: my_asset_id.clone(), deposited_account_id: dao_deposited_account_id.clone()});   


            //注意，这里一定要先mint ,不然没钱创建新的asset,
            let  amount_fact = Self::do_union_dao_mint(origin.clone(), who.clone(), dao_id, mint)?;      

            let min_balance: T::Balance = 1u128.try_into().ok().unwrap();
            let dao_deposited_account_id_lookup = <T::Lookup as sp_runtime::traits::StaticLookup>::unlookup(dao_deposited_account_id.clone());
            
            pallet_assets::Pallet::<T>::create( RawOrigin::Signed(dao_deposited_account_id.clone()).into(), <T as pallet_assets::Config>::AssetIdParameter::from(my_asset_id.clone()), dao_deposited_account_id_lookup, min_balance.clone())?;

               
           
            //必需有一点钱，让账户不至于没钱的时候被删除
            let existential_deposit = T::ExistentialDeposit::get();
            <T as self::Config>::Currency::transfer(&who, &dao_deposited_account_id.clone(), existential_deposit, ExistenceRequirement::AllowDeath)?;

            Self::deposit_event(Event::DaoAssetToMined{
                who: who.clone(),
                dao_id: dao_id.clone(),
                amount_fact: amount_fact.clone(),
            });    

                   
            if let Some(app_advertise_id_value) = app_advertise_id{
                Self::app_advertise_owner_update(origin.clone(), app_advertise_id_value, Option::None, Some(dao_id));
            }

            Ok(().into())
        }

        /// 有时候一次众筹不够，那就追加众筹.
        #[pallet::weight(10_000)]
        pub fn union_dao_append(
            origin: OriginFor<T>,
            my_asset_id: T::AssetId,
            //dao_id:  T::DaoId,  自动生成
            desp: Vec<u8>,            
            deadline: T::BlockNumber,
            min: BalanceOf<T>,
            max: BalanceOf<T>,
            keep_rate: u128,
            mint: BalanceOf<T>,
            stak_account_id: T::AccountId,
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin.clone())?;
            let current_block = <frame_system::Module<T>>::block_number();


            //some code have been removed here for it is just under dev/test
			//but it exist in the released binary for test
            Ok(().into())
        }

        /// 更新推广社群信息.
        #[pallet::weight(10_000)]
        pub fn union_dao_update(
            origin: OriginFor<T>,
            dao_id: T::DaoId,
            min: BalanceOf<T>,
            max: BalanceOf<T>,
            deadline: T::BlockNumber,
            
        ) -> DispatchResultWithPostInfo {

            //some code have been removed here for it is just under test
			//but it exist in the released binary for test
            Ok(().into())

        }

        /// 推广社群进行众筹的时候，新用户就是通过这个接口进行投资的
        #[pallet::weight(10_000)]
        pub fn union_dao_mint(
            origin: OriginFor<T>,
            dao_id: T::DaoId,
            //asset_id: Option<T::AssetId>,//feng  不应该传的参数，但如果不传，就得去读一下，有些麻烦
            amount: BalanceOf<T>,
            //amount: T::Balance,
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin.clone())?;

            let  amount_fact = Self::do_union_dao_mint(origin, who.clone(), dao_id, amount)?;
            
            Self::deposit_event(Event::DaoAssetToMined{
                who: who.clone(),
                dao_id: dao_id.clone(),
                amount_fact: amount_fact.clone(),
            });   
            
          
            Ok(().into())
        }


         /// 众筹结束时间到，众筹条件满足 , 这时就可以调用这接口触发众筹结束操作.（谁调用都可以）
         #[pallet::weight(10_000)]
         pub fn union_dao_finish(
             origin: OriginFor<T>,
             dao_id: T::DaoId,
         ) -> DispatchResultWithPostInfo {

            //some code have been removed here for it is just under dev/test
			//but it exist in the released binary for test         
            
            Ok(().into())
         }




         ///众筹结束时间到，众筹条件不满足 , 这时只能取消众筹结束操作了.（谁调用都可以）
         #[pallet::weight(10_000)]
         pub fn union_dao_abort(
             origin: OriginFor<T>,
             dao_id: T::DaoId,
         ) -> DispatchResultWithPostInfo {

            //some code have been removed here for it is just under test
			//but it exist in the released binary for test
            Ok(().into())

        }


        /// 增加一个推广任务到推广社群，主要是指定这次推广要投入多少钱等内容， 一个推广任务可以用多个“转换操作”
        #[pallet::weight(10_000)]
        pub fn union_task_append(
            origin: OriginFor<T>,
            my_asset_id: T::AssetId,
            advertise_id: T::DaoId,
            //dao_id:  T::DaoId,  自动生成     
            // 匿踪保护。。       
            desp: Vec<u8>,   
            reward_from_treasury: BalanceOf<T>,  //使用国库来支付推广者
            reward_this:  BalanceOf<T>,    //使用额外的钱来支付推广者
            deadline: T::BlockNumber,
            tee_contract_id: Vec<u8>,
            tee_account_id: T::AccountId,   //有account_id from TEE，真正的推广在TEE里，当完成了就可用这个签名来判断。他代表对应的TEE合约。
            tee_desk_account_id: T::AccountId,   //有account_id from TEE，真正的推广在TEE里，当完成了就可用这个签名来判断。他代表对应的TEE合约。
        ) -> DispatchResultWithPostInfo {

            //some code have been removed here for it is just under test 
			//but it exist in the released binary for test			
            Ok(().into())
        }



		/// 新用户的转换操作，被执行的时候，说明有新用户转换过来了
		/// 这里其实只记录了”转换操作“的转账，真正的信息是在TEE隐私合约里，
		/// 如果这个”转换操作“跟钱无关，或是链下web2.0的”转换操作“，是不走这里的
		/// todo 交易的发起人可以不是新用户，而是TEE合约的内置账户，这样有助于用户隐私。但这项目主要还是保护推广者的隐私
        #[pallet::weight(10_000)]
        pub fn union_task_action_pay(
            origin: OriginFor<T>,
            task_id: T::TaskId,
            action_code: u64,
            amount: BalanceOf<T>,             
            //reward_account_id: T::AccountId,
        ) -> DispatchResultWithPostInfo {

            let sender = ensure_signed(origin.clone())?;
			let current_block = <frame_system::Module<T>>::block_number();

            let task = Tasks::<T>::get(&task_id).ok_or(Error::<T>::TaskNotFound)?;
            let tee_desk_account_id = task.tee_desk_account_id.clone();
            let first_dao_id: u64 =  TryInto::<u32>::try_into(task.my_asset_id.clone()).ok().unwrap().into();
            let first_dao_id: T::DaoId = first_dao_id.try_into().ok().unwrap();
            let first_dao = Daos::<T>::get(&first_dao_id).ok_or(Error::<T>::DaoNotFound)?;




            let pay_asset_id = first_dao.pay_asset_id.clone();
            let my_asset_id = first_dao.my_asset_id.clone();
            //let keep_rate = first_dao.keep_rate.clone();
            //let fund = first_dao.fund.clone();
            //let investors = first_dao.investors.clone();
            //let dao_deposited_account_id = first_dao.deposited_account_id.clone();
            

            let value = (task_id.clone(), action_code, amount);
			match TaskActionPayed::<T>::get(&sender) {
				None => {
					let mut myvec:Vec<(T::TaskId, u64, BalanceOf<T>)> = Vec::new();
					myvec.push(value.clone());
					//let rec_vec =  vec![order_info] ;
					TaskActionPayed::<T>::insert(&sender, myvec)
				},
				Some(mut old) => {
					ensure!(
                        !old.iter().any(|&(a, b, _)| a == value.0 && b == value.1),
                        Error::<T>::TaskActionDuplicte
                    );
					old.push(value.clone());
					TaskActionPayed::<T>::insert(&sender, old)
				}
			}



            match pay_asset_id.clone() {
                Option::Some(asset_id_value) =>{
                    let tee_desk_account_id_lookup = <T::Lookup as sp_runtime::traits::StaticLookup>::unlookup(tee_desk_account_id.clone()); 
                    let amount2: T::Balance = TryInto::<u128>::try_into(amount).ok().unwrap().try_into().ok().unwrap(); 
                    pallet_assets::Pallet::<T>::transfer(origin.clone(), T::AssetIdParameter::from(asset_id_value.clone()), tee_desk_account_id_lookup.clone(), amount2).map_err(|e| Error::<T>::NotEnoughBalance )?;

                },
                Option::None =>{
                    <T as self::Config>::Currency::transfer(&sender.clone(), &tee_desk_account_id.clone(), amount, ExistenceRequirement::AllowDeath).map_err(|e| Error::<T>::NotEnoughBalance )?;
                   
                }
            }  

            Self::deposit_event(Event::TaskActionPayed{ who: sender.clone(), dao_id: first_dao_id.clone(), task_id: task_id.clone(), action_code: action_code.clone(), amount:amount.clone() } );   

            Ok(().into())
        }


		/// 新用户进行了“转换操作”后， 可以在TEE 合约里进行验证。
		/// TEE 合约 里进行验证用户所执行的操作，然后会把奖励等发给新用户与推广者
		/// 当奖励发完后，需要结束用户的这次的“转换操作”
        #[pallet::weight(10_000)]
        pub fn union_task_action_finish(
            origin: OriginFor<T>,
            account_id: T::AccountId,
            task_id: T::TaskId,
            action_code: u64,
            amount: BalanceOf<T>,             
            //reward_account_id: T::AccountId,
        ) -> DispatchResultWithPostInfo {


            let tee_account_id = ensure_signed(origin)?;
			//let current_block = <frame_system::Module<T>>::block_number();

            let task = Tasks::<T>::get(&task_id).ok_or(Error::<T>::TaskNotFound)?;
            //let tee_desk_account_id = task.tee_desk_account_id.clone();

            //key code . 完成TEE来源认证
            ensure!(
                task.tee_account_id == tee_account_id,
                Error::<T>::ErrorTeeAccountId
            );

            match TaskActionPayed::<T>::get(&account_id) {
				None => {
					
				},
				Some(mut old) => {
                    let value =  (task_id.clone(), action_code);
					ensure!(
                        old.iter().any(|&(a, b, _)| a == value.0 && b == value.1),
                        Error::<T>::InvalidTaskAction
                    );
					old.retain(|&(a, b, _)| !(a == value.0 && b == value.1));
					TaskActionPayed::<T>::insert(&account_id, old)
				}
			}

            Ok(().into())


        }


        /// 推广者提取佣金
        #[pallet::weight(10_000)]
        pub fn union_task_reward(
            origin: OriginFor<T>,
            task_id: T::TaskId,
            work_ids: Vec<T::AccountId>,   
            reward_total: BalanceOf<T>,
            reward_account_id: T::AccountId,
            nonce: Vec<u8>,   
            nonce_new: Vec<u8>,   
        ) -> DispatchResultWithPostInfo {

            let tee_account_id = ensure_signed(origin.clone())?;


            let task = Tasks::<T>::get(&task_id).ok_or(Error::<T>::TaskNotFound)?;
            let nonce_ = TaskNounces::<T>::get(&nonce).ok_or(Error::<T>::NounceNotFound)?;

            //完成TEE来源认证
            ensure!(
                task.tee_account_id == tee_account_id,
                Error::<T>::ErrorTeeAccountId
            );

           
                      
            //some code have been removed here for it is just under test
			//but it exist in the released binary for test


            Ok(().into())
        }

       

        /// Add liquidity from already deposited amounts to a pool
        #[pallet::weight(10_000)]
        pub fn add_liquidity(
            origin: OriginFor<T>,
            pool_id: T::PoolId,
            asset_deposits: Vec<AssetBalance<T::AssetId, BalanceOf<T>>>,
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin)?;

            let mut asset_deposits = ensure_unique_assets::<T>(asset_deposits)?;
            //let mut deposit = DepositedAmounts::<T>::get(&who);

            for (asset, balance) in &asset_deposits {//feng todo 如果asset是 0?
                let balance2: T::Balance = TryInto::<u128>::try_into(*balance).ok().unwrap().try_into().ok().unwrap();
                let result: WithdrawConsequence<T::Balance> = pallet_assets::Pallet::<T>::can_decrease(*asset, &who, balance2, false);
                ensure!( result == WithdrawConsequence::Success, Error::<T>::NotEnoughBalance);
                //deposit.can_sub(asset, *balance)?;
            }

            Pools::<T>::try_mutate(&pool_id, |maybe_pool| match maybe_pool {
                Some(pool) => {
                    // NOTE: this should fail without writing to storage
                    pool.add_liquidity(&who, &mut asset_deposits)?;
                    Ok(())
                }
                _ => Err(Error::<T>::PoolNotFound),
            })?;

            for (asset, balance) in &asset_deposits {
                let balance2: T::Balance = TryInto::<u128>::try_into(*balance).ok().unwrap().try_into().ok().unwrap();
                let f = pallet_assets::DebitFlags { keep_alive: false, best_effort: false };
                pallet_assets::Pallet::<T>::do_burn(*asset, &who, balance2, Option::None, f)?;//feng todo transfer to pool account_id

            }

            //DepositedAmounts::<T>::insert(who.clone(), deposit);

            Self::deposit_event(Event::AddedLiquidity(
                who,
                asset_deposits
                    .into_iter()
                    .map(|(id, balance)| AssetBalance::new(id, balance))
                    .collect(),
            ));

            Ok(().into())
        }

        /// Remove liquidity the pool
        #[pallet::weight(10_000)]
        pub fn remove_liquidity(
            origin: OriginFor<T>,
            pool_id: T::PoolId,
            shares: BalanceOf<T>,
            min_amounts: Vec<AssetBalance<T::AssetId, BalanceOf<T>>>,
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin)?;

            let withdrawn = Pools::<T>::try_mutate(&pool_id, |maybe_pool| match maybe_pool {
                Some(pool) => pool.remove_liquidity(&who, shares, min_amounts),
                _ => Err(Error::<T>::PoolNotFound),
            })?;

            for output in &withdrawn {
                let balance2: T::Balance = TryInto::<u128>::try_into(output.amount).ok().unwrap().try_into().ok().unwrap();
                //let f = pallet_assets::DebitFlags { keep_alive: false, best_effort: false };
                pallet_assets::Pallet::<T>::do_mint(output.asset, &who, balance2, Option::None)?;

            }

            Self::deposit_event(Event::RemovedLiquidity(who, withdrawn));

            Ok(().into())
        }

        /// Create a `Basic Pool` with the given supported assets and fee.
        #[pallet::weight(10_000)]
        pub fn add_basic_pool(
            origin: OriginFor<T>,
            assets: Vec<T::AssetId>,
            fee: BalanceOf<T>,
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin)?;

            let (next_pool_id, _pool_account_id) = Self::add_basic_pool_inner(who.clone(), assets.clone(), fee).unwrap();
            

            Self::deposit_event(Event::PoolAdded(who, next_pool_id, assets));

            Ok(().into())
        }

        /// Swap some assets via a series of asset swap actions.
        ///
        /// `referral_account` is an optional account that also should get paid for this swap
        /// according to the pool's referral fee.
        /// For example an intermediary that facilitated this transaction.
        #[pallet::weight(10_000)]
        pub fn swap(
            origin: OriginFor<T>,
            swap_actions: Vec<AssetSwap<T::AssetId, BalanceOf<T>, T::PoolId>>,
            referral_account: Option<T::AccountId>,
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin)?;

            //let mut account_deposit = DepositedAmounts::<T>::get(&who);

            let mut pools = BTreeMap::new();
            let exchange_account = ExchangeAccount::<T>::get();

            let mut prev_amount = None;
            let mut swapped = Vec::with_capacity(swap_actions.len());

            for swap in swap_actions {
                let AssetSwap {
                    pool_id,
                    asset_in,
                    amount_in,
                    asset_out,
                    min_amount_out,
                } = swap;
                let pool = pools.entry(pool_id).or_insert(
                    Pools::<T>::try_get(&pool_id).map_err(|_| Error::<T>::PoolNotFound)?,
                );

                let amount_in = if let Some(amount_in) = amount_in {
                    amount_in
                } else {
                    prev_amount.take().ok_or(Error::<T>::MissingSwapAmountIn)?
                };


                let amount_in2: T::Balance = TryInto::<u128>::try_into(amount_in).ok().unwrap().try_into().ok().unwrap();
                let f = pallet_assets::DebitFlags { keep_alive: false, best_effort: false };
                pallet_assets::Pallet::<T>::do_burn(asset_in, &who, amount_in2, Option::None, f)?;
                // withdraw from users account
                //account_deposit.sub(&asset_in, amount_in)?;

                let amount_out = pool.swap(
                    &asset_in,
                    amount_in,
                    &asset_out,
                    min_amount_out,
                    exchange_account.as_ref(),
                    referral_account.as_ref(),
                )?;

                let amount_out2: T::Balance = TryInto::<u128>::try_into(amount_out).ok().unwrap().try_into().ok().unwrap();
                //let f = pallet_assets::DebitFlags { keep_alive: false, best_effort: false };
                pallet_assets::Pallet::<T>::do_mint(asset_out, &who, amount_out2, Option::None)?;
                //account_deposit.add(&asset_out, amount_out)?;

                swapped.push(AssetSwapInfo {
                    pool_id,
                    asset_in,
                    amount_in,
                    asset_out,
                    amount_out,
                });

                prev_amount = Some(amount_out);
            }

            // send back to storage
            //DepositedAmounts::<T>::insert(who.clone(), account_deposit);
            for (pool_id, pool) in pools {
                Pools::<T>::insert(pool_id, pool);
            }

            Self::deposit_event(Event::Swapped(who, swapped));

            Ok(().into())
        }

	}


	impl<T: Config> Pallet<T> {

        pub fn dao_account_id(who: &[T::AccountId], index: u64) -> T::AccountId {
            let entropy = (b"web3share/dao", who, index).using_encoded(blake2_256);
            Decode::decode(&mut TrailingZeroInput::new(entropy.as_ref()))
                .expect("infinite length input; no invalid inputs for type; qed")
        }

        pub fn pool_account_id(who: &[T::AccountId], index: u64) -> T::AccountId {
            //let entropy = (b"modlpy/utilisuba", who, index).using_encoded(blake2_256);
            let entropy = (b"web3share/pool", who, index).using_encoded(blake2_256);
            Decode::decode(&mut TrailingZeroInput::new(entropy.as_ref()))
                .expect("infinite length input; no invalid inputs for type; qed")
        }

        /// Check that signatories is sorted and doesn't contain sender, then insert sender.
        fn ensure_sorted_and_insert(other_signatories: Vec<T::AccountId>, who: T::AccountId)
            -> Result<Vec<T::AccountId>, DispatchError>
        {
            let mut signatories = other_signatories;
            let mut maybe_last = None;
            let mut index = 0;
            for item in signatories.iter() {
                if let Some(last) = maybe_last {
                    ensure!(last < item, Error::<T>::ArgOverflow);
                }
                if item <= &who {
                    ensure!(item != &who, Error::<T>::ArgOverflow);
                    index += 1;
                }
                maybe_last = Some(item);
            }
            signatories.insert(index, who);
            Ok(signatories)
        }



        pub fn do_union_dao_mint(
            origin: OriginFor<T>,
            who: T::AccountId,
            dao_id: T::DaoId,
            //asset_id: Option<T::AssetId>,//feng  不应该传的参数，但如果不传，就得去读一下，有些麻烦
            amount: BalanceOf<T>,
            //amount: T::Balance,
        ) -> Result<BalanceOf<T>, DispatchError> {
            let block_number = <frame_system::Module<T>>::block_number();

            let dao = Daos::<T>::get(&dao_id).ok_or(Error::<T>::DaoNotFound)?;
            let  (pay_asset_id, deposited_account_id) = 
                (dao.pay_asset_id.clone(),   dao.deposited_account_id.clone() );

            
            let mut amount_fact = amount.clone();

           
            //先判断再执行，因为如果没判断，即使后面返回error ,期间的修改也是会保存到数据库里
            match pay_asset_id.clone() {
				Option::Some(asset_id_value) =>{
                    let amount_asset: T::Balance = TryInto::<u128>::try_into(amount).ok().unwrap().try_into().ok().unwrap();
                    let result: WithdrawConsequence<T::Balance> = pallet_assets::Pallet::<T>::can_decrease(asset_id_value, &who, amount_asset, false);
                    ensure!( result == WithdrawConsequence::Success, Error::<T>::NotEnoughBalance);
				},
				Option::None =>{
                    let free = <T as self::Config>::Currency::free_balance(&who);
                    ensure!( free > amount, Error::<T>::NotEnoughBalance);
                }
			}               


            let (my_asset_id, _withdrawn) = Daos::<T>::try_mutate(&dao_id, |maybe_dao| match maybe_dao {
                Some(dao) => 
                    dao.mint(who.clone(), pay_asset_id.clone(), &mut amount_fact,  block_number),
                _ => Err(Error::<T>::DaoNotFound),
            })?;


            match pay_asset_id.clone() {
				Option::Some(asset_id_value) =>{
                             let deposited_account_id_lookup = <T::Lookup as sp_runtime::traits::StaticLookup>::unlookup(deposited_account_id.clone()); 
                    let amount_fact_asset: T::Balance = TryInto::<u128>::try_into(amount_fact).ok().unwrap().try_into().ok().unwrap();
                    pallet_assets::Pallet::<T>::transfer(origin, T::AssetIdParameter::from(asset_id_value.clone()), deposited_account_id_lookup.clone(), amount_fact_asset).map_err(|e| Error::<T>::NotEnoughBalance )?;
   
				},
				Option::None =>{
                    <T as self::Config>::Currency::transfer(&who, &deposited_account_id.clone(), amount_fact, ExistenceRequirement::AllowDeath)?;
				}
			}   
          
            Ok(amount_fact)
        }

        
        /// Returns number of pools.
        pub fn get_number_of_pools() -> u64  {
            PoolCount::<T>::get().unwrap_or_default()
        }

        pub fn add_basic_pool_inner(
            who: T::AccountId,
            assets: Vec<T::AssetId>,
            fee: BalanceOf<T>,
            ) -> Result<(T::PoolId, T::AccountId), Error<T>> {    
            // make sure all assets are supporter
            ensure!(
                assets
                    .iter()
                    .all(|asset| T::AssetId::default() == *asset || pallet_assets::Pallet::<T>::maybe_total_supply(*asset) != Option::None),
                    //.all(|asset| AllowedAssets::<T>::contains_key(asset)),                    
                Error::<T>::AssetNotFound
            );

            // ensure we have still capacity for a new pool
            let mut pool_count = Self::get_number_of_pools();
            ensure!(
                pool_count < T::MaxPoolLimit::get(),
                Error::<T>::PoolLimitReached
            );

            let  deposited_account_id =  Self::pool_account_id(&vec![who.clone()], pool_count+1u64);

            // create a new pool with all the fees and assets
            let pool = BasicPool::new(
                deposited_account_id.clone(),
                assets.clone(),
                fee + T::ExchangeFee::get() + T::ReferralFee::get(),
                T::ExchangeFee::get(),
                T::ReferralFee::get(),
            )?;

            // increment counter and insert
            pool_count += 1;
            let next_pool_id = T::PoolId::from(pool_count);

            ensure!(
                !Pools::<T>::contains_key(&next_pool_id),
                Error::<T>::InvalidPoolId
            );

            PoolCount::<T>::put(pool_count);
            Pools::<T>::insert(next_pool_id, Pool::BasicPool(pool));            

            Ok((next_pool_id, deposited_account_id.clone()))
        }

        pub fn do_add_liquidity(pool:  &mut Pool<T>, origin1: OriginFor<T>,  origin2: OriginFor<T>,  account: &T::AccountId, asset_deposits: &mut BTreeMap<T::AssetId, BalanceOf<T>> ) 
        -> Result<BalanceOf<T>, Error<T>>  {

            //pallet_assets::Pallet::<T>::transfer(origin1, my_asset_id, account_id_lookup, my_balance_mint_to_investor)?;

            pool.add_liquidity(account, asset_deposits)

        }

        /// Returns information about specified pool if it exists
        pub fn get_pool_info(
            &self,
            pool_id: &T::PoolId,
        ) -> Option<PoolInfo<T::AssetId, BalanceOf<T>>> {
            Pools::<T>::get(pool_id).map(From::from)
        }

        
		
    }
}

