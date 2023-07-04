// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is Ownable, ReentrancyGuard, ERC20 {
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        _mint(_msgSender(), 100000000e18);
    }

    function mint(address user_, uint256 amount_) external onlyOwner {
        _mint(user_, amount_);
    }
}
