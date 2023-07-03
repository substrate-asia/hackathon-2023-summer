/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1287, // Set your custom chainId here
      mining: {
        auto: false, // This tells Hardhat not to mine automatically
        interval: 12000 // This tells Hardhat to mine a new block every 12000 milliseconds (12 seconds)
      }
    }
  },
  solidity: "0.8.18",
};
