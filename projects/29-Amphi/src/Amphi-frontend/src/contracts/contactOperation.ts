import contractABI from './ABI/MAIN.json'; // 主合约ABI
import contractAmphiPassABI from './ABI/NFT.json'; // NFT合约ABI

// 主合约信息
export const contractInfo = () => {
    return {
        address: import.meta.env.VITE_PUBLIC_CONTRACT_ADDRESS,
        abi: contractABI
    };
};

// NFT合约信息
export const contractAmphiPassInfo = () => {
    return {
        address: import.meta.env.VITE_PUBLIC_NFT_CONTRACT_ADDRESS,
        abi: contractAmphiPassABI
    };
};
