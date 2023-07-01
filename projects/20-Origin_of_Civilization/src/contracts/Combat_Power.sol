// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./Playerdata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract CombatPower is Ownable{
    struct Attribute{
        uint256 Stamina;
        uint256 Life;
        uint256 Strength;
        uint256 Intelligence;
        uint256 Attack;
        uint256 Defense;
        uint256 Level;
    }

    mapping(address => Attribute) public Attributelist;
    address playerContractAddress;

    PlayerContract playerContract = PlayerContract(0xd9145CCE52D386f254917e481eB44e9943F39138);

    
    
    function PlayerContractAddress(address _ContractAddress_playerData) public onlyOwner {
        playerContractAddress = _ContractAddress_playerData;
    }

    function returnPlayerCombatPower(address _playerAddress) public view returns(uint256) {
        uint256 Stamina = playerContract.returnPlayerProperties(_playerAddress).Stamina;
        uint256 Life = playerContract.returnPlayerProperties(_playerAddress).Life;
        uint256 Strength = playerContract.returnPlayerProperties(_playerAddress).Strength;
        uint256 Intelligence = playerContract.returnPlayerProperties(_playerAddress).Intelligence;
        uint256 Attack = playerContract.returnPlayerProperties(_playerAddress).Attack;
        uint256 Defense = playerContract.returnPlayerProperties(_playerAddress).Defense;
        uint256 Level = playerContract.returnPlayerProperties(_playerAddress).Level;

        uint256 CombatScore = Stamina * 10 + Life * 10 + Strength * 10 + Intelligence * 10 + Attack * 10 + Defense * 10 + Level * 5 ;

        return CombatScore;
    }


}