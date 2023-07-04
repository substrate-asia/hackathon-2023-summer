//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

contract AmphiSBTController {
    address internal root; // 本合约管理权限所有者

    // 这部分地址作为管理地址也授权一部分操作，目前主要是为了给我们的智能合约放权
    mapping(address => bool) public orgAdmins;

    constructor() {}

    modifier onlyRoot() {
        require(msg.sender == root, "ERR_NOT_ENSOUL_ADMIN");
        _;
    }

    modifier onlyOrgAmin() {
        require(this.isAllow(msg.sender), "ERR_NO_AUTH_OF_TOKEN");
        _;
    }

    function isAllow(address sender) external view returns (bool) {
        if (sender == root || orgAdmins[sender]) {
            return true;
        }
        return false;
    }

    // 获取root管理员地址
    function getRoot() external view returns (address) {
        return root;
    }

    // 设置root管理员地址
    function setRoot(address _root) external onlyRoot {
        root = _root;
    }

    function addOrgAdmin(address _admin) external onlyRoot {
        orgAdmins[_admin] = true;
    }
}
