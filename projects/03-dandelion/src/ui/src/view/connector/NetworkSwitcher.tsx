import {useCallback} from "react";
import {Chain} from "@wagmi/core";
import {useNetworks, WagmiNetworkStatus, WagmiSwitchNetwork} from "../../libs/wagmi/hook/UseNetworks";

export function NetworkSwitcher() {
    const {chain, switchNetwork, networks, error} = useNetworks()

    if (!chain || !switchNetwork) { // 还没连接
        // 只有连接成功后才可以切换网络
        return null
    }

    return (
        <div>
            <div>
                Connected to {chain.name}{chain.unsupported && '(unsupported)'}
            </div>

            <div>
                {
                    networks.map((network) => <NetworkBtn
                        key={network.chain.id}
                        status={network.status}
                        switchNetwork={switchNetwork}
                        chain={network.chain}
                    />)
                }
            </div>

            <div>{error && error.message}</div>
        </div>
    )
}

function NetworkBtn({status, switchNetwork, chain} : Readonly<{
    status: WagmiNetworkStatus,
    switchNetwork: WagmiSwitchNetwork
    chain: Chain
}>) {
    const {id} = chain

    const onClick = useCallback(() => {
        if (status === WagmiNetworkStatus.unconnected) {
            switchNetwork(id)
        }
    }, [status, switchNetwork, id])

    let statusText = ''
    switch (status) {
        case WagmiNetworkStatus.connecting:
            statusText = '(连接中)'
            break;
        case WagmiNetworkStatus.connected:
            statusText = '(已连接)'
            break;
    }

    return <button
        onClick={onClick}
    >
        {`${chain.name}${statusText}`}
    </button>
}
