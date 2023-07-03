// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Payment.sol";
import "./TaskPool.sol";
import "./Order.sol";
import "./SharedStructs.sol";
import "./WorkerPool.sol";

contract Marketplace {
    Payment private paymentContract;
    TaskPool private taskPoolContract;
    WorkerPool private workerPoolContract;
    address private admin;
    address private marketplace;
    mapping(address => uint256) public workerLoad;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    uint256 private nextOrderId;

    event TaskCompleted(uint256 indexed taskId, address indexed worker);

    event OrderCreated(string message, uint256 orderId);
    event ConfirmOrder(uint256 orderId, uint256 paymentAmount);
    event Log(string message);
    event LogBool(bool LogBool);

    event Logad(address adr, address adr2);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this operation.");
        _;
    }

    constructor(
        address payable paymentAddress,
        address taskPoolAddress,
        address workerPoolAddress
    ) {
        paymentContract = Payment(paymentAddress);
        taskPoolContract = TaskPool(taskPoolAddress);
        workerPoolContract = WorkerPool(workerPoolAddress);
        admin = msg.sender;
        nextOrderId = 0;
    }

    function addWorker(address worker, uint256 _computingPower) public {
        workerPoolContract.addWorker(worker, _computingPower);
        TriggerTaskPool();
    }
    
    function removeWorker(address worker) public onlyAdmin 
    {
        workerPoolContract.removeWorker(worker);
    }

    function getWorkerList() public view returns(address[] memory)
    {
        return workerPoolContract.getWorkerList();
    }

    function getWorkerInfo(address worker) public view returns(WorkerPool.Worker memory)
    {
        return workerPoolContract.getWorkerByWorkerAddress(worker);
    }

    function getTask(
        uint256 taskId
    ) public view returns (SharedStructs.TaskInfo memory) {
        return taskPoolContract.getTask(taskId);
    }

    function createOrderPreview(
        string memory folderUrl,
        uint256 requiredPower,
        uint256 paymentAmount,
        uint256 orderLevel
    ) public payable returns (uint256) {

        require(msg.value >= paymentAmount, "Not enough funds provided.");
        uint256 orderId = nextOrderId++;

        Order order = new Order(
            msg.sender,
            folderUrl,
            requiredPower,
            orderLevel
        );
        orders[orderId] = order;
        userOrders[msg.sender].push(orderId);
        emit OrderCreated("Cread order success!", orderId);

        Payment(paymentContract).deposit{value: msg.value}(msg.sender);

        uint256 taskId = taskPoolContract.createTask(
            SharedStructs.TaskType.Training,
            orderId,
            order.folderUrl(),
            order.requiredComputingPower(),
            order.orderLevel()
        );
        order.SetOrdertrainTaskId(taskId);
        order.confirm(paymentAmount);
        TriggerTaskPool();
        return orderId;
    }

    function calculateCost(
        uint256 paymentAmount
    ) public payable{

        require(msg.value >= paymentAmount, "Not enough funds provided.");
        
        Payment(paymentContract).deposit{value: msg.value}(msg.sender);
    }

    function getUserOrders(
        address user
    ) public view returns (uint256[] memory) {
        return userOrders[user];
    }

    function getOrderInfo(
        uint256 orderId
    )
        public
        view
        returns (
            uint256 _orderId,
            uint256 _trainTaskId,
            uint256 _validateTaskId,
            address _client,
            uint256 _paymentAmount,
            SharedStructs.OrderStatus _orderStatus,
            uint _orderLevel,
            uint256 _requiredComputingPower,
            string memory _folderUrl
        )
    {
        _orderId = orderId;
        Order order = orders[orderId];
        _trainTaskId = order.trainTaskId();
        _validateTaskId = order.validateTaskId();
        _client = order.client();
        _paymentAmount = order.paymentAmount();
        _orderStatus = order.orderStatus();
        _orderLevel = order.orderLevel();
        _requiredComputingPower = order.requiredComputingPower();
        _folderUrl = order.folderUrl();
    }

    function transferFunds(address recipient, uint256 amount) public {
        require(address(this).balance >= amount, "Insufficient contract balance.");

        payable(recipient).transfer(amount);
    }

    function CompleteTask(address workerAddress, uint256 taskId) external {
        SharedStructs.TaskInfo memory task = taskPoolContract.getTask(taskId);
        taskPoolContract.completeTask(taskId);
        Order order = orders[task.orderId];
        workerPoolContract.finishTask(workerAddress);
        order.SetOrderStatus(SharedStructs.OrderStatus.Completed);

        uint256 paymentWorker = order.paymentAmount() * 9 / 10;  

        Payment(paymentContract).payWorker(workerAddress, paymentWorker);

        TriggerTaskPool();
    }

    function TriggerTaskPool() private
   {
        emit LogBool(taskPoolContract.HasTask());
        if(taskPoolContract.HasTask())
        {
            SharedStructs.TaskInfo memory task =  taskPoolContract.getPendingTask();
            uint256 workerId = workerPoolContract.assignTask(task.requiredPower, task.id, task.expectWorkerId, task.orderLevel);
            
            if(workerId != workerPoolContract.Invalid_WorkerId())
            {
                
                orders[task.orderId].SetOrderStatus(SharedStructs.OrderStatus.processing);
                taskPoolContract.assignTask(task.id, workerId);
            }
        }
    }

    function setMarketplaceAddress(address marketplaceAddress) external {
        require(
            msg.sender == admin,
            "Only admin can set the marketplace address."
        );
        marketplace = marketplaceAddress;
    }
}
