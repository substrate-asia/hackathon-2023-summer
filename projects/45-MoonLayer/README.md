# Basic information

* Project name: MoonLayer
* Project establishment date: June 2023

MoonLayer is a layer 3 Rollup with EVM integration on Polkadot / a layer 2 rollup with EVM integration built on top of Moonbeam.

🧷 [How to run nodes](./docs/how-to-run-node.md)

🧷 [RPC documentation](./docs/RPC.md)

🧷 [Demo](./docs/try-it-out.md)

🧷 [Demo video](https://youtu.be/GgLpw9y1GFI)


# Project background

## Why we chose Moonbeam for building MoonLayer on?

Moonbeam stands out as one of the most successful parachains on Polkadot, boasting high Total Value Locked (TVL) and a thriving ecosystem of dApps. With this robust foundation, MoonLayer not only scales along with Moombeam, but also, boost scalability of Moonbeam even further without comprising security.

By constructing MoonLayer as a Layer 2 Sovereign Rollup on Moonbeam, transaction compression boosts Moonbeam's scalability significantly, allowing for increased transaction throughput and lower fees. Furthermore, Moonbeam's dApps can be seamlessly deployed on MoonLayer through MoonLayer's EVM, and Batches (Rollup blocks) are uploaded from MoonLayer to Moonbeam through Moonbeam transactions, linearly increasing the Moonbeam token($GLMR) price. 

Consequently, building on Moonbeam ensures mutual benefits for both chains.

## Why We Build MoonLayer as a Sovereign Rollup instead of Optimistic or zk Rollup?

![](https://media.discordapp.net/attachments/911232853348597771/1125359172226121748/Comparison.PNG?width=1232&height=461)


# Project Introduction

MoonLayer is a layer 3 Rollup with EVM integration on Polkadot / a layer 2 rollup with EVM integration built on top of Moonbeam.

As a Sovereign Rollup scaling solution, MoonLayer leverages scalability of Moonbeam with faster transaction performance and lower gas fees, while inheriting security of Moonbeam and Polkadot.

MoonLayer’s integration with EVM allows existing decentralized applications (dApps) from Moonbeam and Ethereum to be effortlessly deployed on its platform.

MoonLayer employs a decentralized sequencer system, fostering trustlessness and decentralization, whereas other rollups often rely on centralized sequencers, creating potential single points of failure.

MoonLayer's upgradability is user-driven, not controlled by centralized entities. All new upgraded clients from developers are transparently presented to users, who can choose which client to run, promoting genuine decentralization and community trust.


# Project Demo

🧷 [How to run nodes](./docs/how-to-run-node.md)

🧷 [RPC documentation](./docs/RPC.md)

🧷 [Demo](./docs/try-it-out.md)

🧷 [Demo video](https://youtu.be/GgLpw9y1GFI)


# Technology Architecture

There are primary technologies in MoonLayer:

* The Rollup
* The EVM
* Sovereign model
* Decentralized sequencers
* Community-Driven Upgradability

## The rollup

As a Layer 2 rollup network, MoonLayer transfers state data and computation off-chain, retaining only essential on-chain data for security.

![](https://media.discordapp.net/attachments/911232853348597771/1125342989229756476/HowItWork1.png?width=960&height=540)

Specifically, transactions in a rollup are collected by nodes called "sequencers". These sequencers package certain transactions into a "batch" or "rollup block" and upload the batch onto the MoonLayer blockchain through a transaction to MoonLayer with an amount of $GLMR for gas fees.  As a Sovereign Rollup, these MoonLayer transactions are not executed or verified on layer 1 like Optimistic and Zk rollup. Instead, all MoonLayer nodes will read and verify the transactions based on MoonLayer consensus rules, then execute them with their own independent state.

This process effectively shards transaction execution and state storage from Layer 1 to Layer 2, reducing aggregation costs. Instead of paying for individual transactions on Layer 1, sequencers bundle transactions into batches and submit them on-chain.

In addition, there are heavy compression tricks of Rollups to make transactions even lighter, further increasing MoonLayer’s transaction throughput because we can fit in more compressed transactions in one batch. Batches are also only stored as a note of a transaction in Moonbeam, which doesn't interfere with Layer 1's state storage, improving gas efficiency.

### Compression tricks

MoonLayer has implemented advanced transaction compression techniques to further enhance speed and reduce gas fees.

MoonLayer currently employs two effective compression tricks:

* First Trick: "Address Indexing" : Rather than storing the full address in each transaction, nodes keep an array of network addresses, allowing us to store just the the position or index of the address. This converts a 20-byte address into a 4-byte number within the EVM, saving 16 bytes per transaction.

* Second Trick: "Gas Compression":  Standard EVM transactions use a 3-byte gas limit(representing the maximum amount of gas the transaction can consume) and a 7 or 8 bytes gas price(denoting the price per gas unit). Our method requires only 1 byte: 0.5 bytes for the gas limit and 0.5 bytes for the gas price. Inspired by Vitalik's “An Incomplete Guide to Rollups,” we use powers of two for gas values. Gas is represented by 2^n (n ranging from 9 to 24) and gas price by 2^m (m ranging from 25 to 40). While not pinpoint accurate, this method offers a wide range and is effective given that gas estimations are usually approximate. This trick reduces 10 bytes per transaction.

As mentioned in our roadmap, we plan to implement more compression tricks to enhance the efficiency of MoonLayer!


## The EVM

MoonLayer employs the EVM as its core contract execution environment. It's fully compatible with Ethereum's native EVM and is constructed on an existing Ethereum client's EVM implementation (Ethereum js), integrating flawlessly with our rollup model. Transaction formats, address formats, signatures, and so on, are the same as those in Ethereum.


## The Sovereign model

### Why does MoonLayer eliminate the need for sending proof to Layer 1?

Sovereign Rollup do not need to send proof to Layer 1, unlike Optimistic Rollup and zk Rollup.

![](https://media.discordapp.net/attachments/911232853348597771/1124985319968755802/HowItWork2.png?width=1440&height=297)

User nodes execute transactions after reading and verifying them from batches. If transactions are faulty, the user nodes disregard them them and execute only valid transactions according to the predefined consensus rules. This removes the need to send proofs to Layer 1 for validation, which is necessary in zk and Optimistic Rollups.

There's a common misconception that rollups must verify the batches (rollup blocks) on-chain. However, user nodes can fully validate them off-chain using Rollup’s consensus rules before submitting proofs. For instance, in Optimistic Rollups, nodes must be able to verify the transactions in batches first to know if they are faulty or not to send a fraud proof to the layer one.

The only reason that Optimistic and zk Rollups require fraud or zk proofs since they partially rely on Layer 1 smart contracts, so only verifying by Rollup consensus rules would not work. Even though Rollup nodes know which transactions are valid, the bridge transferring assets from Layer 1 to Layer 2 needs proof to verify transactions. MoonLayer, like other Sovereign Rollups, has the same power as a layer one and uses an External Bridge instead of a Native Bridge, thus eliminating the need for sending proofs.

**Advantages of the Sovereign model:**

* Efficiency: MoonLayer avoids costly disputes and computationally extensive cryptographic proofs.
* Easy upgradability: MoonLayer can be upgraded through community consensus via hard forks instead of a centralized multisig. 
* Simplified decentralized sequencers implementation: Since sequencers can submit batches freely and nodes will discard any transaction that is faulty, sequencers don't need to worry about the duplication of some transactions that they might falsely submit from losing a slot to another sequencer. This means that decentralized sequencers with MoonLayer can be done much easier, without clunky stakes or bonds like Optimistic rollups.
* Reduced risk: MoonLayer's simplicity minimizes risks. Meanwhile, Optimistic rollups are systemically complex through their fraud proof scheme, and ZK rollups have encapsulated complexity where cryptography can be easily broken if not done right/tested properly.


## Decentralized sequencer system

MoonLayer's Sovereign model facilitates a decentralized sequencer system, where anyone can run a sequencing node to listen to transactions and bundle and upload rollup batches using our client on their computer.

No requirements, staking, or specialized hardware needed to become a sequencer - just have some $GLMR for gas fees when submitting rollup batches.


## Community-Driven Upgradability

MoonLayer upgrades like traditional Layer 1 networks through hard and soft forks. Users have the freedom to choose the client or MoonLayer fork they prefer, in contrast to centralized approaches..


# Project logo 

![](https://media.discordapp.net/attachments/911232853348597771/1125361039412830229/MoonLayer-Logo.png?width=540&height=540)


# Our completed milestones during the Hackathon:

✅ Finalize the core MoonLayer network, ensuring synchronization of nodes with rollup blocks, accurate transaction execution, EVM contract deployment, and state data storage.

✅ Succesfully deploying and using existing EVM contracts on MoonLayer.

✅ Integrate transaction compression for lightweight and cost-effective transactions.

✅ Develope the JSON-RPC server so that dapps can easily interact with the network, read state data, send transactions, etc.

✅ Release documentation and specifications of MoonLayerr’s architecture and APIs.




# Future milestones

With your recognition, we can accelerate MoonLayer development. In the next 3 month, we will do:

* Implement and host RPC-endpoint allowing users to interact with MoonLayer without running nodes (clients).
* Add in compatibility with Ethereum tools like Metamask, Hardhat, Brownie, etc.
* Adding more compression techniques to enhance MoonLayer performance.
* Optimize the MoonLayer client for lower hardware requirements and better performance.
* Implement a bridge for asset transfer between Moonbeam and MoonLayer.
* Build an MoonLayer light client to facilitate decentralized access across various devices.


# Team information

|Name|Role|Github|
|-|-|-|
|Nguyen Phu Minh|Project lead/Infrastructure dev|@nguyenphuminh|
|Nguyen Phu Quan|Smart contract dev/Fullstack dev|@GinFdev|
|Minh Duc|Infrastructure dev|@itsfcl|

