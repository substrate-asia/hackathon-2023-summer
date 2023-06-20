import {useContractWrite, UseContractWriteConfig, usePrepareContractWrite, UsePrepareContractWriteConfig} from "wagmi";
import {PrepareWriteContractResult, Signer} from "@wagmi/core";
import {AAFA, AAFAM, ABI, AbiArgs, AbiFunctionWrite} from "../abi/WagmiAbiType";
import {WagmiContract} from "../contract/WagmiContract";

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
