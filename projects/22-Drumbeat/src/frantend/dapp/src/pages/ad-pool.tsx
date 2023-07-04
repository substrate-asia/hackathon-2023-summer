import Base from '@/components/common/Base'
import Sidebar from '@/components/common/Sidebar'
import Header from '@/components/common/Header'
import Ad from '@/components/ad/Ad'
import * as U from '@/utils'
import { useState, useContext, useMemo } from 'react'
import BaseCtx from '@/utils/context'
import useApi from '@/hooks/use-api'
import Button from '@/components/ui/BaseButton'


export default function Dashboard() {
  const [ad, setAd] = useState([])

  const { drumbeatAddress } = useContext(BaseCtx)

  const { api } = useApi(U.C.DRUMBEAT_NETWORK)
  const _api = useMemo(() => api, [api])

  return (
    <Base>
      <div className='flex'>
        <Sidebar
          currentPage='Ad'
        />
        <div className='flex-1 bg-gray-100 px-[3.375rem]'>
          <Header currentPage='Ad Pool' />
          {
            ad.length
              ?
              <div className='grid grid-cols-3 gap-10 mb-10'>
                {
                  ad.map((item: any, index) => (
                    <Ad
                      key={index}
                      metadata={item.metadata}
                      cpi={item.cpi}
                      proposer={item.proposer}
                      target={item.target}
                      title={item.title}
                      id={item.id}
                    />
                  ))
                }
              </div>
              :
              <div>
                <Button
                  label='Load your match ads'
                  handleClick={async () => {
                    console.log(999)
                    const P = new U.P(drumbeatAddress!, _api!)
                    const r: any = await P.getUserMatchAdIndex(drumbeatAddress!)
                    const ad: any = await P.getAdInfo(r.info[0] || 0)
                    ad[0].id = r.info[0]
                    console.log(ad)
                    setAd(ad)
                  }}
                  bg='bg-black'
                  color='text-white'
                  borderColor='border-black'
                />
              </div>
          }

        </div>
      </div>
    </Base>
  )
}
