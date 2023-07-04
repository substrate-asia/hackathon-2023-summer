const standalone = process.env['HARDHAT'] === undefined;
if (standalone) {
  console.log("Running in standalone mode");
}

const hre = require("hardhat");
const minimist = require("minimist");

const parsedArgs = minimist(process.argv.slice(2), {
  alias: {
    "contract": "c",
    "dryRun": "dry",
  },
  boolean: [
    "dryRun",
    "compile",
  ],
  negatable: [
    "compile",
  ],
  string: [
    "contract",
  ],
  default: {
    compile: standalone,
    contract: "CybrosImaginatorBridge",
    dryRun: false,
  },
});

const contractName = parsedArgs.contract;
if (!contractName || contractName.trim().length === 0) {
  console.error("`--contract` must provide.");
  process.exit(1);
}

async function main() {
  if (parsedArgs.compile) {
    await hre.run("compile");
  }

  if (parsedArgs.dryRun) {
    console.log("Dry run mode, the contract won't actual deploy to the network");
    process.exit(0);
  }

  const contract = await hre.ethers.deployContract(contractName);

  await contract.waitForDeployment();

  console.log(
    `Contract deployed to ${contract.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
