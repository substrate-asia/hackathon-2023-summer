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

	// claim ad reward
	async claimReward(idx: number) {
		const { web3FromAddress, web3Enable } = await import(
			'@polkadot/extension-dapp'
		)
		await web3Enable('task-demo')
		const injector = await web3FromAddress(this.sender)

		return new Promise((resolve, reject) => {
			this.tx()
				?.user.claimReward(this.sender, idx)
				.signAndSend(this.sender, { signer: injector.signer })
				.subscribe(result => {
					if (result.isInBlock) {
						resolve({ info: 'ok' })
					}
				})
		})
	}
}

export default CallPolkadot
