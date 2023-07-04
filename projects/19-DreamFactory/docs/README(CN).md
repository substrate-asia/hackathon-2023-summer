### Basic Information
Project name：DreamFactory

website: [https://opensource.dreamfactorys.xyz](https://opensource.dreamfactorys.xyz/)

Starting time：2023-5-25 

Code address：https://github.com/OpenSource-DreamFactory

### Project Description
开源梦工厂旨在建立一个从Web3.0到开源世界的门户，激励开发者继续为开源项目贡献代码和时间。我们在Polkadot上开发了一种动态NFT协议，它创建与开源项目和贡献者活动相关联的动态NFT。参与者将竞争开发最有前途的项目，利用动态NFT和DAO机制支持开源创新。


![dreamfactory.png](https://upload-images.jianshu.io/upload_images/528413-7bca135935649b9d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Vision and Mission
愿景：建立一个充满活力的开源生态系统，激励开发者并为开源项目提供可持续的资金支持。

使命：激励更多的开发者为开源项目做出贡献。开发者应该得到与他们的贡献相称的奖励和认可。为有前途但缺乏资金支持的开源项目提供持续性的财务支持。促进开放协作文化的发展。创新开源生态系统中的治理和激励机制。


### Problem and Opportunity
#### Problem
大多数开源项目依靠开发者的自愿贡献建设,缺乏持续稳定的资金支持,难以长期发展。同时，开发者缺乏动力和激励来维持他们的贡献。

贡献激励不足:现有的贡献评价和激励机制无法有效鼓励开发者的持续贡献,他们的付出得不到应有的认可与回报。

开源项目标准化程度不足，这可能会加大项目组织，开发实施过程的中的不确定性，降低投资人的安全感，从而影响资金注入的积极性。


#### Opportunity

开源梦工厂项目的机会主要在于它的技术和机制:使用创新的动态NFT结合DAO治理的方式。可以体现出较高的技术含金量和创新性,更多的吸引技术社区的眼球。动态NFT其实可以游戏化开源贡献，增强了开源社区用户的参与感，从而不断激发开发者参与开源项目的热情。动态NFT也可以在区块链上公开透明地标记每个贡献行为,这增加了项目的公信力,也便于社区监督,NFT持有者拥有DAO治理投票的权利，反过来解决了投资者注入资金的信任度和积极性,为项目开拓新的商业模式创造机会。


### Our Solution

在波卡上开发动态NFT协议，创建动态NFT来激励开源开发者的贡献
动态NFT动态显示开源项目和贡献者的活动紧密关联，贡献度排名与开源项目分红直接相关
NFT升级机制，将根据项目的进展和用户的贡献进行动态升级,游戏化开源贡献
开源项目对应一个DAO基金池，实施透明和公开公正的财务管理，让投资者和社区成员了解资金的流向和使用情况
让社区和投资者可以参与资金注入和与之对应的开源项目决策
偏好的加密货币来参与开源项目的资金募集，同时还可以在波卡等跨链平台上进行支付和交易
  

### Dynamic NFTs protocol Design

非同质化代币（Non-Fungible Token，简称：NFT），是一种储存在区块链上的数据单位，它可以代表艺术品等独一无二的数字资产，代表了某个独特物品或信息的所有权。通常情况下，当我们谈论非同质化代币（NFT）时，只是在ERC-721标准下才得以流行。ERC-721标准是一种非同质化代币的基本接口，它声明了每个实现ERC-721的智能合约必须支持的一些功能。

像OpenSea这样的NFT交易市场依赖这个NFT标准，如果您访问OpenSea上的页面，您将可以看到NFT相关联的图像。然而，这些图像存储在哪里呢？
NFT相关的数据（即“元数据”，元数据是指存储在区块链上的数字资产的名称、描述和唯一标识符等附加信息，有助于验证其真实性和所有权。）存储在某个可从互联网访问的URL上。可以存储在区块链上，但是区块链上存储资源很宝贵，需要花费很高的费用。还可以存储在链下，用去中心化存储（例如IPFS），或者中心化存储，比如传统的云存储。

选择第一种去中心化存储，一旦数据存储在IPFS上，就无法修改，数据变得静态化，因为IPFS上的数据不可修改。第二种解决方案中心化存储，在数据库允许修改与NFT相关的元数据，但引入了严重的中心化风险，比如单点故障，权限垄断，这与区块链的理念相悖。


静态NFT可以代表一个不可变的资产，NFT一旦确定就终生不能修改，这意味着它们不能随着时间的推移而改变或发展。如果NFT元数据可变同时元数据存储的方式又兼具去中心化的特性，可以响应现实世界事件并根据外部条件改变其状态。NFT的图像能根据业务流程和外部事件“动起来”，那么无疑将会大大提升NFT的应用价值和沉浸式的体验。本项目便是这种动态NFT的一种案例，我们希望NFT动态显示开源项目和贡献者的活动紧密关联，开发者对开源项目的贡献动态记录在动态NFT，以一种游戏化的方式激发开发者投入开源世界。

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


但是目前tableland不支持波卡网络，我们采用了类似Tableland的原理,基于波卡区块链实现动态NFT协议。
我们做了一些工作完成波卡平行链evm兼容的链的动态NFT协议，所以我们采用波卡的平行链astar，并且将tableland验证节点做了一些适配。
具体工作如下：
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


### How Ecosystem Works
开源梦工厂致力于推动开源项目的发展与商业化,在开源创新领域进行生态建设与布局。这是一个非常有意义的方向,能释放开源技术和项目的巨大潜能。

![dream](https://upload-images.jianshu.io/upload_images/528413-9591dde4c5e8d64c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
1. 优秀的开源项目可以通过开源梦工厂项目孵化获得动态NFT。NFT持有者成为项目DAO的成员。
2. 开源项目DAO可以管理项目独立的资金池,并决定资金的使用方向。
3. 优秀开源项目在获得动态NFT和DAO支持后,更容易实现商业转化,这也为开源梦工厂带来投资回报。开源梦工厂的盈利来资金池的资金的手续费。
4. 开源项目和社区的活跃度可以影响NFT的价格和项目获得的投资。项目进展可以通过NFT进行更新。资金使用也需要在社区达成一定共识。
5. 开源生态建设和行业细分为连接开源世界和web3世界的生态提供更广阔的土壤。优秀的开源项目和技术可以在这一生态中获得资金、社区和应用支持,产生更大的价值。

![dem](https://upload-images.jianshu.io/upload_images/528413-526a7597047654ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个图展示了开源梦工厂作为推动者和参与者，探索开源项目商业化的过程:
1. 开源项目需要遵循开源协议,建立活跃社区,不断维护与发展,才能最终获得商业成功与价值。
2. 开源梦工厂通过项目挖掘选择有潜力的项目,为其提供技术支持与投资,推动其商业转化。成功转化可以为开源梦工厂带来投资回报。
3. 项目维护需要开源社区和开源梦工厂的支持,开源梦工厂也可以分享项目的商业成功。这构成一个良性循环。
4. 生态建设为开源梦工厂选择项目和推动项目转化创造条件。优秀项目和技术也可以在生态中获得孵化与布局。


### Technical Architecture
DreamFactory在每个Polkadot Parachain上部署了注册合约（目前在astar，兼容EVM的Polkadot链上运行）。因此，应用程序可以利用其主链的安全性和执行能力，并使用基于合约的SQL和访问控制逻辑。离线时，有一个分布式网络由运行Tableland协议的数据库“验证者”节点组成。这有助于确保存储和查询表数据时没有单点故障。从高层次来看，该网络包括以下内容：

![hybrid](https://upload-images.jianshu.io/upload_images/528413-26ad339f766c7d38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在链上：表的创建和写入通过注册智能合约传递到每个基础链（语句被写入事件日志）。这包括SQL语句本身以及在智能合约中定义的自定义访问控制，使得数据可以在链上获取。
链下：用于表的创建和写入的语句由DreamFactory验证节点实现——这些节点简单地监视注册表，并使用数据库指令改变本地SQLite数据库。在这里，可以通过HTTPS网关使用SQL读取查询来访问数据。

换句话说，通过重放链式注册合约中的所有事件，您可以重新创建表格的状态；这就是如何在彼此之上构建不可阻挡的网络。只要主链存活下来，表格的状态就可以被确定性地汇总。请记住，在智能合约调用内部无法访问表格数据 - 您不能在没有使用某种离线预言机设置的情况下从合约查询表格。与智能合约无法读取交易数据一样，它们也无法读取表格数据，因为数据仅在事件日志中可用。因此，只有通过直接向任何DreamFactory节点发送读取查询才可能实现对数据的访问权限。


### Functions completed during hackathon delivery


1. 在 Polkadot 上开发一个动态 NFT 协议。

2. 基于该协议，实现开源 Dream Factory 的动态 NFT 徽章的效果。

**blockcain**

**区块链**

- `动态NFT智能合约`

- `部署动态NFT合约`，`更新动态NFT元数据`
**后端及前段**

- `开源贡献数据获取`

- `SVG渲染`


### 初始项目审查版本/

### 团队信息/

- Jack：具有Rust和区块链开发经验的软件工程师。

- Soywang：具有Substrate、Solidity和Solana开发经验的区块链开发者。

- Ciconianigra：区块链开发者。

- Yiko：区块链开发者。

#### 跟踪关联

智能合约（及相关）

区块链产品和工具

### 项目演示

#### 视频：

#### 展示演示的方式：

1. 首先，通过GitHub API获取用户的开源贡献数据。

https://github.com/OpenSource-DreamFactory/rectianjh

2. 然后根据用户的开源共享数据进行渲染和生成SVG图像。
https://github.com/OpenSource-DreamFactory/rectianjh/blob/master/github-metrics.svg

3. 在Astar区块链上使用动态NFT合约来创建一个可变的SVG图像的动态NFT。用户共享的开源数据将会不断更新，通过URL链接可以实时更新动态NFT图像。

![image.png](https://upload-images.jianshu.io/upload_images/528413-a36c4c86b2de0adf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[https://raw.githubusercontent.com/rectinajh/rectianjh/3d78820ec33c461f04976c33565678e366c82345/github-metrics.svg?token=AA2NLHYINBMLJG2OVUFGUATEUM4T6](https://metrics.lecoq.io/rectinajh?template=classic&base.repositories=0&base.metadata=0&achievements=1&activity=1&languages=1&base=header%2C%20activity%2C%20community%2C%20repositories%2C%20metadata&base.indepth=false&base.hireable=false&base.skip=false&languages=false&languages.limit=8&languages.threshold=0%25&languages.other=false&languages.colors=github&languages.sections=most-used&languages.indepth=false&languages.analysis.timeout=15&languages.analysis.timeout.repositories=7.5&languages.categories=markup%2C%20programming&languages.recent.categories=markup%2C%20programming&languages.recent.load=300&languages.recent.days=14&achievements=false&achievements.threshold=C&achievements.secrets=true&achievements.display=detailed&achievements.limit=0&activity=false&activity.limit=5&activity.load=300&activity.days=14&activity.visibility=all&activity.timestamps=false&activity.filter=all&config.timezone=Asia%2FShanghai)

![image.png](https://upload-images.jianshu.io/upload_images/528413-a79879cf1b0f1953.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




4，更新 nft 
![image.png](https://upload-images.jianshu.io/upload_images/528413-54d3f958817ac799.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




#### Dynamic SmartContract Explanation:

![image.png](https://upload-images.jianshu.io/upload_images/528413-95b4f1259ef6d965.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
DreamFactoryNFT的合约示例基于ERC721实现了一个NFT合约，并与Tableland集成以提供元数据。

核心逻辑：

动态NFT元数据链接实现（用于动态更新NFT的逻辑）

```source-shell
/**
     *  @dev Must override the default implementation, which simply appends a `tokenId` to _baseURI.
     *  tokenId - The id of the NFT token that is being requested
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI = _baseURI();

        if (bytes(baseURI).length == 0) {
            return "";
        }

        string memory query = string(
            abi.encodePacked(
                "SELECT%20json_object%28%27id%27%2Cid%2C%27name%27%2Cname%2C%27image%27%2Cimage%2C%27description%27%2Cdescription%2C%27attributes%27%2Cjson_group_array%28json_object%28%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20FROM%20",
                mainTable,
                "%20JOIN%20",
                attributesTable,
                "%20ON%20",
                mainTable,
                "%2Eid%20%3D%20",
                attributesTable,
                "%2Emain_id%20WHERE%20id%3D"
            )
        );
        // Return the baseURI with a query string, which looks up the token id in a row.
        // `&mode=list` formats into the proper JSON object expected by metadata standards.
        return
            string(
                abi.encodePacked(
                    baseURI,
                    query,
                    Strings.toString(tokenId),
                    "%20group%20by%20id"
                )
            );
    }
```
这是合同的主要结构和功能：

继承自ERC721合同：DreamFactoryNFT合同继承了OpenZeppelin的ERC721合同，以实现ERC721标准的功能。

构造函数：该合同的构造函数接受三个参数，即baseURI（用于设置合同的基本URI）、_mainTable（主要元数据表的名称）和_attributesTable（属性表的名称）。

公共变量：该合同定义了几个公共变量，包括baseURIString（用于存储表示基本URI的字符串）、mainTable（主要元数据表的名称）、attributesTable（属性表的名称）、_tokenIdCounter（用于跟踪NFT tokenId 的计数器）和_maxTokens （NFT 的最大数量）。

_baseURI 函数：覆盖默认实现，返回合约的基本 URI。

totalSupply 函数：返回现有 NFT 的总数量。

tokenURI 函数：覆盖默认实现，返回给定 tokenId 的元数据 URI。它使用 Tableland 的查询语言来检索与 tokenId 对应的元数据。

mint 函数：用于铸造新 NFT。它检查是否已经铸造了最大数量的 NFT，并安全地将新 NFT 铸造到调用者地址。



其他文件：
项目推介文稿(ppt)：

https://www.canva.com/design/DAFnmvFHlRg/_G_lNDGE48m69eQCYFzwJg/edit?utm_content=DAFnmvFHlRg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton