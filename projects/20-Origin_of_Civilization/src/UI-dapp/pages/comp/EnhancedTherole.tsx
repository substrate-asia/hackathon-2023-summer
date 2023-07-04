
import styles from '../../styles/Home.module.css';
// CIVI
import abi_registcontract from '../abis/abi_RegistContract.json';
import { usePrepareContractWrite, useContractWrite, useAccount, useNetwork, useConnect, useDisconnect, useSwitchNetwork, useContractReads, Address, useContractInfiniteReads, useContractRead } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import address_contracts from "../../tools/ContractManage";
import { useState } from 'react';
import abi_Fight_Contract from "../abis/Fight.json"
import abi_battle_point from "../abis/BattlePoint.json"
import abi_Management from "../abis/Management.json"


const Contract_Owner = "0x5Fc248a7c015FcFFf9A1B01DE176f90F16ABDc3F"


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


const BattlePoints = () => {
    const disconnected = useDisconnect()
    const { connector, isConnected } = useAccount()
    const { chain } = useNetwork()
    const userAddress = useAccount().address

    // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1 
    let chainId = 1284
    const [BattlePoint, setBattlePoint] = useState(0) 


    const { data, isError, isLoading } = useContractReads({
        contracts: [
            {
                address: BattlePointContract,
                abi: abi_battle_point.abi,
                functionName: 'getBattlePoint',
                chainId: chainId,
                args:[userAddress],
            }
        ],

        onSuccess(data) {
            let BattlePoint = data[0] as unknown as number
            console.log("Point of cureent user: ", data, userAddress)
            setBattlePoint(BattlePoint)
            },    
        }    
    )

    return(
          <div>
            <div>
              <h1 className={styles.inCardTitle}>
              Battle Points
              </h1>
            </div>
  
            <div className={styles.inCarddescription}>
              <p>
              Defeat other players and get battlefield points.
              </p>
            </div>
  
            {isConnected &&    
                <>
                    <div className={styles.makeCenter}>

                        <p>
                            Battle Ponints of User: 
                        </p>
                        <div className={styles.addressoverflow}>
                            {userAddress}
                        </div>

                        <div>
                        BattlePoints: {BattlePoint !== null && BattlePoint.toString()}
                        </div>
                    </div>

                </>
            }
  
          </div>
        ) 
}

const EnhanceRole = () => {
  const disconnected = useDisconnect()
  const { connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  let userAddress = useAccount().address;

//   let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1 ;
  let chainId= 0x504

  const [NFTContract, setNFTContract]  = useState('');
  const [tokenID, setTokenId] = useState(0)

  const { config } = usePrepareContractWrite({
    address: PlayerManageContract,
    abi: abi_Management.abi,
    functionName: 'destroyNft721',
    chainId: chainId,
    args:[NFTContract, tokenID],
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
            Enhance Role
            </h1>
          </div>

          <div className={styles.inCarddescription}>
            <p>
            Burn A NFT to Enhance Your Role
            </p>
          </div>

          <div className={styles.inCarddescription}>
            <p>
            Enter the address of the NFT Contract And The TokenID of Your NFT.
            </p>
          </div>

          <div className={styles.inCarddescription}>
            <p>
            Default Contract is: {<a href='https://moonbeam.moonscan.io/address/0x3F780252843bf1746A98DB70e12adEabC8256C07'> NFT Test Contract.</a>}, Just Copy this.
            </p>
          </div>




          <div>
            <input type="text" name='username' defaultValue="contract address like this :0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" className={styles.inputbox} onChange={e => setNFTContract(e.target.value)}/> 
          </div>

          <div>
            <input type="text" name='tokenID' defaultValue="1234" className={styles.inputbox} onChange={e => setTokenId(Number(e.target.value))}/> 
          </div>




          {isConnected &&           

            <>
                <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()}
                    >Enhance Me!
                </button>
                <br />
                {/* <BattlePoints/> */}
            </>
          }
          {!isConnected && 
            <ConnectButton/>
          }

        </div>

      </div>      
    )
}

export default EnhanceRole;
