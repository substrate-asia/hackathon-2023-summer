const {create, signCertificate, types} = require('@phala/sdk')
const {WsProvider, ApiPromise} = require('@polkadot/api')
const fs = require('fs')
const {ContractPromise} = require('@polkadot/api-contract')
const {Keyring} = require('@polkadot/api')
const {waitReady} = require('@polkadot/wasm-crypto')

const main = async () => {
  await waitReady()
  const keyring = new Keyring({type: 'sr25519'})
  const alice = keyring.addFromUri('//Alice')
  const provider = new WsProvider('wss://pc-test-3.phala.network/khala/ws')
  const pruntimeURL = 'http://54.39.243.230:8011'
  const api = await ApiPromise.create({provider, types})
  const certificate = await signCertificate({api, pair: alice})
  const contractId =
    '0x316c24fb3e47e12001c3665121b4d923a9525b06e01e683fa1c9f8d37db6d107'
  const metadata = fs.readFileSync(
    '../target/ink/tokenomic_contract.json',
    'utf-8'
  )

  const decoratedApi = (await create({api, baseURL: pruntimeURL, contractId}))
    .api

  const contract = new ContractPromise(
    decoratedApi,
    JSON.parse(metadata),
    contractId
  )

  try {
    const res = await contract.query.getExecutorAccount(certificate, {})
    // const res = await contract.query.balance(certificate, {})

    console.log(res.output.toJSON())
  } catch (err) {
    console.error(err)
  }
}

main()
