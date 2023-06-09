import { isInternalEndpoint } from 'webext-bridge'
import { onMessage } from 'webext-bridge/background'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

let memoryStoreMap = {
  password: '',
  mnemonicStr: '',
}

onMessage('storeInMemory', async (msg) => {
  if (!isInternalEndpoint(msg.sender))
    return false

  memoryStoreMap = {
    ...memoryStoreMap,
    ...msg.data,
  }
})

onMessage('getStoreInMemory', async (msg) => {
  if (!isInternalEndpoint(msg.sender))
    return false

  const data = {}
  msg.data.keys.map(key => data[key] = memoryStoreMap[key])
  return data
})
