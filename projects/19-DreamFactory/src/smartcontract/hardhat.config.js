require("@nomiclabs/hardhat-waffle")
// Optionally, import for contract verification on Polygonscan
require("@nomiclabs/hardhat-etherscan")
const dotenv = require("dotenv")
dotenv.config()

/**
 * Config sets the gateways to the proper node provider on Goerli & Polygon Mumbai testnets & loads the private key from `.env`
 */
module.exports = {
	solidity: "0.8.4",
	hardhat: {},
	networks: {
		"polygon-mumbai": {
			url: `https://astar-mainnet.g.alchemy.com/v2/ZhIkUrefaBHNymOw6V0B4-MLNvpZFYiU/v2/${process.env.ALCHEMY_POLYGON_MUMBAI_API_KEY}`,
			accounts: [`${process.env.PRIVATE_KEY}`],
		},
	},
	// Set the API keys where the keys are defined by: `npx hardhat verify --list-networks`
	etherscan: {
		apiKey: {
			polygonMumbai: process.env.POLYGONSCAN_API_KEY,
		},
	},
}
