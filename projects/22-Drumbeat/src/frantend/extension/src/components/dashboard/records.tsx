import { FC, useEffect, useState } from "react";
import * as U from '../../util'
import browser from "webextension-polyfill";

interface Score {
  [propName: string]: number
}

const Records: FC = () => {

  const [score, setScore] = useState<Score>({})

  useEffect(() => {
    browser.storage.local.get(['score']).then(({ score }) => {
      setScore(score)
    });
  }, [])

  return (
    <div className={'my-10 w-full'}>
      <div className={'text-xl font-bold text-white mb-4'}
        onClick={async() => {
          const { score } = await browser.storage.local.get(['score'])
          console.log(score)
        }}
      >Your local unsynced score</div>
      {
        Object.keys(score).map((key) => (
          <div className={'w-full h-8 bg-white flex flex-row items-center justify-between px-2 mb-1'} key={key}>
            <div className={'font-bold'}>{key}</div>
            <div className={'font-bold'}>{score[key]}</div>
          </div>
        ))
      }
    </div>
  )
}

export default Records
