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
  
    //XXX
    await tx.send(callback)
  }
  
  // Fetch list of available accounts from the polkadot.js extension.
  // It returns list of accounts, each account have address and other metadata property.
  export const getAllAccounts = async () => {
    const { isWeb3Injected, web3Enable, web3Accounts } = await import(
      '@polkadot/extension-dapp'
    )
    const injectedExtensions = await web3Enable('subsocial-starter')
    if (!isWeb3Injected) {
      throw Error(`Browser does not have any polkadot.js extension`)
    }
  
    if (!injectedExtensions.length) {
      throw Error(`Polkadot Extension has not authorized us to get accounts`)
    }
  
    return await web3Accounts()
  }