import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import { uniq, flatten } from "lodash";
import {Balance} from "@polkadot/types/interfaces";
import {extractAuthor} from "@polkadot/api-derive/type/util"
import { AnyTuple, CallBase } from '@polkadot/types/types';
import { Vec } from '@polkadot/types';

const ACCOUNT_TYPES= ["Address","LookupSource","AccountId"]
const BATCH_CALLS = ["batch", "batchAll"]
const TRANSFER_CALLS = ["transfer", "transferKeepAlive"]

export function isBatch(call: CallBase<AnyTuple>) : boolean {
    return call.section == "utility" && BATCH_CALLS.includes(call.method)
}

export function isProxy(call: CallBase<AnyTuple>) : boolean {
    return call.section == "proxy" && call.method == "proxy"
}

export function isAsDerivative(call: CallBase<AnyTuple>) : boolean {
    return call.section == "utility" && call.method == "asDerivative"   
}

export function isTransfer(call: CallBase<AnyTuple>) : boolean {
    return call.section == "balances" && TRANSFER_CALLS.includes(call.method)
}

export function callsFromBatch(batchCall: CallBase<AnyTuple>) : CallBase<AnyTuple>[] {
    return batchCall.args[0] as Vec<CallBase<AnyTuple>>
}

export function callFromProxy(proxyCall: CallBase<AnyTuple>) : CallBase<AnyTuple> {
    return proxyCall.args[2] as CallBase<AnyTuple>
}

export function eventId(event: SubstrateEvent): string {
    return `${blockNumber(event)}-${event.idx}`
}

export function eventIdFromBlockAndIdx(blockNumber: string, eventIdx: string) {
    return `${blockNumber}-${eventIdx}`
}

export function blockNumber(event: SubstrateEvent): number {
    return event.block.block.header.number.toNumber()
}

export function extrinsicIdFromBlockAndIdx(blockNumber: number, extrinsicIdx: number): string {
    return `${blockNumber.toString()}-${extrinsicIdx.toString()}`
}

export async function extractRelatedAccountsFromBlock (block: SubstrateBlock): Promise<string[]> {
    const accounts: string[] = [];

    if(block.events.length!==0){
        for (const event of block.events){
            for (const [key, typeDef] of Object.entries(event.event.data.typeDef)){
                if(ACCOUNT_TYPES.includes(typeDef.type)){
                    const index = Number(key);
                    accounts.push(event.event.data[index].toString());
                }
            }
        }
    }

    if (block.block.extrinsics.length!==0){
        for (const extrinsic of block.block.extrinsics){
            for (const account of flatten(extractAccountsFromNestedCalls(extrinsic.method))){
                accounts.push(account);
            }
        }
    }

    return uniq(accounts);
}

export function extractAccountsFromNestedCalls(call: CallBase<AnyTuple>): string[]{
    const accounts= [] as string[];
    for (const [key, arg] of Object.entries(call.meta.args.toArray())){
        if(arg.type && ACCOUNT_TYPES.includes(arg.type.toString())){
            const index = Number(key);
            accounts.push(call.args[index].toString());
        }
        if(isBatch(call)){
            const calls = call.args[0] as Vec<CallBase<AnyTuple>>;
            return accounts.concat(
                flatten(
                    calls.map((call) => extractAccountsFromNestedCalls(call)),
                ),
            );
        }
        if(isAsDerivative(call)){
            const childCall = call.args[1] as CallBase<AnyTuple>;
            return accounts.concat(
                flatten(
                    extractAccountsFromNestedCalls(childCall),
                ),
            );
        }
        if(isProxy(call)){
            const childCall = call.args[2] as CallBase<AnyTuple>;
            return accounts.concat(
                flatten(
                    extractAccountsFromNestedCalls(childCall),
                ),
            );
        }
    }
    return accounts;
}

export function extractRelatedAccountsFromEvent (event: SubstrateEvent): string[]{
    const accounts: string[] = [];
    let extrinsic = event.extrinsic? event.extrinsic.extrinsic: null;
    if(!extrinsic){
        return accounts
    }
    let signer = extrinsic.signer
    if (extrinsic.isSigned && signer) {
        accounts.push(signer.toString())
    }
    for (const [key, typeDef] of Object.entries(event.event.data.typeDef)){
        if(ACCOUNT_TYPES.includes(typeDef.type)){
            const index = Number(key);
            accounts.push(event.event.data[index].toString());
        }
    }
    return uniq(accounts);
}


export function getExtrinsicFee(extrinsic: SubstrateExtrinsic): bigint {
    let blockAuthorFee = getBlockAuthorFee(extrinsic)
    let treasuryFee = getTreasuryFee(extrinsic)

    let totalFee = blockAuthorFee + treasuryFee

    return totalFee
}

function getBlockAuthorFee(extrinsic: SubstrateExtrinsic): bigint {
    const eventRecord = extrinsic.events.find((event) => {
        return event.event.method == "Deposit" && event.event.section == "balances"
    })

    if (eventRecord != undefined) {
        const {event: {data: [, fee]}}= eventRecord

        return (fee as Balance).toBigInt()
    } else  {
        return BigInt(0)
    }
}

function getTreasuryFee(extrinsic: SubstrateExtrinsic): bigint {
    const eventRecord = extrinsic.events.find((event) => {
        return event.event.method == "Deposit" && event.event.section == "treasury"
    })

    if (eventRecord != undefined) {
        const {event: {data: [fee]}}= eventRecord

        return (fee as Balance).toBigInt()
    } else  {
        return BigInt(0)
    }
}

