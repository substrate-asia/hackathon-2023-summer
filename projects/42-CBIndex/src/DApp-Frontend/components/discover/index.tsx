import React from 'react'
import { useRouter } from 'next/router'
import Vaults from './Vaults'
import Integrations from './Integrations'
import Assets from './Assets'
import Page from './Page'
import Ducumentary from './Ducumentary'
const Discover = () => {
  const router = useRouter()
  return (
    <>
      {router.query.slug === 'page' && <Page />}
      {router.query.slug === 'vaults' && <Vaults />}
      {router.query.slug === 'integrations' && <Integrations />}
      {router.query.slug === 'assets' && <Assets />}
      {router.query.slug === 'ducumentary' && <Ducumentary />}
    </>
  )
}
export default Discover
