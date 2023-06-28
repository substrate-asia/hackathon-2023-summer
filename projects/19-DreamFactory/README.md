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

像OpenSea这样的NFT交易市场依赖这个NFT标准，如果您访问OpenSea上的页面，您将可以看到NFT相关联的图像。然而，这些图像存储在哪里呢？
NFT相关的数据（即“元数据”，元数据是指存储在区块链上的数字资产的名称、描述和唯一标识符等附加信息，有助于验证其真实性和所有权。）存储在某个可从互联网访问的URL上。可以存储在区块链上，但是区块链上存储资源很宝贵，需要花费很高的费用。还可以元数据可以存储在链下，用去中心化存储（例如IPFS）上，或者中心化存储，比如传统的云存储。

选择第一种去中心化存储，一旦数据存储在IPFS上，就无法修改，数据变得静态化，因为IPFS上的数据不可修改。第二种解决方案中心化存储，在数据库允许修改与NFT相关的元数据，但引入了严重的中心化风险，比如单点故障，权限垄断，这与区块链的理念相悖。

静态NFT可以代表一个不可变的资产，NFT一旦确定就终生不能修改，这意味着它们不能随着时间的推移而改变或发展。如果NFT元数据可变同时元数据存储的方式又兼具去中心化的特性，可以响应现实世界事件并根据外部条件改变其状态。如果NFT的图像能根据业务流程和外部事件“动起来”，那么无疑将会大大提升NFT的应用价值和更加沉浸式的体验。本项目便是这种动态NFT的一种案例，我们希望NFT动态显示开源项目和贡献者的活动紧密关联，贡献动态记录在动态NFT，以一种游戏化的方式激发开发者投入开源世界。

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


综合以上考量，我打算以一种oracle方式来实现外部数据同步到链上，我们了解有chainlink和tableland可以实现我们的目标。

GitHub API数据直接同步至chainlink和tableland Oracle优缺点:
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
   
Tableland和Chainlink的Oracle机制有以下主要区别:
1. 数据来源不同。Tableland的Oracle主要用于同步链下关系型数据库的数据至链上,而Chainlink的Oracle通常用于同步实时数据源如API、IoT设备的数据至链上。
2. 同步目标不同。Tableland的Oracle将数据同步至Tableland网络的数据库中,而Chainlink的Oracle通常将数据同步至智能合约。
3. 节点类型不同。Tableland的Oracle节点需要运行Tableland网络所使用的SQLite数据库,而Chainlink的节点是无状态节点,只需同步数据至链上。
4. 节点获取数据方式不同。Tableland的Oracle节点直接访问Tableland网络的数据库获取最新数据,而Chainlink的节点需要调用外部数据源的API获取数据。
5. 节点角色不同。Tableland的Oracle节点同时也是网络的验证节点,除了同步数据外,还需要验证和执行智能合约调用,而Chainlink节点主要起到数据同步的作用。
   
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

那tableland作为web3去中心化数据库如何解决元数据存储中心化问题？
Tableland属于Oracle机制方案。它通过Oracle将链下数据同步至链上,实现数据的去中心化与实时更新。
所以,总体来说,Tableland主要从以下几个方面降低和避免中心化风险:
1. SQLite用于结构化数据存储。Tableland的Oracle节点内嵌SQLite数据库,用于存储关系型表数据。SQLite是一种轻量级的关系型数据库,方便Tableland节点进行数据管理。Tableland隐藏了数据库运维的复杂度,提供简单的API接口。
2. Oracle网络去中心化。Tableland使用自己的Oracle网络监听链下数据变更并同步至链上。该Oracle网络由众多节点组成,不存在中心化的风险。某个节点发生故障,其仍可以正常工作。
3. 链上数据不可变。Tableland的链上数据存储使用的是区块链本身,数据一旦存储上链就不可变。所以即使Oracle网络或IPFS发生故障,历史数据不会丢失。只是新的更新无法同步,服务会出现短时间中断。
4. 节点竞争机制。Tableland的Oracle网络中的各节点需要通过竞争的机制来获取链下数据变更的监听权。这避免某个节点垄断监听数据变更的权限。如果某节点表现异常,可以被动态剔除,其监听权会转移给其他节点。
5. 链上治理。Tableland链上数据的访问控制与使用权限由链上治理机制来控制。某个节点想要滥用其监听权限的行为可以被链上治理机制检测和制裁。这也降低了中心化风险。


综上我们采用动态NFT实现方式：Tableland

但是目前tableland不支持波卡网络，但是支持evm兼的链，所以我们波卡的平行链astar，并且将tableland验证节点做了一些改动。
1. 在Astar网络上部署Tableland的数据存储合约,用于保存NFT状态和其他数据。
2. Tableland在Polygon/以太坊网络的节点上增加Astar网络数据的索引和缓存。这样,Tableland可以直接查询和更新Astar网络的数据。
3. 当用户在Astar网络上与NFT或资产交互时,Astar网络会自动触发链上事件。Tableland的节点监听到这些事件后,可以直接调用Astar网络智能合约的接口,进行数据查询或更新。
4. 用户查询NFT数据时,直接调用Tableland的API。Tableland节点会checks本地缓存,如果没有最新数据会查询Astar网络获取,并更新缓存。这样,用户可以像查询Tableland原生网络一样查询Astar资产数据。
5. 如果Tableland数据更新也需要触发Astar事件,Tableland节点可以直接调用Astar网络智能合约接口发起事件。
这个方案的主要流程是:
1. 在Astar部署Tableland合约
2. Tableland节点增加对Astar网络数据的缓存和索引
3. Tableland节点监听Astar链上事件,并直接调用Astar合约接口进行数据同步 
4. 用户通过Tableland API查询Astar资产,Tableland节点检查缓存和Astar网络获取最新数据 
5. Tableland可以直接调用Astar合约接口触发事件 


### How it works
使用Tableland与GitHub API交互,实现动态NFT的方案:
1. 开发GitHub API接口,用于获取项目的Issue、PR、Commit等数据。这些接口可以部署在中心化服务器上。
2. 在Tableland上创建数据库表来存储NFT状态数据,包括项目ID、总贡献数、上次同步时间等。
3. 开发一个Oracle服务来定期调用GitHub API,获取项目最新的数据。
4. Oracle服务将从GitHub API获取的数据与Tableland中存储的上次同步时间比较,获取新增的数据。
5. Oracle服务调用Tableland的SQL API,将步骤4中获取的新增数据存入Tableland相应的表中。如果有NFT的贡献属性发生变化,也相应更新NFT状态表中的数据。
6. Oracle服务在Tableland状态表中更新上次同步时间,作为下次同步的参考。
7. 用户查询NFT元数据时,直接调用Tableland的SQL API查询状态表获取。获取到的结果是动态更新过的最新状态数据。
8. 同时,也可以开发事件以主动推送状态表更新到客户端,这样用户端可以保持数据实时刷新。
以上是Tableland与第三方API(如GitHub)交互,实现动态NFT的一个方案。主要流程如下:
1. GitHub API提供项目贡献数据接口
2. Tableland上创建表存储NFT状态和同步时间
3. Oracle服务定期同步GitHub API数据
4. 对比上次同步时间,获取新增数据更新到Tableland
5. 更新Tableland状态表和NFT贡献属性
6. 更新Tableland同步时间,作为下次同步参考
7. 用户端直接查询Tableland获取动态更新后最新NFT状态
8. 也可以开发事件实时推送状态表更新到用户端
这样,通过Oracle作为中间层,实现了Tableland状态数据的动态更新,达成动态NFT的目的。用户端可以通过简单查询Tableland获取NFT实时状态。

![demo.png](https://upload-images.jianshu.io/upload_images/528413-1e4ddb46ab2d53a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



### How Ecosystem Works
开源梦工厂致力于推动开源项目的发展与商业化,在开源创新领域进行生态建设与布局。这是一个非常有意义的方向,能释放开源技术和项目的巨大潜能。

### Technical Architecture


### Functions completed during hackathon delivery

完成开源梦工厂动态NFT勋章的实现效果



### Initial project review version/

### Team information/

- jack：软件工程师，具有 Rust 和区块链开发经验。
- soywang：区块链开发人员，具有 Substrate 和 Solidity, Solana 开发经验。
- ciconianigra：区块链开发人员

### Track affiliation

### Project demonstration
Videos: 

Show how demo works:

Contract Example Online:


Other Files:
Project Pitch Deck: 
