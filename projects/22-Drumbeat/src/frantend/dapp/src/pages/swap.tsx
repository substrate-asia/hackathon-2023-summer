import Base from '@/components/common/Base'
import Sidebar from '@/components/common/Sidebar'
import Header from '@/components/common/Header'
import Button from '@/components/ui/BaseButton'
import Icon13 from '@/components/svg/Icon13'

export default function Swap() {
  return (
    <Base>
      <div className='flex'>
        <Sidebar
          currentPage='Swap'
        />
        <div className='flex-1 bg-gray-100 px-[3.375rem]'>
          <Header
            currentPage='Swap'
          />
          <div className='flex items-center justify-center'>
            <div className='p-[2rem] rounded-[1.25rem] bg-white w-[41.875rem] mt-20'>
              <div className='text-[1.5rem] font-bold mb-1'>Swap</div>
              <div className='mb-10 text-gray-500'>Easy way to trade your tokens</div>
              <div className='p-[1.25rem] rounded-[1.25rem] border bg-[#E5E7EB]'>
                <div className='flex justify-between mb-4'>
                  <div>From</div>
                  <div className='p-1 text-xs bg-blue-600 rounded-full text-white'>Public</div>
                </div>
                <div>
                  <input className='w-full h-[2.25rem] rounded pl-2' type="number" placeholder='amount' />
                </div>
              </div>
              <div className='flex justify-center my-[1.375rem]'>
                <Icon13 />
              </div>
              <div className='p-[1.25rem] rounded-[1.25rem] border bg-[#E5E7EB]'>
                <div className='flex justify-between mb-4'>
                  <div>To</div>
                  <div className='p-1 text-xs bg-blue-600 rounded-full text-white'>Private</div>
                </div>
                <div>
                  <input className='w-full h-[2.25rem] rounded pl-2' type="number" placeholder='amount' />
                </div>
              </div>
              <div className='mt-10 flex justify-center'>
                <Button
                  label='Swap'
                  handleClick={() => { }}
                  bg='bg-black'
                  color='text-white'
                  borderColor='border-black'
                />
              </div> 
            </div>
          </div>
        </div>
      </div>
    </Base>
  )
}
