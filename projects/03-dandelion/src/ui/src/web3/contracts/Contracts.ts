import {Address} from "wagmi";
import {WagmiContract} from "../../libs/wagmi/contract/WagmiContract";
import {AITokenAbi} from "./abi/AITokenAbi";
import {SignTokenAbi} from "./abi/SignTokenAbi";
import {StakeTokenAbi} from "./abi/StakeTokenAbi";
import {VETokenAbi} from "./abi/VETokenAbi";

export const StakeTokenAddress: Address = '0x3FB45146083AB04eD139B0DeEd36574Fac2B392D'
export const StakeToken = new WagmiContract(StakeTokenAddress, StakeTokenAbi)

export const VETokenAddress: Address = '0xf453261a7B281580D2A5F5096f93b71445c6043D'
export const VEToken = new WagmiContract(VETokenAddress, VETokenAbi)

export const SignTokenAddress: Address = '0xF6c3cC4A028528A7205725EdE2477Ede34842e6e'
export const SignToken = new WagmiContract(SignTokenAddress, SignTokenAbi)

export const AITokenAddress: Address = '0xE9E89b2a0eDB7A7A87Be9C6c48808C94aBC14e61'
export const AIToken = new WagmiContract(AITokenAddress, AITokenAbi)
