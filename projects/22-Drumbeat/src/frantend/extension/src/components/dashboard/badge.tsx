import { FC, useEffect, useState } from "react";
import * as U from '../../util'
import browser from 'webextension-polyfill'

const Badge: FC = () => {
  return (
    <div>
      <div className={'text-xl font-bold text-white mb-4'}>Your Badges</div>
      <div className={'mb-10 flex justify-start'}>
        <div className={'w-14 h-14 bg-green-700 flex flex-col items-center justify-center rounded-full mr-1'}>
          <div className={'text-xs text-white'}>GameFi</div>
          <div className={'text-xs text-white'}>Lv.1</div>
        </div>
        <div className={'w-14 h-14 bg-green-700 flex flex-col items-center justify-center rounded-full mr-1'}>
          <div className={'text-xs text-white'}>GameFi</div>
          <div className={'text-xs text-white'}>Lv.1</div>
        </div>
        <div className={'w-14 h-14 bg-green-700 flex flex-col items-center justify-center rounded-full mr-1'}>
          <div className={'text-xs text-white'}>GameFi</div>
          <div className={'text-xs text-white'}>Lv.1</div>
        </div>
      </div>
    </div>

  )
}

export default Badge
