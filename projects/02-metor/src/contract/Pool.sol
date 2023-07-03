// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


import "./interfaces/IPool.sol";

contract Pool is Ownable, ReentrancyGuard, IPool {
    address public token;

    mapping(address => bool) public adminList;

    event DepositEvent(address indexed user, uint256 amount);
    event WithdrawEvent(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    modifier onlyAdmin() {
        require(adminList[_msgSender()], "Pool: not admin");
        _;
    }

    constructor(address token_) {
        token = token_;
    }

    function setAdmin(address addr_) external onlyOwner {
        adminList[addr_] = true;
    }

    function deposit() external payable override nonReentrant {
        emit DepositEvent(_msgSender(), msg.value);
    }

    function withdrawToken(
        address user_,
        uint256 amount_
    ) external override nonReentrant onlyAdmin {
        require(address(this).balance >= amount_, "Pool: token balance not enough!");
        // payable(user).transfer(amount);
        IERC20(token).transfer(user_,amount_);
        emit WithdrawEvent(_msgSender(), user_, amount_);
    }

    receive() external payable {
        // todo: do some things
    }

    function claim() external onlyOwner {
        selfdestruct(payable(_msgSender()));
    }

}
