import React, { useEffect, useState } from 'react'
import SwapPage from '~/components/SwapPage'
import PriceView from '../components/Price'
import QuoteView from '../components/Quote'
// import type { PriceResponse } from './api/types'
import Sidbar from '~/components/Sidbar'
import { useAccount } from 'wagmi'
const Swap = () => {
  const [tradeDirection, setTradeDirection] = useState('sell')
  const [finalize, setFinalize] = useState(false)
  const [price, setPrice] = useState()
  const [quote, setQuote] = useState()
  const { address } = useAccount()
  console.log(address)
  const [show, setShow] = useState(false)
  useEffect(function () {
    setShow(true)
  }, [])
  return (
    <>
      <Sidbar>
        {show && (
          <div
            className={`flex flex-col items-center justify-between bg-zinc-800 p-24 rounded-lg`}
          >
            {finalize && price ? (
              <QuoteView
                takerAddress={address}
                price={price}
                quote={quote}
                setQuote={setQuote}
              />
            ) : (
              <PriceView
                takerAddress={address}
                price={price}
                setPrice={setPrice}
                setFinalize={setFinalize}
              />
            )}
          </div>
        )}
      </Sidbar>
    </>
  )
}
export default Swap
