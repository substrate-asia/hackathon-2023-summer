// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IStore {
    struct Meta {
        address[] miner;
        string[] content;
        string ext;
        uint256 size;
         uint256 dataShards;
        uint256 parityShards;
    }

    event UploadMetaEvent(address indexed user, string cid, string ext);

    function uploadMetaData(
        address[] memory miners_,
        string[] memory fileHash_,
        string memory ext_,
        string memory cid_,
        uint256 size_,
        uint256 dataShards,
        uint256 parityShards,
        address user_
    ) external returns (bool);
}
