import { FC, useContext, useMemo } from "react";
import * as U from '@/utils'
import BaseCtx from "@/utils/context";
import Jazzicon from 'react-jazzicon'

type Props = {
  currentPage?: 'Dashboard' | 'Service' | 'Ad Pool' | 'Swap' | 'User Info'
}


const Header: FC<Props> = ({ currentPage = 'Dashboard' }) => {
  const { drumbeatAddress } = useContext(BaseCtx)

  const generateAvator = useMemo(() => {
    return drumbeatAddress && <Jazzicon diameter={40} seed={Math.round(Math.random() * 10000000)} />
  }, [drumbeatAddress])

  return (
    <div className="flex h-[8.125rem] items-center justify-between">
      <div className="text-[2rem] font-bold">{currentPage}</div>
      <div className="flex items-center">
        <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-blue-500">
          {generateAvator}
        </div>
        <div className="ml-2 font-bold">{U.H.formatAddress(drumbeatAddress)}</div>
      </div>
    </div>
  )
}

export default Header