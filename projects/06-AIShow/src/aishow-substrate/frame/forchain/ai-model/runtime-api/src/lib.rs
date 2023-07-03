// #![cfg_attr(not(feature = "std"), no_std)]
// #![allow(clippy::too_many_arguments)]
// #![allow(clippy::unnecessary_mut_passed)]
//
// // Here we declare the runtime API. It is implemented it the `impl` block in
// // runtime amalgamator file (the `runtime/src/lib.rs`)
// use codec::Codec;
//
// sp_api::decl_runtime_apis! {
//
//     pub trait AiModelApi<Block, AccountId, BlockNumber, Moment> where
//         AccountId: Codec,
//         BlockNumber: Codec,
//         Balance: Codec,
//         Moment: Codec
//     {
//         fn page_user_order(account_id: AccountId, page: u64, size: u64, sort: u8) -> Page<BlockNumber, Moment, AccountId, AiPost<BlockNumber, Moment, AccountId>>;
//     }
// }
