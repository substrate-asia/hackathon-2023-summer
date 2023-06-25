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

// interface Column {
//   id: 'name' | 'code' | 'population' | 'size' | 'density' | 'density1' | 'density2';
//   label: string;
//   minWidth?: number;
//   align?: 'right';
//   format?: (value: number) => string;
// }

// const columns: readonly Column[] = [
//   { id: 'name', label: 'Name', minWidth: 170 },
//   { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
//   {
//     id: 'population',
//     label: 'Population',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => value.toLocaleString('en-US'),
//   },
//   {
//     id: 'size',
//     label: 'Size\u00a0(km\u00b2)',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => value.toLocaleString('en-US'),
//   },
//   {
//     id: 'density',
//     label: 'Density',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => value.toFixed(2),
//   },  {
//     id: 'density1',
//     label: 'Density',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => value.toFixed(2),
//   },  {
//     id: 'density2',
//     label: 'Density',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => value.toFixed(2),
//   },
// ];

// interface Data {
//   name: string;
//   code: string;
//   population: number;
//   size: number;
//   density: number;
//   density1: number;
//   density2: number;

// }

// function createData(
//   name: string,
//   code: string,
//   population: number,
//   size: number,
// ): Data {
//   const density = population / size;
//   const density1 = population / size;
//   const density2 = population / size;

//   return { name, code, population, size, density, density1, density2 };
// }

// const rows = [
//   createData('India', 'IN', 1324171354, 3287263),
//   createData('China', 'CN', 1403500365, 9596961),
//   createData('Italy', 'IT', 60483973, 301340),
//   createData('United States', 'US', 327167434, 9833520),
//   createData('Canada', 'CA', 37602103, 9984670),
//   createData('Australia', 'AU', 25475400, 7692024),
//   createData('Germany', 'DE', 83019200, 357578),
//   createData('Ireland', 'IE', 4857000, 70273),
//   createData('Mexico', 'MX', 126577691, 1972550),
//   createData('Japan', 'JP', 126317000, 377973),
//   createData('France', 'FR', 67022000, 640679),
//   createData('United Kingdom', 'GB', 67545757, 242495),
//   createData('Russia', 'RU', 146793744, 17098246),
//   createData('Nigeria', 'NG', 200962417, 923768),
//   createData('Brazil', 'BR', 210147125, 8515767),
// ];

// export function StickyHeadTable() {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align}
//                   style={{ minWidth: column.minWidth }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row) => {
//                 return (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
//                     {columns.map((column) => {
//                       const value = row[column.id];
//                       return (
//                         <TableCell key={column.id} align={column.align}>
//                           {column.format && typeof value === 'number'
//                             ? column.format(value)
//                             : value}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 );
//               })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={rows.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// }


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
  let [Level, setLevel] = useState('6');
  const { chain } = useNetwork()
  const { connector, isConnected } = useAccount()
  let chainId = chain?.id as number == (1 || 56 || 100 || 1284) ? chain?.id as number : 1
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
        // console.log("All user", AllUser);
        // setAllUser(AllUser);

        let WhichTeam = data[1] as unknown as string;
        // setWhichTeam(WhichTeam);

        let TeamMembers = data[3] as number;
        // console.log("Team Players", AllUser);
        // setTeamMembers(TeamMembers);



        // Player's Properties
        // console.log("Player DATA: ", data[2])

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
            <p className={styles.overflow}>
            {/* Team Owner: {whichTeam} */}
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
        <h2>Level: {Level !== '0' ? Level.toString() : "666"   }</h2>


        {isConnected &&
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