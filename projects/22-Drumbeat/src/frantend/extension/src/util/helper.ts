import browser from 'webextension-polyfill'
import * as U from './'

class Help {
	static async goWeb(url: string) {
		const { tabId } = await browser.storage.local.get(['tabId'])
		console.log(tabId, '111')
		if (tabId) {
			browser.tabs.update(+tabId, { active: true }).then()
		} else {
			browser.tabs.create({ url }).then()
		}

	}

	static formatAddress(address: string) {
		if (!address) {
			return ''
		}
		const str_1 = address.substring(0, 4)
		const str_2 = address.substring(address.length - 4)
		return `${str_1}......${str_2}`
	}

	private static handleGetParams(p: any) {
		let u = ''
		Object.keys(p).forEach(key => {
			console.log(key, p[key])
			u += `${key}=${p[key]}&`
		})
		u = u.substr(0, u.length - 1)

		return u
	}

	static async apiCall(apiInfo: U.ApiInfo<U.Params>) {
		let url = apiInfo.full_url ? apiInfo.URI : U.C.API + apiInfo.URI
		const req: U.RequestReq<any, any> = {
			method: apiInfo.method,
			headers: {
				'Content-Type': apiInfo.content_type || 'application/json'
			}
		}

		switch (apiInfo.method) {
			case 'GET':
				if (apiInfo.params) {
					url = url.concat('?', this.handleGetParams(apiInfo.params))
				}
				break
			case 'POST':
				req.body = JSON.stringify(apiInfo.params)
				break
		}
		try {
			const response = await fetch(url, req)
			return await response.json()
		} catch (error) {
			return Promise.reject()
		}
	}

	static copyTextToClipboard(text: string) {
		var copyFrom = document.createElement('textarea')
		copyFrom.textContent = text
		document.body.appendChild(copyFrom)
		copyFrom.select()
		document.execCommand('copy')
		copyFrom.blur()
		document.body.removeChild(copyFrom)
	}

	static getQueryVariable(variable: string, url: string) {
		let query = new URL(url).search.substring(1)
		let vars = query.split('&')
		for (let i = 0; i < vars.length; i++) {
			let pair = vars[i].split('=')
			if (pair[0] == variable) {
				return pair[1]
			}
		}
		return ''
	}

	static isInWhiteList(whiteList: U.Domain[], url: string) {
		return whiteList.some((v) => {
			return url.includes(v.name.toLowerCase())
		})
	}

	static currentDomainIdx(whiteList: U.Domain[], url: string) {
		return whiteList.findIndex((v) => {
			return url.includes(v.name.toLowerCase())
		})
	}
}

export default Help
