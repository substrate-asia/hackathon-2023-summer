// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./interfaces/IPool.sol";
import "./interfaces/IStore.sol";
import "./interfaces/IPledge.sol";

import "./libraries/AddressSetLib.sol";

contract Pledge is IPledge, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 public constant dayStamp = 86400;
    address public pool;
    address public store;
    address public token;

    uint256 public minerStakePrice;
    uint256 public singleStoragePricce;

    address[] private filterAddress;
    mapping(address => uint8) private userRole;

    mapping(address => MinerStorage) public minerStorage;

    mapping(address => uint256) public userStakeAmount;

    mapping(address => UserStorage) public userOwnStorage;

    AddressSetLib.AddressSet private miners;
    // AddressSetLib.AddressSet private validators;
    AddressSetLib.AddressSet private distributors;
    AddressSetLib.AddressSet private chainUsers;

    modifier onlyAdmin(address sender_) {
        require(
            AddressSetLib.contains(chainUsers, sender_),
            "Pledge: not chain user!"
        );
        _;
    }

    constructor(address pool_, address token_) {
        token = token_;
        pool = pool_;
        minerStakePrice = 1e18;
        singleStoragePricce = 1e10; // 1kb price
    }

    function setSotre(address store_) external onlyOwner {
        store = store_;
    }

    function _getRandomIndex(
        uint256 min,
        uint256 max
    ) internal view returns (uint256) {
        uint256 nonce = 0;
        uint256 randomNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))
        );
        return randomNumber.mod(max.sub(min)).add(min);
    }

    function buyStorage(uint256 store_, uint256 days_) external nonReentrant {
        require(
            days_ >= 30 && days_ % 30 == 0,
            "Pledge: buy storage time set error!"
        );
        // todo buy storage
        // if(store_==0 && days_!=0){
        // }

        userRole[_msgSender()] = 1;
        store_ = store_ * 1024 * 1024 * 1024;
        userOwnStorage[_msgSender()].total += store_;
        userOwnStorage[_msgSender()].unUse += store_;
        userOwnStorage[_msgSender()].deadline += days_ * dayStamp;
        emit BuyStorageEvent(_msgSender(), store_, days_);
    }

    // miner
    function minerStake(uint256 store_, address user_) internal returns (bool) {
        require(store_ > 0, "Pledge: stake storeage is zero!");
        uint256 amount = minerStakePrice * store_;
        require(
            IERC20(token).balanceOf(user_) >= amount,
            "Pledge: balance not enough!"
        );
        if (!AddressSetLib.contains(miners, user_)) {
            AddressSetLib.add(miners, user_);
        }
        bool success = IERC20(token).transferFrom(user_, pool, amount);
        store_ = store_ * 1024 * 1024 * 1024;
        minerStorage[user_].total += store_;
        userStakeAmount[user_] += amount;
        userRole[user_] = 2;
        emit MinerStakeEvent(user_, amount, store_);
        return success;
    }

    // validator
    function validatorStake(address user_) internal returns (bool) {
        if (!AddressSetLib.contains(chainUsers, user_)) {
            AddressSetLib.add(chainUsers, user_);
        }
        userRole[user_] = 3;
        emit ValidatorStakeEvent(user_, 0);
        return true;
    }

    // 2->mienr 3->chain
    function stake(uint256 store_, uint8 role_) external nonReentrant {
        require(role_ == 2 || role_ == 3, "Peldge: role not exist!");
        // 矿工可以重复质押空间
        require(
            userRole[_msgSender()] == 0 || userRole[_msgSender()] == 2,
            "Peldge: already staked!"
        );
        if (role_ == 2) {
            minerStake(store_, _msgSender());
        } else if (role_ == 3) {
            validatorStake(_msgSender());
        }
    }

    function removeUser(address user_) public onlyOwner returns (bool) {
        require(userRole[user_] != 0, "Pledge: user not exist!");
        if (userRole[user_] == 1) {
            AddressSetLib.remove(miners, user_);
        } else if (userRole[user_] == 2) {
            AddressSetLib.remove(chainUsers, user_);
        }
        emit RemoveEvent(user_, userRole[user_]);
        delete (userRole[user_]);
        delete (userStakeAmount[user_]);
        return true;
    }

    function punishUser(
        address user_,
        uint256 amount_
    ) external onlyAdmin(_msgSender()) returns (bool) {
        require(userRole[user_] != 0, "Pledge: user not exist!");
        require(userStakeAmount[user_] >= 0, "Pledge: stake amount is zero!");
        if (userStakeAmount[user_] <= amount_) {
            userStakeAmount[user_] -= amount_;
        } else {
            removeUser(user_);
        }
        emit PunishEvent(user_, amount_);
        return true;
    }

    function rewardUser(
        address user_,
        uint256 amount_
    ) external onlyAdmin(_msgSender()) {
        userStakeAmount[user_] += amount_;
    }

    function uploadMetaDataBytes(bytes memory extra) external nonReentrant {
        (
            address[] memory miners_,
            string[] memory fileHash_,
            string memory ext_,
            string memory cid_,
            uint256 size_,
            uint256 blockSize,
            uint256 dataShards,
            uint256 parityShards,
            address user_
        ) = abi.decode(
                extra,
                (
                    address[],
                    string[],
                    string,
                    string,
                    uint256,
                    uint256,
                    uint256,
                    uint256,
                    address
                )
            );
        IStore(store).uploadMetaData(
            miners_,
            fileHash_,
            ext_,
            cid_,
            size_,
            dataShards,
            parityShards,
            user_
        );

        // userOwnStorage[user_].unUse -= size_;
        // for (uint256 i = 0; i < miners_.length; ) {
        //     minerStorage[miners_[i]].unUse -= blockSize;
        //     unchecked {
        //         ++i;
        //     }
        // }
        emit UploadMetaInfoEvent(user_, size_);
    }

    // view function

    function getMiners(
        uint256 store_,
        uint256 numbers_
    ) external view returns (address[] memory) {
        address[] memory list = allMiners();
        if (list.length <= numbers_) {
            return list;
        }

        // for (uint i = 0; i < list.length; ) {
        //     if (minerStorage[list[i]].unUse >= store_) {
        //         filterAddress.push(list[i]);
        //     }
        //     unchecked {
        //         ++i;
        //     }
        // }

        address[] memory res = new address[](numbers_);
        uint256 remainingCount = numbers_;
        uint256 currentIndex = 0;
        uint256 lastIndex = AddressSetLib.length(miners);
        // todo chose miners
        // while (remainingCount>0) {
        //     uint256 randomIndex = _getRandomIndex(currentIndex,lastIndex);
        //     res[numbers_ - remainingCount] = miners.element[randomIndex];
        // }
        return res;
    }

    function allMiners() public view returns (address[] memory) {
        return AddressSetLib.getPage(miners, 0, AddressSetLib.length(miners));
    }

    function allValidators() public view returns (address[] memory) {
        return
            AddressSetLib.getPage(
                chainUsers,
                0,
                AddressSetLib.length(chainUsers)
            );
    }

    function minerLength() external view returns (uint256) {
        return AddressSetLib.length(miners);
    }

    function validatorLength() external view returns (uint256) {
        return AddressSetLib.length(chainUsers);
    }

    function checkValidator(address user_) external view returns (bool) {
        return AddressSetLib.contains(chainUsers, user_);
    }

    function checkMiner(address user_) external view returns (bool) {
        return AddressSetLib.contains(miners, user_);
    }

    function getUerRole(address user_) external view returns (uint256) {
        return userRole[user_];
    }
}
