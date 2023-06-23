import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import NoSSR from 'react-no-ssr';
import Table from 'react-bootstrap/Table';

import styles from '../styles/Home.module.css';
import { BigNumber, ethers } from 'ethers';
import { usePrepareContractWrite, useContractWrite, useAccount, useContractReads } from 'wagmi';
import { useState } from 'react';
import favicon from './favicon.ico';
import Container from 'react-bootstrap/Container';
import { faAws, faBitcoin, faGithub, faGoogle, faInstagram, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'bootstrap/dist/css/bootstrap.min.css';

// CIVI
import abi_registcontract from './abis/abi_RegistContract.json';
import abi_createTeam from './abis/abi_CreatTeam.json';
import abi_createPlayer from './abis/abi_CreatePlayer.json';
import abi_manage from './abis/abi_PlayerManage.json';
import { noSSR } from 'next/dynamic';

// RegistContract
const address_RegistContract = '0x5eA4f6EBD22241e0605eB093DA55136Ad622eB9a';
// Create Team.
const address_CreateCiviTeam = '0xF262cD1e339cdDd6dC5e5Ff2b5718872d406300A';
// Create Player
const address_CreatePlayer   = '0x59b48fEf2C699a2f199125449Eae527D84B152aA';
// Manage Contract
const address_Manage         = '0x2F71993556F74a251A3F22bdb8b519D070564B74';



export const FirstCard = () => {

  return(
    <div className={styles.card}>
      <h2>Origin of Civilization &rarr;</h2>
        <p>
          A GameFi across multiChain, and Build AAA 3D Games For it.
        </p>
    </div>
  )
}


export const UserRegist = () => {
  const { config } = usePrepareContractWrite({
    address: address_RegistContract,
    abi: abi_registcontract.abi,
    functionName: 'regist',
    chainId: 0x504,
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

        <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
        >Regist Now
        </button>
    </div>
  )
}

export const CreateTeam = () => {
  const { config } = usePrepareContractWrite({
    address: address_CreateCiviTeam,
    abi: abi_createTeam.abi,
    functionName: 'createGroup',
    chainId: 0x504,
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

        <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
        >Create Team.
        </button>
    </div>
  )
}

export const CreatePlayer = () => {
  const { config } = usePrepareContractWrite({
    address: address_CreatePlayer,
    abi: abi_createPlayer.abi,
    functionName: 'createPlayer',
    chainId: 0x504,
    args:['龙王'], // use a input box here.
    overrides: {
    }
  })

  const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)

  return(
    <div className={styles.card}>
      <h2>Create  A Game Character &rarr;</h2>
        <p>
        Gather your friends. Fight together in the game.
        </p>

        <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
        >Create Player.
        </button>
    </div>
  )
}

export const AllowedContract = () => {
  const { config } = usePrepareContractWrite({
    address: address_CreatePlayer,
    abi: abi_createPlayer.abi,
    functionName: 'setAllowedContract',
    chainId: 0x504,
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

        <button className={styles.button} disabled={isLoading || !write} onClick={() => write?.()} 
        >Set AllowedContract Manager.
        </button>
    </div>
  )
}

export const GameDataPanel = () => {
    // Chain ID

  let userAddress = useAccount().address;
  let [AllUser, setAllUser] = useState(0);
  let [whichTeam, setWhichTeam] = useState('0');
  let [teamMembers, setTeamMembers] = useState(0);
  let [playerData, setPlayerData] = useState([]);
  let [playerName, setPlayerName] = useState('');
  let [Stamina, setStamina] = useState('');
  let [Life, setLife] = useState('');
  let [Strength, setStrength] = useState('');
  let [Intelligence, setIntelligence] = useState('');
  let [Attack, setAttack] = useState('');
  let [Defense, setDefense] = useState('');
  let [Level, setLevel] = useState('');
  // let [user, setUser] = useState('0');

  if (userAddress?.length === 42){
    // setUser(userAddress);

    const { data, isError, isLoading } = useContractReads({
      contracts: [
        // All user
        {
          address: address_RegistContract,
          abi: abi_registcontract.abi,
          functionName: 'getTotalRegist',
          chainId: 0x504,     
        },
        // Player Team Info.
        {
          address: address_CreateCiviTeam,
          abi: abi_createTeam.abi,
          functionName: 'returnWitchGroupIn',
          chainId: 0x504,  
          args: [userAddress]   
        },
        // Team members.
        // Player Data.
        {
          address: address_CreatePlayer,
          abi: abi_createPlayer.abi,
          functionName: 'returnPlayerProperties',
          chainId: 0x504,  
          args: [userAddress]
        },

      ],
      onSuccess(data) {
        let AllUser = data[0] as number;
        console.log("All user", AllUser);
        setAllUser(AllUser);
  
        let WhichTeam = data[1] as unknown as string;
        setWhichTeam(WhichTeam);
  
  
        // Player's Properties
        let PlayerData = data[2] as [];
        // setPlayerData(PlayerData);
        // console.log("PlayerData: ", PlayerData[1])

        let playerName = PlayerData.name as unknown as string;
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
      })
    }
    if ((whichTeam !== null) || whichTeam !== '0x0000000000000000000000000000000000000000'){
      const { data, isError, isLoading } = useContractReads({
        contracts: [  
          {
            address: address_CreateCiviTeam,
            abi: abi_createTeam.abi,
            functionName: 'returnTotalMembers',
            chainId: 0x504,  
            args: [whichTeam]   
          },
        ],
        onSuccess(data) {
          let TeamMembers = data[0] as number;
          console.log("Team Players", AllUser);
          setTeamMembers(TeamMembers);
        }
  
      })
      
    }

  


  return(
    <div className={styles.card}>
      <h2>Game Data Panel &rarr;</h2>
        <p>
          Total Player (MoonBeamChain): { AllUser !== null && AllUser.toString()}
        </p>
      <hr/>  
      <h2>Player's Team Info</h2>
        <p>
          Team Owner: {whichTeam}
        </p>
      <hr/>
      <h2>Player's Team Members</h2>
      <p>
        Team Members:{teamMembers !== null && teamMembers.toString()} Players.
      </p>

      <hr/>
      <h2>Player Properties panel</h2>
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
    </div>
  )
}

function isNumeric(str: string) {
  return /^\d*\.?\d+$/.test(str);
}


export const Duration = () => {
  function formatDuration(seconds: number): string {
    const daySeconds = 24 * 60 * 60;
    const hourSeconds = 60 * 60;
    const minuteSeconds = 60;
  
    const days = Math.floor(seconds / daySeconds);
    const hours = Math.floor((seconds % daySeconds) / hourSeconds);
    const minutes = Math.floor(((seconds % daySeconds) % hourSeconds) / minuteSeconds);
    const remainingSeconds = seconds % minuteSeconds;
  
    const dayString = days > 0 ? `${days} Day` : '';
    const hourString = hours > 0 ? `${hours} Hour` : '';
    const minuteString = minutes > 0 ? `${minutes} Min` : '';
    const secondString = remainingSeconds > 0 ? `${remainingSeconds} Sec` : '';
  
    // return `${dayString} ${hourString} ${minuteString} ${secondString}`;
    return `${dayString}`;
  }

  // No
  function secondsSince(startDateTime: string): number {
    /**
     * 
     * @param startDateTime 
     * @returns seconds
     */
    const startDate = new Date(startDateTime);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);
    return seconds;
  }
  
  const startDateTime = '2023-05-17 11:14:40';
  const seconds = secondsSince(startDateTime);


  return (
    <div>
      <script>

      </script>
      Start From {'2023-06-06'}, Already Run {formatDuration(seconds)}

    </div>
  )

}

const Footer = () => {

  return(
    <Container fluid className={styles.footerContainer}>
    <div className="copyright">&copy; 2023 Origin of Civilization Team. All Right Reserved.</div>
    <div className={styles.socials}>
        <div>
          <a href="https://github.com">
          <FontAwesomeIcon icon={faYoutube} className={styles.socialsicon} spin></FontAwesomeIcon>
          </a>
        </div>
        <span className={styles.span}></span>

        <div>
          <a href="https://github.com">
          <FontAwesomeIcon icon={faGithub} className={styles.socialsicon} spin></FontAwesomeIcon>
          </a>
        </div>
        <span className={styles.span}></span>


        <div>
          <a href="https://github.com">
          <FontAwesomeIcon icon={faTwitter} className={styles.socialsicon}></FontAwesomeIcon>
          </a>
        </div>
        <span className={styles.span}></span>


        <div>
          <a href="https://github.com">
          <FontAwesomeIcon icon={faInstagram} className={styles.socialsicon}></FontAwesomeIcon>
          </a>
        </div>
        <span className={styles.span}></span>


        <div>
          <a href="https://github.com">
          <FontAwesomeIcon icon={faBitcoin} className={styles.socialsicon}></FontAwesomeIcon>
          </a>
        </div>

    </div>
  </Container>

  )
}

const Home: NextPage = () => (
  <div className={styles.container}>
    <Head>
      <title>Origin of Civilization</title>
      <meta
        content="Generated by @rainbow-me/create-rainbowkit"
        name="description" />
      <link href={favicon.src} rel="icon" />
    </Head>
    <main className={styles.main}>
    <ConnectButton />
    <NoSSR>
      <div className={styles.grid}>
            <FirstCard/>
            <UserRegist/>
            <CreateTeam/>
            <AllowedContract/>
            <CreatePlayer/>
            <GameDataPanel/>
            <Footer/>
      </div>        
    </NoSSR>
  
    </main>

    
  </div>
);

export default Home;
