import { usePrepareContractWrite, useContractWrite, useAccount, useNetwork } from "wagmi"
import styles from '../../styles/Home.module.css';
// CIVI
import abi_createPlayer from '../abis/abi_CreatePlayer.json';
import abi_manage from '../abis/abi_PlayerManage.json';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import address_contracts from "../../tools/ContractManage";

// createPlayer contract set a Manager address - (Manager contract address)
export const AllowedContract = () => {
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
  const { config } = usePrepareContractWrite({
    address: address_contracts[chainId][3],
    abi: abi_createPlayer.abi,
    functionName: 'setAllowedContract',
    chainId: chainId,
    args:["0x2F71993556F74a251A3F22bdb8b519D070564B74"], // use a input box here.
    overrides: {
      // value: ethers.utils.parseEther('0.05'),
      // gasLimit:200000,
      // gasPrice: ethers.utils.parseUnits('1.2','gwei'),
      }
    })
  
    const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
    return(
      <div className={styles.card}>
        <h2>Owner Set AllowedContract &rarr;</h2>
          <p>
          Game Owner Functions.
          </p>

          {!isConnected && <ConnectButton/>}

          {isConnected && 
            
            <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
            >Set AllowedContract Manager.
            </button>
          }
      </div>
    )  
}
  
export default AllowedContract;