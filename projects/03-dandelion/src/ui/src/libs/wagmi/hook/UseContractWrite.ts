import {
    useContractWrite,
    UseContractWriteConfig,
    usePrepareContractWrite,
    UsePrepareContractWriteConfig,
    useWaitForTransaction
} from "wagmi";
import {Hash, PrepareWriteContractResult, Signer} from "@wagmi/core";
import {AAFA, AAFAM, ABI, AbiArgs, AbiFunctionWrite} from "../abi/WagmiAbiType";
import {WagmiContract} from "../contract/WagmiContract";
import {TransactionReceipt} from "@ethersproject/abstract-provider/src.ts";

export function useWagmiPrepareWrite<TAbi extends ABI, TFunctionName extends string, TChainId extends number, TSigner extends Signer>(
    contract: WagmiContract<TAbi>,
    functionName: AbiFunctionWrite<TAbi, TFunctionName>,
    args: AbiArgs<TAbi, TFunctionName>,
    config?: Omit<UsePrepareContractWriteConfig<TAbi, TFunctionName, TChainId, TSigner>, AAFA>,
) {
    return usePrepareContractWrite<TAbi, TFunctionName, TChainId>({
        address: contract.address,
        abi: contract.abi,
        functionName: functionName,
        args: args,
        ...config,
    } as any)
}

export function useWagmiWrite<TAbi extends ABI, TFunctionName extends string, TChainId extends number>(
    prepared: PrepareWriteContractResult<TAbi, TFunctionName, TChainId> | undefined,
    config?: Omit<UseContractWriteConfig<'prepared', TAbi, TFunctionName>, AAFAM>,
) {
    return useContractWrite<'prepared', TAbi, TFunctionName>({
        ...prepared,
        ...config,
    } as any)
}

export type WagmiStatus = 'idle' | 'loading' | 'success' | 'error'

export function isWagmiIdle(status: WagmiStatus) {
    return status === 'idle'
}
export function isWagmiLoading(status: WagmiStatus) {
    return status === 'loading'
}
export function isWagmiSuccess(status: WagmiStatus) {
    return status === 'success'
}
export function isWagmiError(status: WagmiStatus) {
    return status === 'error'
}

export interface WagmiTransaction {
    busy: boolean
    prepareStatus: WagmiStatus
    prepareErr: Error | null
    writeStatus: WagmiStatus
    writeErr: Error | null
    txHash: Hash | undefined
    txStatus: WagmiStatus
    txErr: Error | null
}

export type WagmiWrite = () => void

export function useWagmiTransaction<TAbi extends ABI, TFunctionName extends string, TChainId extends number, TSigner extends Signer>(
    contract: WagmiContract<TAbi>,
    functionName: AbiFunctionWrite<TAbi, TFunctionName>,
    args: AbiArgs<TAbi, TFunctionName>,
    configs?: {
        prepareWrite?: Omit<UsePrepareContractWriteConfig<TAbi, TFunctionName, TChainId, TSigner>, AAFA>,
        waitForTransaction?: {
            onSuccess?: (data: TransactionReceipt) => void,
            onError?: (err: Error) => void,
        }
    },
): [WagmiTransaction, WagmiWrite | undefined] {
    const resPrepare = useWagmiPrepareWrite(contract, functionName, args, configs?.prepareWrite)
    const resWrite = useWagmiWrite(resPrepare.config)
    const txHash = resWrite.data?.hash
    const resTransaction = useWaitForTransaction({
        ...configs?.waitForTransaction,
        hash: txHash,
    })
    const busy = resWrite.status === 'loading' || resTransaction.status === 'loading'

    return [{
        busy,
        prepareStatus: resPrepare.status,
        prepareErr: resPrepare.error,
        writeStatus: resWrite.status,
        writeErr: resWrite.error,
        txHash: txHash,
        txStatus: resTransaction.status,
        txErr: resTransaction.error,
    }, busy ? undefined : resWrite.write]
}
