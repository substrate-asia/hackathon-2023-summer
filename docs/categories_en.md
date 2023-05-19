# category

## content

<details>
  <summary>Click to open the catalog</summary>

<!-- MarkdownTOC -->
 * [Category 1: Building Parachains + Independent Chains](#category-1-building-parachains--independent-chains)
      * [Game Chain](#game-chain)
      * [DeFi or Stablecoin Chain](#defi-or-stablecoin-chain)
      * [Privacy Chain](#privacy-chain)
      * [DAO Chain](#dao-chain)
      * [Content, social network, storage chain](#content-social-network-storage-chain)
      * [Decentralized Identity Chain (DId)](#decentralized-identity-chain-did)
      * [Decentralized Market Chain](#decentralized-market-chain)
      * [Other ideas](#other-ideas)
   * [Category 2: Smart Contracts (Related)](#category-2-smart-contracts-related)
      * [Smart Contract Chain](#smart-contract-chain)
      * [Smart Contract Platform](#smart-contract-platform)
   * [Category 3: Blockchain Tools](#category-3-blockchain-tools)
      * [test suite](#test-suite)
      * [Visualization](#visualization)
      * [Governance Tools](#governance-tools)
      * [Data Analysis Tools](#data-analysis-tools)
   * [Category 4: Open Hacking](#category-4-open-hacking)
<!-- /MarkdownTOC -->
</details>

## Category 1: Building Parachains + Independent Chains

In this category, you can build a custom blockchain challenge using Substrate. In the near future, your chain will have the ability to connect to the Kusama Relay Chain for interoperability and shared security. The ideas below are meant to give you some inspiration. We want you to get creative and build custom chains that you think will be most useful to other builders of the Substrate ecosystem!

### Game Chain

A game can be defined as a state change between two or more parties with additional predefined rules. Our vision for an ideal game chain is not that it can support slow two-player turn-based games (a problem that has been solved), but a chain that is abstract enough to be applicable to anything from chess and battleships to near real-time, with many players A rogue-like game in the same world. This type of product would ideally be an abstract chain on which developers/entrepreneurs could seamlessly drop games into the multiverse to build a tournament platform with sports booking and esports capabilities for gaming Raise funds and enable game developers to receive fair distribution. Its functionality can include all or some of the following features:

- Implement the multi-token standard (ERC1155).
- Exchange or swap agreement for ERC1155 tokens (e.g. modified to ERC1155).
- On-chain/off-chain (e.g. IPFS) metadata deployment and hosting tools.
- Stablecoin integration (Acala).
- Transaction and integration API for JS/Unity based games.

Try free tx, free tx under certain restrictions, or free tx based on player reputation. Build a proof-of-concept for a web3 game that doesn't disrupt the feel of a centralized game, but instead insists on players, items, and information for true ownership of virtual characters.

example:

- NFT parachain example
- Examples of Substrate collectibles
- Substrate game example

Examples of existing game chains:

- [Darwinia](https://darwinia.network/)
- [Celer](https://www.celer.network/)
- Game DAO
- [Plasm](https://www.plasmnet.io/)

### DeFi or Stablecoin Chain

Decentralized finance is a reimagining of traditional financial services with trust minimization on the blockchain at its core. One example of DeFi is loans and interest-bearing positions, such as MakerDAO's collateralized debt position system. Another example is synthetic asset protocols, which allow users to create stablecoin positions or derivatives. For Kusama, DeFi can exist alone in its own parachain by creating optimized executions, or across parachains by composing protocols on top of the underlying primitives and using XCMP for interoperability.

Stablecoins are less volatile cryptocurrencies, usually pegged to the value of a reference asset such as the U.S. dollar. By using algorithmic stablecoin designs, there are now different designs to perform stablecoins such as Schellingcoin or synthetic asset designs. A Kusama stablecoin could be something like that or something completely original and new.

Other ideas in this category include a stablecoin savings account (such as Dharma), an insurance layer for DeFi (such as Opyn), a B2B payment platform (such as Veem), a fast payment chain, or a regenerative subscription payment Enforcement, or a custody-free swap process that can be integrated with any custody scheme, allowing users to trade with each other without giving up custody of third parties.

Examples of existing DeFi chains:

- [Acala](https://acala.network/)
- [Laminar](https://laminar.one/)
- [Centrifuge](https://centrifuge.io/)

### Privacy Chain

The blockchain is inherently transparent, and all transaction history is visible to all. Some apps will require stronger privacy protections. On Kusama, privacy can be integrated by using methods such as zkSNARKs, STARKs, ring signatures, etc. to hide information on-chain. Privacy can also be created at the protocol or network level by hiding node or validator identities by design. The smallest functionality a project can include here is to allow users to privately trade value within the Kusama or Polkadot ecosystem. Different designs are possible, but the most useful design would be a parachain that allows the use of arbitrary Substrate tokens to process private transactions. Its functionality can include all or some of the following features:

- Confidential Transactions: The ability to transfer tokens between two accounts without revealing the amount or type of transfers, even if the transaction addresses involved remain visible.
- Anonymous transactions: The ability to transfer tokens between two accounts without revealing the addresses involved, even if the amount or type of tokens transferred is public.
- Confidential Account: Account balance is unknown, but also has a view key that allows specified users to view the account's balance, but not incoming or outgoing transactions. This is similar to ZCash's z address.

Reference example:

- [Advanca Network](https://www.advanca.network/)
- [Phala Network](https://phala.network/)
- [Manta Network](https://manta.network/)

### DAO Chain

A DAO, or Decentralized Autonomous Organization, is a blockchain application that allows community members to jointly agree on certain decisions in the DAO. Aragon is the most famous DAO framework in the Ethereum world. It allows someone to start a DAO with a few mouse clicks, while adding new applications (such as different voting or funding models), as well as allowing members to initiate voting on execution actions, not only within the DAO, but also DAO’s external smart contracts (that is, DAO can invest in DeFi to earn interest on membership fees). A Kusama DAO chain allows the use of a modular DAO framework with out-of-the-box basic modules, and allows users to easily plug their own custom modules into the DAO. Whether this is better done through smart contracts or WASM modules that require governance is up to the developer, but the essence of a DAO is the ability to programmatically interact with other DAOs on the same chain - governance Interoperability is a new way of thinking about the state of the digital nation.

Example:

- https://github.com/web3garden/sunshine
- https://github.com/aragon/
- https://daostack.org/

### Content, social network, storage chain

The focus of a content or storage chain will be everything from decentralized Github versions and taking ownership of personal data, to hosting unstoppable, censorship-resistant websites. A social network with built-in privacy, a decentralized email platform, next-generation torrents, all of which should be made possible by integrating a Substrate chain with a protocol like IPFS or Storj. A Kusama storage chain will demonstrate the real need for decentralized storage, not just storage for storage's sake. Or it could be an abstract chain for fee-based read/writes, and someone else could connect to it as easily as an AWS S3 bucket. This may include integration with IPFS, Storj, etc.

Example:

- [SubSocial](https://subsocial.network/)
- Redis style data storage and commands

### Decentralized Identity Chain (DId)

Idea: https://github.com/substrate-developer-hub/hacktoberfest/issues/27

Reference example:

- [KILT Protocol](https://kilt.io/)
- [Dock](https://www.dock.io/)
- [Litentry](https://www.litentry.com/)

### Decentralized Market Chain

Idea: https://github.com/substrate-developer-hub/hacktoberfest/issues/27

### Other ideas

- Public voting chain
- Computational chains (eg Golem)
- Licensing chain
- Prediction market
- Federation Oracle

## Category 2: Smart Contracts (Related)

### Smart Contract Chain

A smart contract chain is a sandbox execution environment for small pieces of code that other developers can deploy without permission. Substrate provides a smart contract module based on EVM and Ink, which Kusama definitely needs to execute to deploy an active parachain. Some specific ideas could include smart contracts in other languages, such as assembly scripts, especially those with existing toolchains. In your opinion, what does a perfect smart contract chain look like?

Reference example:

- [Patract Network](https://patract.network/?lang=zh-CN)
- [Moonbeam Network](https://moonbeam.network/)

and such as:

- Applications based on EVM contracts
- Application based on Ink contract

### Smart Contract Platform
The smart contract platform provides an efficient platform for smart contract specification and execution. The scalability that Substrate possesses makes it very easy to develop a contract platform. The new contract platform can make innovations in the efficiency of execution, the security of contracts, and the cross-chain invocation of contracts.

Reference example:

- [Gear Tech](https://www.gear-tech.io/)
- [t3rn](https://www.t3rn.io/)

## Category 3: Blockchain Tools

### test suite

Currently, writing automated tests is not very straight forward - such as objects available for Truffle, Embark in Ethereum - especially for specific blockchain functionality on Substrate-based chains. A test suite allows to implant test wallets in the suite and perform state tests in a deterministic manner. The output should be a complete category, including problems and suggestions on how to fix them (if a fix is ​​known). Ideally, the bug fixing process should be a crowdsourced effort. Until then, undiscovered bugs will automatically be turned into new categories in the central repository of issues and recipes.

Reference example:

- [Truffle Suite](https://www.trufflesuite.com/)

### Visualization

We thought of thinking from the following perspectives, but if you have other perspectives, don't hesitate to tell us with your actions.

- **Block block visualizer**

    Build a fun, insightful, and beautiful way to visualize Polkadot relay chain growth, allowing for easy block exploration, finalization, validator data, temporary forks, or other information related to block production on Polkadot.

- **Block Explorer**

    If you have a great way to explore the historical blockchain state, now is your chance to show it to the world.

- **Validator Visualizer**

    Impress us with your dynamic presentation of validator information - such as their identities, addresses, age nodes, or which blocks they produced. You can sort them based on the number of blocks produced or the length of time they have been an active validator group. Unleash your creativity!

- **Nomination Visualization**

    In Polkadot, validators are usually nominated by others to join the active validator group. We imagine it as a giant graph where some nodes are validators and more nodes are nominators, and the connections between nominators and their chosen validators. Please share your views on how to present the status of the existing nomination ecosystem to users.

- **Token Distribution Chart**

    Show us how to show how Polkadot tokens are distributed among different accounts.

- **Account Information Visualizer**

    Get creative and provide relevant information about users on one page - anything about on-chain identities, tokens held, nominees, account age, previous votes, submitted proposals if they are verifying , or any other information about a personal account.

- **A relay chain clock**

    Maybe it beeps every time a certain number of blocks pass, or a cuckoo jumps out every 100 blocks? Have a better idea?

- **Throughput Visualizer**

    Displays the number of transactions being processed on the relay chain, and once activated, the number of transactions being processed on the parachain. Or show how many trades are in the trade pool. up to you.

- **Burner Wallet**

    You only need to enter your password once when you start using the app. In the next session, you will be able to interact with the application without entering a password. Huge improvements to the user experience. A Burner wallet can obtain a private key in local storage, or create a temporary wallet via GET.

### substrate pallets tool suite
Reference example: Substrate Open Runtime Module Library

https://github.com/open-web3-stack/open-runtime-module-library

### Governance Tools

inspiration:

- https://kusama.polkassembly.io/
- https://commonwealth.im/

### Data Analysis Tools
During the operation of the blockchain, a large amount of on-chain data will be generated, and data analysis can obtain the hidden information in the data through data mining.

Reference example:

- [web3 go](https://web3go.xyz/)

## Category 4: Open Hacking

In this category, we want you to push the limits of what's possible, be creative, and break things. Improve the underlying technologies of Web3, such as peer-to-peer communication frameworks such as libp2p, new consensus algorithms based on Substrate, node routing and search such as DHT, and other financial and social activities that can be used to help peer-to-peer. Substrate-based light node applications, UI support for the new governance V2, and more.