require("@nomicfoundation/hardhat-toolbox");
require('hardhat-contract-sizer');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // 指定编辑器版本
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
    allowUnlimitedContractSize: true,
  },
  // gas费设置
  gas: 20000000000,
  // 合约大小分析插件
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  // Gas费监控插件
  gasReporter: {
    enabled: true,
    outputFile: "gas-reporter.txt",
    noColors: true,
    token: "MATIC",
  },
  // 网络节点
  networks: {
    "ganache": {
      url: `http://127.0.0.1:9001`,
      accounts: [
        `0x4eafaa8b29c46db27acce8c6dbf3f0792923683fd1cd69009b80e19cef82074b`,
        `0x33af3a517ee1208d122573b5a8e452c3feb8c7fe0829897f449929b2b053c39c`,
        `0x11c651075f437afad6a71c8e64638efdb655dc8f3598c50efba6d11d1b1bebb0`,
        `0x2409737d753df17ec16719235cbb3436e961f5090690af9e35426de39cfad92e`
      ]
    },
    "moonbeamalpha": {
      url: `https://rpc.testnet.moonbeam.network`,
      accounts: [`0xXXX`], //不要上传这个key, 自己本地部署时替换就好了。
      chainId: 1287
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts/app", // 确保这个路径正确
  },
};
