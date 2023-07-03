import { PropsWithChildren, useEffect } from 'react'
import Footer from './Footer'
import Nav from './Nav.js'

type LayoutProps = {
  hideHeader?: boolean
  hideFooter?: boolean
  ConnectKitButton?: any
}

const Layout = ({ children, ConnectKitButton }: PropsWithChildren<LayoutProps>) => {
  useEffect(() => {
    const key = localStorage.getItem('cbindexDarkMode')
    if (!key) {
      document.documentElement.className = 'dark'
    } else {
      document.documentElement.className = key === 'true' ? 'dark' : ''
    }
  }, [])

  return (
    <>
      <Nav ConnectKitButton={ConnectKitButton} />
      <div className="h-full bg-zinc-900">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}

export default Layout
