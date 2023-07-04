import { FC, useMemo } from "react";
import Jazzicon from 'react-jazzicon'
import * as U from '../../util'
import browser from 'webextension-polyfill'

interface Prop {
  address: string
}

const Account: FC<Prop> = ({ address }) => {

  const generateAvator = useMemo(() => {
    return address && <Jazzicon diameter={40} seed={Math.round(Math.random() * 10000000)} />
  }, [address])

  return (
    <div
      className="w-full py-4 px-3 flex  flex-row justify-start items-center mb-4 rounded"
      style={{
        background: '#1D1F26'
      }}
    >
      {generateAvator}
      <div className="ml-4">
        <div
          className="text-white text-sm font-semibold"
          onClick={() => {
            browser.storage.local.clear()
          }}
        >Test account 1</div>
        <div
          className="text-xs"
          style={{
            color: '#525461'
          }}
        >{U.Helper.formatAddress(address)}</div>
      </div>
    </div>
  )
}

export default Account;
