interface Meta {
	genesisHash: string
	name: string
	source: string
}

interface Wallet {
	address: string
	meta: Meta
	type: string
}

interface IMessage<T> {
	type: string
	data: T,
	drumbeat: 'drumbeat'
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export {
  type Wallet,
  type IMessage,
  type Status,
}

