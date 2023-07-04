const WHITE_LIST = {
	searching_engines: ['Google', 'Bing', 'Baidu', 'DuckDuckGo'],
	categories: ['DeFi', 'GameFi', 'NFT', 'Metaverse', 'OnChainData'],
	products: [
		{
			name: 'Uniswap',
			domain: 'uniswap.org',
			category: ['DeFi']
		},
		{
			name: 'Sushi',
			domain: 'sushi.com',
			category: ['DeFi']
		},
		{
			name: 'Decentraland',
			domain: 'decentraland.org',
			category: ['GameFi', 'Metaverse']
		},
		{
			name: 'Nansen',
			domain: 'nansen.ai',
			category: ['OnChainData']
		},
		{
			name: 'Opensea',
			domain: 'opensea.io',
			category: ['NFT']
		}
	]
}

export default WHITE_LIST;