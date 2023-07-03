// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IPledge {
    struct MinerStorage {
        uint256 total;
        uint256 unUse;
    }

    struct UserStorage{
        uint256 total;
        uint256 unUse;
        uint256 deadline; // days
    }

    event MinerStakeEvent(address indexed miner, uint256 amount, uint256 store);
    event ValidatorStakeEvent(address indexed validator, uint256 amount);
    event PunishEvent(address indexed user, uint256 amount);
    event RemoveEvent(address indexed user, uint8 role);
    event UserBuyStorageEvent(address indexed user, uint256 store);
    event UploadMetaInfoEvent(address indexed user, uint256 size);
    event UploadMinerInfoEvent(address indexed miner, string[] info);
    event BuyStorageEvent(address indexed user,uint256 store,uint256 deadline);
    event PulishAndRewardEvent(address user,uint256 amount,uint256 state);

    function allMiners() external view returns (address[] memory);

    function allValidators() external view returns (address[] memory);

    function minerLength() external view returns (uint256);

    function validatorLength() external view returns (uint256);

    function checkValidator(address user_) external view returns (bool);

    function checkMiner(address user_) external view returns (bool);
}
