// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IPool {

    function deposit() external payable;

    function withdrawToken(address user, uint256 amount) external;

}