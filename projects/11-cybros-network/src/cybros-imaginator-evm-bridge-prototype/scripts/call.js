const standalone = process.env['HARDHAT'] === undefined;
if (standalone) {
  console.log("Running in standalone mode");
}

const hre = require("hardhat");
const minimist = require("minimist");

const parsedArgs = minimist(process.argv.slice(2), {
  "--": true,
  alias: {
    "contract": "c",
    "dryRun": "dry",
    "target": "t",
    "function": "f",
  },
  boolean: [
    "dryRun",
    "compile",
  ],
  negatable: [
    "compile"
  ],
  string: [
    "contract",
    "function",
    "target",
    "args",
    "value",
  ],
  default: {
    compile: standalone,
    contract: "CybrosImaginatorBridge",
    dryRun: false,
    value: "0",
  },
});

const contractName = parsedArgs.contract;
if (!contractName || contractName.trim().length === 0) {
  console.error("`--contract` must provide.");
  process.exit(1);
}
const contractAddress = parsedArgs.target;
if (!contractAddress || contractAddress.trim().length === 0) {
  console.error("`--target` must provide.");
  process.exit(1);
}
const contractFunction = parsedArgs.function;
if (!contractFunction || contractFunction.trim().length === 0) {
  console.error("`--function` must provide.");
  process.exit(1);
}

async function main() {
  if (parsedArgs.compile) {
    await hre.run("compile");
  }

  const contract = await hre.ethers.getContractAt(contractName, contractAddress);
  const callee = contract.getFunction(contractFunction);
  const value = hre.ethers.parseEther(parsedArgs.value);
  const callArgs = parsedArgs.args ? JSON.parse(parsedArgs.args) : undefined;
  const callOverrides = (() => {
    let overrides = {};
    if (value > 0) {
      overrides = {...overrides, value};
    }
    return overrides;
  })();
  
  if (parsedArgs.dryRun) {
    const pendingTx = await (async () => {
      if (callArgs) {
        return await callee.populateTransaction(...callArgs, {value});
      } else {
        return await callee.populateTransaction(callOverrides);
      }
    })();
    console.log(pendingTx);

    console.log("Dry run mode, the contract won't actual call.");
    process.exit(0);
  }

  const tx = await (async () => {
    if (callArgs) {
      return await callee.send(...callArgs, callOverrides);
    } else {
      return await callee.send(callOverrides);
    }
  })();

  console.log(
    `Tx hash ${tx.hash}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
