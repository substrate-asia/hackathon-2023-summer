import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {StarterEntity, AppAdvertise, UnionDao, UnionDaoMint} from "../types";
import {Balance} from "@polkadot/types/interfaces";
import {blockNumber, eventId, getExtrinsicFee, extractRelatedAccountsFromEvent} from "./helper";
import {CallBase} from "@polkadot/types/types/calls";
import {AnyTuple} from "@polkadot/types/types/codec";
import type { Bytes, Compact, Enum, HashMap, Option, Result, Struct, Text, U8aFixed, Vec, bool, i32, u32, u64, u128, u8 } from '@polkadot/types-codec';

export async function handleBlock(block: SubstrateBlock): Promise<void> {
    //Create a new starterEntity with ID using block hash
    let record = new StarterEntity(block.block.header.hash.toString());
    //Record block number
    record.field1 = block.block.header.number.toNumber();
    await record.save();
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    logger.info(`handle event  at ${event} `);
    const {event: {data: [account, balance]}} = event;
    //Retrieve the record by its ID
    const record = await StarterEntity.get(event.block.block.header.hash.toString());
    record.field2 = account.toString();
    //Big integer type Balance of a transfer event
    record.field3 = (balance as Balance).toBigInt();
    await record.save();
}



export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  const record = await StarterEntity.get(
    extrinsic.block.block.header.hash.toString()
  );
  //Date type timestamp
  record.field4 = extrinsic.block.timestamp;
  //Boolean tyep
  record.field5 = true;
  await record.save();
}



export async function handleAppAdvertiseEvent(event: SubstrateEvent): Promise<void> {
    logger.info(`handle handleAppAdvertiseEvent  at ${event} `);
    const {event: {data: [id, owner_id, owner_union, asset_id, tag, area, body]}} = event;
    //some code have been removed here for it is just under test
	//but it exist in the released binary
}

export async function handleUnionDaoAddedEvent(event: SubstrateEvent): Promise<void> {
    logger.info(`handle handleUnionDaoAddedEvent  at ${event} `);
    const {event: {data: [who, unionId, myAssetId, depositedAccountId]}} = event;
    
    const {extrinsic: {method: {args: [desp, myAssetId_, payAssetId, deadline, min, max, keepRate, mint, stakAccountId, appAdvertiseId ]}}} = event.extrinsic;

    logger.info(`handle handleUnionDaoAddedEvent  method args desp utf8 ${(desp as Bytes).toUtf8()} `);

    let record = new UnionDao(unionId.toString());

    //record.dao_id=id.toString();
    record.myAssetId= myAssetId.toString();
    record.payAssetId= payAssetId.toString();
    record.desp=(desp as Bytes).toUtf8()
    //record.deadline=deadline.toNumber();
    record.stakAccountId = stakAccountId.toString();
    record.depositedAccountId = depositedAccountId.toString();
    //record.appAdvertiseId = appAdvertiseId.hash.toString();
    record.min = (min as Balance).toBigInt();
    record.max = (max as Balance).toBigInt();
    record.keepRate = (keepRate as u128).toBigInt();
    record.fund = BigInt("0");
    record.earnAcc = BigInt("0");
   
    record.blockHash = event.block.block.header.hash.toString();
    record.extrinsicHash = event.extrinsic.extrinsic.hash.toString();

    record.signer = event.extrinsic.extrinsic.signer.toString();
    record.fee = getExtrinsicFee(event.extrinsic).toString();
    record.blockHeight = event.block.block.header.number.toNumber();
    record.createDate = event.block.timestamp;
    record.updateDate = event.block.timestamp;
    await record.save();

}

export async function handleUnionDaoAppendedEvent(event: SubstrateEvent): Promise<void> {
    logger.info(`handle handleUnionDaoAppendedEvent  at ${event} `);
    const {event: {data: [who, unionId, myAssetId]}} = event;
	//some code have been removed here for it is just under test
	//but it exist in the released binary
}

export async function handleUnionDaoAssetToMinedEvent(event: SubstrateEvent): Promise<void> {
  logger.info(`handle handleUnionDaoAssetToMinedEvent  at ${event} `);
  const {event: {data: [who, daoId, amountFact]}} = event;
  //some code have been removed here for it is just under test
  //but it exist in the released binary



}



export async function handleAppAdvertiseCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    logger.info(`handle handleAppAdvertiseCall  ${extrinsic} `);

    const {extrinsic: {method: {args: [unionId, assetId, tag, area, ver, ext1, ext2, body]}}} = extrinsic;
}


