import { Address } from "wagmi";
import {
  prepareWriteContract,
  PrepareWriteContractConfig,
  PrepareWriteContractResult,
  readContract,
  ReadContractConfig,
  ReadContractResult,
  Signer,
  writeContract,
  WriteContractPreparedArgs,
  WriteContractResult,
  WriteContractUnpreparedArgs,
} from "@wagmi/core";
import {
  AAFA,
  AAFAM,
  ABI,
  AbiArgs,
  AbiFunctionRead,
  AbiFunctionWrite,
} from "../abi/WagmiAbiType";

type WriteContractArgs<TAbi extends ABI, TFunctionName extends string> =
  | WriteContractUnpreparedArgs<TAbi, TFunctionName>
  | WriteContractPreparedArgs<TAbi, TFunctionName>;

export class WagmiContract<TAbi extends ABI> {
  constructor(readonly address: Address, readonly abi: TAbi) {}

  read<TFunctionName extends string>(
    functionName: AbiFunctionRead<TAbi, TFunctionName>,
    args: AbiArgs<TAbi, TFunctionName>,
    config?: Omit<ReadContractConfig<TAbi, TFunctionName>, AAFA>
  ): Promise<ReadContractResult<TAbi, TFunctionName>> {
    return readContract<TAbi, TFunctionName>({
      address: this.address,
      abi: this.abi,
      functionName: functionName,
      args: args,
      ...config,
    } as any);
  }

  async prepareWrite<
    TFunctionName extends string,
    TChainId extends number,
    TSigner extends Signer
  >(
    functionName: AbiFunctionWrite<TAbi, TFunctionName>,
    args: AbiArgs<TAbi, TFunctionName>,
    config?: Omit<
      PrepareWriteContractConfig<TAbi, TFunctionName, TChainId, TSigner>,
      AAFA
    >
  ): Promise<PrepareWriteContractResult<TAbi, TFunctionName, TChainId>> {
    return prepareWriteContract<TAbi, TFunctionName, TChainId, TSigner>({
      address: this.address,
      abi: this.abi,
      functionName: functionName,
      args: args,
      ...config,
    } as any);
  }

  async unpreparedWrite<
    TFunctionName extends string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TChainId extends number,
    TSigner extends Signer
  >(
    functionName: AbiFunctionWrite<TAbi, TFunctionName>,
    args: AbiArgs<TAbi, TFunctionName>,
    config?: Omit<WriteContractArgs<TAbi, TFunctionName>, AAFAM>
  ): Promise<WriteContractResult> {
    return writeContract<TAbi, TFunctionName, TSigner>({
      mode: "recklesslyUnprepared",
      address: this.address,
      abi: this.abi,
      functionName: functionName,
      args: args,
      ...config,
    } as any);
  }
}
