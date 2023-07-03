// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./interfaces/IStore.sol";

import "./libraries/LinkIdSetLib.sol";

contract Store is IStore, Ownable, ReentrancyGuard {
    address public pledge;

    uint256 private incrementLinkId;

    mapping(address => bool) private admins;
    mapping(address=>uint256)public userCidLength;
    mapping(address => string[]) public cidList;
    mapping(string => Meta) public cidMeta;
    mapping(string => address) public cidOwner;

    // miner info
    mapping(address => LinkIdSetLib.LinkIdSet) private minerOwnHash;

    modifier onlyAdmin() {
        require(admins[_msgSender()], "Store: not allowed!");
        _;
    }

    constructor(address pledge_) {
        pledge = pledge_;
        admins[pledge_] = true;
    }

    function delFileHash(
        address miner_,
        string memory fileHash_
    ) external onlyAdmin nonReentrant {
        LinkIdSetLib.remove(minerOwnHash[miner_], fileHash_);
    }

    function getMinerAllHash(
        address miner_
    ) external view returns (string[] memory) {
        return
            LinkIdSetLib.getPage(
                minerOwnHash[miner_],
                0,
                LinkIdSetLib.length(minerOwnHash[miner_])
            );
    }

    function getlength(address miner_) external view returns (uint256) {
        return LinkIdSetLib.length(minerOwnHash[miner_]);
    }

    function uploadMetaData(
        address[] memory miners_,
        string[] memory fileHash_,
        string memory ext_,
        string memory cid_,
        uint256 size_,
        uint256 dataShards,
        uint256 parityShards,
        address user_
    ) public onlyAdmin nonReentrant returns (bool) {
        // update info
        for (uint256 i = 0; i < miners_.length; ) {
            LinkIdSetLib.add(minerOwnHash[miners_[i]], fileHash_[i]);
            unchecked {
                ++i;
            }
        }
        Meta memory metas_ = Meta(miners_, fileHash_, ext_, size_,dataShards,parityShards);
        cidList[user_].push(cid_);
        cidMeta[cid_] = metas_;
        cidOwner[cid_] = user_;
        emit UploadMetaEvent(user_, cid_, ext_);
        return true;
    }
}
