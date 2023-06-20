import {Abi, AbiStateMutability, ExtractAbiFunctionNames} from "abitype";
import {PrepareWriteContractConfig} from "@wagmi/core";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type AAFA = 'address' | 'abi' | 'functionName' | 'args'
export type AAFAM = AAFA | 'mode'

export type ABI = Abi | readonly unknown[]
export type AbiStateReadonly = 'pure' | 'view'
export type AbiStateWritable = 'nonpayable' | 'payable'

export type AbiFunctionName<TAbi extends ABI, TFunctionName extends string, TAbiStateMutability extends AbiStateMutability = AbiStateMutability>
    = TAbi extends Abi ? ExtractAbiFunctionNames<TAbi, TAbiStateMutability> extends infer AbiFunctionNames ? AbiFunctionNames | (TFunctionName extends AbiFunctionNames ? TFunctionName : never) | (Abi extends TAbi ? string : never) : never : TFunctionName

export type AbiFunctionRead<TAbi extends ABI, TFunctionName extends string>
    = AbiFunctionName<TAbi, TFunctionName, AbiStateReadonly>

export type AbiFunctionWrite<TAbi extends ABI, TFunctionName extends string>
    = AbiFunctionName<TAbi, TFunctionName, AbiStateWritable>

export type AbiArgs<TAbi extends ABI, TFunctionName extends string>
    = InferArgs<PrepareWriteContractConfig<TAbi, TFunctionName>>

export const NoArgs = undefined

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type InferArgs<T> = T extends { args: infer R } ? R : undefined

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
