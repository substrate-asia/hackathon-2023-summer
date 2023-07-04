const ethers = require('ethers');
const verifySquareRootCompiled = require('./compile');
const batchCompiled = require('./compileBatch');

const fs = require('fs');


const providerRPC = {
  development: {
    name: 'moonbeam-development',
    rpc: 'http://localhost:9944',
    chainId: 1281,
  },
  moonbase: {
    name: 'moonbase-alpha',
    rpc: 'https://moonbase-alpha.public.blastapi.io',
    chainId: 1287,
  },
};
const provider = new ethers.providers.JsonRpcProvider(providerRPC.moonbase.rpc, {
  chainId: providerRPC.moonbase.chainId,
  name: providerRPC.moonbase.name,
}); // Change to correct network

const account_from = {
  privateKey: '091e67bea524ca528375b55da511a6aedd6926b128994587866c136cab241cb9',
};
const contractAddress = '0xAd93d0b5969A27718E79d60E300D40122028FAEA';
const _value = 3;

const proof_source = fs.readFileSync('proof.json', 'utf8');


let wallet = new ethers.Wallet(account_from.privateKey, provider);

const contract = new ethers.Contract(contractAddress, verifySquareRootCompiled['abi'], wallet);

const batchAddress = "0x0000000000000000000000000000000000000808";
const batch = new ethers.Contract(batchAddress, batchCompiled['abi'], wallet);

const increment = async () => {
  console.log(
    `Calling the increment by ${_value} function in contract at address: ${contractAddress}`
  );

  // const createReceipt = await incrementer.increment(_value);
  // await createReceipt.wait();
  proof = JSON.parse(proof_source);
  // console.log(proof);
  // console.log(abi);
  const inputStruct = {
    a: {
      X: ethers.BigNumber.from(proof.proof.a[0]),
      Y: ethers.BigNumber.from(proof.proof.a[1]),
    },
    b: {
      X: [ethers.BigNumber.from(proof.proof.b[0][0]), ethers.BigNumber.from(proof.proof.b[0][1])],
      Y: [ethers.BigNumber.from(proof.proof.b[1][0]), ethers.BigNumber.from(proof.proof.b[1][1])],
    },
    c: {
      X: ethers.BigNumber.from(proof.proof.c[0]),
      Y: ethers.BigNumber.from(proof.proof.c[1]),
    }
  }

  // const createReceipt =  await contract.verifyTx(inputStruct, [ethers.BigNumber.from(proof.inputs[0])]);
  // const createReceipt =  await contract.populateTransaction.verifyTx(inputStruct, [ethers.BigNumber.from(proof.inputs[0])]);

  // console.log([inputStruct, [ethers.BigNumber.from(proof.inputs[0])]]);
  const verifyTxCallData = contract.interface.encodeFunctionData("verifyTx",[inputStruct, [ethers.BigNumber.from(proof.inputs[0])]]);
  console.log(verifyTxCallData);
  // console.log(createReceipt);
  // await createReceipt.wait();
  // console.log(`Tx successful with hash: ${createReceipt.hash}`);

  const mockTxCallData = contract.interface.encodeFunctionData("verifyTx",[inputStruct, [ethers.BigNumber.from(ethers.BigNumber.from(proof.inputs[0])-1)]]);
  console.log(mockTxCallData);

  // Assemble and send the batch transaction
  const batchAll = await batch.batchAll(
    [contractAddress, contractAddress], // to address
    [], // value of the native token to send 
    [verifyTxCallData, mockTxCallData], // call data
    [] // gas limit
  );
  await batchAll.wait();
  console.log(`Tx successful with hash: ${batchAll.hash}`);
  
};

increment();