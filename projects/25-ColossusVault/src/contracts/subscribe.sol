// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract SubscriptionContract {
    struct Subscription {
        // store the end-time of subscription
        mapping(address => uint256) follower_info;  
        mapping(address => uint256) following_info;
        // address[] followers;
        // address[] followings;
    }

    mapping(address => Subscription) Subscriptions;

    // Different duration correspond to different prices.
    mapping(uint256 => uint256) subscription_price;

    event CreateSubscription(address indexed following, address indexed follower, uint256 duration, uint256 fee);

    constructor (uint256 _fixed_duration, uint256 _fixed_price) {
        // Temporarily fixed at  2592000 : one month
        subscription_price[_fixed_duration] = _fixed_price;
    }

    function subscribe(
        address _following, 
        uint256 duration
    ) external payable returns (bool){
        require(msg.sender != _following, "can not subscribe yourself");
        require(subscription_price[duration] > 0, "no this duration");
        require(msg.value >= subscription_price[duration], "need enough subscription fee");
        Subscriptions[msg.sender].following_info[_following] = block.timestamp + duration;
        Subscriptions[_following].follower_info[msg.sender] = block.timestamp + duration;
        
        // pay for Subscription
        payable(_following).transfer(msg.value);
        
        emit CreateSubscription(msg.sender, _following, duration, msg.value);
        
        return true;
    }

    function getEndTimeOfSubscription(
        address _follower, 
        address _following
    ) public view returns (uint256) {
        return Subscriptions[_follower].following_info[_following];
    }

    function getSubscriptionPrice(uint256 _duration) public view returns (uint256) {
        return subscription_price[_duration];
    }
}