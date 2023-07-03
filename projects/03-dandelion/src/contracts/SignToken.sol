// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
// 签到合约
contract SignToken is ERC20, Ownable {
    using SafeMath for uint256;
    uint256 private constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18; // 1,000,000,000 tokens with 18 decimals

    // 签到时间
    mapping(address => uint256) private signTimestamps;

    constructor() ERC20('SignToken', 'ST') {
        _mint(msg.sender, TOTAL_SUPPLY);
    }


        // 签到接口
    function signIn3day() external {
        if (signTimestamps[msg.sender] == 0) {
            signTimestamps[msg.sender] = block.timestamp;
        }
        uint256 elapsedTime = block.timestamp.sub(signTimestamps[msg.sender]); // 已经过去的时间
        require(elapsedTime >= 3 days, "It takes three days to sign in!");
        // 发放  3个token
        super.transfer( msg.sender, 3 * 10 ** 18);
        // 更新签到时间
        signTimestamps[msg.sender] ==  block.timestamp;
    }

    // 获取当前签到进度
    function getSignIn3day(
        address _addr
    ) external view returns (uint256 signTimes, uint256 elapsedPeriods) {
        uint256 elapsedTime = block.timestamp.sub(signTimestamps[_addr]); // 已经过去的时间
        uint256 _elapsedPeriods = elapsedTime.div(3 days); // 已经过去的签到的天数
        return (signTimestamps[_addr], _elapsedPeriods);
    }

}
