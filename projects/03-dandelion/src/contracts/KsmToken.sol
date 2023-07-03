// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract KsmToken is ERC20, Ownable {
    using SafeMath for uint256;

    uint256 private constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18; // 1,000,000,000 tokens with 18 decimals

    constructor() ERC20('KsmToken', 'KSM') {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
}
