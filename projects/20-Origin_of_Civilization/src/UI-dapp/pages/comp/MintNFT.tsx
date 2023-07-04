
import styles from '../../styles/Home.module.css';
// CIVI
import abi_registcontract from '../abis/abi_RegistContract.json';
import { usePrepareContractWrite, useContractWrite, useAccount, useNetwork, useConnect, useDisconnect, useSwitchNetwork } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import address_contracts from "../../tools/ContractManage";
import abi_NFTTestContract from "../abis/NFTTest.json"
import abi_CastleNFTContract from "../abis/CastleTest.json"
import { useState } from 'react';

// Regist Contract deployed to 0xA1Da8C3DcAc42A4551d07188FEF4C2a140772003
const RegistContract = '0x633470Bb3696E5Db3eC1f5f747dd1Fe27e0A908C';
// PlayerContract deployed to 0x58177C9584Ec0f3D2F2CB384d02Bd2B7722d5a7e
const PlayerContract = '0x7E60D0Bc3D539e6577cf1C21AD251ABB5990897E'
// ManagementContract deployed to 0x1D3E62799Aca3d978dF4329a7C0606aa96301ad1
const PlayerManageContract = '0x3Ca5E76400a9D1aAbf32866d51f9ED4AcCDedc7b'
// CreateCiviTeam deployed to 0xe1BF113788506Dd2D7cEfbC83Ce1C8aa2992210D
const CreateCiviTeamContract = '0x432B53f20732Aba0BFc6230Bb3191Fd9c0884fF4'
// BattlePoint deployed to 0x69913Cb667Abe3CedBa99e50400B6A82904fc54D
const BattlePointContract = '0x8FE38954c85974E55F10b7e6ea611A7250Fb8a1a'
// CombatPower deployed to 0xc3112BEe8Aa51805540201aE973119f6C5c92799
const CombatPowerContract  = '0x717a4cC15288431BF13039aCb2794DF3a491625d'
// Fight deployed to 0xB06901bf420451db9633D360A2c9eA2d7215CA8a
const FightContract  = '0x8529742DaC259f440F9Acd758C9899B499Fe730c'
// NFTTest deployed to 0x523637bC646f44164B2465b7e969DEb695b6102A
const NFTTestContract = '0x3F780252843bf1746A98DB70e12adEabC8256C07'
// CastleTest deployed to 0xa08dA538d0769032F577a16c634393B83e9545bB  
const CastleTestContract = '0x3a013E4eB2fbe64d5226Ef5804149cFCFd9ac86c'

const ApproveForBurn = () => {
  // Approve, so ManagementContract can burn it and make character stronger,
  const disconnected = useDisconnect()
  const userAddress = useAccount().address
  const { connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  const [tokenId, setTokenId] = useState(0)
  let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1284

  const { config } = usePrepareContractWrite({
    address: NFTTestContract,
    abi: abi_NFTTestContract.abi,
    functionName: 'approve',
    chainId: chainId,
    args:[PlayerManageContract, tokenId]
  })
    
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
    
    return(
        <div className={styles.inCardContainer}>
          <div>
            <h1 className={styles.inCardTitle}>
            Approve 
            </h1>
          </div>

          <div className={styles.inCarddescription}>
            <p>
            Approve And Burn A NFT to Enhance the combat power of the character.
            </p>
          </div>

          <div>
            <input type="number" name='tokenID' defaultValue={0} className={styles.inputbox} onChange={e => setTokenId(Number(e.target.value))}/> 
          </div>

          

          {isConnected &&           
            <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()}
            >Approve NFT
            </button>
          }

        </div>  
    )


}

const MintNFT2 = () => {
    const disconnected = useDisconnect()
    const userAddress = useAccount().address
    const { connector, isConnected } = useAccount()
    const { chain } = useNetwork()
    let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1284
  
    const { config } = usePrepareContractWrite({
      address: CastleTestContract,
      abi: abi_CastleNFTContract.abi,
      functionName: 'safeMint',
      chainId: chainId,
      args:[userAddress],
      overrides: {
        // value: ethers.utils.parseEther('0.05'),
        // gasLimit:200000,
        // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
      }
    })
      
      const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
      
      return(
          <div className={styles.inCardContainer}>
            <div>
              <h1 className={styles.inCardTitle}>
              Mint A NFT for TEST.
              </h1>
            </div>
  
            <div className={styles.inCarddescription}>
              <p>
              A Test Castle NFT. Use For Bonus player character's Attributes.
              </p>
            </div>
  
            {isConnected &&           
              <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()}
              >MintNFT-Castle
              </button>
            }
            {!isConnected && 
              <ConnectButton/>
            }
  
          </div>  
      )
}


const MintNFT1 = () => {
  const disconnected = useDisconnect()
  const { connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  const userAddress = useAccount().address

  let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1284

  const { config } = usePrepareContractWrite({
    address: NFTTestContract,
    abi: abi_NFTTestContract.abi,
    functionName: 'safeMint',
    chainId: chainId,
    args:[userAddress],
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
    }
  })
    
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
    
    return(
      <div className={styles.card}>
        <div className={styles.inCardContainer}>
          <div>
            <h1 className={styles.inCardTitle}>
            Mint A NFT for TEST.
            </h1>
          </div>

          <div className={styles.inCarddescription}>
            <p>
            A Test NFT. Use For Upgrade player character.
            </p>
          </div>

          {isConnected &&           
            <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()}
            >MintNFT 
            </button>
          }

          { <ApproveForBurn/>}

          <MintNFT2/>
          {!isConnected && 
            <ConnectButton/>
          }

        </div>

      </div>      
    )
}

export default MintNFT1;