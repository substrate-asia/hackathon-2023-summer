use crate::{ensure_unique_assets, AssetBalance, BalanceOf, Config, Error};
use frame_support::pallet_prelude::*;
use frame_support::sp_runtime::traits::*;
use frame_support::traits::Time;

use sp_std::{collections::btree_map::BTreeMap, fmt::Debug, prelude::*};
use sp_std::{convert::TryInto};	

#[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub enum Dao<T: Config> {
    /// A Dao with equal weight constant product of 2 assets.
    UnionDao(UnionDao<T>),
}

impl<T: Config> Dao<T> {


    pub fn get_deposited_account_id(
        &mut self,
    ) -> Result<T::AccountId, Error<T>> {
        match self {
            Dao::UnionDao(inner) => Ok(inner.deposited_account_id.clone()),
        }
    }


    pub fn get_status(
        &mut self,
    ) -> Result<DaoStatus, Error<T>> {
        match self {
            Dao::UnionDao(inner) => Ok(inner.status.clone()),
        }
    }


    pub fn mint(
        &mut self,        
        account: T::AccountId,
        pay_asset_id: Option<T::AssetId>,
        amount: &mut BalanceOf<T>,
        block_number: T::BlockNumber,
    ) -> Result<(T::AssetId, BTreeMap<T::AccountId, BalanceOf<T>>), Error<T>> {

        match self {
            Dao::UnionDao(inner) => inner.mint(account, pay_asset_id, amount, block_number),
        }

    }


    pub fn finish(
        &mut self,
        block_number: T::BlockNumber,
    ) -> Result<UnionDao<T>, Error<T>> {
        match self {
            Dao::UnionDao(inner) => inner.finish(block_number),
        }
    }


    pub fn abort(
        &mut self,
        account: &T::AccountId,
        block_number: T::BlockNumber,
    ) -> Result<UnionDao<T>, Error<T>> {
        match self {
            Dao::UnionDao(inner) => inner.abort(account, block_number),
        }
    }



}

#[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub enum DaoStatus {
    /// Error names should be descriptive.
    Proposal,
    /// Errors should have helpful documentation associated with them.
    Normal,
    /// Maximum amount of pools issued
    Finish,
    Abort,
}



#[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct UnionDao<T: Config> {   
    ///投资人的钱，即股份
    pub investors: BTreeMap<T::AccountId, BalanceOf<T>>,
    ///账上总的钱（支付货币）
    //pub invest_total: BalanceOf<T>,//本次已经原币总额度。。支持
    pub fund: BalanceOf<T>,//本次已经原币总额度。。支持
    ///账上总的收益（目标货币）
    pub earn_acc: BalanceOf<T>, 


    ///（目标货币）
    pub pay_asset_id: Option<T::AssetId>,//原币的assetId.. 或叫 pay_asset_id
    ///（股份）
    pub my_asset_id: T::AssetId,// 被发现的币   ,  id 与 my_asset_id 相关的是原始的root unionDao
    

    pub desp: Vec<u8>,
    /// 成立时的 资金筹集
    pub min: BalanceOf<T>,//本次 fund  后少于这个数，自动失败(以原币计)
    pub max: BalanceOf<T>,//本次 fund  后多于这个数，结束(以原币计)
    /// 截至时间    
    pub deadline: T::BlockNumber,
    ///  矿机账户, 矿机账户没在线一天，就一天没有提成。
    pub stak_account_id: T::AccountId,//     
    //  investors 保留获取方。可以设置多个
    pub deposited_account_id: T::AccountId,//   
    pub status: DaoStatus,  

    pub create_datetime: <<T as Config>::Time as Time>::Moment,



    pub keep_rate: u128,  /// 保留比例(万份比), 如90给到个人，10%给到公会。
    pub union_period: u128,  //安天，安星期，安月结？
    pub union_salary: BalanceOf<T>, //基本工资，
    pub union_min_score: u128, //有个最少金额，少于这个不让参与本unit  。。减少gas费

    /// 还没有教会的区域去传福音的人
    pub unionarys: BTreeMap<T::AccountId, BalanceOf<T>>,

    
}



#[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct UnionTask<T: Config> {  
    pub my_asset_id: T::AssetId,
    pub advertise_id: T::DaoId,
    pub desp: Vec<u8>,        
    pub reward_from_treasury: BalanceOf<T>,  //使用国库来支付推广者
    pub reward_this:  BalanceOf<T>,    //使用额外的钱来支付推广者
    pub deadline: T::BlockNumber,
    pub tee_account_id: T::AccountId,
    pub tee_desk_account_id: T::AccountId,
    pub tee_contract_id: Vec<u8>,

    pub pay_acc: BalanceOf<T>, 

    pub status: TaskStatus, 
    pub create_datetime: <<T as Config>::Time as Time>::Moment,

}


#[derive(Clone, PartialEq, Eq, Encode, Decode, Debug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub enum TaskStatus {
    /// Error names should be descriptive.
    Proposal,
    /// Errors should have helpful documentation associated with them.
    Normal,
    /// Maximum amount of pools issued
    Finish,
    Abort,
}



impl<T: Config> UnionDao<T> {
    pub fn new(
        desp: Vec<u8>,        
        my_asset_id: T::AssetId,
        pay_asset_id: Option<T::AssetId>,        
        deadline: T::BlockNumber,
        rate: u128,
        min: BalanceOf<T>,
        max: BalanceOf<T>,
        keep_rate: u128,
        stak_account_id: T::AccountId,
        deposited_account_id: T::AccountId,
        create_datetime: <<T as Config>::Time as Time>::Moment,
    ) -> Result<Self, Error<T>> {



        Ok(Self {
            desp,
            pay_asset_id,
            my_asset_id,
            fund: BalanceOf::<T>::zero(),
            earn_acc:  BalanceOf::<T>::zero(),            
            investors: BTreeMap::new(),            
            deadline,
            min,
            max,
            status: DaoStatus::Normal,

            keep_rate,
            stak_account_id: stak_account_id.clone(),  
            deposited_account_id: deposited_account_id.clone(),
            create_datetime,
            

            union_min_score: 0,
            union_period: 0,
            union_salary: BalanceOf::<T>::zero(),   
            unionarys:  BTreeMap::new(),   


        })
    }


    pub fn mint(
        &mut self,        
        account: T::AccountId,
        pay_asset_id: Option<T::AssetId>,
        amount: &mut BalanceOf<T>,
        block_number: T::BlockNumber,
    ) -> Result<(T::AssetId, BTreeMap<T::AccountId, BalanceOf<T>>), Error<T>> {

        //some code been removed here for it is just under test
        Ok((self.my_asset_id.clone(), BTreeMap::new()))
    }


    pub fn update(
        &mut self,
        min: BalanceOf<T>,
        max: BalanceOf<T>,
        block_number: T::BlockNumber,
    ) -> Result<UnionDao<T>, Error<T>> {
        //mock code,  just for demostrate.
         Ok(self.clone())

    }


   // 返回两种币的去向
    pub fn finish(
        &mut self,
        block_number: T::BlockNumber,
    ) -> Result<UnionDao<T>, Error<T>> {
        
        //some code been removed here for it is just under test
        Ok(self.clone())

    }



    pub fn abort(
        &mut self,
        account: &T::AccountId,
        block_number: T::BlockNumber,
    ) -> Result<UnionDao<T>, Error<T>> {

        //some code been removed here for it is just under test
        Ok(self.clone())

    }

    pub fn my_rate(
        balance: BalanceOf<T>,
        mul: u128,
        div: u128,
    ) -> BalanceOf<T> {

        let mul_ : BalanceOf<T> = mul.try_into().ok().unwrap();
        let div_ : BalanceOf<T> = div.try_into().ok().unwrap();
        let keep_amount = balance.checked_mul(&mul_).unwrap().checked_div(&div_).unwrap();
        keep_amount
    }
   
  
}

