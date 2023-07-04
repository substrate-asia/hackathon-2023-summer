import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>CBIndex | One-stop Toolkit for Decentralized Investment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Home
