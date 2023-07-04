// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// 质押 Token 主要的业务逻辑实现
contract CfgStakeToken is Ownable {
    using SafeMath for uint256;
    IERC20 vetoken; // 社区token
    IERC20 token; // 其它项目方 token

    constructor(address _vetoken, address _token) {
        vetoken = IERC20(_vetoken);
        token = IERC20(_token);
    }

    //每个地址的质押份额
    mapping(address => uint256) private shares;
    //质押时间
    mapping(address => uint256) public depositTimestamps;

    //质押总数量
    uint256 stakeTotalReward = 0;
    // 用户最多质押数量
    uint256 stake_max_amount = 1000 * 10 ** 18;
    // 是否领取了空投
    mapping(address => bool) private isParadrop;
    // 签到时间
    mapping(address => uint256) private signTimestamps;

    // 区块产出奖励总数量
    uint256 blockRewardPerMin;
    // 产中奖励的区块高度
    uint blockNumberTop;
    // 用户是否领过当前区块奖励
    mapping(address => uint) private addressBlockNumber;


    //质押,【外部调用/所有人/不需要支付/读写状态】
    function stake(uint256 _amount) external {
        // 用户持有量
        uint256 veBalanceOf = vetoken.balanceOf(msg.sender);
        require( stake_max_amount >= _amount , "you stake > max amount!");
        require(veBalanceOf >= _amount, "you have not enough  balance!");
        // 添加用户质押记录
        shares[msg.sender] = shares[msg.sender].add(_amount);
        depositTimestamps[msg.sender] = block.timestamp;
        vetoken.transferFrom(msg.sender, address(this), _amount);
        stakeTotalReward.add(_amount);
        // 首次质押 发放空投
        if (isParadrop[msg.sender] == false) {
            token.transfer( msg.sender, _amount);
            isParadrop[msg.sender] = true;
        }
    }
    // function getBalanceOf() external view returns ( address addr, uint256 balanceOf) {
    //     return (address(this), token.balanceOf(address(this)));
    // }
    // 获取质押量和时间
    function getStakeDepositInfo(
        address _addr
    ) external view returns (uint256 stakea_amount, uint256 timestamps) {
        return (shares[_addr], depositTimestamps[_addr]);
    }

    //解除质押，提取token,【外部调用/所有人/不需要支付/读写状态】
    function unStake() external {
        uint256 elapsedTime = block.timestamp.sub(
            depositTimestamps[msg.sender]
        ); // 已经过去的时间
        require(elapsedTime >= 30 days, "you stake id not enough 30 days!");
        vetoken.transfer(msg.sender, shares[msg.sender]);
        stakeTotalReward.sub(shares[msg.sender]);
        shares[msg.sender] = 0;
    }

    //  设置区块产出奖励总数量,和奖励的区块高度
    function setBlockRewardPerMin(
        uint256 _blockRewardPerMin,
        uint _blockNumberTop
    ) external onlyOwner {
        blockRewardPerMin = _blockRewardPerMin;
        blockNumberTop = _blockNumberTop;
    }

    //  设置用户最多质押数量
    function setStakeMaxAmount(
        uint _stake_max_amount
    ) external onlyOwner {
        stake_max_amount = _stake_max_amount;
    }

    //获取某地址区块高度奖励,【外部调用/所有人/不需要支付/只读】
    function getBlockReward(address _addr) external view returns (uint256) {
        require(
            token.balanceOf(address(this)) >= 0,
            "project token balance's have not enough!"
        );
        // 计算额按用户质押的社区代币比例进行分配
        return shares[_addr].div(stakeTotalReward).mul(blockRewardPerMin);
    }

    // 区块高度奖励
    function gainBlockReward() external {
        require(
            token.balanceOf(address(this)) >= 0,
            "project token balance's have not enough!"
        );
        require(
            block.number >= blockNumberTop,
            "project token block reward have not enough!"
        );
       require(
            blockNumberTop != addressBlockNumber[msg.sender],
            "user address has gain rewarded!"
        );
        
        // // 计算额按用户质押的社区代币比例进行分配
        uint256 reward = shares[msg.sender].div(stakeTotalReward).mul(
            blockRewardPerMin
        );
        require(
            token.balanceOf(address(this)) >= reward,
            "project token balance's < reward!"
        );
        // 发放项目方奖励
        token.transfer(msg.sender, reward);
        // 设置用过领过当前区块
        addressBlockNumber[msg.sender] = blockNumberTop;
    }

    // 获取区块和时间
    function getBlockInfo()
        external
        view
        returns (uint256 blockNumber, uint256 blockTimestamp)
    {
        return (block.number, block.timestamp);
    }

    // 签到接口
    function signIn3day() external {
        if (signTimestamps[msg.sender] == 0) {
            signTimestamps[msg.sender] = block.timestamp;
        }
        uint256 elapsedTime = block.timestamp.sub(signTimestamps[msg.sender]); // 已经过去的时间
        require(elapsedTime >= 3 days, "It takes three days to sign in!");
        // 发放  3个token
        token.transfer( msg.sender, 3 * 10 ** 18);
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
