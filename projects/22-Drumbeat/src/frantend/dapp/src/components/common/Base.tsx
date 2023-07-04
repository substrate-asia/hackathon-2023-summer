import { FC, ReactNode } from "react";
import Head from 'next/head';
import * as U from '@/utils'

type TDK = {
  title?: string,
  keywords?: string,
  description?: string
}

type Props = {
  tdk?: TDK,
  children: ReactNode
}

const Base: FC<Props> = ({ tdk, children }) => {

  return (
    <div className="w-full">
      <Head>
        <title>{tdk?.title || U.C.BASE_TITLE}</title>
        <meta name="keywords" content={tdk?.keywords || U.C.BASE_KEYWORDS} />
        <meta name="description" content={tdk?.description || U.C.BASE_DEC} />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {children}
      </main>
    </div>
  )
}

export default Base;