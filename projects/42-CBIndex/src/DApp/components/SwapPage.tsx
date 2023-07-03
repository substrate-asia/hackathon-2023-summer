import { Button, Select, InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'
import qs from 'qs'
import { LimitOrder, SignatureType, RfqOrder } from '@0x/protocol-utils'
import { ethers } from 'ethers'
import { Web3Wrapper } from '@0x/web3-wrapper'
// import { providerEngine } from '../components/LimitOrder/provider_engine'
import GuardianLogic from '../data/GuardianLogic.json'
import CallOn from '../data/CallOn.json'
import erc20 from '../data/erc20.json'
import { Web3ProviderEngine } from '@0x/subproviders'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
function formatSelector(str: string) {
  const bytes4 = ethers.utils.id(str).substring(0, 10)
  return bytes4
}

async function init() {
  let response = await fetch('https://tokens.coingecko.com/uniswap/all.json')
  let tokenListJSON = await response.json()
  let nowarr = tokenListJSON.tokens.slice(0, 100)
  const newArray = nowarr.map((obj: any) => {
    return {
      label: (
        <div className="flex text-white">
          <img src={obj.logoURI} /> {obj.name}
        </div>
      ),
      value: obj.address,
    }
  })
  return newArray
}

let provider: any
const SwapPage = () => {
  // const [selectTokenList, setSelectTokenList] = useState([
  //   {
  //     value: '0xE03489D4E90b22c59c5e23d45DFd59Fc0dB8a025',
  //     label: 'SandAddress',
  //   },
  //   {
  //     value: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
  //     label: 'DaiAddress',
  //   },
  //   {
  //     value: 'buyTokenAddress',
  //     label: 'LinkAddress',
  //   },
  //   {
  //     value: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
  //     label: 'UsdcAddress',
  //   },
  // ])
  // const [sellTokenAddress, setSellTokenAddress] = useState(
  //   '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
  // )
  // const [buyTokenAddress, setBuyAddress] = useState(
  //   '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
  // )
  // const [sellAmount, setSellAmount] = useState(0)
  // const [signer, setSigner] = useState('')
  // const [daiContract, setDaiContract] = useState('')
  // const [erc20Contract, setErc20Contract] = useState('')
  // const [balanceOfAmonut, setBalanceOfAmonut] = useState(0)
  // const [returnOrderObj, setReturnOrder] = useState('')
  // const [contractAddress, setContractAddress] = useState(
  //   '0x26AB767c39Ba52fCA0b77790D217Ba139aa7fF2A'
  // )

  // console.log()
  // ethers.utils.
  // ethers.utils.
  // async function getSigner() {
  //   if (window.ethereum) {
  //     await window.ethereum.enable()
  //     provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const signer = provider.getSigner()
  //     setSigner(signer)
  //     const contract = new ethers.Contract(
  //       '0x7A55D70aD3eb809B5F714bfB22efa883BA22689B',
  //       GuardianLogic.abi,
  //       provider
  //     )
  //     const erc20Contract = new ethers.Contract(
  //       sellTokenAddress,
  //       erc20,
  //       provider
  //     )
  //     setErc20Contract(erc20Contract)
  //     setDaiContract(contract)
  //   }
  // }
  // async function sign() {
  //   console.log(returnOrderObj)
  //   const bytes4Signature = formatSelector('takeOrder(address,bytes,bytes)')
  //   const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
  //   const getFutureExpiryInSeconds = () => Math.floor(Date.now() / 1000 + 300) // 5 min expiry
  //   console.log(getFutureExpiryInSeconds())
  //   // const web3Wrapper = new Web3Wrapper(provider)
  //   const accounts = await window.ethereum.request({
  //     method: 'eth_requestAccounts',
  //   })
  //   // const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync()
  //   // maker = accounts[0]
  //   // console.log(maker)

  //   // console.log(accounts[0])
  //   // console.log(provider)
  //   const web3 = new Web3(window.ethereum)
  //   const rfqOrder: RfqOrder = new RfqOrder({
  //     chainId: 80001,
  //     makerToken: buyTokenAddress,
  //     takerToken: sellTokenAddress,
  //     makerAmount: returnOrderObj.orders[0].makerAmount,
  //     takerAmount: returnOrderObj.orders[0].takerAmount,
  //     maker: '0x92bfe961dce0e686809f185236fd66ed9fd792bb',
  //     taker: NULL_ADDRESS,
  //     txOrigin: '0x0261bF3a2BA3539cB8dD455957C00248e19fE3E2',
  //     pool: ethers.utils.formatBytes32String(''),
  //     expiry: getFutureExpiryInSeconds(),
  //     salt: getFutureExpiryInSeconds(),
  //   })
  //   // console.log(rfqOrder.getHash())
  //   const signture = await rfqOrder.getSignatureWithProviderAsync(
  //     web3.currentProvider,
  //     SignatureType.EIP712,
  //     accounts[0]
  //   )
  //   console.log(signture)
  //   const encodedData = ethers.utils.defaultAbiCoder.encode(
  //     [
  //       'tuple(address makerToken,address takerToken,uint128 makerAmount ,uint128 takerAmount,address maker,address taker, address txOrigin,bytes32 pool, uint64 expiry ,uint256 salt) d',
  //       'tuple(uint8 signatureType,uint8 v,bytes32 r, bytes32 s) d',
  //     ],
  //     [
  //       {
  //         makerToken: rfqOrder.makerToken,
  //         takerToken: rfqOrder.takerToken,
  //         makerAmount: rfqOrder.makerAmount,
  //         takerAmount: rfqOrder.takerAmount,
  //         maker: rfqOrder.maker,
  //         taker: rfqOrder.taker,
  //         txOrigin: rfqOrder.txOrigin,
  //         pool: rfqOrder.pool,
  //         expiry: rfqOrder.expiry,
  //         salt: rfqOrder.salt,
  //       },
  //       {
  //         signatureType: signture.signatureType,
  //         v: signture.v,
  //         r: signture.r,
  //         s: signture.s,
  //       },
  //     ]
  //   )
  //   let integrationDataencode = ethers.utils.defaultAbiCoder.encode(
  //     ['bytes', 'uint128', 'uint8'],
  //     [encodedData, returnOrderObj.orders[0].takerAmount, 1]
  //   )
  //   let calldata = ethers.utils.defaultAbiCoder.encode(
  //     ['address', 'bytes4', 'bytes'],
  //     [
  //       '0x26AB767c39Ba52fCA0b77790D217Ba139aa7fF2A',
  //       bytes4Signature,
  //       integrationDataencode,
  //     ]
  //   )
  //   console.log(calldata)
  //   try {
  //     if (signer && daiContract) {
  //       const transaction = daiContract
  //         .connect(signer)
  //         .callOnExtension(
  //           '0x92bfe961dce0e686809f185236fd66ed9fd792bb',
  //           0,
  //           calldata,
  //           { gasLimit: 500000 }
  //         )
  //     }
  //   } catch (error) {
  //     console.log('交互错误:', error)
  //   }
  // }
  // async function getSellSwapPrice() {
  //   let params
  //   await erc20Contract
  //     .balanceOf('0x363483b3b92bD46345cA233f2795dA8399505e42')
  //     .then((d: any) => {
  //       console.log(d.toString())
  //       params = {
  //         sellToken: sellTokenAddress,
  //         buyToken: buyTokenAddress,
  //         sellAmount: d.toString(),
  //       }
  //     })
  //   let response = await fetch(
  //     `https://mumbai.api.0x.org/swap/v1/quote?${qs.stringify(params)}`
  //   )
  //   const data = await response.json()
  //   console.log(data)
  //   setReturnOrder(data)
  // }
  // useEffect(() => {
  //   getSigner()
  // }, [])
  // const sellChangeEvt = (value: string) => {
  //   // setSellTokenAddress(value)
  // }
  // const buyChangeEvt = (value: string) => {
  //   // setBuyAddress(value)
  // }
  // useEffect(() => {
  //   if (sellTokenAddress && sellAmount && buyTokenAddress) {
  //     getSellSwapPrice()
  //   }
  // }, [sellTokenAddress, sellAmount, buyTokenAddress])
  return (
    <>
      <div className="w-full text-white">


        















        {/* <div>
          Select Token:
          <Select onChange={sellChangeEvt} options={selectTokenList} />
          <InputNumber onChange={setSellAmount} />
        </div>
        <div>
          Select Token:
          <Select onChange={buyChangeEvt} options={selectTokenList} />
          <InputNumber />
        </div>
        <Button onClick={() => sign()}>Sign</Button> */}
      </div>
    </>
  )
}

export default SwapPage
