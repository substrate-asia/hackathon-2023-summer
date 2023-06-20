import {ReadContractResult} from "wagmi/actions";
import {useContractRead, UseContractReadConfig} from "wagmi";
import {WagmiContract} from "../contract/WagmiContract";
import {AAFA, ABI, AbiArgs, AbiFunctionRead} from "../abi/WagmiAbiType";

export function useWagmiRead<TAbi extends ABI, TFunctionName extends string, TSelectData = ReadContractResult<TAbi, TFunctionName>>(
    contract: WagmiContract<TAbi>,
    functionName: AbiFunctionRead<TAbi, TFunctionName>,
    args: AbiArgs<TAbi, TFunctionName>,
    config?: Omit<UseContractReadConfig<TAbi, TFunctionName, TSelectData>, AAFA>,
) {
    return useContractRead<TAbi, TFunctionName, TSelectData>({
        address: contract.address,
        abi: contract.abi,
        functionName: functionName,
        args: args,
        ...config,
    } as any)
}
