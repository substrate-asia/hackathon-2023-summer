const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("CashierDesk Contract Test", function () {
    let owner;
    let user1;
    let user2;

    let Erc20T;
    let erc20T;
    let contractTokenAsSignerOwner;
    let contractTokenAsSignerUser1;
    let contractTokenAsSignerUser2;

    beforeEach(async function () { //beforeEach是执行describe测试方法的前置调用，前置处理可以放在这个方法里
        // 获取测试用户
        [owner, user1, user2] = await ethers.getSigners();

        console.log(
            "当前部署合约的账号为：",
            owner.address
        );

        // 首先部署 Erc20T 合约试试
        Erc20T = await hre.ethers.getContractFactory("Erc20T");
        erc20T = await Erc20T.deploy();
        console.log("Erc20T合约部署成功，合约地址为:", erc20T.address);

        contractTokenAsSignerOwner = await erc20T.connect(owner);
        contractTokenAsSignerUser1 = await erc20T.connect(user1);
        contractTokenAsSignerUser2 = await erc20T.connect(user2);
    });

    describe("Erc20T方法测试", function () { // 可以理解为模块的测试
        it("获取余额", async function () { // 子功能测试
            // user1 质押 100个DRC Token

            let balance = await erc20T.balanceOf(owner.address);
            console.log("owner's erc20T balance is: ", balance);
            expect(balance).to.equal(1000000);
        });
    });
});