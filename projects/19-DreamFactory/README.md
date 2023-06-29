### Basic Information
Project name：DreamFactory

website: [https://opensource.dreamfactorys.xyz](https://opensource.dreamfactorys.xyz/)

Starting time：2023-5-25 

Code address：https://github.com/OpenSource-DreamFactory

### Project Description
开源梦工厂旨在建立一个从Web3.0到开源世界的门户，激励开发者继续为开源项目贡献代码和时间。我们在Polkadot上开发了一种动态NFT协议，它创建与开源项目和贡献者活动相关联的动态NFT。参与者将竞争开发最有前途的项目，利用动态NFT和DAO机制支持开源创新。

The Open Source Dream Factory aims to establish a gateway from Web3.0 to the opensource world, incentivizing developers to continue contributing code and time to open source projects. We have developed a dynamic NFT protocol on Polkadot，It creates dynamic NFTs associated with open source projects and contributors' activities, Participants will compete to develop the most promising projects that can leverage the dynamic NFT and DAO mechanisms to support open source innovation.

![dreamfactory.png](https://upload-images.jianshu.io/upload_images/528413-7bca135935649b9d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Vision and Mission
愿景：建立一个充满活力的开源生态系统，激励开发者并为开源项目提供可持续的资金支持。

- Vision: Build a vibrant open-source ecosystem that incentivizes developers and provides sustainable funding for open source projects.

使命：激励更多的开发者为开源项目做出贡献。开发者应该得到与他们的贡献相称的奖励和认可。为有前途但缺乏资金支持的开源项目提供持续性的财务支持。促进开放协作文化的发展。创新开源生态系统中的治理和激励机制。

- Mission: Motivate more developers to contribute to open source projects. Developers should receive rewards and recognition commensurate with their contributions.Provide sustained financial support for promising but underfunded open source projects. Promote the development of a culture of open collaboration. Innovate governance and incentive mechanisms in the open source ecosystem.

### Problem and Opportunity
#### Problem
大多数开源项目依靠开发者的自愿贡献建设,缺乏持续稳定的资金支持,难以长期发展。同时，开发者缺乏动力和激励来维持他们的贡献。

1.Most open source projects rely on voluntary contributions from developers and lack sustained and stable financial support, making it difficult for them to develop in the long term.At the same time, developers lack motivation and incentives to sustain their contributions.

贡献激励不足:现有的贡献评价和激励机制无法有效鼓励开发者的持续贡献,他们的付出得不到应有的认可与回报。

2.Inadequate contribution incentives: The existing contribution evaluation and incentive mechanisms are unable to effectively encourage developers' sustained contributions, and their efforts do not receive the recognition and rewards they deserve.

开源项目标准化程度不足，这可能会加大项目组织，开发实施过程的中的不确定性，降低投资人的安全感，从而影响资金注入的积极性。

3.The standardization level of open source projects is insufficient, which may increase uncertainty in the project organization and development implementation process, reduce investors' sense of security, and thus affect the enthusiasm for capital injection.

#### Opportunity

开源梦工厂项目的机会主要在于它的技术和机制:使用创新的动态NFT结合DAO治理的方式。可以体现出较高的技术含金量和创新性,更多的吸引技术社区的眼球。动态NFT其实可以游戏化开源贡献，增强了开源社区用户的参与感，从而不断激发开发者参与开源项目的热情。动态NFT也可以在区块链上公开透明地标记每个贡献行为,这增加了项目的公信力,也便于社区监督,NFT持有者拥有DAO治理投票的权利，反过来解决了投资者注入资金的信任度和积极性,为项目开拓新的商业模式创造机会。

The opportunity of the Open Source Dream Factory project mainly lies in its technology and mechanism: using innovative dynamic NFT combined with DAO governance. This reflects a high level of technical expertise and innovation, which attracts more attention from the technical community. Dynamic NFT can gamify open source contributions, enhancing the participation of users in the open source community and continuously inspiring developers to participate in open source projects. Dynamic NFTs also can publicly and transparently mark each contribution behavior on the blockchain, increasing project credibility and facilitating community supervision. NFT holders have the right to vote for DAO governance, which in turn solves trustworthiness and enthusiasm issues for investors injecting funds, creating opportunities for new business models for the project.


### Our Solution

在波卡上开发动态NFT协议，创建动态NFT来激励开源开发者的贡献
动态NFT动态显示开源项目和贡献者的活动紧密关联，贡献度排名与开源项目分红直接相关
NFT升级机制，将根据项目的进展和用户的贡献进行动态升级,游戏化开源贡献
开源项目对应一个DAO基金池，实施透明和公开公正的财务管理，让投资者和社区成员了解资金的流向和使用情况
让社区和投资者可以参与资金注入和与之对应的开源项目决策
偏好的加密货币来参与开源项目的资金募集，同时还可以在波卡等跨链平台上进行支付和交易

- Developing a dynamic NFT protocol on Polkadot to create dynamic NFTs that incentivize contributions from open-source developers.
- The dynamic NFT is closely related to the open source project and contributors' activities, and the contribution ranking is directly related to the distribution of dividends for the open source project.
- The NFT upgrade mechanism will dynamically upgrade based on the progress of the project and user contributions.
- Each open source project corresponds to a DAO fund pool that implements transparent and fair financial management, allowing investors and community members to understand the flow and use of funds.
- This allows communities and investors to participate in funding injections and corresponding decision-making for open source projects.
- Preferred cryptocurrencies can be used for fundraising in open-source projects, while payments and transactions can also be made on cross-chain platforms such as Polkadot.
  

### Dynamic NFTs protocol Design

非同质化代币（Non-Fungible Token，简称：NFT），是一种储存在区块链上的数据单位，它可以代表艺术品等独一无二的数字资产，代表了某个独特物品或信息的所有权。通常情况下，当我们谈论非同质化代币（NFT）时，只是在ERC-721标准下才得以流行。ERC-721标准是一种非同质化代币的基本接口，它声明了每个实现ERC-721的智能合约必须支持的一些功能。

A non-fungible token (NFT) is a data unit stored on the blockchain that represents unique digital assets such as artworks, representing ownership of a particular item or information. Typically, when we talk about NFTs, it is popularized under the ERC-721 standard. The ERC-721 standard is a basic interface for non-fungible tokens, declaring certain functionalities that every smart contract implementing ERC-721 must support.

像OpenSea这样的NFT交易市场依赖这个NFT标准，如果您访问OpenSea上的页面，您将可以看到NFT相关联的图像。然而，这些图像存储在哪里呢？
NFT相关的数据（即“元数据”，元数据是指存储在区块链上的数字资产的名称、描述和唯一标识符等附加信息，有助于验证其真实性和所有权。）存储在某个可从互联网访问的URL上。可以存储在区块链上，但是区块链上存储资源很宝贵，需要花费很高的费用。还可以存储在链下，用去中心化存储（例如IPFS），或者中心化存储，比如传统的云存储。

NFT trading markets like OpenSea rely on this NFT standard. If you visit a page on OpenSea, you will be able to see images associated with the NFTs. However, where are these images stored?

The data related to NFTs (known as "metadata," which refers to additional information such as the name, description, and unique identifier of a digital asset stored on the blockchain) is stored at a URL that can be accessed from the internet. It can be stored on the blockchain, but storing resources on the blockchain is costly due to its limited capacity. Alternatively, it can be stored off-chain using decentralized storage systems like IPFS or centralized storage systems such as traditional cloud storage.

选择第一种去中心化存储，一旦数据存储在IPFS上，就无法修改，数据变得静态化，因为IPFS上的数据不可修改。第二种解决方案中心化存储，在数据库允许修改与NFT相关的元数据，但引入了严重的中心化风险，比如单点故障，权限垄断，这与区块链的理念相悖。

Choose the first option of decentralized storage. Once the data is stored on IPFS, it cannot be modified, making the data static because IPFS data is immutable. The second solution involves centralized storage, where the database allows modifications to NFT-related metadata. However, this introduces significant centralization risks such as single point of failure and monopolized permissions, which contradict the principles of blockchain.

静态NFT可以代表一个不可变的资产，NFT一旦确定就终生不能修改，这意味着它们不能随着时间的推移而改变或发展。如果NFT元数据可变同时元数据存储的方式又兼具去中心化的特性，可以响应现实世界事件并根据外部条件改变其状态。NFT的图像能根据业务流程和外部事件“动起来”，那么无疑将会大大提升NFT的应用价值和沉浸式的体验。本项目便是这种动态NFT的一种案例，我们希望NFT动态显示开源项目和贡献者的活动紧密关联，开发者对开源项目的贡献动态记录在动态NFT，以一种游戏化的方式激发开发者投入开源世界。

Static NFTs can represent an immutable asset, once determined, they cannot be modified for life. This means that they cannot change or evolve over time. However, if the NFT metadata is mutable and stored in a decentralized manner, it can respond to real-world events and change its state based on external conditions. If the image of an NFT can 'come alive' according to business processes and external events, it will undoubtedly greatly enhance the application value of NFTs and provide an immersive experience. This project is an example of such dynamic NFTs. We hope to closely associate the activities of open-source projects and contributors with dynamic NFTs, recording developers' contributions to open-source projects dynamically within these NFTs in a gamified way to inspire developer involvement in the open-source world.

动态NFT的实现主要有以下三种方案:
1. 链下存储 + API:
- NFT元数据存储在中心化数据库或文件服务器,NFT中只存储一个URI指向元数据
- 查询和更新通过调用API实现,NFT本身是静态的
- 优点:开发和部署难度小,可以实现复杂的动态逻辑
- 缺点:中心化存储,存在单点故障,数据可控性差
2. 链上存储动态渲染生成SVG:
- NFT元数据直接存储在链上,可以是在NFT合约里或通过IPFS哈希存储
- 查询通过读取链上数据实现,更新通过调用合约函数完成
- 优点:数据去中心化,可信且可控 
- 缺点:链上存储成本高,不易实现复杂动态逻辑,用户体验差
3. Oracle机制:
- 元数据存储在链下,但通过Oracle将其同步至链上 
- Oracle监听链下数据变化,并调用合约函数将最新数据更新至链上 
- 查询直接从链上获取,实时性强
- 优点:兼具链上链下优点,数据可信且实时 
- 缺点:Orcle机制复杂,实现难度大,安全性需要考量

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


综合以上考量，我打算以一种oracle方式来实现外部数据同步到链上，我们了解有chainlink和tableland可以实现我们的目标。

Taking all the above considerations into account, I plan to implement external data synchronization onto the chain using an Oracle approach. We are aware that Chainlink and Tableland can help us achieve our goals.

GitHub API数据直接同步至chainlink Oracle和tableland Oracle优缺点:
优点:
1. 简单直接,开发难度小。只需要编写Oracle服务调用GitHub API和链上合约,逻辑较简单。
2. 响应速度快。数据只需要同步一次,从GitHub到链上,减少了中间环节。
缺点:
1. Oracle机制实现复杂,安全隐患高。Oracle网络部署和运行难度大,数据可信度需要提高。
2. 数据只能同步至链上,无法进行链下查询和管理。一旦数据同步至链上就脱离开发者控制,难以发挥更大价值。
3. 用户体验较差。链上数据查询和更新都需要调用智能合约,gas费用高且体验差。
通过Tableland同步:
优点:
1. Tableland提供安全可靠的Oracle网络和数据库服务,数据管理全面与高效。
2. 支持链上链下数据同步与使用,实现更强大的交互体验。用户可在链上链下自由读取和更新数据。
3. 开发难度减小,Tableland隐藏了数据库运维的复杂度,提供简单的API接口。
缺点:
1. 部署成本高,Tableland的技术实现较复杂,需要投入大量资源进行开发与维护。
2. 数据响应略慢,需要从GitHub到Tableland然后到链上,多一跳发送数据。
3. Tableland作为中间层,也增加了潜在风险,需要对Tableland自身保证安全与性能。

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
   
Tableland和Chainlink的Oracle机制有以下主要区别:
1. 数据来源不同。Tableland的Oracle主要用于同步链下关系型数据库的数据至链上,而Chainlink的Oracle通常用于同步实时数据源如API、IoT设备的数据至链上。
2. 同步目标不同。Tableland的Oracle将数据同步至Tableland网络的数据库中,而Chainlink的Oracle通常将数据同步至智能合约。
3. 节点类型不同。Tableland的Oracle节点需要运行Tableland网络所使用的SQLite数据库,而Chainlink的节点是无状态节点,只需同步数据至链上。
4. 节点获取数据方式不同。Tableland的Oracle节点直接访问Tableland网络的数据库获取最新数据,而Chainlink的节点需要调用外部数据源的API获取数据。
5. 节点角色不同。Tableland的Oracle节点同时也是网络的验证节点,除了同步数据外,还需要验证和执行智能合约调用,而Chainlink节点主要起到数据同步的作用。

The Tableland and Chainlink Oracle mechanisms have the following main differences:

1. Different data sources: The Tableland Oracle is mainly used to synchronize data from off-chain relational databases to the blockchain, while the Chainlink Oracle is typically used to synchronize real-time data sources such as APIs and IoT devices to the blockchain.
2. Different synchronization targets: The Tableland Oracle synchronizes data to the database of the Tableland network, while the Chainlink Oracle usually synchronizes data to smart contracts.
3. Different node types: The Tableland Oracle nodes need to run SQLite databases used by the Tableland network, while Chainlink nodes are stateless nodes that only need to synchronize data onto the blockchain.
4. Different ways of obtaining data for nodes: The Tableland Oracle nodes directly access the database of the Tableland network to obtain up-to-date data, while Chainlink nodes need to call external data source APIs for obtaining data.
5. Different node roles: The Tableland Oracle nodes also serve as validation nodes in addition to synchronizing data; they verify and execute smart contract calls. On the other hand, Chainlink nodes primarily play
   
Tableland Oracle:
- 数据来源:链下关系型数据库
- 同步目标:Tableland网络数据库
- 节点类型:运行SQLite数据库的验证节点
- 获取数据方式:直接访问Tableland数据库 
- 节点角色:数据同步+验证和执行智能合约调用
Chainlink Oracle:
- 数据来源:外部API 
- 同步目标:智能合约  
- 节点类型:无状态节点
- 获取数据方式:调用外部API 
- 节点角色:数据同步
但两者也有一定的相似之处:
- 都利用Oracle机制实现链下数据同步至链上 
- 都需要多个Oracle节点form一个网络,提高可靠性 
- 都面临数据可信度和安全性的挑战,需要妥善设计与应对。
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

那tableland作为web3去中心化数据库如何解决元数据存储中心化问题？
Tableland属于Oracle机制方案。它通过Oracle将链下数据同步至链上,实现数据的去中心化与实时更新。
所以,总体来说,Tableland主要从以下几个方面降低和避免中心化风险:
1. SQLite用于结构化数据存储。Tableland的Oracle节点内嵌SQLite数据库,用于存储关系型表数据。SQLite是一种轻量级的关系型数据库,方便Tableland节点进行数据管理。Tableland隐藏了数据库运维的复杂度,提供简单的API接口。
2. Oracle网络去中心化。Tableland使用自己的Oracle网络监听链下数据变更并同步至链上。该Oracle网络由众多节点组成,不存在中心化的风险。某个节点发生故障,其仍可以正常工作。
3. 链上数据不可变。Tableland的链上数据存储使用的是区块链本身,数据一旦存储上链就不可变。所以即使Oracle网络或IPFS发生故障,历史数据不会丢失。只是新的更新无法同步,服务会出现短时间中断。
4. 节点竞争机制。Tableland的Oracle网络中的各节点需要通过竞争的机制来获取链下数据变更的监听权。这避免某个节点垄断监听数据变更的权限。如果某节点表现异常,可以被动态剔除,其监听权会转移给其他节点。
5. 链上治理。Tableland链上数据的访问控制与使用权限由链上治理机制来控制。某个节点想要滥用其监听权限的行为可以被链上治理机制检测和制裁。这也降低了中心化风险。

How does Tableland, as a decentralized database for web3, solve the problem of centralized metadata storage?
Tableland belongs to the Oracle mechanism solution. It synchronizes off-chain data to the blockchain through Oracle, achieving decentralization and real-time updates of data.
Overall, Tableland mainly reduces and avoids centralization risks in the following aspects:
1. SQLite for structured data storage. The Oracle node of Tableland embeds a SQLite database for storing relational table data. SQLite is a lightweight relational database that facilitates data management for Tableland nodes. Tableland hides the complexity of database operation and provides simple API interfaces.
2. Decentralized Oracle network. Tableland uses its own Oracle network to monitor off-chain data changes and synchronize them on-chain. This Oracle network consists of multiple nodes without centralization risk. Even if one node fails, it can still function normally.
3. Immutable on-chain data. The on-chain data storage used by Tableland is based on the blockchain itself, which means once stored on-chain, the data becomes immutable. Therefore, even if there are failures in the Oracle network or IPFS, historical data will not be lost; only new updates cannot be synchronized temporarily resulting in short service interruptions.
4. Node competition mechanism.Tableland's Oracle network requires nodes to compete for listening rights to off-chain data changes.This prevents any single node from monopolizing the privilege of listening to such changes.If a node behaves abnormally,it can be dynamically removed,and its listening rights will be transferred to other nodes.
5.On-chain governance.The access control and usage permissions for Tableland's on-chaindata are controlled by an on-chain governance mechanism.The behavior of a certain node attempting to abuse its monitoring authority can be detected and penalized by the on-chain governance mechanism. This also reduces centralization risks.


但是目前tableland不支持波卡网络，我们采用了类似Tableland的原理,基于波卡区块链实现动态NFT协议。
我们做了一些工作完成波卡平行链evm兼容的链的动态NFT协议，所以我们采用波卡的平行链astar，并且将tableland验证节点做了一些适配。
具体工作如下：
1. 在Astar网络上部署Tableland的数据存储合约,用于保存NFT状态和其他数据。
2. Tableland在Polygon/以太坊网络的节点上增加Astar网络数据的索引和缓存。这样,Tableland可以直接查询和更新Astar网络的数据。
3. 当用户在Astar网络上与NFT或资产交互时,Astar网络会自动触发链上事件。Tableland的节点监听到这些事件后,可以直接调用Astar网络智能合约的接口,进行数据查询或更新。
4. 用户查询NFT数据时,直接调用Tableland的API。Tableland节点会checks本地缓存,如果没有最新数据会查询Astar网络获取,并更新缓存。这样,用户可以像查询Tableland原生网络一样查询Astar资产数据。
5. 如果Tableland数据更新也需要触发Astar事件,Tableland节点可以直接调用Astar网络智能合约接口发起事件。
   
But currently, Tableland does not support the Polkadot network. Instead, we have implemented a dynamic NFT protocol based on the principles similar to Tableland, using the Polkadot blockchain. We have done some work to achieve compatibility with EVM on Polkadot's parachain Astar and made adaptations to the Tableland validation nodes.

The specific work is as follows:
1. Deploying Tableland's data storage contract on the Astar network to store NFT states and other data.
2. Adding indexing and caching of Astar network data on Tableland nodes in Polygon/Ethereum networks. This allows Tableland to directly query and update Astar network data.
3. When users interact with NFTs or assets on the Astar network, it automatically triggers on-chain events. Upon detecting these events, Tableland nodes can directly call interfaces of Astar network smart contracts for data querying or updating.
4. When users query NFT data, they can directly call Tableland's API. The Tableland node checks its local cache first; if there is no latest data available, it queries the Astar network to obtain it and updates the cache accordingly. This enables users to query Astar asset data just like they would for native Tableland networks.
5. If updating Tableland's data also requires triggering an event in Astar, then the Tableland node can directly call interfaces of Astar network smart contracts to initiate such events.
这个方案的主要流程是:
1. 在Astar部署Tableland合约
2. Tableland节点增加对Astar网络数据的缓存和索引
3. Tableland节点监听Astar链上事件,并直接调用Astar合约接口进行数据同步 
4. 用户通过Tableland API查询Astar资产,Tableland节点检查缓存和Astar网络获取最新数据 
5. Tableland可以直接调用Astar合约接口触发事件

The main process of this plan is as follows:

1. Deploy the Tableland contract on the Astar platform.
2. The Tableland node adds caching and indexing for Astar network data.
3. The Tableland node listens to events on the Astar chain and directly calls the Astar contract interface for data synchronization.
4. Users can query Astar assets through the Tableland API, and the Tableland node checks the cache and obtains the latest data from the Astar network.
5. Tableland can directly call the Astar contract interface to trigger events.


### How it works
![works](https://upload-images.jianshu.io/upload_images/528413-a2fd43c618f67381.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
1. 选择开源项目:选择几个活跃且有影响力的开源项目进入该生态。项目动态NFT与之对应,并根据项目与用户贡献变化。
2. 动态NFT设计:基于波卡上动态NFT协议，给开源项目方设计一系列动态NFT,它们会随着项目进展和用户贡献自动升级,表示项目发展与用户贡献的荣誉。
3. 贡献度评估标准:制定开源项目贡献度评估标准,可以根据提交的PR与Issue数量、代码行数、项目影响力等维度进行评估。这些标准将与NFT的动态性绑定。
4. 开发Chrome插件:开发一个Chrome插件用于颁发和管理这些动态NFT,项目开发者和贡献者可以在插件中查看自己的NFT及开源级别。
5. NFT发行:用户可以在钱包插件内可以用astar购买项目动态NFT,代表认可项目并为其注入资金。购买后NFT记录在用户钱包。
6. 激励机制:基于NFT的动态变化来激励和吸引更多开发者为该开源项目作出贡献。可以额外给予项目币奖励,或在NFT市场拍卖著名开发者的NFT来实现变现。
7. DAO基金池:NFT销售所得全部进入DAO基金池,由其统一管理。这些资金主要用于回购市场NFT和资助各开源项目发展。
8. 项目进展与NFT变化:项目达成里程碑时,相关动态NFT自动升级,激励NFT持有者持续关注和购买,为项目注入更多资金。
9. 用户贡献 & NFT提升:项目贡献者达到一定级别,相关NFT提升级别,褒奖其对项目贡献。这激发更多开发者参与。
10. DAO治理:NFT基金会与项目DA0共同负责相关职能。NFT持有者可以参与DAO治理,影响资金流向和项目方向。

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


使用Dreamfactory动态nft协议与GitHub API交互,实现动态NFT的方案:
1. 开发GitHub API接口,用于获取项目的Issue、PR、Commit等数据。这些接口可以部署在中心化服务器上。
2. 在Dreamfactory上创建数据库表来存储NFT状态数据,包括项目ID、总贡献数、上次同步时间等。
3. 开发一个Oracle服务来定期调用GitHub API,获取项目最新的数据。
4. Oracle服务将从GitHub API获取的数据与Tableland中存储的上次同步时间比较,获取新增的数据。
5. Oracle服务调用Dreamfactory的SQL API,将步骤4中获取的新增数据存入Dreamfactory相应的表中。如果有NFT的贡献属性发生变化,也相应更新NFT状态表中的数据。
6. Oracle服务在Dreamfactory状态表中更新上次同步时间,作为下次同步的参考。
7. 用户查询NFT元数据时,直接调用Dreamfactory的SQL API查询状态表获取。获取到的结果是动态更新过的最新状态数据。
8. 同时,也可以开发事件以主动推送状态表更新到客户端,这样用户端可以保持数据实时刷新。

Using the Dreamfactory dynamic NFT protocol to interact with the GitHub API, we can implement a solution for dynamic NFTs:

1. Develop a GitHub API interface to retrieve project data such as issues, pull requests, commits, etc. These interfaces can be deployed on centralized servers.
2. Create database tables on Dreamfactory to store NFT status data, including project ID, total contributions, last synchronization time, etc.
3. Develop an Oracle service that periodically calls the GitHub API to fetch the latest project data.
4. The Oracle service compares the data obtained from the GitHub API with the last synchronization time stored in Tableland and retrieves any new data.
5. The Oracle service calls Dreamfactory's SQL API to store the newly retrieved data from step 4 into their respective tables in Dreamfactory. If there are any changes in NFT contribution attributes, it updates the corresponding data in the NFT status table as well.
6. The Oracle service updates the last synchronization time in Dreamfactory's status table as a reference for future synchronizations.
7. When users query NFT metadata, they can directly call Dreamfactory's SQL API to retrieve information from the status table. The results obtained will be dynamically updated with real-time state information.
8. Additionally, events can be developed to proactively push updates of state tables to clients so that user-side data remains continuously refreshed.


以上是Dreamfactory与第三方API(如GitHub)交互,实现动态NFT的一个方案。主要流程如下:
1. GitHub API提供项目贡献数据接口
2. Dreamfactory上创建表存储NFT状态和同步时间
3. Oracle服务定期同步GitHub API数据
4. 对比上次同步时间,获取新增数据更新到Tableland
5. 更新Dreamfactory状态表和NFT贡献属性
6. 更新Dreamfactory同步时间,作为下次同步参考
7. 用户端直接查询Dreamfactory获取动态更新后最新NFT状态
8. 也可以开发事件实时推送状态表更新到用户端
这样,通过Oracle作为中间层,实现了Dreamfactory状态数据的动态更新,达成动态NFT的目的。用户端可以通过简单查询Dreamfactory获取NFT实时状态。

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
开源梦工厂致力于推动开源项目的发展与商业化,在开源创新领域进行生态建设与布局。这是一个非常有意义的方向,能释放开源技术和项目的巨大潜能。
The Open Source Dream Factory is committed to promoting the development and commercialization of open source projects, and building an ecosystem in the field of open source innovation. This is a very meaningful direction that can unleash the tremendous potential of open source technology and projects.

![dream](https://upload-images.jianshu.io/upload_images/528413-9591dde4c5e8d64c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
1. 优秀的开源项目可以通过开源梦工厂项目孵化获得动态NFT。NFT持有者成为项目DAO的成员。
2. 开源项目DAO可以管理项目独立的资金池,并决定资金的使用方向。
3. 优秀开源项目在获得动态NFT和DAO支持后,更容易实现商业转化,这也为开源梦工厂带来投资回报。开源梦工厂的盈利来资金池的资金的手续费。
4. 开源项目和社区的活跃度可以影响NFT的价格和项目获得的投资。项目进展可以通过NFT进行更新。资金使用也需要在社区达成一定共识。
5. 开源生态建设和行业细分为连接开源世界和web3世界的生态提供更广阔的土壤。优秀的开源项目和技术可以在这一生态中获得资金、社区和应用支持,产生更大的价值。

1. Excellent open-source projects can obtain dynamic NFTs through the Open Source Dream Factory project incubation. NFT holders become members of the project DAO.
2. The open-source project DAO can manage an independent fund pool and decide on the direction of fund utilization.
3. After obtaining dynamic NFTs and DAO support, outstanding open-source projects are more likely to achieve commercialization, which also brings investment returns to the Open Source Dream Factory. The profit of the Open Source Dream Factory comes from fees generated by the fund pool.
4. The activity level of open-source projects and communities can influence the price of NFTs and investments received by projects. Project progress can be updated through NFTs, and consensus within the community is required for fund usage decisions.
5. Building an open-source ecosystem and industry segmentation provide a broader foundation for connecting the open-source world with the web3 world. Excellent open-source projects and technologies can obtain funding, community support, and application support in this ecosystem, generating greater value.

![dem](https://upload-images.jianshu.io/upload_images/528413-526a7597047654ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个图展示了开源梦工厂作为推动者和参与者，探索开源项目商业化的过程:
1. 开源项目需要遵循开源协议,建立活跃社区,不断维护与发展,才能最终获得商业成功与价值。
2. 开源梦工厂通过项目挖掘选择有潜力的项目,为其提供技术支持与投资,推动其商业转化。成功转化可以为开源梦工厂带来投资回报。
3. 项目维护需要开源社区和开源梦工厂的支持,开源梦工厂也可以分享项目的商业成功。这构成一个良性循环。
4. 生态建设为开源梦工厂选择项目和推动项目转化创造条件。优秀项目和技术也可以在生态中获得孵化与布局。

This diagram illustrates the process of commercializing open source projects, with Open Source Dream Factory as both a promoter and participant:

1. Open source projects need to adhere to open source licenses, establish active communities, and continuously maintain and develop in order to ultimately achieve commercial success and value.
2. Open Source Dream Factory identifies promising projects through project mining and provides them with technical support and investment to facilitate their commercial transformation. Successful transformations can bring investment returns for Open Source Dream Factory.
3. Project maintenance requires the support of both the open source community and Open Source Dream Factory. The latter can also share in the commercial success of the projects, creating a virtuous cycle.
4. Ecological construction creates conditions for project selection and transformation by Open Source Dream Factory. Excellent projects and technologies can also receive incubation and layout within this ecosystem.


### Technical Architecture
DreamFactory在每个Polkadot Parachain上部署了注册合约（目前在astar，兼容EVM的Polkadot链上运行）。因此，应用程序可以利用其主链的安全性和执行能力，并使用基于合约的SQL和访问控制逻辑。离线时，有一个分布式网络由运行Tableland协议的数据库“验证者”节点组成。这有助于确保存储和查询表数据时没有单点故障。从高层次来看，该网络包括以下内容：

DreamFactory has registry contracts deployed on each polkadot Parachain (currently live on astar，EVM-compatible Polkadot chain). Thus, applications can take advantage of its host chain's security and execution with contract-driven SQL and access control logic. Off-chain, there is a decentralized network of database "validator" nodes running the Tableland protocol. This helps guarantee there isn't a single point of failure when storing and querying table data. At a high level, the network consists of the following:
![hybrid](https://upload-images.jianshu.io/upload_images/528413-26ad339f766c7d38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在链上：表的创建和写入通过注册智能合约传递到每个基础链（语句被写入事件日志）。这包括SQL语句本身以及在智能合约中定义的自定义访问控制，使得数据可以在链上获取。

链下：用于表的创建和写入的语句由DreamFactory验证节点实现——这些节点简单地监视注册表，并使用数据库指令改变本地SQLite数据库。在这里，可以通过HTTPS网关使用SQL读取查询来访问数据。
On-chain: Table creates and writes pass through the registry smart contract on each base chain (statements are written to event logs). This includes the SQL statement itself plus custom access controls defined in smart contracts such that data is available on-chain.
Off-chain: Statements for table creates and writes are materialized by Tableland validator nodes—these nodes simply watch the registry and mutate a local SQLite database with the database instructions. Here, the data is accessible using SQL read queries at an HTTPS gateway.

换句话说，通过重放链式注册合约中的所有事件，您可以重新创建表格的状态；这就是如何在彼此之上构建不可阻挡的网络。只要主链存活下来，表格的状态就可以被确定性地汇总。请记住，在智能合约调用内部无法访问表格数据 - 您不能在没有使用某种离线预言机设置的情况下从合约查询表格。与智能合约无法读取交易数据一样，它们也无法读取表格数据，因为数据仅在事件日志中可用。因此，只有通过直接向任何DreamFactory节点发送读取查询才可能实现对数据的访问权限。
In other words, you can recreate a table's state by replaying all of the events at a chain's registry contract; this is how unstoppable networks are built on top of each other. As long as the host chain survives, the table's state can deterministically be collated. Keep in mind that table data is not accessible from within smart contract calls—you can't query a table from a contract without using some off-chain oracle-like setup. Much like how smart contracts can't read transaction data, they also cannot read table data since data is available in event logs. Thus, data accessibility is only possible using read queries directly to any DreamFactory node.



### Functions completed during hackathon delivery

1，开发波卡上动态NFT协议

2，在这个协议基础上，完成开源梦工厂动态NFT勋章的实现效果

1. Develop a dynamic NFT protocol on Polkadot.

2. Based on this protocol, achieve the implementation effect of open-source Dream Factory's dynamic NFT badges.





### Initial project review version/

### Team information/

- jack：软件工程师，具有 Rust 和区块链开发经验。
- soywang：区块链开发人员，具有 Substrate 和 Solidity, Solana 开发经验。
- ciconianigra：区块链开发人员

### Track affiliation

Smart Contracts (and related)

Blockchain Products and Tools

### Project demonstration
Videos: 

Show how demo works:

Contract Example Online:


Other Files:
Project Pitch Deck: 
