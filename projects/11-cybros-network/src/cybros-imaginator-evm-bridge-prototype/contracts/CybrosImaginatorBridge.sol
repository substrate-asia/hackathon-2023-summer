// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CybrosImaginatorBridge {
    // 合约管理员
    address public owner;

    // 能够接收的最小转账额度，默认为 0.02 Ether
    uint256 public minAmount = 0.02 ether;

    // 用于通知转账成功接收的 event
    event PromptRequested(address indexed sender, uint256 fee, string input, bytes publicKey, bool simple);

    // 构造函数，将合约发布者设置为管理员
    constructor() {
        owner = msg.sender;
    }

    // 修改接收转账的最小额度，只有管理员可以调用
    function setMinAmount(uint256 _minAmount) public {
        require(msg.sender == owner, "Only owner can change the minAmount");
        minAmount = _minAmount;
    }

    // 接收转账的函数，接受额外的字符串参数
    function requestSimple(string memory _prompt) public payable {
        require(msg.value >= minAmount, "Amount is less than the minimum required");

        // 触发 PromptRequested 事件
        emit PromptRequested(msg.sender, msg.value, _prompt, "", true);
    }

    function request(string memory _input, string memory length, uint8 _v, bytes32 _r, bytes32 _s, bytes memory _publicKey) public payable {
        require(msg.value >= minAmount, "Amount is less than the minimum required");
        require(msg.sender == address(uint160(uint256(keccak256((_publicKey))))), "Public key mismatched");

        bytes memory prefix = bytes(string.concat("\x19Ethereum Signed Message:\n", length));
        bytes32 inputHash = keccak256(abi.encodePacked(prefix, _input));
        address signer = ecrecover(inputHash, _v, _r, _s);
        require(signer != address(0) && signer == msg.sender, "ECDSA: invalid signature");

        // 触发 PromptRequested 事件
        emit PromptRequested(msg.sender, msg.value, _input, _publicKey, false);
    }

    // 取出合约内的所有以太币，只有管理员可以调用
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
