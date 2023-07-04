import { useEffect, useState } from 'react'
import type { ApiOptions } from '@polkadot/api/types'
import type { ApiRx } from '@polkadot/api';

import * as U from '../utils'

type OptionsFn = (options?: ApiOptions) => ApiOptions

export default function useApi(
	network: string,
	options?: OptionsFn
): {
	api?: ApiRx
	status: U.T.Status
	error: null | unknown
} {
	const [api, setApi] = useState<ApiRx>()
	const [status, setStatus] = useState<U.T.Status>('idle')
	const [error, setError] = useState<null | unknown>(null)

	useEffect(() => {
		if (!api) {
			setStatus('loading')

			try {
				import('@polkadot/api').then(({ WsProvider, ApiRx }) => {
					const provider = new WsProvider(network)
					const apiOptions =
						typeof options === 'function' ? options({ provider }) : { provider }

            ApiRx.create(apiOptions).subscribe(_api => {
						setApi(_api)

						console.log(`API ready on ${network}`, {
							ss58Format: _api.registry.chainSS58,
							tokenDecimals: _api.registry.chainDecimals,
							tokenSymbol: _api.registry.chainTokens
						})

						setStatus('success')
					})
				})
			} catch (e) {
				setStatus('error')
				setError(e)
			}
		}
	}, [network, api, options])

	return {
		api,
		status,
		error
	}
}
