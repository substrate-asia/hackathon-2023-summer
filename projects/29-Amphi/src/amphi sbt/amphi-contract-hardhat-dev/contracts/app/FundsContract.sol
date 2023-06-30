// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./../interfaces/IERC20.sol";

contract FundsContract is Ownable {
    IERC20 private _token;
    event WithdrawEv(address indexed to, uint256 amount);
    event TransferEv(address to, uint256 amout);
    address private accessAddress;

    constructor(address tokenAddress) {
        _token = IERC20(tokenAddress);
    }

    //提取合约资金
    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Invalid amount");
        require(
            _amount <= _token.balanceOf(address(this)),
            "Insufficient balance"
        );
        require(_token.transfer(msg.sender, _amount), "Transfer failed");
        emit WithdrawEv(msg.sender, _amount);
    }

    //转账
    function transferToAddress(address _to, uint256 _amount) external {
        require(
            accessAddress != address(0) || msg.sender == accessAddress,
            "Invalid access address"
        );
        require(
            _to != address(0) || _amount > 0,
            "Invalid address or invalid amount"
        );
        require(
            _amount <= _token.balanceOf(address(this)),
            "Insufficient balance"
        );
        require(_token.transfer(_to, _amount), "Transfer failed");
        emit TransferEv(_to, _amount);
    }

    //获取合约余额
    function contractBalance() external view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    //更改新的erc20合约
    function newErc20Address(address _newAddress) external onlyOwner {
        _token = IERC20(_newAddress);
    }

    //设置访问合约地址
    function setAccessAddress(address _address) external onlyOwner {
        accessAddress = _address;
    }
}
