import type { ApiRx } from '@polkadot/api'
import * as U from './'

class CallPolkadot {
	sender: string
	api: ApiRx

	constructor(sender: string, api: ApiRx) {
		this.sender = sender
		this.api = api
	}

	private tx() {
		if (!this.api) return null

		return this.api.tx
	}

	private qu() {
		if (!this.api) return null

		return this.api.query
	}

	getAddressBanlance() {
		return new Promise((resolve, reject) => {
			this.qu()
				?.system.account(this.sender)
				.subscribe((c: any) => {
					if (c.toString()) {
						const d = JSON.parse(c.toString())
						resolve(d.data.free || 0)
					}
				})
		})
	}

	// update user profile
	async updateUserProfile(age: number, tag: string, level: number, display: boolean) {
		const { web3FromAddress, web3Enable } = await import(
			'@polkadot/extension-dapp'
		)
		await web3Enable(U.C.EXTENSION_NAME)
		const injector = await web3FromAddress(this.sender)

		return new Promise((resolve, reject) => {
			this.tx()
				?.user.addZkProfile(age, tag, level, display)
				.signAndSend(this.sender, { signer: injector.signer })
				.subscribe(result => {
					if (result.isInBlock) {
						resolve({ info: 'ok' })
					}
				})
		})
	}

	// get user ads
	async getUserMatchAdIndex(uper: string) {
		return new Promise((resolve, reject) => {
			this.qu()
				?.user.users(uper)
				.subscribe((c: any) => {
					if (c.toString()) {
						resolve({ info: [JSON.parse(c.toString()).matchedAds[0][1]] })
					} else {
						resolve({ info: [] })
					}
				})
		})
	}

	// get ad info with index
	async getAdInfo(idx: number) {
		return new Promise((resolve, reject) => {
			this.qu()
				?.ad.impressionAds(U.C.ALICE, idx)
				.subscribe((c: any) => {
					if (c.toString()) {
						resolve([JSON.parse(c.toString())])
					} else {
						resolve([])
					}
				})
		})
	}
}

export default CallPolkadot
