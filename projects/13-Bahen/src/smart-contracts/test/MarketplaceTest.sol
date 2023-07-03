pragma solidity ^0.8.0;

import "../contracts/Marketplace.sol";
import "../contracts/Payment.sol";
import "../contracts/Task.sol";

contract MarketplaceTest {
    Marketplace private marketplaceInstance;
    Payment private paymentInstance;
    Task private taskInstance;

    constructor() {
        paymentInstance = new Payment();
        taskInstance = new Task();
        marketplaceInstance = new Marketplace(payable(address(paymentInstance)), address(taskInstance));
    }

    function test_create_order_preview() public returns (string memory) {
        string memory folderUrl = "https://example.com/";
        uint256 requiredPower = 100;

        uint256 orderId = marketplaceInstance.createOrderPreview(folderUrl, requiredPower);

        require(orderId == 0, "OK");
        return "test_create_order_preview: passed";
    }

    function test_confirm_order() public {
        string memory folderUrl = "https://example.com/";
        uint256 requiredPower = 100;

        uint256 orderId = marketplaceInstance.createOrderPreview(folderUrl, requiredPower);

        uint256 paymentAmount = 1 ether;
        marketplaceInstance.confirmOrder{value: paymentAmount}(orderId, paymentAmount);

        Order order = Order(marketplaceInstance.orders(orderId));
        // require(order.client() == msg.sender, "The client of the order should be the sender of the transaction.");
        require(order.isConfirmed(), "Order should be confirmed.");
    }
}
