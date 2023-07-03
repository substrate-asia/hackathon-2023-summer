import {useAccount, useEnsName} from "wagmi";

export function useAccountAndEnsName() {
    const {address} = useAccount()
    const {data: ensName} = useEnsName({address})
    return {address, ensName}
}

export function useConnected(): boolean {
    const {isConnected} = useAccount()
    return isConnected
}
