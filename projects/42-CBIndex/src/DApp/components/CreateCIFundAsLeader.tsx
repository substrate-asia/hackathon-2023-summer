import React, { useState, useEffect } from 'react'
import Sidbar from './Sidbar'
import { Button, Input, Select } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import VaultFactory from '../data/VaultFactory.json'
import { ethers } from 'ethers'
let provider
declare global {
  interface Window {
    ethereum?: any
  }
}
let signer: any
let daiContract: any
const ApplyForLeaderPage = () => {
  // const [signer, setSigner] = useState(undefined)
  // const [daiContract, setDaiContract] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [describeValue, setDescribeValue] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [selectAsset, setSelectAsset] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const handleChange = (value: any) => {
    setSelectAsset(value)
  }
  async function getSigner() {
    if (window.ethereum) {
      await window.ethereum.enable()
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      // setSigner(signer)
      const contract = new ethers.Contract(
        '0xD3F1d851Df6974b3683a84947C3D55bCb375cc19',
        VaultFactory.abi,
        provider
      )
      daiContract = contract
      // setDaiContract(contract)
    }
  }
  useEffect(() => {
    getSigner()
  }, [])
  async function createValut() {

    const vaultName = name
    const vaultSymbol = symbol
    const denominationAsset = selectAsset
    const sharesActionTimelock = 0

    try {
      if (signer && daiContract) {
        const transaction = await daiContract
          .connect(signer)
          .createNewVault(
            vaultName,
            vaultSymbol,
            denominationAsset,
            sharesActionTimelock,
            { gasLimit: 10000000 }
          )
        const receipt = await transaction.wait()
      }
    } catch (error) {
      console.log('Interaction Error:', error)
    }
  }
  return (
    <Sidbar>
      <div
        style={{
          color: 'white',
          width: '100%',
          margin: 'auto',
          height: '100%',
          padding: '20px',
        }}
        className="flex flex-col justify-between rounded-lg bg-zinc-800"
      >
        <div>
          <div>
            <div className="my-8 text-xl font-medium">
              Create a copy-investing fund as the leading investor
            </div>
            <div className="my-4">
              <div className="my-2 text-zinc-400">Fund Name</div>
              <div>
                <Input
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="my-4">
            <div className="my-2 text-zinc-400">Fund Symbol</div>
            <div>
              <Input
                onChange={(e) => {
                  setSymbol(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="my-4">
            <div className="my-2 text-zinc-400">Denomination Asset</div>
            <div>
              <Select
                // defaultValue={{ value: 'USDT', label: 'USDT' }}
                style={{ width: 120 }}
                onChange={handleChange}
                options={[
                  {
                    value: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
                    label: 'MATIC',
                  },

                  {
                    value: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
                    label: 'USDC',
                  },
                  {
                    value: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
                    label: 'Link',
                  },
                  {
                    value: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
                    label: 'Dai',
                  },
                  {
                    value: '0xE03489D4E90b22c59c5e23d45DFd59Fc0dB8a025',
                    label: 'Sand',
                  },
                ]}
              />
            </div>
          </div>
          <div className="mt-16">
            <Button
              className="w-full p-4 text-center text-white border-slate-800"
              onClick={() => createValut()}
              size={'large'}
            >
              Create
            </Button>
          </div>
        </div>
        <div className="my-4 text-gray-900">
          Please note: It will cost some gas fee for the fund creation.
        </div>
      </div>
    </Sidbar>
  )
}
export default ApplyForLeaderPage
