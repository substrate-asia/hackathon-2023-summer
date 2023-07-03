import { ethers } from "hardhat";

async function main() {
// 1. Regit for novice package.
  const Regit = await ethers.getContractFactory("RegistContract");
  const rgist = await Regit.deploy();

  await rgist.deployed();

  console.log(
    `Regist Contract deployed to ${rgist.address}`
  );
  // const regist_abi = require("../artifacts/contracts/Register_novice_package.sol/RegistContract.json");
  // const RegistContract = new ethers.Contract(rgist.address, regist_abi)
// 2. Create Player Contract
  const PlayerContract = await ethers.getContractFactory("PlayerContract");
  const Player = await PlayerContract.deploy();

  await Player.deployed();

  console.log(
    `PlayerContract deployed to ${Player.address}`
  ); 
// 3. Management contract, use for update player's attributes.
  const Management = await ethers.getContractFactory("Management");
  const management = await Management.deploy();

  await management.deployed();

  console.log(
    `ManagementContract deployed to ${management.address}`
  );
// 4. CreateCiviTeam contract.
  const CreateCiviTeam = await ethers.getContractFactory("CreateCiviTeam");
  const createCiviTeam = await CreateCiviTeam.deploy();

  await createCiviTeam.deployed();

  console.log(
    `CreateCiviTeam deployed to ${createCiviTeam.address}`
  );

// 5. BattlePoints, use for update BattlePoints 
  const BattlePoint = await ethers.getContractFactory("BattlePoint");
  const battlePoint = await BattlePoint.deploy();

  await battlePoint.deployed();

  console.log(
    `BattlePoint deployed to ${battlePoint.address}`
  );
// 6. CombatPower. Caculate CombatPower for player.
  const CombatPower = await ethers.getContractFactory("CombatPower");
  const combatPower = await CombatPower.deploy();

  await combatPower.deployed();

  console.log(
    `CombatPower deployed to ${combatPower.address}`
  );

  // 7. Fight Contract
  const Fight = await ethers.getContractFactory("Fight");
  const fight = await Fight.deploy();

  await fight.deployed();

  console.log(
    `Fight deployed to ${fight.address}`
  );
// 8. NFT for test: Burn NFT & update Attributes
  const NFTTest = await ethers.getContractFactory("NFTTest");
  const nFTTest = await NFTTest.deploy();

  await nFTTest.deployed();

  console.log(
    `NFTTest deployed to ${nFTTest.address}`
  );
// 9. Castle NFT Test
  const CastleTest = await ethers.getContractFactory("CastleTest");
  const castleTest = await CastleTest.deploy();

  await castleTest.deployed();

  console.log(
    `CastleTest deployed to ${castleTest.address}`
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
