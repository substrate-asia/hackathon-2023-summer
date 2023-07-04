import { usePrepareContractWrite, useContractWrite, useAccount, useNetwork } from "wagmi"
import styles from '../../styles/Home.module.css';
// CIVI
import abi_registcontract from '../abis/abi_RegistContract.json';
import abi_createTeam from '../abis/abi_CreatTeam.json';
import abi_createPlayer from '../abis/abi_CreatePlayer.json';
import abi_manage from '../abis/abi_PlayerManage.json';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import address_contracts from "../../tools/ContractManage";


// RegistContract
const address_RegistContract = '0x5eA4f6EBD22241e0605eB093DA55136Ad622eB9a';
// Create Team.
const address_CreateCiviTeam = '0xF262cD1e339cdDd6dC5e5Ff2b5718872d406300A';
// Create Player
const address_CreatePlayer   = '0x59b48fEf2C699a2f199125449Eae527D84B152aA';
// Manage Contract
const address_Manage         = '0x2F71993556F74a251A3F22bdb8b519D070564B74';


export const CreateTeam = () => {
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1

  const { config } = usePrepareContractWrite({
    address: address_contracts[chainId][2],
    abi: abi_createTeam.abi,
    functionName: 'createGroup',
    chainId: chainId,
    args:["炸天帮","最强帮会",["0xea0A6E3c511bbD10f4519EcE37Dc24887e11b55d"]],
    overrides: {
    }
  })
  
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
      <div className={styles.card}>
        <h2>Build A Team &rarr;</h2>
          <p>
          Gather your friends. Fight together in the game.
          </p>

          {!isConnected && <ConnectButton/>}
          {isConnected && 
            <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
            >Create Team.
            </button>                    
          }
  
      </div>
    )

}
  

  export default CreateTeam;