import { getNewIdsFromEvent } from '@subsocial/api'

// logTransaction is a callback method when a transaction is sent to
// the blockchain. It listens and logs the events like ready, broadcast, finalized, etc.
// It also logs if a new id is generated during an event.
export const logTransaction = (result: any) => {
  const { status } = result

  if (!result || !status) {
    return
  }
  if (status.isFinalized) {
    const blockHash = status.isFinalized ? status.asFinalized : status.asInBlock
    console.log('Tx finalized. Block hash', blockHash.toString())
    const newIds = getNewIdsFromEvent(result) // get first argument from array.
    if (newIds.length > 0) {
      console.log(`New Item Id: ${newIds[0]}`)
    }
  } else if (result.isError) {
    console.log(JSON.stringify(result))
  } else {
    console.log('⏱ Current tx status:', status.type)
  }
}

// Sign and send transaction using polkadot.js web extension.
// Arguments: [tx] is the transaction object, accountId is the wallet adddress, callback is a method
// that listens to events of the transaction processing. See example: [logTransaction].
export const signAndSendTx = async (
  tx: any,
  accountId: string,
  callback?: (result: any) => void
) => {
  const { web3FromAddress } = await import('@polkadot/extension-dapp')
  const accounts = await getAllAccounts()

  const addresses = accounts.map((account) => account.address)

  const containsAddress = addresses.includes(accountId)
  if (!containsAddress) {
    throw Error('Address not found on Polkadot.js extension.')
  }

  const { signer } = await web3FromAddress(accountId)
  await tx.signAsync(accountId, { signer })

  await tx.send(callback ?? logTransaction)
}

// Fetch list of available accounts from the polkadotjs extension.
// It returns list of accounts, each account have address and other metadata property.
export const getAllAccounts = async () => {
  const { isWeb3Injected, web3Enable, web3Accounts } = await import(
    '@polkadot/extension-dapp'
  )
  const injectedExtensions = await web3Enable('subsocial-starter')
  if (!isWeb3Injected) {
    throw Error(`Browser do not have any polkadot.js extension`)
  }

  if (!injectedExtensions.length) {
    throw Error(`Polkadot Extension have not authorized us to get accounts`)
  }

  return await web3Accounts()
}

export default { logTransaction, getAllAccounts, signAndSendTx }
