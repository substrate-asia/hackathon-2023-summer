// import { useNetwork } from "wagmi"

import { Address } from "wagmi";

// let ChainID = useNetwork().chain?.id as unknown as string

interface Contracts {
    [contractIndex: number]: Address; // 用于存储合约名和地址的键值对
  }
  
interface Chain {
[chainId: number]: Contracts; // 用于存储链ID和合约键值对的键值对
}
  
let address_contracts: Chain = {
    1284: {
        // address_RegistContract 
        0: '0x5eA4f6EBD22241e0605eB093DA55136Ad622eB9a' as Address,

        // address_CreateCiviTeam 
        1: '0xF262cD1e339cdDd6dC5e5Ff2b5718872d406300A',

        // address_CreatePlayer   
        2: '0x59b48fEf2C699a2f199125449Eae527D84B152aA',

        // address_Manage         
        3: '0x2F71993556F74a251A3F22bdb8b519D070564B74',  
    },
    1 : {
        // address_RegistContract 
        0: '0x5eA4f6EBD22241e0605eB093DA55136Ad622eB01',
        // address_CreateCiviTeam 
        1: '0xF262cD1e339cdDd6dC5e5Ff2b5718872d406300A',
        // address_CreatePlayer   
        2: '0x59b48fEf2C699a2f199125449Eae527D84B152aA',
        // address_Manage         
        3: '0x2F71993556F74a251A3F22bdb8b519D070564B74',  
    },
    100: {
        // address_RegistContract 
        0: '0x5eA4f6EBD22241e0605eB093DA55136Ad622e100',
        // address_CreateCiviTeam 
        1: '0xF262cD1e339cdDd6dC5e5Ff2b5718872d406300A',
        // address_CreatePlayer   
        2: '0x59b48fEf2C699a2f199125449Eae527D84B152aA',
        // address_Manage         
        3: '0x2F71993556F74a251A3F22bdb8b519D070564B74',  
    },
    56: {
        // address_RegistContract 
        0: '0x5eA4f6EBD22241e0605eB093DA55136Ad622eB56',
        // address_CreateCiviTeam 
        1: '0xF262cD1e339cdDd6dC5e5Ff2b5718872d406300A',
        // address_CreatePlayer   
        2: '0x59b48fEf2C699a2f199125449Eae527D84B152aA',
        // address_Manage         
        3: '0x2F71993556F74a251A3F22bdb8b519D070564B74',  
    },
};
  
//   let chain = getContracts(); // 返回一个Chain对象
//   console.log(chain['chain1']['contractA']); // 0x1234567890abcdef
//   console.log(chain['chain2']['contractD']); // 0xfedcba0987654321

export default address_contracts;


