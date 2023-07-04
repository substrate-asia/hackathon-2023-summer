import {ConnectArgs} from "@wagmi/core";
import {Connector, useAccount, useConnect} from "wagmi";

export type WagmiConnect = (args?: Partial<ConnectArgs>) => void

export enum WagmiConnectorStatus {
    unready,
    unconnected,
    connecting,
    connected,
}

export interface WagmiConnector {
    conn: Connector
    status: WagmiConnectorStatus
}

export function useConnectors(): Readonly<{
    connect: WagmiConnect
    connectors: WagmiConnector[]
    error: Error | null
}> {
    const {connector} = useAccount()
    const {connect, connectors, isLoading, pendingConnector, error} = useConnect()

    const connectedId = connector?.id
    const pendingId = pendingConnector?.id

    const wagmiConnectors: WagmiConnector[] = []
    for (const conn of connectors) {
        let status: WagmiConnectorStatus
        if (conn.id === connectedId) {
            status = WagmiConnectorStatus.connected
        } else if (!conn.ready) {
            status = WagmiConnectorStatus.unready
        } else if (isLoading) {
            if (conn.id === pendingId) {
                status = WagmiConnectorStatus.connecting
            } else {
                status = WagmiConnectorStatus.unconnected
            }
        } else {
            status = WagmiConnectorStatus.unconnected
        }

        wagmiConnectors.push({conn, status})
    }

    return {connect, connectors: wagmiConnectors, error}
}
