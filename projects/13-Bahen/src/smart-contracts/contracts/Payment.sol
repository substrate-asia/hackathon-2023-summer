// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payment {
    mapping(address => uint256) public balanceOf;
    event Deposit(address indexed sender, uint256 amount);
    event Balance(address indexed sender, uint256 Balance);
    event Transfer(
        address indexed sender,
        address indexed recipient,
        uint256 amount
    );
    event Withdrawal(address indexed sender, uint256 amount);

    function deposit(address user) external payable {
        balanceOf[user] += msg.value;
        emit Deposit(user, msg.value);
        emit Balance(user, address(this).balance);
    }

    function transfer(address to, uint256 amount) external {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance.");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function withdraw(uint256 amount) external {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance.");

        balanceOf[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function payWorker(address worker, uint256 amount) public {
        _transferETH(worker, amount);
    }

    function _transferETH(address to, uint256 amount) internal {
        require(
            address(this).balance >= amount,
            "Insufficient contract balance."
        );

        // Transfer the specified amount of ETH to the recipient
        payable(to).transfer(amount);
    }

    receive() external payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    fallback() external payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
