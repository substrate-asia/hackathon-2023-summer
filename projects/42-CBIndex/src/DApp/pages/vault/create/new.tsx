import React, { useEffect, useState } from 'react'
import MySteps from '~/components/MySteps'
import NewPageForm from '~/components/NewPageForm'
import { Button } from 'antd'
import { ethers } from 'ethers'
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
const VaultNew = () => {
  const [signer, setSigner] = useState<any>()
  const [daiContract, setDaiContract] = useState<string>('')
  const [current, setCurrent] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [symbol, setSymbol] = useState<string>('')
  const [myManagementFee, setMyManagementFee] = useState<string>('')
  const [myPerformanceFee, setMyPerformanceFee] = useState<string>('')
  const [myEntranceFee, setMyEntranceFee] = useState<string>('')
  const [myKindExitFee, setMyKindExitFee] = useState<string>('')
  const [myPendingExitFee, setMyPendingExitFee] = useState<string>('')
  const [myManagementFeeSwitch, setMyManagementFeeSwitch] =
    useState<boolean>(false)
  const [myPerformanceFeeSwitch, setMyPerformanceFeeSwitch] =
    useState<boolean>(false)
  const [myEntranceFeeSwitch, setMyEntranceFeeSwitch] = useState<boolean>(false)
  const [myExitFeeSwitch, setMyExitFeeSwitch] = useState<boolean>(false)
  const stepsAction = (type: string) => {
    if (type === 'next') {
      setCurrent(current + 1)
    } else {
      setCurrent(current - 1)
    }
  }
  const getNameSymbolFuc = (name: string, symbol: string) => {
    setName(name)
    setSymbol(symbol)
  }
  const getTreeFee = (
    managementFee: string,
    performanceFee: string,
    entranceFee: string,
    kindExitFee: string,
    pendingExitFee: string
  ) => {
    setMyManagementFee(managementFee)
    setMyPerformanceFee(performanceFee)
    setMyEntranceFee(entranceFee)
    setMyKindExitFee(kindExitFee)
    setMyPendingExitFee(pendingExitFee)
  }
  const getTreeSwtichStatus = (
    managementFeeSwitch: boolean,
    performanceFeeSwitch: boolean,
    entranceFeeSwitch: boolean,
    exitFeeSwitch: boolean
  ) => {
    setMyManagementFeeSwitch(managementFeeSwitch)
    setMyPerformanceFeeSwitch(performanceFeeSwitch)
    setMyEntranceFeeSwitch(entranceFeeSwitch)
    setMyExitFeeSwitch(exitFeeSwitch)
  }
  useEffect(
    function () {
      console.log(current)
    },
    [current]
  )
  return (
    <div>
      <div className="flex h-full flex-col space-y-8 p-6 sm:flex-row lg:space-y-16">
        <div className=" w-auto sm:w-1/3 ">
          <div className="mb-10 text-2xl font-bold text-white">
            Create Your Vault
          </div>
          <MySteps current={current} />
        </div>
        <div className="md:border-base-300 ml-8 mr-16 h-auto md:border-l"></div>
        <div style={{ width: '100%' }}>
          <div style={{ width: '100%' }}>
            <NewPageForm
              getNameSymbolFuc={getNameSymbolFuc}
              current={current}
              name={name}
              symbol={symbol}
              getTreeFee={getTreeFee}
              myPerformanceFee={myPerformanceFee}
              myManagementFee={myManagementFee}
              myEntranceFee={myEntranceFee}
              myPendingExitFee={myPendingExitFee}
              myKindExitFee={myKindExitFee}
              getTreeSwtichStatus={getTreeSwtichStatus}
              myManagementFeeSwitch={myManagementFeeSwitch}
              myPerformanceFeeSwitch={myPerformanceFeeSwitch}
              myEntranceFeeSwitch={myEntranceFeeSwitch}
              myExitFeeSwitch={myExitFeeSwitch}
            />
          </div>
          <div className="float-right">
            <Button onClick={() => stepsAction('back')}>上一个</Button>
            {current === 7 ? (
              <Button>创建</Button>
            ) : (
              <Button onClick={() => stepsAction('next')}>下一个</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default VaultNew
