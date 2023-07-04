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
        // Regist Contract deployed to 0x2f7c9039B921c0a5bdCd8037a91325c1eF92E916
        0: '0xA1Da8C3DcAc42A4551d07188FEF4C2a140772003',
        // PlayerContract deployed to 0x227826c896A0e6287cda5c97892A70A2C8433BB2
        1: '0x58177C9584Ec0f3D2F2CB384d02Bd2B7722d5a7e',
        // ManagementContract deployed to 0x607BE7855c19Ad2188E6CBA5ecD7f59471a39f0F
        2: '0x1D3E62799Aca3d978dF4329a7C0606aa96301ad1',
        // CreateCiviTeam deployed to 0x2Ba16835e0C547B8D313dc3C8B4A5f87e2dfBe8D
        3: '0xcC4fd9249D5866abCFAfd167e64B908aE4896De6',
        // BattlePoint deployed to 0x9901aA6012438cD72e1d106c7Ebf4442d2E0e8eE
        4: '0x69913Cb667Abe3CedBa99e50400B6A82904fc54D',
        // CombatPower deployed to 0x392dcD5F7c2b663c43A013457b3182caA009e12B
        5: '0xc3112BEe8Aa51805540201aE973119f6C5c92799',
        // Fight deployed to 0x7cFCD4287305B912fDA30955501B299BC91e4e8d
        6: '0xEf59448802cF48FC16B98A107A77af34a75eF808',
        // NFTTest deployed to 0x8c083D92c8C98c005D166f74B02D78d3f54F7D04
        7: '0x523637bC646f44164B2465b7e969DEb695b6102A',
        // CastleTest deployed to 0x16F46b776272586748E3594B412837BA226CC171
        8: '0xa08dA538d0769032F577a16c634393B83e9545bB'
        // Regist Contract deployed to 0xA1Da8C3DcAc42A4551d07188FEF4C2a140772003
        // PlayerContract deployed to 0x58177C9584Ec0f3D2F2CB384d02Bd2B7722d5a7e
        // ManagementContract deployed to 0x1D3E62799Aca3d978dF4329a7C0606aa96301ad1
        // CreateCiviTeam deployed to 0xe1BF113788506Dd2D7cEfbC83Ce1C8aa2992210D
        // BattlePoint deployed to 0x69913Cb667Abe3CedBa99e50400B6A82904fc54D
        // CombatPower deployed to 0xc3112BEe8Aa51805540201aE973119f6C5c92799
        // Fight deployed to 0xB06901bf420451db9633D360A2c9eA2d7215CA8a
        // NFTTest deployed to 0x523637bC646f44164B2465b7e969DEb695b6102A
        // CastleTest deployed to 0xa08dA538d0769032F577a16c634393B83e9545bB    
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


