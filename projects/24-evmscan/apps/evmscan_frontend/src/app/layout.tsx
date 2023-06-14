import Root from './root'

export const metadata = {
  title: 'Evmscan',
  description: `EVMScan is an open source MVP version's explorer(inspired by [etherscan](https://etherscan.io/)) for EVM compatible solutions, such as Ethereum/Sepolia, Arbitrum, Optimism, Coinbase Base, ZKSync era and Polygon zkEVM etc.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  )
}
