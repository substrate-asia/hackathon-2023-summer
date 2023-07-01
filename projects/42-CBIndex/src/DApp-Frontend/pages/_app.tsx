import type { AppProps } from 'next/app'
import { ThemeProvider } from '~/lib/theme'
import '../styles/globals.css'
import '../styles/swiper.css'
import Layout from '~/components/Layout'
import Head from 'next/head'
import { ConfigProvider, theme } from 'antd'
function MyApp({ Component, pageProps }: AppProps) {
  return (
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
          <title>{123} | Supabase Partner Gallery Example</title>
          <meta name="description"></meta>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ConfigProvider>
  )
}

export default MyApp
