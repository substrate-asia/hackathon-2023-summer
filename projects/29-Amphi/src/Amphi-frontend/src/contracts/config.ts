import Web3 from 'web3';

export const TestMode = true;

// export const MainChainId = 1284;
export const MainChainId = 80001;
export const TestChainId = parseInt(import.meta.env.VITE_PUBLIC_CHAIN_ID as string, 10) || '';
// console.log(import.meta.env.VITE_PUBLIC_CHAIN_ID);
export const ChainId = TestMode ? TestChainId : MainChainId;

// @ts-ignore
export const ethereum = window.ethereum || undefined;
export const web3 = new Web3(ethereum);

export interface Chain {
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}

export const TestChainDetail: Chain = {
    chainId: web3.utils.toHex(TestChainId),
    chainName: 'Moonbase Alpha',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: [' https://mumbai.polygonscan.com'],

    nativeCurrency: {
        name: 'DEV',
        symbol: 'DEV',
        decimals: 18
    }

    //   rpcUrls: https://rpc-mumbai.maticvigil.com
    // blockExplorerUrls: https://mumbai.polygonscan.com/
};

export const MoonbeamMainChainDetail = {
    chainId: web3.utils.toHex(MainChainId),
    chainName: 'Moonbeam',
    rpcUrls: ['https://rpc.api.moonbeam.network'],
    blockExplorerUrls: ['https://moonbeam.moonscan.io'],
    nativeCurrency: {
        name: 'GLMR',
        symbol: 'GLMR',
        decimals: 18
    }
};

export const MumbaiChainDetail = {
    chainId: web3.utils.toHex(MainChainId),
    chainName: 'Mumbai',
    rpcUrls: [' https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    // Currency:"MATIC"
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
    }
};

export const FilecoinHyperspaceTestnet: Chain = {
    chainId: web3.utils.toHex(TestChainId),
    chainName: 'Filecoin Hyperspace Testnet',
    rpcUrls: ['https://api.hyperspace.node.glif.io/rpc/v1'],
    blockExplorerUrls: ['https://hyperspace.filfox.info/en'],
    nativeCurrency: {
        name: 'tFIL',
        symbol: 'tFIL',
        decimals: 18
    }
};

// export const ChainDetail = TestMode ? TestChainDetail : MainChainDetail;
export const ChainDetail = TestMode ? FilecoinHyperspaceTestnet : MumbaiChainDetail;
