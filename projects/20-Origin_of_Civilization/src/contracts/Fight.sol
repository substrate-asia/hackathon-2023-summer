// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "./Playerdata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BattlePoint.sol";

contract Fight is Ownable{

    // uint256 BattlePoint;

    struct Fighter{
        uint256 Stamina;
        uint256 Life;
        uint256 Strength;
        uint256 Intelligence;
        uint256 Attack;
        uint256 Defense;
        uint256 Level;
    }

    struct Winner{
        uint256 Rounds;
        address Winner;
    }

    mapping(address => Fighter) public Fighters;
    // mapping(address => uint256) public BattlePoints;
    address playerContractAddress;

    PlayerContract playerContract = PlayerContract(0xd9145CCE52D386f254917e481eB44e9943F39138);

    BattlePoint battePoint = BattlePoint();

    function setPlayerContractAddress(address _ContractAddress_playerData) public onlyOwner {
        playerContractAddress = _ContractAddress_playerData;
    }

    function attack(address _attacker, address _targetAddress) public returns(Winner memory) {
        require(_attacker == msg.sender && _attacker != _targetAddress, "Cannot attack yourself!");
        // attcker & target's Attack Attribute
        Fighters[msg.sender].Attack = playerContract.returnPlayerProperties(msg.sender).Attack;
        Fighters[_targetAddress].Attack = playerContract.returnPlayerProperties(_targetAddress).Attack;
        
        // Life Attribute
        Fighters[msg.sender].Life = playerContract.returnPlayerProperties(msg.sender).Life;
        Fighters[_targetAddress].Life = playerContract.returnPlayerProperties(_targetAddress).Life;

        // Defense Attribute
        Fighters[msg.sender].Defense = playerContract.returnPlayerProperties(msg.sender).Defense;
        Fighters[_targetAddress].Defense = playerContract.returnPlayerProperties(_targetAddress).Defense;

        require(Fighters[msg.sender].Attack != 0 && Fighters[_targetAddress].Attack != 0, "Attack And target must Attack attribute > 0.");

        // uint256 Rounds = 0;
        // address Winner = address(0);
        Winner memory win;
        while (Fighters[msg.sender].Life > 0 || Fighters[_targetAddress].Life > 0) {

            Fighters[_targetAddress].Life -= Fighters[msg.sender].Attack;
            if (Fighters[_targetAddress].Life >0){
                Fighters[msg.sender].Life -= Fighters[_targetAddress].Attack;
                win.Rounds += 1;
            }
            else {
                win.Rounds +=1;
                win.Winner = address(msg.sender);
            }
            
        }
        win.Rounds;
        win.Winner = Fighters[msg.sender].Life > 0 ? address(msg.sender) : address(_targetAddress);
        // 每赢得一场战斗,战场积分加1.
        battePoint.updatePoints(win.Winner, 1);
        return win;        
    }

}
