import Base from '@/components/common/Base'
import Sidebar from '@/components/common/Sidebar'
import Header from '@/components/common/Header'
import Icon5 from '@/components/svg/Icon5'
import Icon6 from '@/components/svg/Icon6'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell, Bar } from 'recharts'
import Icon7 from '@/components/svg/Icon7'
import Icon8 from '@/components/svg/Icon8'
import Icon9 from '@/components/svg/Icon9'
import Icon10 from '@/components/svg/Icon10'
import Icon11 from '@/components/svg/Icon11'
import BaseCtx from '@/utils/context'
import { useContext, useEffect, useMemo, useState } from 'react'
import * as U from '@/utils'
import useApi from "@/hooks/use-api";

const data = [
  {
    "name": "A",
    "statistics": 17
  },
  {
    "name": "B",
    "statistics": 21
  },
  {
    "name": "C",
    "statistics": 15
  }
]
const colors = ['#BADFDF', '#DCD4EF', '#E4833D'];

export default function Dashboard() {

  const { api } = useApi(U.C.DRUMBEAT_NETWORK)
  const _api = useMemo(() => api, [api])
  const [balance, setBalance] = useState('0')
  const [earn, setEarn] = useState('0')
  const [P, setP] = useState<U.P>()
  const [currentData, setCurrentData] = useState<any>()

  const { drumbeatAddress } = useContext(BaseCtx)

  useEffect(() => {
    const P = new U.P(drumbeatAddress!, _api!)

    setP(P)
    P.getAddressBanlance().then((v) => {
      console.log(v)
      const b: number = (v as number) / Math.pow(10, 12)
      console.log(b.toFixed(2))
      setBalance(b.toFixed(2))
    })

    const data = localStorage.getItem('sync_data')
    if (data) {
      const d = U.H.formatLevelData(JSON.parse(data))
      console.log(d)
      setCurrentData(d)
    }
  }, [drumbeatAddress, _api])

  return (
    <Base>
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 bg-gray-100 px-[3.375rem]'>
          <Header />
          <div className='flex items-start mb-[1.75rem]'>
            <div className='p-[1.25rem] border border rounded-[.625rem] border-dashed w-[13.75rem] mr-[2rem]'>
              <div className='flex items-end mb-[1.875rem]'>
                <Icon5 />
                <div className='ml-2 text-[1.375rem] font-bold'>Balance</div>
              </div>
              <Icon6 />
              <div className='text-[1.375rem] font-bold mt-[1.875rem]'>${balance}</div>
            </div>
            <div className='w-[29.75rem] rounded-[10px] bg-white p-[1rem]'>
              <div className='text-[1.25rem] font-bold mb-1'>Earnings Statistics</div>
              <div className='px-2 py-0 rounded bg-[#46CACA4F] text-xs mb-2 inline-block'>8%</div>
              <div>
                <BarChart width={420} height={120} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis />
                  <Bar dataKey="statistics" fill="#E4833D" barSize={60} label={{ fill: 'black', fontSize: 14, position: 'insideBottom' }} >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </div>
          </div>
          <div className='flex mb-[1.75rem]'>
            <div className='p-[2rem] bg-white rounded-[1.25rem] mr-[1.5rem] h-[12.5rem] flex flex-col justify-between mr-[1.5rem]'>
              <div className='flex items-center'>
                <Icon7 />
                <div className='text-[.875rem] font-semibold ml-2'>Total earnings</div>
              </div>
              <div className='flex items-center'>
                <div className='text-[2.5rem] mr-2 font-semibold text-[#3772FF]'>{+balance / 100 * 0.6}</div>
                <div className='px-2 py-0 bg-[#58BD7D] text-sm font-semibold rounded'>ADM</div>
              </div>
              <div className='text-[1.5rem] font-bold text-[#777E90]'>${+balance / 100 * 0.6 * 1.8}</div>
            </div>
            <div className='p-[2rem] bg-white rounded-[1.25rem] mr-[1.5rem] h-[12.5rem] flex flex-col justify-between mr-[1.5rem]'>
              <div className='flex items-center'>
                <Icon7 />
                <div className='text-[.875rem] font-semibold ml-2'>Completed ad tasks</div>
              </div>
              <div className='flex items-center'>
                <div className='text-[2.5rem] mr-2 font-semibold text-[#3772FF]'>{Math.round(Math.random() * 20)}</div>
              </div>
              <div className='bg-gray-200 h-2'>
                <div className='w-[30%] bg-[#3772FF] h-2'></div>
              </div>
            </div>
            <div className='p-[2rem] bg-white rounded-[1.25rem] mr-[1.5rem] h-[12.5rem] flex flex-col justify-between'>
              <div className='flex items-center'>
                <Icon7 />
                <div className='text-[.875rem] font-semibold ml-2'>Earned NFT badges</div>
              </div>
              <div className='flex items-start'>
                <div className='w-[3.75rem] mr-[.75rem] flex flex-col items-center'>
                  <Icon8 />
                  <div className='text-xs font-bold'>Metaverse</div>
                  <div className='text-xs font-bold'>LV:3</div>
                </div>
                <div className='w-[3.75rem] mr-[.75rem] flex flex-col items-center'>
                  <Icon9 />
                  <div className='text-xs font-bold'>GameFi</div>
                  <div className='text-xs font-bold'>LV:3</div>
                </div>
                <div className='w-[3.75rem] mr-[.75rem] flex flex-col items-center'>
                  <Icon10 />
                  <div className='text-xs font-bold'>DeFi</div>
                  <div className='text-xs font-bold'>LV:3</div>
                </div>
                <div className='w-[3.75rem] flex flex-col items-center'>
                  <Icon11 />
                  <div className='text-xs font-bold'>DEX</div>
                  <div className='text-xs font-bold'>LV:3</div>
                </div>
              </div>
            </div>
          </div>
          <div className='p-[2rem] rounded-[20px] bg-white mb-10'>
            <div className='text-[1.5rem] font-semibold mb-[2.5rem]'>Current Web3 records:</div>
            {
              currentData?.tag.map((item: any, index: number) => (
                <div className='flex items-center mb-4' key={index}>
                  <div className='w-[2.5rem] h-[2.5rem] rounded bg-[#7551FF] mr-4'></div>
                  <div className='w-[8.75rem] text-[1rem] font-semibold mr-4'>{item} Score</div>
                  <div className='w-[6.25rem] text-[.875rem] text-[#777E90] font-semibold mr-4'>{currentData?.score[index]}</div>
                  <div className='w-[6.25rem] text-[.875rem] text-[#FC1212] font-semibold mr-4'>Lv.{currentData?.level[index]}</div>
                  <div className='w-[25rem] h-[12px] bg-gray-200'>
                    <div 
                    className={`h-[12px] bg-[#3772FF]`}
                    style={{
                      width: currentData?.level[index] !== 0 ? Math.ceil(Math.random()*100) + '%' : '0%'
                    }}
                    ></div>
                  </div>
                </div>
              ))}

          </div>
        </div>
      </div>
    </Base>
  )
}
