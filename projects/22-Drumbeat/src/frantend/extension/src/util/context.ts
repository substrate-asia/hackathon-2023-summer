import { createContext } from 'react'

interface BaseData {
  showOption?: boolean,
  setShowOption?: (v: boolean) => void
}

const initialState: BaseData = {
  showOption: false,
}


const BaseCtx = createContext(initialState);

export default BaseCtx;
