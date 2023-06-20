// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";


contract PlayerContract is Ownable{
    struct PlayerData {

        string name;
        // Strength, Life, Strength, Intelligence, Attack, Defense, Level  
        // 体力,生命值,力量,智力,攻击,防御,等级
        uint256 Stamina;
        uint256 Life;
        uint256 Strength;
        uint256 Intelligence;
        uint256 Attack;
        uint256 Defense;
        uint256 Level;        
    }

    mapping(address => PlayerData) public Player;
    address public allowedContract;

    function createPlayer(string calldata _name) public {
        Player[msg.sender].name = _name;
        Player[msg.sender].Stamina = 5;
        Player[msg.sender].Life = 5;
        Player[msg.sender].Strength = 5;
        Player[msg.sender].Intelligence = 5;
        Player[msg.sender].Attack = 5;
        Player[msg.sender].Defense = 5;
        Player[msg.sender].Level = 1;
       
    }

    function updatePlayerName(address _player, string calldata _name) public {
        require(_player == msg.sender, "You can't do it.");
        Player[_player].name = _name;
    }

    function updatePlayerProperties(address _player, uint256 _Stamina, uint256 _Life, uint256 _Strength, uint256 _Intelligence,uint256 _Attack, uint256 _Defense, uint256 _Level) public onlyAllowedContract{
        Player[_player].Stamina += _Stamina;
        Player[_player].Life += _Life;
        Player[_player].Strength += _Strength;
        Player[_player].Intelligence += _Intelligence;
        Player[_player].Attack += _Attack;
        Player[_player].Defense += _Defense;
        Player[_player].Level += _Level;
    }

    modifier onlyAllowedContract() {
        require(msg.sender == allowedContract, "Only allowed contract can call this function");
        _;
    }

    function setAllowedContract(address _allowedContract) public onlyOwner {
        allowedContract = _allowedContract;
    }

}