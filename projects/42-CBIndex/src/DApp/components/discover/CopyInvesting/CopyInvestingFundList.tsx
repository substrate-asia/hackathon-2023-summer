import { Button, Card } from 'antd'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import RiseFallLabel from '~/components/Label/RiseFallLabel'
import InitMoney from '~/components/Label/ParseMoney'
import { useRouter } from 'next/router'
import { vault_listApi } from '../../../data/api/AllApi'
import { ethers } from 'ethers'
import GuardianLogic from '../../../data/GuardianLogic.json'
const { Meta } = Card
function splitString(inputString: string): string {
  if (inputString.length <= 8) {
    return inputString
  }

  const firstFourChars: string = inputString.substring(0, 4)
  const lastFourChars: string = inputString.substring(inputString.length - 4)

  return `${firstFourChars}...${lastFourChars}`
}
let provider
let signer: any
let daiContract: any
const CopyInvestingFundList = (props: any) => {
  // const [signer, setSigner] = useState(undefined)
  // const [daiContract, setDaiContract] = useState(null)
  async function getSigner() {
    if (window.ethereum) {
      await window.ethereum.enable()
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      // setSigner(signer)

      const contract = new ethers.Contract(
        '0xCf3C934AC369f72ac5F5e17E8da7206ad4705996',
        GuardianLogic.abi,
        provider
      )
      daiContract = contract
      // setDaiContract(contract)
    }
  }
  const router = useRouter()
  const { selectTabsKey } = props
  const [carLoading, setCarLoading] = useState<boolean>(true)
  const [carInfo, setCarInfo] = useState<any[]>([])
  function getTimeDifference(targetTime: any) {
    const currentTime = new Date()
    const givenTime = new Date(targetTime)
    const timeDifference = Number(currentTime) - Number(givenTime)

    const seconds = Math.floor(timeDifference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    // 构建时间差字符串
    const timeDiffString = `${days}d ${hours % 24}h ${minutes % 60}m ${
      seconds % 60
    }s`

    return timeDiffString
  }
  useEffect(() => {
    setTimeout(() => {
      setCarLoading(false)
    }, 1500)
  }, [])
  useEffect(() => {
    // getSigner()
    vault_listApi().then((d) => {
      console.log(d)
      let temp = []
      for (let i = 0; i < d.data.list.length; i++) {
        let tempt: {
          name: string
          address: string
          detailAddress: string
          runtime: string // 或者使用适当的日期/时间类型
          roi: number
          pnl: number
          nav: number // 或者使用适当的数字类型
          peopleNum: number
          copyAddress: string
          detaiAddress: string
        } = {
          name: '',
          address: '',
          detailAddress: '',
          runtime: '',
          roi: 0,
          pnl: 0,
          nav: 0,
          peopleNum: 0,
          copyAddress: '',
          detaiAddress: '',
        }
        tempt.name = d.data.list[i].name
        tempt.address = d.data.list[i].owner
        tempt.detaiAddress = d.data.list[i].address
        tempt.runtime = getTimeDifference(d.data.list[i].CreatedAt)
        tempt.roi = 10.23
        tempt.pnl = 1088.52
        tempt.nav = 150.5
        tempt.peopleNum = d.data.list[i].followers.length
        tempt.copyAddress = d.data.list[i].guardianAddress
        temp.push(tempt)
      }
      setCarInfo(temp)
    })
  }, [])
  const follow = async (address: string) => {
    let signer
    let contract
    if (window.ethereum) {
      await window.ethereum.enable()
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      contract = new ethers.Contract(address, GuardianLogic.abi, provider)
    }
    try {
      if (signer && contract) {
        const transaction = await contract.connect(signer).Follow({
          gasLimit: 21000000,
        })
        const receipt = await transaction.wait()
      }
    } catch (error) {
      console.log('Interaction Error', error)
    }
  }
  return (
    <>
      <div className="flex flex-wrap">
        {carInfo.map((it) => {
          return (
            <Card
              style={{
                width: '300px',
                height: '360px',
                margin: '12px 8px',
                cursor: 'pointer',
              }}
              hoverable={true}
              className="bg-zinc-800 hover:bg-zinc-700"
              loading={carLoading}
              key={it.name}
            >
              <div
                onClick={() => {
                  router.push({
                    pathname: '/portfolio',
                    query: {
                      address: it.detaiAddress,
                    },
                  })
                  // router.push(')
                }}
              >
                <div className="flex">
                  <div> {it.headsculpture}</div>
                  <div className="flex flex-col mb-4">
                    <span className="text-xl font-bold text-zinc-100">
                      {it.name}
                    </span>
                    <span className="mb-2 text-xs font-semibold text-neutral-500">
                      {splitString(it.address)}
                    </span>
                    <div>
                      <div className="font-semibold">{it.runtime}</div>
                      <div className="text-xs font-semibold text-neutral-500">
                        Since Inception
                      </div>
                    </div>
                  </div>
                </div>
                {/* Statistics */}
                <div className="my-8">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xl font-semibold">
                        <RiseFallLabel num={it.roi} after={'%'} />
                      </div>
                      <div className="text-xs font-semibold text-neutral-500">
                        30D ROI
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">
                        <InitMoney num={it.pnl} fontSize="1.25rem" />
                      </div>
                      <div className="text-xs font-semibold text-neutral-500">
                        30D PNL
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-3">
                    <div>
                      <span className="text-xl font-semibold">
                        <InitMoney num={it.nav} fontSize="1.25rem" />
                      </span>
                      <div className="text-xs font-semibold text-neutral-500">
                        NAV
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">
                        <RiseFallLabel num={it.peopleNum} />
                      </div>
                      <div className="text-xs font-semibold text-neutral-500">
                        Copy Investors
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Meta
                description={
                  <Button
                    // className="float-right rounded-[6px] bg-zinc-900 p-4 text-white group-hover:scale-105"
                    className="float-right bg-zinc-900"
                    onClick={() => follow(it.copyAddress)}
                  >
                    Copy
                  </Button>
                }
              />
            </Card>
          )
        })}
      </div>
    </>
  )
}
export default CopyInvestingFundList
