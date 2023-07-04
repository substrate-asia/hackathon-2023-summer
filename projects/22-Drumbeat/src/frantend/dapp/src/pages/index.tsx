import Base from '@/components/common/Base'
import Button from '@/components/ui/BaseButton'
import * as U from '@/utils'
import BaseCtx from '@/utils/context'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import Logo from '@/components/svg/logo'

export default function Home() {
  const { drumbeatAddress, mantaAddress, setDrumbeatAddress, setMantaAddress, setZkAddress, setConnected } = useContext(BaseCtx)
  const router = useRouter()

  return (
    <Base>
      <div className='flex px-[18.4375rem] h-[5rem] items-center border-b'>
        <Logo />
      </div>
      <div className='flex items-center flex-col'>
        <div className='text-[3rem] font-bold mt-[5rem] mb-[3.75rem]'>Connect Wallet</div>
        <div className='text-base mb-[1.25rem]'>Welcome to Drumbeat World, First, please connect your Polkadot Wallet and Manta Wallet, <br />if you don&apos;t have you can create one by our link, here is link to install.
        </div>
        <div className='flex mb-[4rem]'>
          <Button
            label='Install Polkadot Wallet and create a account'
            handleClick={async () => {
              window.open('https://polkadot.js.org/extension/')
            }}
          />
          <div className='w-8'></div>
          <Button
            label='Install manta wallet and create a account'
            handleClick={async () => {
              window.open('https://docs.manta.network/docs/guides/MantaWallet')
            }}
          />
        </div>
        <div className='text-base mb-[1.25rem]'>Here are some tasks to complete:</div>
        <div className='flex justify-between w-full px-[26.875rem] relative'>
          <div className='absolute left-[33rem] right-[30rem] top-[1.1875rem] h-1 bg-black'></div>
          <div className='flex flex-col items-center w-[13rem] relative z-10'>
            <div className='flex justify-center items-center w-[2.5rem] h-[2.5rem] rounded-full bg-black mb-[.625rem]'>
              <div className='text-white text-[1.5rem]'>1</div>
            </div>
            <div className='font-bold text-2xl mb-4'>Polkadot Wallet</div>
            <div className='text-base mb-4'>First connect <br />Polkadot Wallet</div>
            {
              drumbeatAddress ? <div className='font-bold text-green-600'>Connected!</div>
                :
                <Button
                  label='Connect Wallet'
                  handleClick={async () => {
                    console.log(9999)
                    const address = await U.H.connectDrumbeatWallet()
                    console.log(address)
                    setDrumbeatAddress!(address![0].address)
                  }}
                />
            }
          </div>
          <div className='flex flex-col items-center w-[13rem] relative z-10'>
            <div className='flex justify-center items-center w-[2.5rem] h-[2.5rem] rounded-full bg-black mb-[.625rem]'>
              <div className='text-white text-[1.5rem]'>2</div>
            </div>
            <div className='font-bold text-2xl mb-4'>Manta Wallet</div>
            <div className='text-base mb-4'>Second connect <br />Manta wallet</div>
            {
              mantaAddress ? <div className='font-bold text-green-600'>Connected!</div>
                :
                <Button
                  label='Connect Wallet'
                  handleClick={async () => {
                    const address = await U.H.connectMantaWallet()
                    setMantaAddress!(address![0].address)
                    setZkAddress!(address![0].zkAddress)
                  }}
                />
            }
          </div>
          <div className='flex flex-col items-center w-[13rem]relative z-10'>
            <div className='flex justify-center items-center w-[2.5rem] h-[2.5rem] rounded-full bg-black mb-[.625rem]'>
              <div className='text-white text-[1.5rem]'>3</div>
            </div>
            <div className='font-bold text-2xl mb-4'>Complete</div>
            <div className='text-base mb-4'>Let us go into<br />Drumbeat world</div>
            <Button
              label='Completed'
              handleClick={() => {
                if (!drumbeatAddress) {
                  alert('Please connect polkadot!')
                  return
                }
                if (!mantaAddress) {
                  alert('Please connect manta!')
                  return
                }
                U.Messager.sendMessageToContent(U.C.DRUMBEAT_MSG_HACKATHON_ACCOUNT, { address: drumbeatAddress })
                router.push('/dashboard')
              }}
            />
          </div>
        </div>
      </div>
    </Base>
  )
}
