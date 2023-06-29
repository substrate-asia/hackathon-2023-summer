import { usePrepareContractWrite, useContractWrite, Address, useNetwork, useAccount } from "wagmi"
import styles from '../../styles/Home.module.css';
// CIVI
import abi_registcontract from '../abis/abi_RegistContract.json';
import abi_createTeam from '../abis/abi_CreatTeam.json';
import abi_createPlayer from '../abis/abi_CreatePlayer.json';
import abi_manage from '../abis/abi_PlayerManage.json';

// import address_contracts from "../tools/ContractManage";
import address_contracts from "../../tools/ContractManage";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const CreatePlayer = () => {
    const { chain } = useNetwork()
    const { connector, isConnected } = useAccount()
    let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
    const { config } = usePrepareContractWrite({
      address: address_contracts[chainId][2],
      abi: abi_createPlayer.abi,
      functionName: 'createPlayer',
      chainId: chainId,
      args:['龙王'], // use a input box here.
      overrides: {
      },
    })

    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
      <div className={styles.card}>
        <h2>Create  A Game Character &rarr;</h2>
          <p>
          Gather your friends. Fight together in the game.
          </p>
          {!isConnected &&   
            <ConnectButton/>          
          }    

          {isConnected &&             
            <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
            >Create Player.
            </button>
          }

      </div>
    )
}
  
export default CreatePlayer;