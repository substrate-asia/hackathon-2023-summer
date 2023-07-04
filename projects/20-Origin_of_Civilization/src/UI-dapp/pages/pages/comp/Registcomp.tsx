
import styles from '../../styles/Home.module.css';
// CIVI
import abi_registcontract from '../abis/abi_RegistContract.json';
import { usePrepareContractWrite, useContractWrite, useAccount, useNetwork, useConnect, useDisconnect, useSwitchNetwork } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import address_contracts from "../../tools/ContractManage";


export const UserRegist = () => {
  const disconnected = useDisconnect()
  const { connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1  

  const { config } = usePrepareContractWrite({
    address: address_contracts[chainId][0],
    abi: abi_registcontract.abi,
    functionName: 'regist',
    chainId: chainId,
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
    }
  })
    
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
    
    return(
      <div className={styles.card}>

        <h2>Regist As User &rarr;</h2>
          <p>
            Beginner gift packs will be distributed to registered users.
          </p>
          {isConnected &&           
            <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()}
            >Regist Now
            </button>
          }
          {!isConnected && 
            <ConnectButton/>
          }
      </div>      
    )
}

export default UserRegist;
  