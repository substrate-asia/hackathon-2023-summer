const hre = require("hardhat");

async function main() {
    // 我们的部署脚本从这里开始
    const [deployer] = await hre.ethers.getSigners();

    console.log(
        "当前部署合约的账号为：",
        deployer.address
    );

    // 部署EffWorkloadSBT合约
    const EffWorkloadSBT = await hre.ethers.getContractFactory("EffWorkloadSBT");
    const effWorkloadSBT = await EffWorkloadSBT.deploy();
    console.log("effWorkloadSBT合约部署成功，合约地址为:", effWorkloadSBT.address);
    console.log("部署完成");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});