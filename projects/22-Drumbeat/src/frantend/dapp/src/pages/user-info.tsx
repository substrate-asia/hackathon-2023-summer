import Base from '@/components/common/Base'
import Sidebar from '@/components/common/Sidebar'
import Header from '@/components/common/Header'
import Button from '@/components/ui/BaseButton'
import Icon8 from '@/components/svg/Icon8'
import { useContext } from 'react'
import BaseCtx from '@/utils/context'

export default function UserInfo() {
  const { mantaAddress, drumbeatAddress, zkAddress } = useContext(BaseCtx)

  return (
    <Base>
      <div className='flex'>
        <Sidebar
          currentPage='User Info'
        />
        <div className='flex-1 bg-gray-100 px-[3.375rem]'>
          <Header
            currentPage='User Info'
          />
          <div className='p-[2rem] rounded-[1.25rem] bg-white w-[41.875rem]'>
            <div className='flex items-center mb-4'>
              <div className='font-bold mr-2 text-green-500'>
                Drumbeat Address:
              </div>
              <div>{drumbeatAddress}</div>
            </div>
            <div className='flex items-center mb-4'>
              <div className='font-bold mr-2 text-green-500'>
                Manta Address:
              </div>
              <div>{mantaAddress}</div>
            </div>
            <div className='flex items-center mb-4'>
              <div className='font-bold mr-2 text-green-500'>
                Manta ZK Address:
              </div>
              <div className='mr-4'>{zkAddress}</div>
            </div>
            <div className='flex items-center mb-4'>
              <div className='font-bold mr-2 text-green-500'>
                You SBT:
              </div>
              <div className='mr-4'>
                <Icon8 />
                <div className='text-sm font-bold'>NFT Lv.3</div>
              </div>
              <Button
                label='Go Mint'
                handleClick={() => { }}
                bg='bg-black'
                color='text-white'
                borderColor='border-black'
              />
            </div>
          </div>

        </div>
      </div>
    </Base>
  )
}
