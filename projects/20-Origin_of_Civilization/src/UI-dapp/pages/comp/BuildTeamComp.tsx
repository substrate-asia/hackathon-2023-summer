import { usePrepareContractWrite, useContractWrite, useAccount, useNetwork, useContractReads, useDisconnect } from "wagmi"
import styles from '../../styles/Home.module.css';
// CIVI
import abi_registcontract from '../abis/abi_RegistContract.json';
import abi_createTeam from '../abis/abi_CreatTeam.json';
import abi_createPlayer from '../abis/abi_CreatePlayer.json';
import abi_manage from '../abis/abi_PlayerManage.json';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import address_contracts from "../../tools/ContractManage";
import { useState } from "react";
import { BigNumber } from "ethers";


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

// Regist Contract deployed to 0x633470Bb3696E5Db3eC1f5f747dd1Fe27e0A908C
// PlayerContract deployed to 0x7E60D0Bc3D539e6577cf1C21AD251ABB5990897E
// ManagementContract deployed to 0x3Ca5E76400a9D1aAbf32866d51f9ED4AcCDedc7b
// CreateCiviTeam deployed to 0x432B53f20732Aba0BFc6230Bb3191Fd9c0884fF4
// BattlePoint deployed to 0x8FE38954c85974E55F10b7e6ea611A7250Fb8a1a
// CombatPower deployed to 0x9eDb6AF43EeA4633EA290E01c9D9fC62E1d28363
// Fight deployed to 0x8529742DaC259f440F9Acd758C9899B499Fe730c
// NFTTest deployed to 0x3F780252843bf1746A98DB70e12adEabC8256C07
// CastleTest deployed to 0x3a013E4eB2fbe64d5226Ef5804149cFCFd9ac86c

const YourTeamInfo = () => {
  const disconnected = useDisconnect()
  const { connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  const userAddress = useAccount().address

  // let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1 
  let chainId = 1284
  const [whichTeam, setWhichTeam] = useState('')
  const [TeamName, setTeamName] = useState('炸天帮')
  const [TeamDec, setTeamDec] = useState('')
  const [TeamMembers,setTeamMembers] = useState(0)

  const { data, isError, isLoading } = useContractReads({
      contracts: [
          {
            address: CreateCiviTeamContract,
            abi: abi_createTeam.abi,
            functionName: 'returnWitchGroupIn',
            chainId: chainId,
            args:[userAddress]
          },
          {
            address: CreateCiviTeamContract,
            abi: abi_createTeam.abi,
            functionName: 'CiviTeams',
            chainId: chainId,
            args:[whichTeam]
          },


      ],
      onSuccess(data) {
          let team = data[0] as unknown as string 
          setWhichTeam(team)
          console.log("WhichTeam: ", team)
          interface info {
            name:string,
            description: string,
            totalMembers: number
          }
          if (data[1] != null) {
            let teaminfo = data[1] as unknown as info
            console.log("Team: ::::::::", teaminfo)
            let teamname = teaminfo.name ==(null || '') ? "Strong Team": teaminfo.name
            setTeamName(teamname)
            let teamDecs = teaminfo.description == (null || '') ? "Strong Team!" : teaminfo.description            
            setTeamDec(teamDecs)
            let teamPlayers = Number(teaminfo.totalMembers) == 0 ? 6666666666 : Number(teaminfo.totalMembers)
            setTeamMembers(teamPlayers) 

          }
        },    
      }
  
    )
    return (
      <div className={styles.makeCenter}>
      
        <div className={styles.addressoverflow}>
          <h2> You're in The Team: </h2>
          {whichTeam} 
        </div>

        <h2> Team Name: {TeamName}</h2>
        <h2> Team Desc: {TeamDec}</h2>
        <h2> Team Members: {TeamMembers}</h2>
      
      </div>
    )

}

const JoinTeam = () => {
  const [targetTeam, setTargetTeam] = useState("")
  console.log("Team Address.", targetTeam)
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = (chain?.id as number == (1 || 56 || 100 || 1284)) ? chain?.id as number : 1284
  let chainId = 0x504
  const { config } = usePrepareContractWrite({
    address: CreateCiviTeamContract,
    abi: abi_createTeam.abi,
    functionName: 'joinGroup',
    chainId: chainId,
    args:[targetTeam],
    overrides: {
    }
  })

  const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)

  return(
    <div>
        <p>
          Choose a Strong Team to Join Them!
        </p>
  
        <input type="text" name='setteam' defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" defaultChecked className={styles.inputboxaddress} onChange={e => setTargetTeam(e.target.value)}/> 

        <br/>
        <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
          >Join Team.
        </button> 

        <YourTeamInfo/>                  

    </div>

  )
}


const CreateTeam = () => {
  const [teamName, setTeam] = useState("炸天帮")
  const [teamDescription, setTeamDescription] = useState("天下第一")
  console.log("Team,TeamDes", teamName,teamDescription)
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  // let chainId = (chain?.id as number == (1 || 56 || 100 || 1284)) ? chain?.id as number : 1284
  let chainId = 1284


  const { config } = usePrepareContractWrite({
    address: CreateCiviTeamContract,
    abi: abi_createTeam.abi,
    functionName: 'createGroup',
    chainId: chainId,
    args:[teamName,teamDescription],
    overrides: {
    }
  })
  
  const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
  
  return(
    <div className={styles.card}>
      <div className={styles.inCardContainer}>
        <div>
          <h1 className={styles.inCardTitle}>
          Build A Team | Join A Team.
          </h1>
        </div>

        <div className={styles.inCarddescription}>
          <p>
          Gather your friends. Fight together in the game.
          </p>
        </div>

        <div>
          <input type="text" name='team' defaultValue="炸天帮" className={styles.inputbox} onChange={e => setTeam(e.target.value)}/> 
        </div>

        <div>
          <input type="text" name='teamDescription' defaultValue="最强帮会" className={styles.inputbox} onChange={e => setTeamDescription(e.target.value)}/> 
        </div>



        {!isConnected && <ConnectButton/>}
        {isConnected && 
          <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()}
          // <button className={styles.button} onClick={() => write?.()}
          >Create Team.
          </button>                    
        }
        </div>

        <hr/>
        <p>
          Don't want to create a team?
        </p>

        <JoinTeam/>

    </div>
  )

}
  

  export default CreateTeam;