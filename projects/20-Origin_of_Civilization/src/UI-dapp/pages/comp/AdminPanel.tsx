import { usePrepareContractWrite, useContractWrite, useAccount, useNetwork } from "wagmi"
import styles from '../../styles/Home.module.css';
// CIVI
import abi_createPlayer from '../abis/abi_CreatePlayer.json';
import abi_manage from '../abis/abi_PlayerManage.json';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import address_contracts from "../../tools/ContractManage";
import { useState } from "react";

import abi_Player from "../abis/PlayerContract.json"
import abi_PlayerManage from "../abis/Management.json"
import abi_BattlePoint from "../abis/BattlePoint.json"
import abi_Fight from "../abis/Fight.json"
import abi_CombatPower from "../abis/CombatPower.json"
import abi_CreateTeam from "../abis/CreateCiviTeam.json"

const Contract_Owner = "0x5Fc248a7c015FcFFf9A1B01DE176f90F16ABDc3F"

// Regist Contract deployed to 0xA1Da8C3DcAc42A4551d07188FEF4C2a140772003
const RegistContract = '0xA1Da8C3DcAc42A4551d07188FEF4C2a140772003';
// PlayerContract deployed to 0x58177C9584Ec0f3D2F2CB384d02Bd2B7722d5a7e
const PlayerContract = '0x58177C9584Ec0f3D2F2CB384d02Bd2B7722d5a7e'
// ManagementContract deployed to 0x1D3E62799Aca3d978dF4329a7C0606aa96301ad1
const PlayerManageContract = '0x1D3E62799Aca3d978dF4329a7C0606aa96301ad1'
// CreateCiviTeam deployed to 0xe1BF113788506Dd2D7cEfbC83Ce1C8aa2992210D
const CreateCiviTeamContract = '0xe1BF113788506Dd2D7cEfbC83Ce1C8aa2992210D'
// BattlePoint deployed to 0x69913Cb667Abe3CedBa99e50400B6A82904fc54D
const BattlePointContract = '0x69913Cb667Abe3CedBa99e50400B6A82904fc54D'
// CombatPower deployed to 0xc3112BEe8Aa51805540201aE973119f6C5c92799
const CombatPowerContract  = '0xc3112BEe8Aa51805540201aE973119f6C5c92799'
// Fight deployed to 0xB06901bf420451db9633D360A2c9eA2d7215CA8a
const FightContract  = '0xB06901bf420451db9633D360A2c9eA2d7215CA8a'
// NFTTest deployed to 0x523637bC646f44164B2465b7e969DEb695b6102A
const NFTTestContract = '0x523637bC646f44164B2465b7e969DEb695b6102A'
// CastleTest deployed to 0xa08dA538d0769032F577a16c634393B83e9545bB  
const CastleTestContract = '0xa08dA538d0769032F577a16c634393B83e9545bB'


const AdminSetPanel = () => {
  const user = useAccount().address
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1

  return(
    <>
    {isConnected && (user == Contract_Owner) && 

      <div className={styles.card}>
      <h2>Admin's Setting Panel.</h2>
        <p>
        Thera are Game Owner Functions.
        </p>

        {!isConnected && <ConnectButton/>}

        {isConnected && 

        <PlayerDataSetAllowedContract/>
        
        }

        {
          isConnected && 
          <AttributeContractSetPlayerAddress/>

        }
        {
          isConnected && 
          <BattlePointContractSetAllowedContract/>

        }
        {
          isConnected && 
          <CombatPowerContractSetPlayerDataContract/>

        }
        {
          isConnected && 
          <FightContractSetPlayerContract/>

        }
        {
          isConnected && 
          <FightContractSetBattlePointContract/>

        }

        {
          isConnected && 
          <BuildTeamCompSetRegistContract/>

        }

      </div>
    }
    </>      
  )  


}

export default AdminSetPanel;

const AttributeContractSetPlayerAddress = () => {
  const user = useAccount().address
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
  let chainId = 1284
  const [PlayerContract, setPlayerContract] = useState('')
  const { config } = usePrepareContractWrite({
    address: PlayerManageContract,
    abi: abi_PlayerManage.abi,
    functionName: 'setAllowedContract',
    chainId: chainId,
    args:[PlayerContract], // use a input box here.
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
      }
    })
  
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
        <div>
          <p>
          Attribute Management Contract Set Playerdata Address
          </p>

          <div>
          <input type="text" name='username' defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" className={styles.inputbox} onChange={e => setPlayerContract(e.target.value)}/> 
          </div> 

          <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
          >Set Player Contract.
          </button>
        </div>
    )  


}

const BuildTeamCompSetRegistContract = () => {

  const user = useAccount().address
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
  let chainId = 1284
  const [registContract, setRegistContract] = useState('')
  const { config } = usePrepareContractWrite({
    address: CreateCiviTeamContract,
    abi: abi_CreateTeam.abi,
    functionName: 'setRegistContract',
    chainId: 0x504,
    args:[registContract], // use a input box here.
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
      }
    })
  
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
        <div>
          <p>
          BuildTeam Contract Set AllowedContract 
          </p>

          <div>
          <input type="text" name='username' defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" className={styles.inputbox} onChange={e => setRegistContract(e.target.value)}/> 
          </div> 

          <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
          >Set Regist Contract
          </button>
        </div>
    )    

}

const BattlePointContractSetAllowedContract = () => {

  const user = useAccount().address
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
  let chainId = 1284
  const [allowedContract, setAllowedContract] = useState('')
  const { config } = usePrepareContractWrite({
    address: BattlePointContract,
    abi: abi_BattlePoint.abi,
    functionName: 'setAllowedContract',
    chainId: chainId,
    args:[allowedContract], // use a input box here.
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
      }
    })
  
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
        <div>
          <p>
          BattlePoint Contract Set AllowedContract 
          </p>

          <div>
          <input type="text" name='username' defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" className={styles.inputbox} onChange={e => setAllowedContract(e.target.value)}/> 
          </div> 

          <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
          >Set AllowedContract
          </button>
        </div>
    )    

}

const CombatPowerContractSetPlayerDataContract = () => {

  const user = useAccount().address
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
  let chainId = 1284
  const [PlayerContract, setPlayerContract] = useState('')
  const { config } = usePrepareContractWrite({
    address: CombatPowerContract,
    abi: abi_CombatPower.abi,
    functionName: 'setAllowedContract',
    chainId: chainId,
    args:[PlayerContract], // use a input box here.
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
      }
    })
  
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
        <div>
          <p>
          CombatPower Contract Set Player Data Contract
          </p>

          <div>
          <input type="text" name='username' defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" className={styles.inputbox} onChange={e => setPlayerContract(e.target.value)}/> 
          </div> 

          <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
          >Set Player Contract.
          </button>
        </div>
    )  


}

const FightContractSetPlayerContract = () => {

  const user = useAccount().address
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
  let chainId = 1284
  const [allowedContract, setAllowedContract] = useState('')
  const { config } = usePrepareContractWrite({
    address: FightContract,
    abi: abi_Fight.abi,
    functionName: 'setAllowedContract',
    chainId: chainId,
    args:[allowedContract], // use a input box here.
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
      }
    })
  
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
        <div>
          <p>
          Fight Contract Set Player Contract
          </p>

          <div>
          <input type="text" name='username' defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" className={styles.inputbox} onChange={e => setAllowedContract(e.target.value)}/> 
          </div> 

          <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
          >Set Player Contract.
          </button>
        </div>
    )    


}

const FightContractSetBattlePointContract = () => {


  const user = useAccount().address
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
  let chainId = 1284
  const [battlePointContract, setBattlePointContract] = useState('')
  const { config } = usePrepareContractWrite({
    address: FightContract,
    abi: abi_Fight.abi,
    functionName: 'setAllowedContract',
    chainId: chainId,
    args:[battlePointContract], // use a input box here.
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
      }
    })
  
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
        <div>
          <p>
          Fight Contract Set BattlePoint Contract
          </p>

          <div>
          <input type="text" name='username' defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" className={styles.inputbox} onChange={e => setBattlePointContract(e.target.value)}/> 
          </div> 

          <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
          >Set BattlePoint Contract
          </button>
        </div>
    )    

  
}

// createPlayer contract set a Manager address - (Manager contract address)
const PlayerDataSetAllowedContract = () => {
  const user = useAccount().address
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
  let chainId = 1284
  const [allowedContract, setAllowedContract] = useState('')
  const { config } = usePrepareContractWrite({
    address: PlayerContract,
    abi: abi_Player.abi,
    functionName: 'setAllowedContract',
    chainId: chainId,
    args:[allowedContract.toString()], // use a input box here.
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
      }
    })
  
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
      <div>
        <p>
        PlayerData Contract Set Allowed Contract
        </p>   

        <div>
          <input type="text" name='username' defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" className={styles.inputbox} onChange={e => setAllowedContract(e.target.value)}/> 
        </div>     

        <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
        >Set AllowedContract Manager.
        </button>
      </div>
    )  
}
  
// export default PlayerDataSetAllowedContract;