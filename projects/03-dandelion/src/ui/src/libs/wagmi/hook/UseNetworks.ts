import {useNetwork, useSwitchNetwork} from "wagmi";
import {Chain} from "@wagmi/core";

export type WagmiSwitchNetwork = (chainId: number) => void

export enum WagmiNetworkStatus {
    unconnected,
    connecting,
    connected,
}

export interface WagmiNetwork {
    chain: Chain
    status: WagmiNetworkStatus
}

export function useNetworks(): Readonly<{
    chain?: Chain & { unsupported?: boolean }
    switchNetwork?: WagmiSwitchNetwork
    networks: WagmiNetwork[]
    error: Error | null
}> {
    const {chain} = useNetwork()
    const {switchNetwork, chains, isLoading, pendingChainId, error} = useSwitchNetwork()

    const chainId = chain?.id

    const networks: WagmiNetwork[] = []
    for (const chain of chains) {
        let status: WagmiNetworkStatus
        if (chain.id === chainId) {
            status = WagmiNetworkStatus.connected
        } else if (isLoading) {
            if (chain.id === pendingChainId) {
                status = WagmiNetworkStatus.connecting
            } else {
                status = WagmiNetworkStatus.unconnected
            }
        } else {
            status = WagmiNetworkStatus.unconnected
        }

        networks.push({chain, status})
    }

    return {chain, switchNetwork, networks, error}
}
