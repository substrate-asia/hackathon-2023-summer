# Minting Dynamic NFTs #onAstar with Tableland 

## Technology intros

### Intro to [Astar]([https://polygon.technology/](https://docs.astar.network/))

Astar is the largest smart contract platform in the Polkadot ecosystem, supporting both Wasm and EVM. While providing native access to the Polkadot ecosystem through it's parachain slot, Astar also has bridges into other major ecosystems, including Ethereum, BSC, Cosmos, Polygon, and more. Through the #Build2Earn program, Astar offers a basic income to dApp developers through inflation, and provides direct funding to projects through the Astar Incubation Program.

### Intro to [Tableland](https://tableland.xyz/)

Tableland is a network and relational metadata protocol for EVM chains like Ethereum. We'll use Tableland to store, query, and update NFT metadata on two tables. Here are some things you can do with Tableland.

- Use tables to store mutable NFT metadata governed by immutable rules.
- Use tables to attach in-app or in-game metadata to existing NFTs.
- Control table write access with token or address-based rules.
- Use tables to build fully decentralized apps and games that require complex relational data models.


## Get started

Get started building fast. Clone this repo, then create a .env file and add the following as environment variables from [Alchemy](https://alchemy.com/), [Astar](https://polygonscan.com/apis), and [Metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key). CREATE A NEW TEST ACCOUNT ON METAMASK. DO NOT USE AN ACCOUNT WITH REAL ASSETS.

```
touch .env
```

Add the following to your .env file

- ALCHEMY_Astar_API_KEY=your_polygon_mumbai_alchemy_api_key 
- ASTARSCAN_API_KEY=your_polygonscan_api_key
- PRIVATE_KEY=your_new_dev_only_account_metamask_private_key_with_no_real_assets

then install dependencies and deploy the smart contract!

```
npm i
npx hardhat run scripts/deployTequilaTables.js --network "astar"
```

After you've deployed, read the contractAddress and 2 Tableland table names logged in the CLI. Update constants accordingly on lines 2-7 of scripts/constants.js

#### Optional -- mint more NFTs

```
npx hardhat run scripts/mintNFT.js --network astar
```

#### Updating Metadata

Modify code inside of scripts/updateMetadata.js, then run the script to update metadata. One callout -- by default only the contract creator can update metadata. If you want the owner to be able to update their NFT's metadata, look into [Using a TablelandController](https://docs.tableland.xyz/table-ownership-access)

```
 npx hardhat run scripts/updateMetadata.js --network astar
```

#### TokenURI

- NFT minted: tokenURI for tokenId '0' https://testnet.tableland.network/query?mode=list&s=SELECT%20json_object%28%27id%27%2Cid%2C%27name%27%2Cname%2C%27image%27%2Cimage%2C%27description%27%2Cdescription%2C%27attributes%27%2Cjson_group_array%28json_object%28%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20FROM%20table_nft_main_80001_962%20JOIN%20table_nft_attributes_80001_963%20ON%20table_nft_main_80001_962%2Eid%20%3D%20table_nft_attributes_80001_963%2Emain_id%20WHERE%20id%3D0%20group%20by%20id
