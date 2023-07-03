import React, { useEffect, useState } from 'react'
import { Card, Skeleton, Avatar, Button, Tabs, InputNumber } from 'antd'
import Image from 'next/image'
import RiseFallLabel from '~/components/Label/RiseFallLabel'
import ParseMoney from '~/components/Label/ParseMoney'
// import type { TabsProps } from 'antd'
import CurrentPositions from '~/components/protfolioTabs/CurrentPositions'
import TradeHistory from '~/components/protfolioTabs/TradeHistory'
import StatisticalData from '~/components/protfolioTabs/StatisticalData'
import DepositsAndWithdrawals from '~/components/protfolioTabs/DepositsAndWithdrawals'
import GuardianLogic from '../data/GuardianLogic.json'
import { BigNumber, ethers } from 'ethers'
import { vault_detailsApi } from '../data/api/AllApi'
import { useRouter } from 'next/router'
import erc20 from '../data/erc20.json'
// import { BigNumber } from 'ethers'
// import BigNumber from 'bignumber.js'
// import InputNumber from 'antd/es/input/InputNumber'
// interface CarInfo {
//   guardianAddress: string
//   name: string
//   age: number
//   address: string
//   tags: string[]
//   owner: string
// }
const { Meta } = Card
let provider

const mtAbi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Withdrawal',
    type: 'event',
  },
]
let signer
let daiContract
let erc20Contract
const PortfolioList = () => {
  // const [signer, setSigner] = useState(undefined)
  // const [daiContract, setDaiContract] = useState(null)
  const [carInfo, setCarInfo] = useState({
    guardianAddress: '',
    name: '',
    age: 0,
    address: '',
    tags: [],
    owner: '',
  })
  const [userAddress, setUserAddress] = useState('')
  const [assetsList, setAssetsList] = useState([])
  const [TradeHistoryList, setTradeHistoryList] = useState([])
  const [followersList, setFollowersList] = useState([])
  // const [erc20Contract, setErc20Contract] = useState(null)
  const [userBalance, seUserBalance] = useState(0)
  const [vaultBaseAssetAddress, setVaultBaseAssetAddress] = useState('')
  const [depositAmount, setDepositAmount] = useState(0)
  const router = useRouter()
  const onChange = (key) => {
    console.log(key)
  }
  async function getSigner(address, denominationAsset) {
    if (window.ethereum) {
      await window.ethereum.enable()
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      daiContract = new ethers.Contract(address, GuardianLogic.abi, provider)
      // setDaiContract(contract)
      // daiContract = contract
      let erc20Contract = new ethers.Contract(
        denominationAsset,
        erc20,
        provider
      )

      erc20Contract.balanceOf(accounts[0]).then((d) => {
        seUserBalance(d.toString() / 10 ** 18)
      })
      // setErc20Contract(erc20Contract)
    }
  }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    vault_detailsApi(router.asPath.split('=')[1]).then((d) => {
      setAssetsList(d.data.assets)
      setTradeHistoryList(d.data.activities)
      setCarInfo(d.data)
      getSigner(d.data.guardianAddress, d.data.denominationAsset)
      setVaultBaseAssetAddress(d.data.denominationAsset)
      setFollowersList(d.data.followers)
    })
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])
  const items = [
    {
      key: '1',
      label: `Portfolio`,
      children: <CurrentPositions assetsList={assetsList} />,
    },
    {
      key: '2',
      label: `Activity`,
      children: <TradeHistory TradeHistoryList={TradeHistoryList} />,
    },
    {
      key: '3',
      label: `Copy Investors`,
      children: <StatisticalData followersList={followersList} />,
    },
    // {
    //   key: '4',
    //   label: `Deposits and Withdrawals`,
    //   children: <DepositsAndWithdrawals />,
    // },
  ]
  const DepositEvt = async () => {
    const wmaticContract = new ethers.Contract(
      vaultBaseAssetAddress, //mtAddress
      mtAbi, //mtABi
      signer
    )
    const allowanceAmount = await wmaticContract.allowance(
      localStorage.getItem('address'), // 授权者的地址
      carInfo.guardianAddress // 合约地址或被授权者的地址
    )
    // if

    if (allowanceAmount.toString() === '0') {
      const amountToApprove = ethers.constants.MaxUint256
      const approveTx = await wmaticContract.approve(
        carInfo.guardianAddress, //
        amountToApprove
      )
      await approveTx.wait()
    }
    const investmentAmount = (depositAmount * 10 ** 18).toString()
    const minSharesQuantity = 0.00001 * 10 ** 18
    try {
      if (signer && daiContract) {
        // empower wmt
        const transaction = await daiContract
          .connect(signer)
          .buyShares(investmentAmount, minSharesQuantity, {
            gasLimit: 15000000,
          })
        const receipt = await transaction.wait()
        console.log(receipt)
      }
    } catch (error) {
      console.log('Interaction Error:', error)
    }
  }
  const followEvt = async (address) => {
    let signer
    let contract
    if (window.ethereum) {
      await window.ethereum.enable()
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      contract = new ethers.Contract(address, GuardianLogic.abi, provider)
    }
    console.log(contract)
    try {
      if (signer && contract) {
        const transaction = await contract.connect(signer).Follow({
          gasLimit: 2100000,
        })
        const receipt = await transaction.wait()
      }
    } catch (error) {
      console.log('Interaction Error:', error)
    }
  }
  return (
    <div>
      <div className="pt-6">
        <Card style={{ width: '70%', margin: 'auto', padding: '10px' }}>
          <Skeleton loading={loading} avatar active>
            <Meta
              avatar={
                <Image
                  src="/images/123.jpg"
                  width={60}
                  height={60}
                  style={{ borderRadius: '50%' }}
                  alt="Avator"
                />
              }
              title={carInfo.name}
              description={carInfo.owner}
            />
            {/* <div className="flex flex-col float-right">
              <div>{vaultBaseAssetAddress}</div>
              <div>{vaultBaseAssetAddress}</div>
              <div>Max: {Math.floor(userBalance * 10000) / 10000}</div>
              <div className="flex items-center">
                <span className="mr-4">
                  <InputNumber
                    max={Math.floor(userBalance * 10000) / 10000}
                    min={0}
                    step={0.01}
                    onChange={setDepositAmount}
                  />
                </span>

                <a
                  className="float-right text-emerald-500"
                  onClick={() => DepositEvt()}
                >
                  Deposit
                </a>
              </div>
            </div> */}
            <div className="my-8 grid grid-cols-2 items-end gap-[16px] md:mb-[24px] md:mt-[24px] md:grid-cols-4 lg:grid-cols-4">
              <div className="flex flex-col items-start mb-4">
                <div className="text-2xl font-medium">
                  <RiseFallLabel num={10.2} after={'%'} />
                </div>
                <div className="text-sm text-zinc-400">7D ROI</div>
              </div>
              <div lassName="flex flex-col items-start mb-4">
                <div className="text-2xl font-medium">
                  <ParseMoney num={101.11} fontSize="1.25rem" />
                </div>
                <div className="text-sm text-zinc-400">7D PNL (USD)</div>
              </div>
              <div lassName="flex flex-col items-start mb-4">
                <div className="text-2xl font-medium">103</div>
                <div className="text-sm text-zinc-400">Copy Investors</div>
              </div>
              <div lassName="flex flex-col items-start mb-4">
                <div className="text-2xl font-medium">
                  <ParseMoney num={150.5} fontSize="1.25rem" />
                </div>
                <div className="text-sm text-zinc-400">
                  Net Asset Value (USD)
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button
                onClick={() => followEvt(carInfo.guardianAddress)}
                className="w-full bg-zinc-900"
              >
                Copy
              </Button>
            </div>
          </Skeleton>
        </Card>
        <Tabs
          defaultActiveKey="1"
          style={{ width: '70%', margin: 'auto', marginTop: '20px' }}
          items={items}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
export default PortfolioList
