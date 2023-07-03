import { useRouter } from 'next/router'
import React from 'react'
import { Partner } from '~/types/partners'
import Discover from '~/components/discover'
import Sidbar from '~/components/Sidbar'
interface Props {
  partners: Partner[]
}
function IntegrationPartnersPage(props: Props) {
  return (
    <div className="w-full">
      <Sidbar>
        <Discover />
      </Sidbar>
    </div>
  )
}

export default IntegrationPartnersPage
