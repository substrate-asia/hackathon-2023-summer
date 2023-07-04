import * as U from './'

export const formatAddress = (address: string | undefined): string => {
	if (!address) {
		return ''
	}
	const str_1 = address.substring(0, 4)
	const str_2 = address.substring(address.length - 4)
	return `${str_1}......${str_2}`
}

export const connectPolkadotWallet = async () => {
	if (typeof window !== 'undefined') {
		const { web3Enable, web3Accounts } = await import(
			'@polkadot/extension-dapp'
		)
		const extensions = await web3Enable('task-demo')
		if (extensions.length === 0) {
			console.log('No extension found')
			return
		}
		const accounts = (await web3Accounts()) as U.T.Wallet[]
		return accounts
	}
}