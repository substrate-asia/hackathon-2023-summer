// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "./Playerdata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BattlePoint is Ownable{
    uint256 Points;
    mapping(address => uint256) public BattlePoints;
    address public allowedContract;


    modifier onlyAllowedContract() {
        require(msg.sender == allowedContract, "Only allowed contract can call this function");
        _;
    }

    function setAllowedContract(address _allowedContract) public onlyOwner {
        allowedContract = _allowedContract;
    }

    function updatePoints(address _address, uint256 _points) public onlyAllowedContract{
        BattlePoints[_address] += _points;
    }

    function getBattlePoin(address _address) public view returns(uint256) {
        return BattlePoints[_address];
    }

}