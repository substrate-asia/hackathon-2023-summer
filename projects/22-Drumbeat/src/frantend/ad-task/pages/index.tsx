import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import axios from 'axios';
import { Steps, message } from 'antd';
import { useState, useMemo } from 'react';
import { ethers, BigNumber } from 'ethers'
import detectEthereumProvider from "@metamask/detect-provider";
import * as U from '../utils'
import useApi from '../hooks/use-api';

const { Step } = Steps;

const Web3: NextPage = () => {

  const [connect, setConnect] = useState(false)
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState('')

  const router = useRouter()
  const { id } = router.query

  const { api } = useApi("wss://testnet.admeta.network")
  const _api = useMemo(() => api, [api])

  const handleToClaim = async () => {
    if (id) {
      const P = new U.P(address!, _api!)
      const r: any = await P.claimReward(+id)
      console.log(r)
    }
    
  }

  const stepDom = () => (
    <Steps current={step} labelPlacement="vertical">
      <Step title="Connect Wallet" description="First connect wallet." />
      <Step title="Go Telegram" description="Go telegram and browse Admeta." />
      <Step title="Claim rewards" description="Go Admeta claim rewards." />
    </Steps>
  )

  const handleConnectMetamask = () => {
    const w = window as any
    if (typeof w.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      w.ethereum.request({ method: 'eth_requestAccounts' }).then((a: any) => {
        setAddress(a[0])
        setConnect(true)
        setStep(1)
      });
    } else {
      message.error('Please first install metamask extenison on your pc')
    }
  }

  const handleConnectPolkadot = async () => {
    const accounts = await U.H.connectPolkadotWallet()
    console.log(id)
    setAddress(accounts![0].address || '')
    setConnect(true)
    setStep(1)
  }

  const formatAddress = (address: string): string => {
    const str_1 = address.substring(0, 5)
    const str_2 = address.substring(address.length - 4)
    return `${str_1}......${str_2}`
  }

  return (
    <div className="container">
      <Head>
        <title>Web3</title>
        <meta name="description" content="web3 ecology" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="web3">
        <div className='w-screen flex fiexd top-0 left-0 right-0 h-20 pl-8 pr-8 justify-between items-center'>
          <div className='text-3xl italic font-bold text-white'>Admeta Web3 Case</div>
          {
            connect
              ?
              <div className='pl-4 pr-4 pt-2 pb-2 rounded-full border-blue-600 border-2'>
                <div className='text-base text-white font-bold'>{formatAddress(address)}</div>
              </div>
              :
              <div
                onClick={handleConnectPolkadot}
                className='bg-blue-600 pl-4 pr-4 pt-2 pb-2 rounded-full cursor-pointer hover:bg-blue-700 font-bold'>
                <div className='text-white'>Connect wallet</div>
              </div>
          }
        </div>
        <div className='w-full pt-8 pb-8 main-title text-center text-5xl font-bold mb-20 mt-20'>
          Complete the following tasks to get rewards
        </div>
        <div className='pl-20 pr-20 mb-20'>
          {stepDom()}
        </div>

        <div className='w-full flex justify-center items-center'>
          {
            step === 0
            &&
            <div
              onClick={handleConnectPolkadot}
              className='text pl-8 pr-8 hover:bg-blue-700 bg-blue-600 pt-4 pb-4 rounded-full cursor-pointer text-white font-bold'>
              Connect Wallet
            </div>
          }

          {
            step === 1
            &&
            <div
              onClick={() => {
                window.open('https://t.me/admetanetwork', '_blank')
                setStep(2)
              }}
              className='text pl-8 pr-8 hover:bg-blue-700 bg-blue-600 pt-4 pb-4 rounded-full cursor-pointer text-white font-bold'>
              Go telegram
            </div>
          }

          {
            step === 2
            &&
            <div
              onClick={() => {
                handleToClaim()
                setStep(3)
              }}
              className='text pl-8 pr-8 hover:bg-blue-700 bg-blue-600 pt-4 pb-4 rounded-full cursor-pointer text-white font-bold'>
              Completed
            </div>
          }
        </div>
      </div>

      <div className="footer">
        Powered by Web3 Ecology
      </div>
    </div>
  )
}
export default Web3
