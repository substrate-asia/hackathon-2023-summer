import { FC } from "react";
import Button from "../ui/BaseButton";
import * as U from '@/utils'
import Image from "next/image";
import { hexToString } from '@polkadot/util'
import Jazzicon from 'react-jazzicon'
import { useMemo } from 'react'

type Prop = {
  metadata: string,
  cpi: number,
  target: string,
  title: string,
  proposer: string,
  id: number
}

const Ad: FC<Prop> = ({ metadata, cpi, target, title, proposer, id }) => {

  const generateAvator = useMemo(() => {
    return proposer && <Jazzicon diameter={40} seed={Math.round(Math.random() * 10000000)} />
  }, [proposer])

  return (
    <div className="p-[1.25rem] bg-white rounded-[1.25rem]">
      <div className="w-full h-[12.5rem] rounded-[1.25rem] mb-[.875rem] overflow-hidden">
        <Image
          src={hexToString(metadata)}
          alt=""
          width={360}
          height={200}
        />
      </div>
      <div className="text-[1.125rem] font-bold mb-[.625rem]">{hexToString(title)}</div>
      <div className="flex items-center justift-between border-b pb-4 mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-600 mr-2 rounded-full">
            {generateAvator}
          </div>
          <div>
            <div className="text-sm text-gray-500">Creater</div>
            <div className="text-sm text-gray-500">{U.H.formatAddress(proposer)}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-sm text-green-600 font-bold">Rewards available</div>
        <div className="flex justify-between items-center">
          <div className="text-base">{cpi} adm = ${cpi * 1.5}</div>
          <Button
            label="Accept"
            handleClick={() => {
              window.open(hexToString(target) + `?id=${id}`)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Ad