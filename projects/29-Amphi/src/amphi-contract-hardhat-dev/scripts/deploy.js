// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // 这一部分都是hardhat部署Lock合约的示例代码
  /*
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.parseEther("0.001");

  const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
  */

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
  //  const sbtAddress = "0x71d7917603b4E6BCA309BCA397870B8beE746884"; //之前部署的sbt合约地址

  // 部署AmphiTrans合约
  // const AmphiTrans = await hre.ethers.getContractFactory("AmphiTrans");
  // const amphiTrans = await AmphiTrans.deploy();
  // console.log("AmphiTrans合约部署成功，合约地址为:", amphiTrans.address);

  // 部署AmphiPass合约
  const AmphiPass = await hre.ethers.getContractFactory("AmphiPass");
  const amphiPass = await AmphiPass.deploy("ipfs://bafybeih7pmj6yqlhpaniaad7sofxuo556mzoeyoviqpzlxhryu3ic62c54/"); // TODO: baseUri的参数是什么含义？这里amphiPass合约部署的时候，需要有这个初始化参数
  console.log("AmphiPass合约部署成功，合约地址为:", amphiPass.address);

  //部署Funds合约
  const Funds = await hre.ethers.getContractFactory("FundsContract");
  const funds = await Funds.deploy(erc20T.address);
  console.log("Funds合约部署成功，合约地址为:", funds.address);


  //部署业务合约
  const NewImpl = await hre.ethers.getContractFactory("NewImpl");
  const newImpl = await NewImpl.deploy(amphiPass.address, amphiTrans.address, erc20T.address, funds.address, effWorkloadSBT.address);
  console.log("NewImpl合约部署成功，合约地址为:", newImpl.address);


  amphiTrans.setAccessAddress(newImpl.address);
  console.log("======设置AmphiTrans可访问合约地址成功===============");

  amphiPass.setAmphiWorkAddress(newImpl.address);
  console.log("======设置AmphiPass访问合约地址成功===============");

  funds.setAccessAddress(newImpl.address);
  console.log("======设置Funds可访问合约地址成功===============");

  console.log("合约部署完成");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});