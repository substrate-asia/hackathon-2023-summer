import { useState } from "react";
import { useAccount, useContractReads, useNetwork } from "wagmi";
// import 'bootstrap/dist/css/bootstrap.min.css'; 
// import 'bootstrap/dist/css/bootstrap.css';
// import { Table } from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';



// css
import styles from '../../styles/Home.module.css';


// CIVI
import abi_registcontract from '../abis/abi_RegistContract.json';
import abi_createTeam from '../abis/abi_CreatTeam.json';
import abi_createPlayer from '../abis/abi_CreatePlayer.json';
import abi_manage from '../abis/abi_PlayerManage.json';


// Material Table

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { dark } from "@mui/material/styles/createPalette";


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


const ChainID_MoonBeam = 0x504;


export const GameDataPanel = () => {
    // Chain ID

  let userAddress = useAccount().address;
  let [AllUser, setAllUser] = useState(0);
  let [whichTeam, setWhichTeam] = useState('0x70F657164e5b75689b64B7fd1fA275F334f28e18');
  let [teamMembers, setTeamMembers] = useState(0);
  let [playerData, setPlayerData] = useState([]);
  let [playerName, setPlayerName] = useState('Alice');
  let [Stamina, setStamina] = useState('6');
  let [Life, setLife] = useState('6');
  let [Strength, setStrength] = useState('6');
  let [Intelligence, setIntelligence] = useState('6');
  let [Attack, setAttack] = useState('6');
  let [Defense, setDefense] = useState('6');
  let [Level, setLevel] = useState(0);
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1284
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  interface Column {
    // { Name, BaseValue, EquipmentBonus, CivilizaitonLevelBonus, TeamBonus, CastleBonus, PetBonus, SUM};

    id: 'Name' | 'BaseValue' | 'EquipmentBonus' | 'CivilizaitonLevelBonus' | 'TeamBonus' | 'CastleBonus' | 'PetBonus' | 'SUM';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: (value: number) => string;
  }
  
  const columns: readonly Column[] = [
    { 
      id: 'Name', 
      label: 'Attributes', 
      minWidth: 170,
      align: 'left',
      // format: (value: number) => value.toFixed(2),

    },
    { 
      id: 'BaseValue', 
      label: 'BaseValue', 
      minWidth: 100,
      align: 'left',
      format: (value: number) => value.toFixed(2),

    },
    {
      id: 'EquipmentBonus',
      label: 'EquipmentBonus',
      minWidth: 170,
      align: 'left',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'CivilizaitonLevelBonus',
      label: 'CivilizaitonLevelBonus',
      minWidth: 170,
      align: 'left',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'TeamBonus',
      label: 'TeamBonus',
      minWidth: 170,
      align: 'left',
      format: (value: number) => value.toFixed(2),
    },  {
      id: 'CastleBonus',
      label: 'CastleBonus',
      minWidth: 170,
      align: 'left',
      format: (value: number) => value.toFixed(2),
    },  {
      id: 'PetBonus',
      label: 'PetBonus',
      minWidth: 170,
      align: 'left',
      format: (value: number) => value.toFixed(2),
    },{
      id: 'SUM',
      label: 'SUM',
      minWidth: 170,
      align: 'left',
      format: (value: number) => value.toFixed(2),
    },
  ];
  
  interface Data {
    Name: string;
    BaseValue: number;
    EquipmentBonus: number;
    CivilizaitonLevelBonus: number;
    TeamBonus: number;
    CastleBonus: number;
    PetBonus: number;     
    SUM: number;   
  }
  
  function createData(
    Name: string,
    BaseValue: number,
    EquipmentBonus: number,
    CivilizaitonLevelBonus: number,
    TeamBonus: number,
    CastleBonus: number,
    PetBonus: number,
  ): Data {
    const SUM = BaseValue + EquipmentBonus + CivilizaitonLevelBonus + TeamBonus + CastleBonus + PetBonus 
  
    return { Name, BaseValue, EquipmentBonus, CivilizaitonLevelBonus, TeamBonus, CastleBonus, PetBonus, SUM};
  }
  
  const rows = [
    createData('Stamina', 6,6,6,6,6,6),
    createData('Life', 6,6,6,6,6,6),
    createData('Strength', 6,6,6,6,6,6),
    createData('Intelligence', 6,6,6,6,6,6),
    createData('Defense', 6,6,6,6,6,6),
  ];
    // setUser(userAddress);
  const { data, isError, isLoading } = useContractReads({
  

      contracts: [
      // All user
      {
        address: RegistContract,
        abi: abi_registcontract.abi,
        functionName: 'getTotalRegist',
        chainId: ChainID_MoonBeam,     
      },
      // Player Team Info.
      {
        address: CreateCiviTeamContract,
        abi: abi_createTeam.abi,
        functionName: 'returnWitchGroupIn',
        chainId: ChainID_MoonBeam,  
        args: [userAddress]   
      },
      // Team members.
      // Player Data.
      {
        address: PlayerContract,
        abi: abi_createPlayer.abi,
        functionName: 'returnPlayerProperties',
        chainId: ChainID_MoonBeam,  
        args: [userAddress]
      },
      {
        address: CreateCiviTeamContract,
        abi: abi_createTeam.abi,
        functionName: 'returnTotalMembers',
        chainId: chainId,  
        args: [userAddress]   
      },
    ],
      onSuccess(data) {
        let AllUser = data[0] as number;
        // console.log("All user", AllUser);
        setAllUser(AllUser);

        let WhichTeam = data[1] as unknown as string;
        setWhichTeam(WhichTeam);

        let TeamMembers = data[3] as number;
        setTeamMembers(TeamMembers)
        interface PlayerObject {
          // Strength, Life, Strength, Intelligence, Attack, Defense, Level  
          name: string;
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
          let playerName = PlayerData.name  != null ? PlayerData.name as unknown as string : "NONE";
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
    
          let Level = PlayerData.Level as unknown as number;
          setLevel(Level) 

        }
      }
      
    })

    return(
    // className={styles.card}
      <div className={styles.card}>
        <h2>Game Data Panel &rarr;</h2>
          {isConnected && 
            <p>
              Total Player {chain?.name}: { AllUser.toString() }
            </p>        
          }
        <hr/>  
        <h2>Player's Team Info</h2>
          {isConnected &&
            <p className={styles.addressoverflow}>
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
        <h2>Player {playerName !== 'NONE' ? playerName: "Alice"}'s Attributes panel</h2>
        <h2>Level: {Level == 0 ? '777' : Level.toString() }</h2>


        {isConnected &&
          <Paper sx={{ width: '100%', overflow: 'hidden'}}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.Name}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        }
        {!isConnected && 
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.Name}>
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>  
        }

    </div>
  )
}

export default GameDataPanel;