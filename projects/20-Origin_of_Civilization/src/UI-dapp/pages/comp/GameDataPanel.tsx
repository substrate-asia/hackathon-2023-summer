import { useState } from "react";
import { Table } from "react-bootstrap";
import { useAccount, useContractReads, useNetwork } from "wagmi";

// css
import styles from '../../styles/Home.module.css';


// CIVI
import abi_registcontract from '../abis/abi_RegistContract.json';
import abi_createTeam from '../abis/abi_CreatTeam.json';
import abi_createPlayer from '../abis/abi_CreatePlayer.json';
import abi_manage from '../abis/abi_PlayerManage.json';


// RegistContract
const address_RegistContract = '0x5eA4f6EBD22241e0605eB093DA55136Ad622eB9a';
// Create Team.
const address_CreateCiviTeam = '0xF262cD1e339cdDd6dC5e5Ff2b5718872d406300A';
// Create Player
const address_CreatePlayer   = '0x59b48fEf2C699a2f199125449Eae527D84B152aA';
// Manage Contract
const address_Manage         = '0x2F71993556F74a251A3F22bdb8b519D070564B74';

const ChainID_MoonBeam = 0x504;


export const GameDataPanel = () => {
    // Chain ID

  let userAddress = useAccount().address;
  let [AllUser, setAllUser] = useState(0);
  let [whichTeam, setWhichTeam] = useState('0x0000000000000000000000000000000');
  let [teamMembers, setTeamMembers] = useState(0);
  let [playerData, setPlayerData] = useState([]);
  let [playerName, setPlayerName] = useState('Alice');
  let [Stamina, setStamina] = useState('6');
  let [Life, setLife] = useState('6');
  let [Strength, setStrength] = useState('6');
  let [Intelligence, setIntelligence] = useState('6');
  let [Attack, setAttack] = useState('6');
  let [Defense, setDefense] = useState('6');
  let [Level, setLevel] = useState('6');
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1

    // setUser(userAddress);
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      // All user
      {
        address: address_RegistContract,
        abi: abi_registcontract.abi,
        functionName: 'getTotalRegist',
        chainId: ChainID_MoonBeam,     
      },
      // Player Team Info.
      {
        address: address_CreateCiviTeam,
        abi: abi_createTeam.abi,
        functionName: 'returnWitchGroupIn',
        chainId: ChainID_MoonBeam,  
        args: [userAddress]   
      },
      // Team members.
      // Player Data.
      {
        address: address_CreatePlayer,
        abi: abi_createPlayer.abi,
        functionName: 'returnPlayerProperties',
        chainId: ChainID_MoonBeam,  
        args: [userAddress]
      },
      {
        address: address_CreateCiviTeam,
        abi: abi_createTeam.abi,
        functionName: 'returnTotalMembers',
        chainId: chainId,  
        args: [userAddress]   
      },

    ],
    onSuccess(data) {
      let AllUser = data[0] as number;
      console.log("All user", AllUser);
      // setAllUser(AllUser);

      let WhichTeam = data[1] as unknown as string;
      // setWhichTeam(WhichTeam);

      let TeamMembers = data[3] as number;
      console.log("Team Players", AllUser);
      // setTeamMembers(TeamMembers);



      // Player's Properties
      console.log("Player DATA: ", data[2])

      interface PlayerObject {
        // Strength, Life, Strength, Intelligence, Attack, Defense, Level  
        Name: string;
        Stamina: number;
        Life: number;
        Strength: number;
        Intelligence: number;
        Attack: number;
        Defense: number;
        Level: number;
      }
      let PlayerData = data[2] as PlayerObject;
      if (PlayerData !== null) {
        let playerName = PlayerData.Name  != null ? PlayerData.Name as unknown as string : "NONE";
        setPlayerName(playerName)
        let stamina = PlayerData.Stamina as unknown as string;
        setStamina(stamina)
  
        let life = PlayerData.Life as unknown as string;
        setLife(life)
  
        let Strength = PlayerData.Strength as unknown as string;
        setStrength(Strength);
  
        let Intelligence = PlayerData.Intelligence as unknown as string;
        setIntelligence(Intelligence);
  
        let Attack = PlayerData.Attack as unknown as string;
        setAttack(Attack);
  
        let Defense = PlayerData.Defense as unknown as string;
        setDefense(Defense);
  
        let Level = PlayerData.Level as unknown as string;
        setLevel(Level) 

      }
      }
    })

  return(
    <div className={styles.card}>
      <h2>Game Data Panel &rarr;</h2>
        {isConnected && 
          <p>
            Total Player {chain?.name}: { AllUser.toString() }
          </p>        
        }
      <hr/>  
      <h2>Player's Team Info</h2>
        {isConnected && chainId == 0x504 &&
          <p>
          Team Owner: {whichTeam}
          </p>        
        }
      <hr/>
      <h2>Player's Team Members</h2>

      {isConnected && 
        <p>
          Team Members:{teamMembers !== null && teamMembers.toString()} Players.
        </p>      
      }

      <hr/>
      <h2>Player Properties panel</h2>

      {isConnected &&
              <Table  bordered hover responsive="sm">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Base Value</th>
                  <th>Equipment Bonus</th>
                  <th>Civilizaiton Level</th>
                  <th>Team Bonus</th>
                  <th>Castle Bonus</th>
                  <th>Pet Bonus</th>
                  <th>SUM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{playerName}</td>
                </tr>
                <tr>
                  <td>Stamina</td>
                  <td>{Stamina.toString()}</td>
                  <td>{Stamina.toString()}</td>
      
                </tr>
                <tr>
                  <td>Life</td>
                  <td>{Life.toString()}</td>
                </tr>
                <tr>
                  <td>Strength</td>
                  <td>{Strength.toString()}</td>
                </tr>
                <tr>
                  <td>Intelligence</td>
                  <td>{Intelligence.toString()}</td>
                </tr>
                <tr>
                  <td>Defense</td>
                  <td>{Defense.toString()}</td>
                </tr>
                <tr>
                  <td>Level</td>
                  <td>{Level.toString()}</td>
                </tr>
              </tbody>
            </Table>      
      }
    </div>
  )
}

export default GameDataPanel;