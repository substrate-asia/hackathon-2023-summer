import Root from './root'
import { i18n } from '../../../i18n-config'

export const metadata = {
  title: 'Evmscan',
  description: `EVMScan is an open source MVP version's explorer(inspired by [etherscan](https://etherscan.io/)) for EVM compatible solutions, such as Ethereum/Sepolia, Arbitrum, Optimism, Coinbase Base, ZKSync era and Polygon zkEVM etc.`,
}

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  return (
    <html lang={params.lang}>
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  )
}
