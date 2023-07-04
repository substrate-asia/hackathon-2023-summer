const ethers = require('ethers');
const { abi } = require('./compile');

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
const provider = new ethers.JsonRpcProvider(providerRPC.development.rpc, {
  chainId: providerRPC.development.chainId,
  name: providerRPC.development.name,
}); // Change to correct network

const contractAddress = '0x6BADaB931f60efe738739c97F03b6a5a0529D0A8';

const verifier = new ethers.Contract(contractAddress, abi, provider);

const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`);

  // const data = await incrementer.number();

  // console.log(`The current number stored is: ${data}`);
};

get();