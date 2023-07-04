import useSWR from 'swr'
import Image from 'next/image'
import {
  POLYGON_TOKENS_BY_SYMBOL,
  POLYGON_TOKENS_BY_ADDRESS,
} from '../../lib/constants'
import { fetcher } from '../Price'
// import type { PriceResponse, QuoteResponse } from '../api/types'
import { ethers } from 'ethers'
import {
  useAccount,
  useSendTransaction,
  usePrepareSendTransaction,
} from 'wagmi'

export default function QuoteView({ price, quote, setQuote, takerAddress }) {
  // fetch quote here

  const { address } = useAccount()

  const { isLoading: isLoadingPrice } = useSWR(
    [
      'https://polygon.api.0x.org/swap/v1/quote',
      {
        sellToken: price.sellTokenAddress,
        buyToken: price.buyTokenAddress,
        sellAmount: price.sellAmount,
        // buyAmount: TODO if we want to support buys,
        takerAddress,
      },
    ],
    fetcher,
    {
      onSuccess: (data) => {
        setQuote(data)
        console.log('quote', data)
      },
    }
  )

  const { config } = usePrepareSendTransaction({
    to: quote?.to, // The address of the contract to send call data to, in this case 0x Exchange Proxy
    data: quote?.data, // The call data required to be sent to the to contract address.
  })

  const { sendTransaction } = useSendTransaction(config)

  if (!quote) {
    return <div className="text-white">Getting best quote...</div>
  }

  const sellTokenInfo =
    POLYGON_TOKENS_BY_ADDRESS[price.sellTokenAddress.toLowerCase()]

  return (
    <div className="mx-auto max-w-screen-sm p-3 ">
      <form>
        <div className="mb-3 rounded-sm bg-slate-200 p-4 dark:bg-slate-800">
          <div className="mb-2 text-xl text-white">You pay</div>
          <div className="flex items-center text-lg text-white sm:text-3xl">
            <img
              width={36}
              height={36}
              alt={sellTokenInfo.symbol}
              className="mr-2 h-9 w-9 rounded-md"
              src={sellTokenInfo.logoURI}
            />
            <span>
              {ethers.utils.formatUnits(
                quote.sellAmount,
                sellTokenInfo.decimals
              )}
            </span>
            <div className="ml-2">{sellTokenInfo.symbol}</div>
          </div>
        </div>

        <div className="mb-3 rounded-sm bg-slate-200 p-4 dark:bg-slate-800">
          <div className="mb-2 text-xl text-white">You receive</div>
          <div className="flex items-center text-lg text-white sm:text-3xl">
            <img
              width={36}
              height={36}
              alt={
                POLYGON_TOKENS_BY_ADDRESS[price.buyTokenAddress.toLowerCase()]
                  .symbol
              }
              className="mr-2 h-9 w-9 rounded-md"
              src={
                POLYGON_TOKENS_BY_ADDRESS[price.buyTokenAddress.toLowerCase()]
                  .logoURI
              }
            />
            <span>
              {ethers.utils.formatUnits(
                quote.buyAmount,
                POLYGON_TOKENS_BY_ADDRESS[price.buyTokenAddress.toLowerCase()]
                  .decimals
              )}
            </span>
            <div className="ml-2">
              {
                POLYGON_TOKENS_BY_ADDRESS[price.buyTokenAddress.toLowerCase()]
                  .symbol
              }
            </div>
          </div>
        </div>
      </form>

      <button
        className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => {
          sendTransaction && sendTransaction()
        }}
      >
        Place Order
      </button>
    </div>
  )
}
