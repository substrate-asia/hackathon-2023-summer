import type { AppProps } from 'next/app'
import { ThemeProvider } from '~/lib/theme'
import '../styles/globals.css'
import '../styles/swiper.css'
import Layout from '~/components/Layout'
import Head from 'next/head'
import { ConfigProvider, theme } from 'antd'
import {
  arbitrum,
  mainnet,
  polygon,
  arbitrumGoerli,
  polygonMumbai,
} from 'wagmi/chains'
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from 'connectkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { useEffect, useState } from 'react'
const projectId = 'bce62feae59107ac8ebbdc9aa8810513'
const chains = [arbitrum, mainnet, polygon, arbitrumGoerli, polygonMumbai]
function MyApp({ Component, pageProps }: AppProps) {
  const [config, setConfig] = useState(createConfig(
    getDefaultConfig({
      // Required API Keys
      alchemyId: 'Ah1uBeiN9iaNdSMTMRPHMT2vp2-nkVel', // or infuraId
      walletConnectProjectId: projectId,
      // Required
      appName: 'QWE',
      // Optional
      // chains,
      appDescription: 'CBIndex | One-stop Toolkit for Decentralized Investment',
      appUrl: 'https://app.cbindex.finance', // your app's url
      // appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
    })
  ))

  return (
    <>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: '#5bfb91',
              },
              components: {
                Table: {
                  // colorBg: "transpanrent",
                  borderRadius: 4,
                  borderRadiusLG: 6,
                  colorFillAlter: 'rgba(255, 255, 255, 0.02)',
                  fontSize: 14,
                },
                Button: {
                  fontSize: 14,
                  colorLink: '#42aa65',
                  colorLinkHover: '#5bfb91',
                  colorLinkActive: '#5bfb91',
                },
                Popover: {
                  colorBgElevated: 'rgba(48,48,48, 0.9)',
                  padding: 8,
                },
                // Modal: {
                //   color: 'red',
                // },
                Segmented: {
                  colorText: 'white',
                  colorBorder: 'white',
                },
              },
            }}
          >
            <ThemeProvider>
              <Head>
                <title>
                  CBIndex | One-stop Toolkit for Decentralized Investment
                </title>
                <meta name="description"></meta>
                <link rel="icon" href="/favicon.ico" />
              </Head>
              {/* <ConnectKitButton /> */}
              <Layout ConnectKitButton={ConnectKitButton}>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </ConfigProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
