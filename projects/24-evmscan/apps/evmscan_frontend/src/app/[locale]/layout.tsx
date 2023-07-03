import Root from './root'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Evmscan',
  description: `EVMScan is an open source MVP version's explorer(inspired by [etherscan](https://etherscan.io/)) for EVM compatible solutions, such as Ethereum/Sepolia, Arbitrum, Optimism, Coinbase Base, ZKSync era and Polygon zkEVM etc.`,
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }]
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Root>{children}</Root>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
