import { FC } from "react";
import BaseButton from "../ui/base-button";
import * as U from '../../util'
import browser from "webextension-polyfill";

const Protocol: FC = () => {
  return (
    <div
      className="w-full pl-6 pr-6 overflow-y-auto"
      style={{
        height: '577px',
        paddingTop: '60px'
      }}
    >
      <div className="text-white text-4xl font-semibold mb-4"
      >Welcome Drumbeat!</div>
      <div
        className="mb-4 p-3 rounded w-full"
        style={{
          background: '#23262F'
        }}
      >
        <div className="text-white text-xs mb-3 h-[auto]">WHITELIST</div>
        <div
          className="p-2 rounded overflow-y-auto w-full"
          style={{
            background: '#1D1F26',
            height: '137px'
          }}
        >
          {
            U.WHITE_LIST.products.map((item, index) => (
              <div
                className="text-white text-sm mb-1"
                key={index}
                style={{
                  color: '#3772FF'
                }}
              >{item.domain}</div>
            ))
          }
        </div>
      </div>
      <div className="flex justify-center h-[40px] mb-4">
        <BaseButton
          label="Agree"
          handleClick={async () => {
            U.Helper.goWeb(U.C.WEP_PAGE)
            browser.storage.local.set({ step: 1 })
          }}
        />
      </div>
    </div>
  )
}

export default Protocol;
