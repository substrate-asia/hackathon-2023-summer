### Basic Information
Project name：DreamFactory

website: [https://opensource.dreamfactorys.xyz](https://opensource.dreamfactorys.xyz/)

Starting time：2023-5-25 

Code address：https://github.com/OpenSource-DreamFactory

### Project Description

The Open Source Dream Factory aims to establish a gateway from Web3.0 to the opensource world, incentivizing developers to continue contributing code and time to open source projects. We have developed a dynamic NFT protocol on Polkadot，It creates dynamic NFTs associated with open source projects and contributors' activities, Participants will compete to develop the most promising projects that can leverage the dynamic NFT and DAO mechanisms to support open source innovation.

![dreamfactory.png](https://upload-images.jianshu.io/upload_images/528413-7bca135935649b9d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Vision and Mission

- Vision: Build a vibrant open-source ecosystem that incentivizes developers and provides sustainable funding for open source projects.


- Mission: Motivate more developers to contribute to open source projects. Developers should receive rewards and recognition commensurate with their contributions.Provide sustained financial support for promising but underfunded open source projects. Promote the development of a culture of open collaboration. Innovate governance and incentive mechanisms in the open source ecosystem.

### Problem and Opportunity
#### Problem

1.Most open source projects rely on voluntary contributions from developers and lack sustained and stable financial support, making it difficult for them to develop in the long term.At the same time, developers lack motivation and incentives to sustain their contributions.


2.Inadequate contribution incentives: The existing contribution evaluation and incentive mechanisms are unable to effectively encourage developers' sustained contributions, and their efforts do not receive the recognition and rewards they deserve.


3.The standardization level of open source projects is insufficient, which may increase uncertainty in the project organization and development implementation process, reduce investors' sense of security, and thus affect the enthusiasm for capital injection.

#### Opportunity

The opportunity of the Open Source Dream Factory project mainly lies in its technology and mechanism: using innovative dynamic NFT combined with DAO governance. This reflects a high level of technical expertise and innovation, which attracts more attention from the technical community. Dynamic NFT can gamify open source contributions, enhancing the participation of users in the open source community and continuously inspiring developers to participate in open source projects. Dynamic NFTs also can publicly and transparently mark each contribution behavior on the blockchain, increasing project credibility and facilitating community supervision. NFT holders have the right to vote for DAO governance, which in turn solves trustworthiness and enthusiasm issues for investors injecting funds, creating opportunities for new business models for the project.


### Our Solution

- Developing a dynamic NFT protocol on Polkadot to create dynamic NFTs that incentivize contributions from open-source developers.
- The dynamic NFT is closely related to the open source project and contributors' activities, and the contribution ranking is directly related to the distribution of dividends for the open source project.
- The NFT upgrade mechanism will dynamically upgrade based on the progress of the project and user contributions.
- Each open source project corresponds to a DAO fund pool that implements transparent and fair financial management, allowing investors and community members to understand the flow and use of funds.
- This allows communities and investors to participate in funding injections and corresponding decision-making for open source projects.
- Preferred cryptocurrencies can be used for fundraising in open-source projects, while payments and transactions can also be made on cross-chain platforms such as Polkadot.
  

### Dynamic NFTs protocol Design


A non-fungible token (NFT) is a data unit stored on the blockchain that represents unique digital assets such as artworks, representing ownership of a particular item or information. Typically, when we talk about NFTs, it is popularized under the ERC-721 standard. The ERC-721 standard is a basic interface for non-fungible tokens, declaring certain functionalities that every smart contract implementing ERC-721 must support.


NFT trading markets like OpenSea rely on this NFT standard. If you visit a page on OpenSea, you will be able to see images associated with the NFTs. However, where are these images stored?

The data related to NFTs (known as "metadata," which refers to additional information such as the name, description, and unique identifier of a digital asset stored on the blockchain) is stored at a URL that can be accessed from the internet. It can be stored on the blockchain, but storing resources on the blockchain is costly due to its limited capacity. Alternatively, it can be stored off-chain using decentralized storage systems like IPFS or centralized storage systems such as traditional cloud storage.


Choose the first option of decentralized storage. Once the data is stored on IPFS, it cannot be modified, making the data static because IPFS data is immutable. The second solution involves centralized storage, where the database allows modifications to NFT-related metadata. However, this introduces significant centralization risks such as single point of failure and monopolized permissions, which contradict the principles of blockchain.


Static NFTs can represent an immutable asset, once determined, they cannot be modified for life. This means that they cannot change or evolve over time. However, if the NFT metadata is mutable and stored in a decentralized manner, it can respond to real-world events and change its state based on external conditions. If the image of an NFT can 'come alive' according to business processes and external events, it will undoubtedly greatly enhance the application value of NFTs and provide an immersive experience. This project is an example of such dynamic NFTs. We hope to closely associate the activities of open-source projects and contributors with dynamic NFTs, recording developers' contributions to open-source projects dynamically within these NFTs in a gamified way to inspire developer involvement in the open-source world.


There are three main approaches to implementing dynamic NFTs:
1. Off-chain storage + API:
- NFT metadata is stored in a centralized database or file server, with the NFT itself only storing a URI pointing to the metadata.
- Queries and updates are done through API calls, while the NFT remains static.
- Pros: Easy development and deployment, can implement complex dynamic logic.
- Cons: Centralized storage introduces single point of failure, poor data control.
2. On-chain storage with dynamically rendered SVG:
- NFT metadata is directly stored on the blockchain, either within the NFT contract or using IPFS hash for storage.
- Queries are performed by reading on-chain data, and updates are done by calling contract functions.
- Pros: Decentralized data that is trustworthy and controllable.
- Cons: High on-chain storage costs, difficult to implement complex dynamic logic, poor user experience.
3. Oracle mechanism:
- Metadata is stored off-chain but synchronized to the blockchain through an oracle.
- The oracle monitors changes in off-chain data and calls contract functions to update the latest data on-chain.
- Queries are made directly from the blockchain for real-time access.
- Pros: Combines advantages of both on-chain and off-chain approaches; trustworthy and real-time data availability.
- Cons: Oracle mechanism complexity makes implementation challenging; security considerations need to be taken into account.


Taking all the above considerations into account, I plan to implement external data synchronization onto the chain using an Oracle approach. We are aware that Chainlink and Tableland can help us achieve our goals.


Advantages and disadvantages of synchronizing GitHub API data directly to Chainlink Oracle and Tableland Oracle:
Advantages:
1. Simple and direct, with low development difficulty. Only need to write an Oracle service to call the GitHub API and on-chain contracts, with relatively simple logic.
2. Fast response speed. Data only needs to be synchronized once from GitHub to the blockchain, reducing intermediate steps.

Disadvantages:
1. Complex implementation of the Oracle mechanism, high security risks. Deploying and running an Oracle network is difficult, and data credibility needs improvement.
2. Data can only be synchronized on-chain, unable to perform off-chain queries and management. Once data is synced on-chain, it is beyond developer control, making it difficult to realize greater value.
3. Poor user experience. On-chain data queries and updates require calling smart contracts, resulting in high gas fees and a poor user experience.

Synchronizing through Tableland:
Advantages:
1. Tableland provides a secure and reliable Oracle network and database service with comprehensive and efficient data management capabilities.
2. Supports synchronization between on-chain and off-chain data for a more powerful interactive experience. Users can freely read from or update data both on-chain 
   

The Tableland and Chainlink Oracle mechanisms have the following main differences:

1. Different data sources: The Tableland Oracle is mainly used to synchronize data from off-chain relational databases to the blockchain, while the Chainlink Oracle is typically used to synchronize real-time data sources such as APIs and IoT devices to the blockchain.
2. Different synchronization targets: The Tableland Oracle synchronizes data to the database of the Tableland network, while the Chainlink Oracle usually synchronizes data to smart contracts.
3. Different node types: The Tableland Oracle nodes need to run SQLite databases used by the Tableland network, while Chainlink nodes are stateless nodes that only need to synchronize data onto the blockchain.
4. Different ways of obtaining data for nodes: The Tableland Oracle nodes directly access the database of the Tableland network to obtain up-to-date data, while Chainlink nodes need to call external data source APIs for obtaining data.
5. Different node roles: The Tableland Oracle nodes also serve as validation nodes in addition to synchronizing data; they verify and execute smart contract calls. On the other hand, Chainlink nodes primarily play.
  
Tableland Oracle:
- Data source: Off-chain relational database
- Synchronization target: Tableland network database
- Node type: Validation node running SQLite database
- Data retrieval method: Direct access to Tableland database
- Node role: Data synchronization + validation and execution of smart contract calls

Chainlink Oracle:
- Data source: External API
- Synchronization target: Smart contract
- Node type: Stateless node
- Data retrieval method: Calling external API 
- Node role: Data synchronization

However, there are also some similarities between the two:
- Both use the Oracle mechanism to synchronize off-chain data to on-chain.
- Both require multiple Oracle nodes to form a network for increased reliability.
- Both face challenges in data trustworthiness and security, requiring careful design and response.

How does Tableland, as a decentralized database for web3, solve the problem of centralized metadata storage?
Tableland belongs to the Oracle mechanism solution. It synchronizes off-chain data to the blockchain through Oracle, achieving decentralization and real-time updates of data.
Overall, Tableland mainly reduces and avoids centralization risks in the following aspects:
1. SQLite for structured data storage. The Oracle node of Tableland embeds a SQLite database for storing relational table data. SQLite is a lightweight relational database that facilitates data management for Tableland nodes. Tableland hides the complexity of database operation and provides simple API interfaces.
2. Decentralized Oracle network. Tableland uses its own Oracle network to monitor off-chain data changes and synchronize them on-chain. This Oracle network consists of multiple nodes without centralization risk. Even if one node fails, it can still function normally.
3. Immutable on-chain data. The on-chain data storage used by Tableland is based on the blockchain itself, which means once stored on-chain, the data becomes immutable. Therefore, even if there are failures in the Oracle network or IPFS, historical data will not be lost; only new updates cannot be synchronized temporarily resulting in short service interruptions.
4. Node competition mechanism.Tableland's Oracle network requires nodes to compete for listening rights to off-chain data changes.This prevents any single node from monopolizing the privilege of listening to such changes.If a node behaves abnormally,it can be dynamically removed,and its listening rights will be transferred to other nodes.
5.On-chain governance.The access control and usage permissions for Tableland's on-chaindata are controlled by an on-chain governance mechanism.The behavior of a certain node attempting to abuse its monitoring authority can be detected and penalized by the on-chain governance mechanism. This also reduces centralization risks.
   
But currently, Tableland does not support the Polkadot network. Instead, we have implemented a dynamic NFT protocol based on the principles similar to Tableland, using the Polkadot blockchain. We have done some work to achieve compatibility with EVM on Polkadot's parachain Astar and made adaptations to the Tableland validation nodes.
The specific work is as follows:
1. Deploying Tableland's data storage contract on the Astar network to store NFT states and other data.
2. Adding indexing and caching of Astar network data on Tableland nodes in Polygon/Ethereum networks. This allows Tableland to directly query and update Astar network data.
3. When users interact with NFTs or assets on the Astar network, it automatically triggers on-chain events. Upon detecting these events, Tableland nodes can directly call interfaces of Astar network smart contracts for data querying or updating.
4. When users query NFT data, they can directly call Tableland's API. The Tableland node checks its local cache first; if there is no latest data available, it queries the Astar network to obtain it and updates the cache accordingly. This enables users to query Astar asset data just like they would for native Tableland networks.
5. If updating Tableland's data also requires triggering an event in Astar, then the Tableland node can directly call interfaces of Astar network smart contracts to initiate such events.
   

The main process of this plan is as follows:

1. Deploy the Tableland contract on the Astar platform.
2. The Tableland node adds caching and indexing for Astar network data.
3. The Tableland node listens to events on the Astar chain and directly calls the Astar contract interface for data synchronization.
4. Users can query Astar assets through the Tableland API, and the Tableland node checks the cache and obtains the latest data from the Astar network.
5. Tableland can directly call the Astar contract interface to trigger events.


### How it works
![works](https://upload-images.jianshu.io/upload_images/528413-a2fd43c618f67381.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


1. Select Open Source Projects: Choose several active and influential open source projects to enter the ecosystem. The dynamics of NFT correspond to these projects and change according to project progress and user contributions.
2. Dynamic NFT Design: Based on the dynamic NFT protocol on Polkadot, design a series of dynamic NFTs for open source projects. These NFTs will automatically upgrade based on project progress and user contributions, representing the honor of project development and user contributions.
3. Contribution Evaluation Criteria: Establish contribution evaluation criteria for open source projects, which can be assessed based on dimensions such as the number of submitted PRs and issues, lines of code, and project influence. These criteria will be tied to the dynamics of NFTs.
4. Develop Chrome Extension: Develop a Chrome extension for issuing and managing these dynamic NFTs so that project developers and contributors can view their own NFTs and open-source levels within the extension.
5. NFT Issuance: Users can purchase project dynamic NFTs using astar within the wallet plugin, representing their recognition of the project while injecting funds into it. After purchase, the record of the purchased NFT is stored in users' wallets.
6. Incentive Mechanism: Use the dynamic changes in NFTs to incentivize more developers to contribute to this open source project. Additional rewards such as project tokens or monetization through auctioning famous developers' NFTs in an NFT marketplace can be provided.
7. DAO Fund Pool: All proceeds from selling NFT s go into a DAO fund pool managed collectively by participants.This fund is mainly used for repurchasing marketN FT sand supporting various open source projects' development.
8.Project Progress & NFT Changes: When milestones are achieved in aproject,the corresponding dynamic NFT swill automatically upgrade,incentivizing holders topay continuous attentionand make purchases,to inject more funds into the project.
9. User Contributions & NFT Upgrades: When contributors reach a certain level, their related NFT swill be upgraded to reward their contributions to the project. This will inspire more developers to participate.
10. DAO Governance: The NFT Foundation and the project's DAO jointly take responsibility for relevant functions.NFT holders can participate in DAO governance, influencing fund allocation and project direction.
![kaiyuan](https://upload-images.jianshu.io/upload_images/528413-6b4bd84772d2dafc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


Using the Dreamfactory dynamic NFT protocol to interact with the GitHub API, we can implement a solution for dynamic NFTs:

1. Develop a GitHub API interface to retrieve project data such as issues, pull requests, commits, etc. These interfaces can be deployed on centralized servers.
2. Create database tables on Dreamfactory to store NFT status data, including project ID, total contributions, last synchronization time, etc.
3. Develop an Oracle service that periodically calls the GitHub API to fetch the latest project data.
4. The Oracle service compares the data obtained from the GitHub API with the last synchronization time stored in Tableland and retrieves any new data.
5. The Oracle service calls Dreamfactory's SQL API to store the newly retrieved data from step 4 into their respective tables in Dreamfactory. If there are any changes in NFT contribution attributes, it updates the corresponding data in the NFT status table as well.
6. The Oracle service updates the last synchronization time in Dreamfactory's status table as a reference for future synchronizations.
7. When users query NFT metadata, they can directly call Dreamfactory's SQL API to retrieve information from the status table. The results obtained will be dynamically updated with real-time state information.
8. Additionally, events can be developed to proactively push updates of state tables to clients so that user-side data remains continuously refreshed.



The above is a solution for Dreamfactory to interact with third-party APIs (such as GitHub) to achieve dynamic NFT. The main process is as follows:
1. GitHub API provides project contribution data interface.
2. Create a table on Dreamfactory to store NFT status and synchronization time.
3. Oracle service periodically synchronizes data from the GitHub API.
4. Compare the last synchronization time and retrieve new data to update Tableland.
5. Update the Dreamfactory status table and NFT contribution attributes.
6. Update the Dreamfactory synchronization time as a reference for the next synchronization.
7. Users can directly query Dreamfactory to obtain the latest updated NFT status in real-time.
8. It is also possible to develop event-based real-time updates of the status table to users' end.

In this way, by using Oracle as an intermediate layer, dynamic updates of Dreamfactory's state data are achieved, thereby achieving dynamic NFTs. Users can easily query Dreamfactory to obtain real-time NFT statuses.


### How Ecosystem Works

The Open Source Dream Factory is committed to promoting the development and commercialization of open source projects, and building an ecosystem in the field of open source innovation. This is a very meaningful direction that can unleash the tremendous potential of open source technology and projects.

![dream](https://upload-images.jianshu.io/upload_images/528413-9591dde4c5e8d64c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1. Excellent open-source projects can obtain dynamic NFTs through the Open Source Dream Factory project incubation. NFT holders become members of the project DAO.
2. The open-source project DAO can manage an independent fund pool and decide on the direction of fund utilization.
3. After obtaining dynamic NFTs and DAO support, outstanding open-source projects are more likely to achieve commercialization, which also brings investment returns to the Open Source Dream Factory. The profit of the Open Source Dream Factory comes from fees generated by the fund pool.
4. The activity level of open-source projects and communities can influence the price of NFTs and investments received by projects. Project progress can be updated through NFTs, and consensus within the community is required for fund usage decisions.
5. Building an open-source ecosystem and industry segmentation provide a broader foundation for connecting the open-source world with the web3 world. Excellent open-source projects and technologies can obtain funding, community support, and application support in this ecosystem, generating greater value.

![dem](https://upload-images.jianshu.io/upload_images/528413-526a7597047654ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


This diagram illustrates the process of commercializing open source projects, with Open Source Dream Factory as both a promoter and participant:
1. Open source projects need to adhere to open source licenses, establish active communities, and continuously maintain and develop in order to ultimately achieve commercial success and value.
2. Open Source Dream Factory identifies promising projects through project mining and provides them with technical support and investment to facilitate their commercial transformation. Successful transformations can bring investment returns for Open Source Dream Factory.
3. Project maintenance requires the support of both the open source community and Open Source Dream Factory. The latter can also share in the commercial success of the projects, creating a virtuous cycle.
4. Ecological construction creates conditions for project selection and transformation by Open Source Dream Factory. Excellent projects and technologies can also receive incubation and layout within this ecosystem.


### Technical Architecture


DreamFactory has registry contracts deployed on each polkadot Parachain (currently live on astar，EVM-compatible Polkadot chain). Thus, applications can take advantage of its host chain's security and execution with contract-driven SQL and access control logic. Off-chain, there is a decentralized network of database "validator" nodes running the Tableland protocol. This helps guarantee there isn't a single point of failure when storing and querying table data. At a high level, the network consists of the following:
![hybrid](https://upload-images.jianshu.io/upload_images/528413-26ad339f766c7d38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


On-chain: Table creates and writes pass through the registry smart contract on each base chain (statements are written to event logs). This includes the SQL statement itself plus custom access controls defined in smart contracts such that data is available on-chain.
Off-chain: Statements for table creates and writes are materialized by Tableland validator nodes—these nodes simply watch the registry and mutate a local SQLite database with the database instructions. Here, the data is accessible using SQL read queries at an HTTPS gateway.


In other words, you can recreate a table's state by replaying all of the events at a chain's registry contract; this is how unstoppable networks are built on top of each other. As long as the host chain survives, the table's state can deterministically be collated. Keep in mind that table data is not accessible from within smart contract calls—you can't query a table from a contract without using some off-chain oracle-like setup. Much like how smart contracts can't read transaction data, they also cannot read table data since data is available in event logs. Thus, data accessibility is only possible using read queries directly to any DreamFactory node.



### Functions completed during hackathon delivery


1. Develop a dynamic NFT protocol on Polkadot.

2. Based on this protocol, achieve the implementation effect of open-source Dream Factory's dynamic NFT badges.

**blockcain**

- `pallet-dynamic nft`
  - [ ] NFT 创建及数据结构定义 (`fn create_nft()`)
  - [ ] NFT 转帐函数 (`fn transfer()`)
  - [ ] NFT 销毁函数 (`fn burn_token()`)

**客户端**

- web 端
  - [ ] 用户注册页面
  - [ ] NFT 产品创建流程
  - [ ] NFT 产品购买流程




### Initial project review version/

### Team information/

- jack：软件工程师，具有 Rust 和区块链开发经验。
- soywang：区块链开发人员，具有 Substrate 和 Solidity, Solana 开发经验。
- ciconianigra：区块链开发人员
- yiko：区块链开发人员

### Track affiliation

Smart Contracts (and related)

Blockchain Products and Tools

### Project demonstration
Videos: 

Show how demo works:

Contract Example Online:


Other Files:
Project Pitch Deck: 
