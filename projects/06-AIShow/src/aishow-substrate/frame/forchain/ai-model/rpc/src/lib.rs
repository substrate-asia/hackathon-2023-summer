// //! RPC interface for the transaction payment module.
//
// use std::convert::TryInto;
// use jsonrpc_core::{Error as RpcError, ErrorCode, Result};
// use jsonrpc_derive::rpc;
// use sp_api::ProvideRuntimeApi;
// use sp_blockchain::HeaderBackend;
// use sp_runtime::{generic::BlockId, traits::{Block as BlockT, MaybeDisplay}};
// use std::sync::Arc;
// use storage_order_runtime_api::OrderPage as OrderPage;
// pub use storage_order_runtime_api::StorageOrderApi as StorageRuntimeApi;
// use codec::Codec;
// use sp_rpc::number::NumberOrHex;
//
// #[rpc]
// pub trait AiModelApi<Block, AccountId, BlockNumber, Moment> {
//     #[rpc(name = "aiModel_pageUserOrder")]
//     fn page_user_order(&self, account_id: AccountId, page: u64, size: u64, sort: u8) -> Page<BlockNumber, Moment, AccountId, AiPost<BlockNumber, Moment, AccountId>>;
//
// }
//
// /// A struct that implements the `AiModelApi`.
// pub struct AiModel<C, M> {
//     // If you have more generics, no need to StorageOrder<C, M, N, P, ...>
//     // just use a tuple like StorageOrder<C, (M, N, P, ...)>
//     client: Arc<C>,
//     _marker: std::marker::PhantomData<M>,
// }
//
// impl<C, M> AiModel<C, M> {
//     /// Create new `AiModel` instance with the given reference to the client.
//     pub fn new(client: Arc<C>) -> Self {
//         Self {
//             client,
//             _marker: Default::default(),
//         }
//     }
// }
//
// /// Error type of this RPC api.
// // pub enum Error {
// // 	/// The transaction was not decodable.
// // 	DecodeError,
// // 	/// The call to runtime failed.
// // 	RuntimeError,
// // }
// //
// // impl From<Error> for i64 {
// // 	fn from(e: Error) -> i64 {
// // 		match e {
// // 			Error::RuntimeError => 1,
// // 			Error::DecodeError => 2,
// // 		}
// // 	}
// // }
//
// impl<C, Block, AccountId, BlockNumber, Moment> AiModelApi<<Block as BlockT>::Hash,AccountId,BlockNumber,Moment> for AiModel<C, Block>
//     where
//         Block: BlockT,
//         C: Send + Sync + 'static,
//         C: ProvideRuntimeApi<Block>,
//         C: HeaderBackend<Block>,
//         C::Api: AiModelRuntimeApi<Block, AccountId, BlockNumber, Moment>,
//         AccountId: Clone + std::fmt::Display + Codec,
//         BlockNumber: Clone + std::fmt::Display + Codec,
//         Moment: Clone + std::fmt::Display + Codec,
// {
//     fn page_user_order(&self, account_id: AccountId, page: u64, size: u64, sort: u8) ->  Result<Page<BlockNumber, Moment, AccountId, AiPost<BlockNumber, Moment, AccountId>>> {
//         let api = self.client.runtime_api();
//         let best = self.client.info().best_hash;
//         let at = BlockId::hash(best);
//         let runtime_api_result = api.page_user_order(&at,account_id,page,size,sort);
//         runtime_api_result.map_err(|e| RpcError {
//             code: ErrorCode::ServerError(9876), // No real reason for this value
//             message: "Something wrong".into(),
//             data: Some(format!("{:?}", e).into()),
//         })
//     }
// }