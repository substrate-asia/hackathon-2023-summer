// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract PlayerContract {
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

    mapping(address => PlayerData) public Playerlist;
    address manager = address(0x1234);

    function createPlayer(string calldata _name) public {
        Playerlist[msg.sender].name = _name;
        Playerlist[msg.sender].Stamina = 5;
        Playerlist[msg.sender].Life = 5;
        Playerlist[msg.sender].Strength = 5;
        Playerlist[msg.sender].Intelligence = 5;
        Playerlist[msg.sender].Defense = 5;
        Playerlist[msg.sender].Level = 1;
       
    }

    function updatePlayerName(address _player, string calldata _name) public {
        require(_player == msg.sender, "You can't do it.");
        Playerlist[_player].name = _name;
    }

    function updatePlayerProperties(address _player, uint256 _Stamina, uint256 _Life, uint256 _Strength, uint256 _Intelligence, uint256 _Defense, uint256 _Level) public {
        // require(msg.sender == manager, "You don't have the Permissions");
        Playerlist[_player].Stamina += _Stamina;
        Playerlist[_player].Stamina += _Life;
        Playerlist[_player].Stamina += _Strength;
        Playerlist[_player].Stamina += _Intelligence;
        Playerlist[_player].Stamina += _Defense;
        Playerlist[_player].Stamina += _Level;
    }
}