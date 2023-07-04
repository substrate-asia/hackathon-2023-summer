use codec::{Decode, Encode};
use sp_std::vec::Vec;
use frame_support::{Parameter, RuntimeDebug};
use sp_runtime::traits::AtLeast32BitUnsigned;

// /*
//    模型结构
// */
#[derive(PartialEq, Eq, Clone, Encode, Decode, RuntimeDebug, scale_info::TypeInfo)]
pub struct AiModel<BlockNumber, Moment, AccountId>
    where BlockNumber: Parameter + AtLeast32BitUnsigned{
    // 模型hash
    pub hash : Vec<u8>,
    // 模型名
    pub name: Vec<u8>,
    // 模型名
    pub filename: Vec<u8>,
    // 模型下载地址
    pub link: Vec<u8>,
    // 模型的实例图片
    pub images: Vec<Vec<u8>>,
    // 模型的实例图片下载地址
    pub image_links: Vec<Vec<u8>>,
    // 购买（下载）模型的价格
    pub download_price: u128,
    // model的大小 字节
    pub size: u128,
    // 模型的描述信息（markdown 格式）
    pub comment: Vec<u8>,
    // 模型拥有者账户地址
    pub account_id : AccountId,
    // 上传模型的区块
    pub block_number : BlockNumber,
    //创建时间
    pub create_time: Moment,
}

impl<BlockNumber, Moment, AccountId> AiModel<BlockNumber, Moment, AccountId>
    where BlockNumber: Parameter + AtLeast32BitUnsigned{
    pub fn new( hash: Vec<u8>,
                name: Vec<u8>,
                filename: Vec<u8>,
                link: Vec<u8>,
                images: Vec<Vec<u8>>,
                image_links: Vec<Vec<u8>>,
                download_price: u128,
                size: u128,
                comment: Vec<u8>,
                account_id: AccountId,
                block_number: BlockNumber,
                create_time: Moment
    ) -> Self {
        Self{
            hash,
            name,
            filename,
            link,
            images,
            image_links,
            download_price,
            size,
            comment,
            account_id,
            block_number,
            create_time
        }
    }
}


// /*
//    模型下用户Post（帖子）结构
// */
#[derive(PartialEq, Eq, Clone, Encode, Decode, RuntimeDebug, scale_info::TypeInfo,PartialOrd, Ord)]
pub struct AiPost<BlockNumber, Moment, AccountId>
    where BlockNumber: Parameter + AtLeast32BitUnsigned{
    // 帖子所属模型hash
    pub model_hash : Vec<u8>,
    // uuid
    pub uuid : Vec<u8>,
    // 帖子名
    pub name: Vec<u8>,
    // 帖子的图片列表
    pub images: Vec<Vec<u8>>,
    // 帖子的图片下载地址列表
    pub image_links: Vec<Vec<u8>>,
    // 帖子的描述信息（markdown 格式）
    pub comment: Vec<u8>,
    // 帖子创建者账户id
    pub account_id : AccountId,
    // 帖子的创建所在区块
    pub block_number : BlockNumber,
    //创建时间
    pub create_time: Moment,
}

impl<BlockNumber, Moment, AccountId> AiPost<BlockNumber, Moment, AccountId>
    where BlockNumber: Parameter + AtLeast32BitUnsigned{
    pub fn new( model_hash: Vec<u8>,
                uuid : Vec<u8>,
                name: Vec<u8>,
                images: Vec<Vec<u8>>,
                image_links: Vec<Vec<u8>>,
                comment: Vec<u8>,
                account_id: AccountId,
                block_number: BlockNumber,
                create_time: Moment
    ) -> Self {
        Self{
            model_hash,
            name,
            images,
            image_links,
            comment,
            account_id,
            block_number,
            create_time,
            uuid,
        }
    }
}

// #[derive(PartialEq, Eq, Clone, Encode, Decode, RuntimeDebug, scale_info::TypeInfo)]
// #[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
// pub struct Page<BlockNumber, Moment, AccountId, T>
//     where BlockNumber: Parameter + AtLeast32BitUnsigned, T: Clone {
//     // 数据
//     pub data : Vec<T>,
//     // 总数
//     pub page: u64,
//     // 总数
//     pub size: u64,
//     // 总数
//     pub total: u64,
// }
//
//
//
// impl<BlockNumber, Moment, AccountId> Page<BlockNumber, Moment, AccountId, T>
//     where BlockNumber: Parameter + AtLeast32BitUnsigned, T: Clone {
//     pub fn new( data : Vec<T>,
//                 page: u64,
//                 size: u64,
//                 total: u64,
//     ) -> Self {
//         Self{
//             data,
//             page,
//             size,
//             total,
//         }
//     }
// }
