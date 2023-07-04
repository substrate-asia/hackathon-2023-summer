
import { createContext, ReactNode } from 'react'

interface BaseData {
  isConnected?: boolean,
  setConnected?: (v: boolean) => void,
  drumbeatAddress?: string,
  setDrumbeatAddress?: (v: string) => void,
  mantaAddress?: string,
  setMantaAddress?: (v: string) => void,
  zkAddress?: string,
  setZkAddress?: (v: string) => void,
}

export const initialState: BaseData = {
  isConnected: false
}

const BaseCtx = createContext(initialState);

export default BaseCtx;