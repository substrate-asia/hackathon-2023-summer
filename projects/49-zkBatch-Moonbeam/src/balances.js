const ethers = require('ethers');

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
const provider = new ethers.JsonRpcProvider(providerRPC.moonbase.rpc, {
  chainId: providerRPC.moonbase.chainId,
  name: providerRPC.moonbase.name,
}); // Change to correct network

const addressFrom = '0x69ca007e322e9BB26CFdEE9D0d7633C876b0b131';
const addressTo = '0x6BADaB931f60efe738739c97F03b6a5a0529D0A8';

const balances = async () => {
  const balanceFrom = ethers.formatEther(await provider.getBalance(addressFrom));

  const balanceTo = ethers.formatEther(await provider.getBalance(addressTo));

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

balances();