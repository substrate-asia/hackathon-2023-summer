import { FC, useContext } from "react";
import Account from "./account";
import BaseButton from "../ui/base-button";
import Records from "./records";
import * as U from '../../util'
import browser from "webextension-polyfill";

interface Prop {
  address: string
}

const Dashboard: FC<Prop> = ({ address }) => {
  const { showOption } = useContext(U.BaseCtx)

  return (
    <div className="w-full pl-4 pr-4">
      {
        address
          ?
          <>
            <Account address={ address }/>
            <Records/>
            <div className={ 'mb-20 flex justify-center' }>
              <BaseButton label={ 'Sync Data' } handleClick={async () => {
                const { tabId, score } = await browser.storage.local.get(['tabId', 'score'])
                U.Messenger.sendMessageToContentScript(tabId, U.C.DRUMBEAT_MSG_HACKATHON_SYNC_TO, score)
              } }/>
            </div>
          </>
          :
          <div className={ 'my-20 flex flex-col items-center' }>
            <div className={ 'text-white font-bold mb-4 text-2xl' }>First, Please connect wallet!</div>
            <BaseButton label={ 'Connect Wallet' } handleClick={ () => {
              U.Helper.goWeb(U.C.WEP_PAGE)
            } }/>
          </div>
      }

    </div>
  )
}

export default Dashboard;
