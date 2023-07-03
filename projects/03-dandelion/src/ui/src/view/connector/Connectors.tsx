import {useCallback} from "react";
import {Connector, useDisconnect} from "wagmi";
import {useConnectors, WagmiConnect, WagmiConnectorStatus} from "../../libs/wagmi/hook/UseConnector";

export function Connectors() {
    const {connect, connectors, error} = useConnectors()

    return (
        <div>
            <div>
                {connectors.map(connector => <ConnectorBtn
                    key={connector.conn.id}
                    status={connector.status}
                    connect={connect}
                    connector={connector.conn}
                />)}
            </div>
            {error && <div>{error.message}</div>}
        </div>
    )
}

function ConnectorBtn({connect, status, connector} : Readonly<{
    status: WagmiConnectorStatus,
    connect: WagmiConnect,
    connector: Connector,
}>) {
    const {disconnect} = useDisconnect()

    const onClick = useCallback(() => {
        switch (status) {
            case WagmiConnectorStatus.unconnected:
                connect({connector: connector})
                break;
            case WagmiConnectorStatus.connected:
                disconnect()
                break;
        }
    }, [status, connect, connector, disconnect])

    let statusText = ''
    switch (status) {
        case WagmiConnectorStatus.unready:
            statusText = '(不可用)'
            break;
        case WagmiConnectorStatus.connecting:
            statusText = '(连接中)'
            break;
        case WagmiConnectorStatus.connected:
            statusText = '(点击断开连接)'
            break;
    }

    return <button
        onClick={onClick}
    >
        {`${connector.name}${statusText}`}
    </button>
}
