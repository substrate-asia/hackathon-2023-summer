import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Layout from '~/components/Layout'
import PartnerLinkBox from '~/components/PartnerLinkBox'
import SectionContainer from '~/components/SectionContainer'
import { Partner } from '~/types/partners'
import Discover from '~/components/discover'
interface Props {
  partners: Partner[]
}
function IntegrationPartnersPage(props: Props) {
  const router = useRouter()

  return (
    <>
      <SectionContainer className="space-y-16">
        <div className="grid space-y-12 md:gap-8 lg:grid-cols-12 lg:gap-16 lg:space-y-0 xl:gap-16">
          <div className="rounded-lg bg-slate-700 p-4 lg:col-span-4 xl:col-span-3">
            <div>
              <div className="hidden lg:block">
                <div className="space-y-1">
                  <button
                    onClick={() => router.push('/discover')}
                    className="block text-base text-scale-1100"
                  >
                    Discover
                  </button>
                  <button
                    onClick={() => router.push('/discover/vaults')}
                    className="block text-base text-scale-1100"
                  >
                    Vaults
                  </button>
                  <button className="block text-base text-scale-1100">
                    Network
                  </button>
                  <button
                    onClick={() => router.push('/discover/assets')}
                    className="block text-base text-scale-1100"
                  >
                    Assets
                  </button>
                  <button
                    onClick={() => router.push('/discover/integrations')}
                    className="block text-base text-scale-1100"
                  >
                    Integrations
                  </button>
                  <button
                    onClick={() => router.push('/discover/ducumentary')}
                    className="block text-base text-scale-1100"
                  >
                    Ducumentary
                  </button>
                </div>
              </div>
              <div className="mt-0 lg:mt-96">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-1">
                  <PartnerLinkBox
                    title="Create your first vault"
                    color="blue"
                    description="Create an Enzyme vault and start managing your assets."
                    href={`/vault/create`}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="grid space-y-10">
              <Discover />
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}

export default IntegrationPartnersPage
