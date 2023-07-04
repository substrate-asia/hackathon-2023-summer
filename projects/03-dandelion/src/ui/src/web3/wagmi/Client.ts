import {configureChains, createClient} from 'wagmi'
import {publicProvider} from 'wagmi/providers/public'
import {moonbaseAlpha} from 'wagmi/chains'
import {MetaMaskConnector} from 'wagmi/connectors/metaMask'

export const wagmiClient = createWagmiClient()

function createWagmiClient() {
    const {chains, provider, webSocketProvider} = configureChains(
        [moonbaseAlpha],
        [publicProvider()],
    )

    return createClient({
        provider,
        webSocketProvider,
        autoConnect: true,
        connectors: [
            new MetaMaskConnector({chains}),
        ],
    })
}
