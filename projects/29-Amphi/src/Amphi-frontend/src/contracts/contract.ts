import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';

import { web3 } from './config';

import amphi from './ABI/MAIN.json'; // 主合约ABI
import erc20 from './ABI/ERC20.json'; // erc20合约ABI
import amphiPass from './ABI/NFT.json'; // NFT合约ABI
import sbtABI from './ABI/SBT.json'; // SBT合约ABI

// 主合约
let contract: Contract;
export async function getAmphi() {
    if (!contract) {
        contract = new web3.eth.Contract(
            amphi as AbiItem[],
            import.meta.env.VITE_PUBLIC_CONTRACT_ADDRESS
        );
    }
    return contract;
}

export async function getErc20Contract(address: any) {
    // @ts-ignore
    return new web3.eth.Contract(erc20.abi as AbiItem[], address);
}

export async function getErc20() {
    // @ts-ignore
    return new web3.eth.Contract(erc20.abi as AbiItem[], erc20.address);
}

// 获取NFT合约
let contractAmphiPass: Contract;
export async function getAmphiPass() {
    if (!contractAmphiPass) {
        contractAmphiPass = new web3.eth.Contract(
            amphiPass as AbiItem[],
            import.meta.env.VITE_PUBLIC_NFT_CONTRACT_ADDRESS
        );
    }
    return contractAmphiPass;
}

// 获取SBT合约
let contractSBT: Contract;
export async function getSBTContract() {
    if (!contractSBT) {
        contractSBT = new web3.eth.Contract(
            sbtABI as AbiItem[],
            import.meta.env.VITE_PUBLIC_SBT_CONTRACT_ADDRESS
        );
    }
    return contractSBT;
}
