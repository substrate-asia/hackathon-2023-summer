import { FC, useEffect, useState } from "react";
import * as U from '../../util'
import browser from 'webextension-polyfill'

const Rewards: FC = () => {
  const [info, setInfo] = useState<U.Soul>()

  useEffect(() => {
    browser.storage.local.get(['address']).then(({ address }) => {
      U.Helper.apiCall({ method: 'GET', URI: `hackathon/check/${address}` }).then((v) => {
        setInfo(v[0])
      })
    });

  }, [])

  return (
    <div className="w-full pl-4 pr-4 mb-10">
      <div className="text-white text-2xl font-semibold mb-2">Your Rewards</div>
      <div className="flex justify-between items-center mb-10">
        <div
          className="rounded flex flex-col justify-center items-center py-4"
          style={{
            width: '49%',
            background: 'rgba(55, 114, 255, 0.16)'
          }}
        >
          <div
            className="text-white text-xs font-semibold"
            style={{
              color: '#9AA0B0'
            }}
          >Total</div>
          <div className="flex justify-center items-center my-2">
            <div className="text-white text-2xl font-semibold mr-2">{info?.total}</div>
            <div className="text-white text-xs font-semibold">AMD</div>
          </div>
          <div className="inline-flex py-2 px-4 border-white border rounded-full">
            <div
              className="text-sm font-semibold cursor-pointer"
              style={{
                color: '#E6E7F0'
              }}
            >History</div>
          </div>
        </div>
        <div
          className="rounded flex flex-col justify-center items-center py-4"
          style={{
            width: '49%',
            background: 'rgba(55, 114, 255, 0.16)'
          }}>
          <div className="text-white text-xs font-semibold"
            style={{
              color: '#9AA0B0'
            }}>Uncliam</div>
          <div className="flex justify-center items-center my-2">
            <div className="text-white text-2xl font-semibold mr-2">{info?.uncliam}</div>
            <div className="text-white text-xs font-semibold">AMD</div>
          </div>
          <div className="inline-flex py-2 px-4 border-white border rounded-full">
            <div
              className="text-sm font-semibold cursor-pointer"
              style={{
                color: '#E6E7F0'
              }}
              onClick={async () => {
                const { address } = await browser.storage.local.get(['address'])
                const r = await U.Helper.apiCall({
                  method: 'GET',
                  URI: `hackathon/check/${address}`
                })
                if (!r.length) {
                  return
                }

                const obj: U.Params = r[0]
                const uncliam = 0
                const params = {
                  ...obj,
                  uncliam
                }

                await U.Helper.apiCall({
                  method: 'POST',
                  URI: `hackathon/update`,
                  params
                })

                U.Helper.apiCall({ method: 'GET', URI: `hackathon/check/${address}` }).then((v) => {
                  setInfo(v[0])
                })
              }}
            >Claim</div>
          </div>
        </div>
      </div>
      <div className="text-white text-2xl font-semibold mb-2">Your Tasks</div>
      <div className="mb-10">
        <div
          className="mb-3 rounded relative p-4 cursor-pointer"
          style={{
            background: '#1D1F26'
          }}
          onClick={async () => {
            const { address } = await browser.storage.local.get(['address'])
            const r = await U.Helper.apiCall({
              method: 'GET',
              URI: `hackathon/check/${address}`
            })
            if (!r.length) {
              return
            }
            const obj: U.Params = r[0]
            const uncliam = Number(obj['uncliam']) + 50
            const total = Number(obj['total']) + 50
            const params = {
              ...obj,
              uncliam,
              total
            }
            await U.Helper.apiCall({
              method: 'POST',
              URI: `hackathon/update`,
              params
            })
            U.Helper.goWeb('https://web3go.xyz/')
          }}
        >
          <div className="text-white text-sm font-semibold mb-2">Broswer Web3go</div>
          <div
            className="text-sm mb-2"
            style={{
              color: '#777E90',
              lineHeight: '18px'
            }}
          >Complete 1 simple task to earn 50 AMD now, Web3Go is an all-in-one open data analytics and service platform where everyone can grasp the value behind blockchain data.</div>
          <div
            className="text-white text-xs font-semibold rounded absolute right-0"
            style={{
              padding: '2px 8px',
              top: '-4px',
              background: '#3772FF'
            }}
          >50 AMD</div>
        </div>
        <div
          className="mb-3 rounded relative p-4 cursor-pointer"
          style={{
            background: '#1D1F26'
          }}
          onClick={async () => {
            const { address } = await browser.storage.local.get(['address'])
            const r = await U.Helper.apiCall({
              method: 'GET',
              URI: `hackathon/check/${address}`
            })
            if (!r.length) {
              return
            }
            const obj: U.Params = r[0]
            const uncliam = Number(obj['uncliam']) + 50
            const total = Number(obj['total']) + 50
            const params = {
              ...obj,
              uncliam,
              total
            }
            await U.Helper.apiCall({
              method: 'POST',
              URI: `hackathon/update`,
              params
            })
            U.Helper.goWeb('https://litentry.com/')
          }}
        >
          <div className="text-white text-sm font-semibold mb-2">Broswer Litentry</div>
          <div
            className="text-sm mb-2"
            style={{
              color: '#777E90',
              lineHeight: '18px'
            }}
          >Complete 1 simple task to earn 50 AMD now, Litentry is a Decentralized Identity Aggregation protocol across multiple networks. </div>
          <div
            className="text-white text-xs font-semibold rounded absolute right-0"
            style={{
              padding: '2px 8px',
              top: '-4px',
              background: '#3772FF'
            }}
          >50 AMD</div>
        </div>
      </div>
    </div>
  )
}

export default Rewards;