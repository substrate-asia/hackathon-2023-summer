import React, { useEffect } from 'react'
const { ethers, JsonRpcSigner, JsonRpcProvider, Contract } = require('ethers')
// import Web3 from 'web3'
const FormOne: React.FC = () => {
  useEffect(() => {
    // console.log(ethers.id('rinkeby'))
    // const provider = new JsonRpcProvider(providerUrl)
    // const contractAddress = '0x2662fA996a31A09A7987bf1fe218271B91cBAAfA'
    // console.log(provider)

    // const provider = new ethers.providers.JsonRpcSigner(providerUrl)

    // console.log(provider)

    // console.log(web3Provider, web3)
  }, [])
  return (
    <div className="text-white">
      <h1>Before You Start</h1>
      <p>
        Based on the template you have chosen, many settings in the process to
        create your vault have been pre-configured. You can edit these settings
        in the steps that follow.
      </p>
      <p>There are two types of settings:</p>
      <p>Editable settings can be changed at any time after fund creation.</p>
      <p>
        Semi-permanent settings can only be changed upon reconfiguration or with
        an upgrade of your vault. Both processes require a 7-day cool down
        period after you have configured new settings before they take effect.
        During this period, your vault will reject any new depositors, and
        existing depositors may opt to leave if they do not like the new
        settings.
      </p>
    </div>
  )
}

export default FormOne
