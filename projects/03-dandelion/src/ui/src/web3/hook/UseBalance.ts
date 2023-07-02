import {Address, useAccount, useBalance} from "wagmi";
import {SignTokenAddress, VETokenAddress} from "../contracts/Contracts";
import {FetchBalanceResult} from "@wagmi/core";

export function useMyBalance(token: Address | undefined, watch?: boolean): FetchBalanceResult | undefined  {
  const { address } = useAccount()
  const { data } = useBalance({
    address: address,
    token: token,
    watch: watch,
  })
  return data
}

export function useMyNativeBalance(watch?: boolean): FetchBalanceResult | undefined {
  return useMyBalance(undefined, watch)
}

export function useMyVEBalance(watch?: boolean): FetchBalanceResult | undefined {
  return useMyBalance(VETokenAddress, watch)
}

export function useMySignBalance(watch?: boolean): FetchBalanceResult | undefined {
  return useMyBalance(SignTokenAddress, watch)
}
