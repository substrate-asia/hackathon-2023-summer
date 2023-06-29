// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract RegistContract{
    mapping (address => bool) Registed;
    uint256 TotalRegister;

    function regist () public {
        require(Registed[msg.sender] == false, "already registed");
        Registed[msg.sender] = true;
        TotalRegister += 1;
    }

    function isRegisted(address _address) public view returns(bool) {
        return Registed[_address];
    }

    function getTotalRegist() public view returns (uint256) {
        return TotalRegister;
    }
}