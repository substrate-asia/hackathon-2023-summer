import { PropsWithChildren, useEffect } from 'react'
import Footer from './Footer'
import Nav from './Nav.js'

type LayoutProps = {
  hideHeader?: boolean
  hideFooter?: boolean
}

const Layout = ({ children }: PropsWithChildren<LayoutProps>) => {
  useEffect(() => {
    const key = localStorage.getItem('supabaseDarkMode')
    if (!key) {
      document.documentElement.className = 'dark'
    } else {
      document.documentElement.className = key === 'true' ? 'dark' : ''
    }
  }, [])

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-zinc-900">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}

export default Layout
