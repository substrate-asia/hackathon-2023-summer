import {config} from "./config";
import {loadExampleAbi} from "../utils";
import {loadExampleAddress} from "../utils";

import { ethers, Wallet, Contract, utils }  from "ethers";
export const initEthers = async (): Promise<InitEthersResult> => {

    let tokenPaymasterAbi =  loadExampleAbi("TokenPaymaster");
    let tokenPaymasterAddress = loadExampleAddress("TokenPaymaster")

    let simpleAccountFactoryAbi =  loadExampleAbi("SimpleAccountFactory");
    let simpleAccountFactoryAddress = loadExampleAddress("SimpleAccountFactory")

    let entryPointAbi =  loadExampleAbi("EntryPoint");
    let entryPointAddress = loadExampleAddress("EntryPoint")

    const provider = new ethers.providers.JsonRpcProvider(config.chain.chain_url);

    const wallet = await new Wallet(config.chain.owner_privateKey!, provider);
    let accountOwnerAddress = await wallet.getAddress();

    let tokenPaymaster = new Contract(tokenPaymasterAddress,tokenPaymasterAbi,wallet)
    let simpleAccountFactory = new Contract(simpleAccountFactoryAddress,simpleAccountFactoryAbi,wallet)
    let entryPoint = new Contract(entryPointAddress,entryPointAbi,wallet)

    return new InitEthersResult(wallet,accountOwnerAddress,tokenPaymaster,simpleAccountFactory,entryPoint)
}

export class InitEthersResult{
    constructor(readonly wallet:ethers.Wallet,readonly accountOwnerAddress:string,
                readonly tokenPaymaster:ethers.Contract,
                readonly simpleAccountFactory:ethers.Contract,
                readonly entryPoint:ethers.Contract) {}
}