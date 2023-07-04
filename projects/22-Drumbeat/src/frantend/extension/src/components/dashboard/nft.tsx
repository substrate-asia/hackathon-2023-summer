import { FC, useEffect, useState } from "react";
import BaseTag from "../ui/base-tag";
import browser from 'webextension-polyfill'
import * as U from '../../util'

const bgs = ['#58BD7D', '#2151F5', '#F58721']

const NFT: FC = () => {
  const [metadata, setMetadata] = useState('')
  const [label, setLabel] = useState('')

  useEffect(() => {
    browser.storage.local.get(['metadata', 'label']).then(({ metadata, label }) => {
      setMetadata(metadata)
      setLabel(label)
    });
  }, [])

  return (
    <div className="w-full pl-4 pr-4 pt-6 mb-10">
      <div className="text-white text-2xl font-semibold mb-2">Your Soul NFT</div>
      <div className="flex justify-start items-center">
        {
          metadata
            ?
            <div
              style={{
                maxWidth: '100px'
              }}
            >
              <img
                src={metadata}
                className="w-24 h-24 mb-3"
              />
              <div className="flex flex-wrap">
                {
                  label.split('-').map((item, index) => (
                    <BaseTag
                      label={item}
                      bg={bgs[index]}
                    />
                  ))
                }
              </div>
            </div>
            :
            <div
              onClick={() => {
                U.Helper.goWeb(U.C.WEP_PAGE)
              }}
              className="text-white text-base font-semibold mb-2"
            >Go to webpage Mint</div>
        }

      </div>
    </div>
  )
}

export default NFT;