require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

process.env['HARDHAT'] = true

const { WALLET_PRIVATE_KEY, DEFAULT_NETWORK } = process.env;

const config = {
  solidity: "0.8.18",
  defaultNetwork: DEFAULT_NETWORK,
  networks: {
    hardhat: {}
  }
};

if (config.networks && process.env.POLYGON_MUMBAI_HTTP_API_URL) {
  config.networks.polygon_mumbai = {
    url: process.env.POLYGON_MUMBAI_HTTP_API_URL,
    accounts: [`0x${WALLET_PRIVATE_KEY}`]
  };
}
if (config.networks && process.env.POLYGON_MAINNET_HTTP_API_URL) {
  config.networks.polygon_mainnet = {
    url: process.env.POLYGON_MAINNET_HTTP_API_URL,
    accounts: [`0x${WALLET_PRIVATE_KEY}`]
  };
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = config;
