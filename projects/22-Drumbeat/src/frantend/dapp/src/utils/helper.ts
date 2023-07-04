import * as U from './'
import { getWallets } from 'manta-extension-connect'
import { hexToString } from '@polkadot/util'

export const formatAddress = (address: string | undefined): string => {
	if (!address) {
		return ''
	}
	const str_1 = address.substring(0, 4)
	const str_2 = address.substring(address.length - 4)
	return `${str_1}......${str_2}`
}

export const connectDrumbeatWallet = async () => {
	if (typeof window !== 'undefined') {
		const { web3Enable, web3Accounts } = await import(
			'@polkadot/extension-dapp'
		)
		const extensions = await web3Enable(U.C.EXTENSION_NAME)
		if (extensions.length === 0) {
			console.log('No extension found')
			return
		}
		const accounts = (await web3Accounts()) as U.T.Wallet[]
		return accounts
	}
}

export function formatAdData(c: any[]) {
	let arr: any[] = []
	c.forEach(item => {
		arr.push(item[1])
	})
	arr.forEach(item => {
		item = item.toString()
	})

	let a: any[] = JSON.parse(`[${arr.toString()}]`)
	a.forEach(item => {
		item.target = hexToString(item.target)
		item.metadata = hexToString(item.metadata)
		item.title = hexToString(item.title)
	})

	return a
}

export const connectMantaWallet = async () => {
	const selectedWallet = getWallets().find((wallet) => wallet.extensionName === 'manta-wallet-js');
	await selectedWallet?.enable(U.C.EXTENSION_NAME);

	const mantaWallet = selectedWallet?.extension;
	const accounts = await mantaWallet.accounts.get();
	console.log(accounts)
	return accounts
}

export const calculationSingleLevel = (score: number) => {
	if (score === 0) {
		return 0
	}
	return U.C.SCORE_LEVEL.findIndex(v => score < v) + 1
}

export const calculationTag = (obj: {}) => {
	const a = Object.keys(obj)
	const b: number[] = Object.values(obj)
	const c = Math.max(...b)
	const idx = b.findIndex((v) => v === c)
	console.log(c, b, a[idx])
	return {tag: a[idx], score: c}
}

export const getTimer = () => {
	const d = new Date()
	return `${d.getFullYear()}/${d.getMonth()}/${d.getDay()} ${d.getHours()}:${d.getMinutes()}`
}

export const formatLevelData = (obj: {}) => {
	const a = Object.keys(obj)
	const b: number[] = Object.values(obj)
	const c = b.map((v) => calculationSingleLevel(v))
	return {tag: a, score: b, level: c}
}