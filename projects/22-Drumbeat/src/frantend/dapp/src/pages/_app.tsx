import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import BaseCtx from '@/utils/context'
import { useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [isConnected, setConnected] = useState(false)
  const [drumbeatAddress, setDrumbeatAddress] = useState('')
  const [mantaAddress, setMantaAddress] = useState('')
  const [zkAddress, setZkAddress] = useState('')

  return (
    <BaseCtx.Provider value={{ isConnected, setConnected, drumbeatAddress, setDrumbeatAddress, mantaAddress, setMantaAddress, zkAddress, setZkAddress }}>
      <Component {...pageProps} />
    </BaseCtx.Provider>
  )
}
