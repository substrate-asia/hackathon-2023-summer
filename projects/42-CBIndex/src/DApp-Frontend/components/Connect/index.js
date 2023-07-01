import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon, arbitrumGoerli } from 'wagmi/chains'
import {
  Web3Button,
  Web3Modal,
  useWeb3ModalTheme,
  Web3NetworkSwitch,
} from '@web3modal/react'
import { Button } from 'antd'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { IFundDeployer } from '../../data/abis/IFundDeployer'
const daiAddress = '0x2662fA996a31A09A7987bf1fe218271B91cBAAfA'
const daiAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_fundOwner',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_fundName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_fundSymbol',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_denominationAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_sharesActionTimelock',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_feeManagerConfigData',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_policyManagerConfigData',
        type: 'bytes',
      },
    ],
    name: 'createNewFund',
    outputs: [
      {
        internalType: 'address',
        name: 'comptrollerProxy_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'vaultProxy_',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
const chains = [arbitrum, mainnet, polygon, arbitrumGoerli]
const projectId = 'bce62feae59107ac8ebbdc9aa8810513'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

const Connect = () => {
  const [signer, setSigner] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const { setTheme } = useWeb3ModalTheme()
  function enCodeFunc(fee, address, contractAddressArray) {
    const feeArray = ethers.utils.defaultAbiCoder.encode(
      ['uint256', 'address'],
      [fee, address]
    )
    const encodedBytes = ethers.utils.defaultAbiCoder.encode(
      ['address[]', 'bytes[]'],
      [[...contractAddressArray], [feeArray]]
    )
    return encodedBytes
  }
  async function createNewFund() {
    const fee = ethers.utils.defaultAbiCoder.encode(
      ['uint256', 'address'],
      [500, '0x0261bF3a2BA3539cB8dD455957C00248e19fE3E2']
    )
    //  然后将合约地址和Fee的bytes合并到一起
    // console.log(a)
    const encodedBytes = ethers.utils.defaultAbiCoder.encode(
      ['address[]', 'bytes[]'],
      [['0x09d98A5bb4eC2deE15B35a5a0be051E1d62fFd8e'], [fee]]
    )
    console.log(encodedBytes)

    const fundOwner = '0x0261bF3a2BA3539cB8dD455957C00248e19fE3E2' // 基金拥有者的地址
    const fundName = '123' // 基金名称
    const fundSymbol = '123' // 基金代号
    const denominationAsset = '0x1980A588fA420E874fC5fB1e0E68FBE39c34672f' // 衡量资产的地址
    const sharesActionTimelock = 123 // 股份操作锁定时间
    const feeManagerConfigData = encodedBytes // 费用管理器配置数据（bytes 类型）
    const policyManagerConfigData = new Uint8Array(0) // 策略管理器配置数据（bytes 类型）
    // const policyManagerConfigData = ethers.utils.formatBytes32String('') // 策略管理器配置数据（bytes 类型）
    try {
      if (signer && daiContract) {
        const transaction = await daiContract
          .connect(signer)
          .createNewFund(
            fundOwner,
            fundName,
            fundSymbol,
            denominationAsset,
            sharesActionTimelock,
            feeManagerConfigData,
            policyManagerConfigData,
            { gasLimit: 21000000 }
          )
        const receipt = await transaction.wait()
        console.log(receipt)
      }
    } catch (error) {
      console.log('交互错误:', error)
    }
  }
  async function getSigner() {
    if (window.ethereum) {
      await window.ethereum.enable()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      setSigner(signer)
      const contract = new ethers.Contract(daiAddress, daiAbi, provider)
      setDaiContract(contract)
    }
  }
  useEffect(() => {
    setTheme({
      themeMode: 'dark',
      themeVariables: {
        '--w3m-font-family': 'Roboto, sans-serif',
        '--w3m-accent-color': '#F5841F',
        '--w3m-background-color': 'rgb(20,20,20)',
      },
    })
    getSigner()
  }, [])

  return (
    <>
      <Button onClick={() => createNewFund()}>创建基金</Button>
      <WagmiConfig config={wagmiConfig}>
        <Web3Button />
        <Web3NetworkSwitch />
      </WagmiConfig>
      <Web3Modal
        projectId={projectId}
        themeMode="dark"
        ethereumClient={ethereumClient}
      />
    </>
  )
}

export default Connect
