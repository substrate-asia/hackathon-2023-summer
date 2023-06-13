// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import './Register_novice_package.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract Check_Regist is Ownable{
    address RegistContractAddress;
    // ？
    function setRegistContractAddress(address _address) public onlyOwner {
        RegistContractAddress = _address;        
    }

    // 似乎只有在部署合约时传入正确的合约地址才能正常工作.
    // RegistContract regist = RegistContract(RegistContractAddress);
    RegistContract regist = RegistContract(0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c);

    function isRegisted() view external returns(bool) {
        return regist.isRegisted(msg.sender);
    }
}