import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import FastActionBox from '~/components/FastActionBox'
import SectionContainer from '~/components/SectionContainer'
import link_icon from '~/public/images/link_blank.png'
import { FundOutlined } from '@ant-design/icons'
const Sidbar = (props: any) => {
  const router = useRouter()
  return (
    <>
      <SectionContainer>
        <div className="flex lg:gap-16 lg:space-y-0 xl:gap-16">
          <div className="px-2 py-4 rounded-lg w-72 bg-slate-700 lg:col-span-4 xl:col-span-3">
            <div>
              <div className="hidden lg:block">
                <div className="space-y-1">
                  <div className="flex p-2 rounded-md group/item hover:bg-slate-200">
                    <span>
                      <Link href="https://app.cbindex.finance/">
                        <a
                          className="block mr-2 text-base text-scale-1200"
                          target={'_blank'}
                        >
                          CBIndex App
                        </a>
                      </Link>
                    </span>

                    <span className="flex items-center">
                      <Image
                        src={link_icon}
                        width={20}
                        height={20}
                        alt="link"
                      />
                    </span>
                  </div>
                  <div className="flex p-2 rounded-md group/item hover:bg-slate-200">
                    <button
                      onClick={() => router.push('/discover/CopyInvesting')}
                      className="block text-base text-scale-1200"
                    >
                      Copy-Investing
                    </button>
                  </div>
                  <div className="flex p-2 rounded-md">
                    <button
                      onClick={() => router.push('/discover/vaults')}
                      className="block text-base text-scale-1200 disabled:opacity-30"
                      disabled
                    >
                      Active Fund
                    </button>
                  </div>
                  <div className="flex p-2 rounded-md">
                    <button
                      onClick={() => router.push('/discover/vaults')}
                      className="block text-base text-scale-1200 disabled:opacity-30"
                      disabled
                    >
                      Index Fund
                    </button>
                  </div>
                  <div className="flex p-2 rounded-md group/item hover:bg-slate-200">
                    <button
                      onClick={() => router.push('/swap')}
                      className="block text-base text-scale-1200"
                    >
                      Swap
                    </button>
                  </div>
                  <div className="flex p-2 rounded-md">
                    <button
                      onClick={() => router.push('/discover/vaults')}
                      className="block text-base text-scale-1200 disabled:opacity-30"
                      disabled
                    >
                      Integrations
                    </button>
                  </div>
                  <div className="flex p-2 rounded-md">
                    <button
                      onClick={() => router.push('/discover/vaults')}
                      className="block text-base text-scale-1200 disabled:opacity-30"
                      disabled
                    >
                      My Wallet
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-0 lg:mt-96">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-1">
                  <FastActionBox
                    title="Copy-Investing Fund"
                    color="green"
                    description="Create a Copy-Investing Fund and start leading the investment."
                    // href={`/vault/create`}
                    href={`/individualfunds`}
                    icon={<FundOutlined />}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: '100%' }}>{props.children}</div>
        </div>
      </SectionContainer>
    </>
  )
}
export default Sidbar
