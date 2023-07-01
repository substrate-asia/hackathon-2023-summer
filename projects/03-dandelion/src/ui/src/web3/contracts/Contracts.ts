import {Address} from "wagmi";
import {WagmiContract} from "../../libs/wagmi/contract/WagmiContract";
import {AITokenAbi} from "./abi/AITokenAbi";
import {SignTokenAbi} from "./abi/SignTokenAbi";
import {StakeTokenAbi} from "./abi/StakeTokenAbi";
import {VETokenAbi} from "./abi/VETokenAbi";

export const VETokenAddress: Address = '0xD5724171C2b7f0AA717a324626050BD05767e2C6'
export const VEToken = new WagmiContract(VETokenAddress, VETokenAbi)

export const SignTokenAddress: Address = '0x2d04968bD5ad9284E3C777f738194578233EAE12'
export const SignToken = new WagmiContract(SignTokenAddress, SignTokenAbi)

export const StakeTokenAddress: Address = '0x45f9799669BC3f5029E01439dA8338B6bC90Ccd1'
export const StakeToken = new WagmiContract(StakeTokenAddress, StakeTokenAbi)

export const AITokenAddress: Address = '0x4eA8b9B299dD2f16533905a627e61D2AD347F454'
export const AIToken = new WagmiContract(AITokenAddress, AITokenAbi)
