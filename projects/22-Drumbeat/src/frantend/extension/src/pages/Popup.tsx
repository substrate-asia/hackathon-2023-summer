import { FC, useEffect, useState } from "react";
import browser from 'webextension-polyfill'
import Header from '../components/header';
import Protocol from '../components/protocol';
import Dashboard from '../components/dashboard';
import * as U from '../util'

import "./Popup.css";

const Popup: FC = () => {
  const [address, setAddress] = useState('')
  const [step, setStep] = useState<number>(0)
  const [showOption, setShowOption] = useState(false)

  useEffect(() => {
    browser.storage.local.get(['address', 'step']).then(({ address, step }) => {
      setAddress(address)
      setStep(step)
      browser.storage.local.set({ step })
    });
  }, [])

  return (
    <U.BaseCtx.Provider value={ { showOption, setShowOption } }>
      <div className='w-body-w'>
        <Header/>
        {
          step === 0 || step === undefined
            ?
            <Protocol/>
            :
            <Dashboard
              address={ address }
            />
        }
      </div>
    </U.BaseCtx.Provider>
  )
}

export default Popup
