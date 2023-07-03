export interface CustomNetwork {
  substrateNodeUrl: string
  ipfsNodeUrl: string
}

// Testnet configuration for the playground.
// This connects with SoonSocialX testnet.
// You get the free test tokens by using our Discord bot.
// Check here: https://docs.subsocial.network/docs/develop/getting-started/testnet
export const Testnet: CustomNetwork = {
  substrateNodeUrl: 'wss://rco-para.subsocial.network',
  ipfsNodeUrl: 'https://gw.crustfiles.app',
}

// Mainnet configuration for the playground.
// This connects with SubSocial parachain.
// This is the default configuration
export const Mainnet: CustomNetwork = {
  substrateNodeUrl: 'wss://para.f3joule.space',
  ipfsNodeUrl: 'https://ipfs.subsocial.network',
}

// Localnet configuration for the playground.
// This allows you to connect to a local node.
// You need to run the local nodes of subsocial, ipfs & offchain.
// Links to the repository:
// Subsocial Node: https://github.com/dappforce/subsocial-node
// IPFS Node: https://ipfs.io/#install
export const Localnet: CustomNetwork = {
  substrateNodeUrl: 'http://127.0.0.1:9944',
  ipfsNodeUrl: 'http://127.0.0.1:8080',
}

export const CRUST_TEST_AUTH_KEY =
  'c3ViLTVGQTluUURWZzI2N0RFZDhtMVp5cFhMQm52TjdTRnhZd1Y3bmRxU1lHaU45VFRwdToweDEwMmQ3ZmJhYWQwZGUwNzFjNDFmM2NjYzQzYmQ0NzIxNzFkZGFiYWM0MzEzZTc5YTY3ZWExOWM0OWFlNjgyZjY0YWUxMmRlY2YyNzhjNTEwZGY4YzZjZTZhYzdlZTEwNzY2N2YzYTBjZjM5OGUxN2VhMzAyMmRkNmEyYjc1OTBi' // can only be used for testnet.
