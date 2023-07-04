## 基本资料

项目名称：Dandelion(蒲公英)

项目立项日期 ：2023-05-20 

## 项目整体简介
当前，区块链项目最好的发射方式当属空投，因其超低的参与门槛，超高的发射效率，但目前各个项目方在实施空投的过程中存在各种各样的问题，比如女巫攻击等等，dandelion（蒲公英）项目将基于Polkadot打造一个专业可复用的空投社区及发射台，通过社区结合区块链经济模型的模式，打造一套以社区经济模型驱动的可复用型空投发射平台，深度黏合项目方与用户，深度挖掘空投模式的潜力，使得各方利益最大化、成本最小化。 
At present, the best launch method of blockchain projects is airdrop, because of its ultra-low participation threshold, ultra-high launch efficiency, but at present, there are various problems in the process of implementing airdrops, such as witch attacks, etc., Dandelion project will be based on Polkadot to create a professional reusable airdrop community and launch pad, through the community combined with the blockchain economic model model, to create a set of community economic model driven reusable airdrop launch platform, Deeply bond the project party and users, deeply tap the potential of the airdrop model, maximize the benefits of all parties and minimize the cost.

- 项目背景/原由/要解决的问题 (如有其他附件，可放到 `文档` 目录内。英文提交)。

    项目背景/原由：空投是最优秀的项目发射模式，没有之一。得益于超低参与门槛的空投发射模式，可以使优秀的项目在短时间内积聚大量人气，这是一个优秀且经过市场验证的模式，但目前项目方在空投实施的过程中也存在很多的问题和痛点，其中危害最大的就是“女巫攻击” ，每一个空投的项目方都通过设置各种链上及社交平台交互等验证策略来减少“女巫攻击”的影响，但其效果并不理想。dandelion项目探索构想空投2.0的形态，通过将链上经济模型打造一个高粘性空投社区的方案解决这一问题，并可作为社区与项目方深度融合沟通的桥梁，彻底解决空投模式的痛点，并为波卡生态项目带来丰富多样的发射体验，降低波卡生态的参与门槛。
    要解决的问题：Dandelion（蒲公英）项目正在构建一条空投社区平行链（探索空投的2.0形态），打造Polkadot上的去中心化（DAO）原生社区中心，推动不同平行链用户的交流和转化，提升跨链基础设施（XCM）的应用频率，并通过空投活动吸引增量用户进入Polkadot生态，正如Polkadot连接了不同共识的平行链，成为公链的交通枢纽，Dandelion（蒲公英）则以常态化空投（活动性可定制空投）为桥梁，连接不同平行链的社区，成为不同社区的交通枢纽，促进不同平行链社区用户的快速流动和转化，降低各平行链及生态项目的推广成本，增加Polkadot生态用户的黏性，并通过开创性的社区活跃度系统为各项目方筛选优质真实用户，减少女巫攻击造成的损失。具体解决问题如下：

    1、解决当前不同平行链社区用户转化效率较低的问题，通过空投模式，使用户快速完成从0到1跨社区的过程；

    2、打破平行链社区孤岛，让不同平行链社区产生更多交集，达到 1 + 1 > 2 的效果；

    3、通过可定制规则空投减少了女巫攻击对项目方造成的损失；

    4、促使用户与多元化的波卡生态项目接触，以增加接触面的原理，来增加用户粘性；

    5、通过可复用的社区空投发射模式，显著降低各平行链及其生态项目推广成本；

    6、解决用户参与链上治理的积极性不高等以此类推的其他问题（通过社区活跃度规则）；

    7、用户转化率可在链上轻松追溯。
- 项目介绍
    dandelion项目，项目整体思路是深挖空投模式的潜力，探索空投2.0的形态，做一个黏合社区与各个项目方的专业化空投平台，建立一个随时准备就绪的黏性社区，节省项目方空投前的宣传以及时间成本，并通过社区经济模型杜绝女巫攻击及集中抛售对项目方的损失，使项目方获得真实有效的用户，也使真实的用户获益。大大节约项目推广的中间成本，使真正的好项目更易脱颖而出。也通过集中化的管理降低用户领取空投时遭受的欺诈风险。在项目就绪之后，计划转交社区治理，并完成去中心化的过程。
- 关于预防女巫攻击的技术手段及黑客松期间要实现的功能介绍
    在避免女巫攻击之前，首先我们要分析女巫攻击的本质是什么，受到女巫攻击的前提条件是由于新建女巫账号的成本要低于每个账号的空投收益，即“单个女巫账号的空投收益>新建女巫小号的成本”，符合这一条件的空投项目将不可避免的受到女巫攻击，特别是热度较高、市场较为看好的项目受女巫攻击的影响更为严重，基于这一原理，Dandelion项目设计了一套“可定制空投规则智能合约”，该合约可以对参与空投的用户条件进行限制以达到抑制女巫攻击的目的。

例如，某个定制空投规则的合约的空投发放规则如下：

1、根据 用户质押的社区代币质押数量等比例发放空投；

2、单个用户最多质押1000枚社区代币；

3、社区活跃度需要>20（社区活跃度的获取方式为社区链上交互“空投主页浇水”、“链上治理投票”、“邀请新用户加入空投”等）;

4、空投释放的区块高度为从20000块高开始到45000块高结束。

在以上规则下，女巫攻击由技术门槛转为经济门槛和时间门槛，科学家的技术优势被削弱，我们假设一名科学家想要多开女巫账号获取空投，那么他每个女巫账号的最低成本就是质押1000枚社区代币和长期的链上交互，这在空投即将发放的时候是无法完成的，而提前布局又需要承担市场波动风险和链上交互的成本，而按照区块缓慢释放空投的规则可有效避免用户集中砸盘对币价带来的短期抛压与系统性风险， 因此“可定制规则空投”对女巫攻击的规模和影响可以进行有效的抑制，使项目方受女巫攻击的影响大大降低。

本次黑客松计划实现的防女巫功能有：1、根据 用户质押的社区代币质押数量等比例发放空投；2、单个用户空投合约最多质押量的限制；3、社区空投主页链上交互功能；4、空投按照区块高度逐块发放功能。
  
- 项目Demo
    https://dandelion-1lf.pages.dev/
- 技术架构
    Substrate平行链 + Evm + 智能合约
- 项目 logo (如有)，这 logo 会印制在文宣，会场海报或贴子上。
    ![蒲公英](https://bafybeiep3ezg7u7igdfxhcle7tlllamt6jxouwhnounmessqwbyohibrke.ipfs.w3s.link/%E8%92%B2%E5%85%AC%E8%8B%B1.png "蒲公英logo")
    

- 项目的启始的commit，对于全新的项目可以是一个开源框架的clone，比如区块链clone自substrate-node-template, react
  框架等，请给出说明。对于成熟项目可以是一个branch，要求在2023年5月12号之后生成，说明有哪些功能是已经有了的

## 黑客松期间计划完成的事项
- 1.完成平行链poa共识开发
- 2.完成evm模块及相关智能合约开发（包括社区vetoken代币swap模块、自定义规则空投模块、用户活跃度模块等）
- 2.完成前端基础ui界面的设计（包括空投项目进度展示模块，用户空投领取进度模块，社区代币质押模块）


**区块链端**
![后端](https://bafybeihdkzcccsmdvxitaxonp4ksqr7sbi2vpoozhoxtyu44q5hiquiznq.ipfs.w3s.link/%E5%90%8E%E7%AB%AF.png "后端合约模块")

Dandelion 合约 && Substrate add Evm
1. 6月12日 社区质押合约和 币持有量同比例发放空投功能合约。
2. 6月14日 社区活跃度（签到token），每三日一个周期。
3. 6月17日 Substrate add Evm ,并能部署合约。
4. 6月23日 Substrate 修改成 web3用户钱包体系。
5. 6月30日 Substrate 修改成 POA 共识。


**客户端**

- web 端
    - [https://dandelion-1lf.pages.dev/] 项目介绍主页
    - [https://dandelion-1lf.pages.dev/list] 空投列表及用户信息展示页
    - [https://dandelion-1lf.pages.dev/list/airdrop/12] 空投项目参与页面

## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)

- 1.完成了平行链poa共识开发
- 2.完成evm模块及相关智能合约开发（包括社区vetoken代币swap模块、自定义规则空投模块、用户活跃度模块等）
- 3.完成前端基础ui界面的设计（包括空投项目进度展示模块，用户空投领取进度模块，社区代币质押模块）
- 4.代码结构： ![后端](https://bafybeihdkzcccsmdvxitaxonp4ksqr7sbi2vpoozhoxtyu44q5hiquiznq.ipfs.w3s.link/%E5%90%8E%E7%AB%AF.png "后端合约模块")
- 5.[https://dandelion-1lf.pages.dev/] 项目Demo
- 6.[https://drive.google.com/file/d/1U-Zd05p05DcCgv4MlujFw-aUXQzB-uHZ/view?usp=sharing] 项目介绍文档


## 队员信息

| 姓名         | 角色         | GitHub 帐号  | 微信账号     |
| ----------- | ----------- | ----------- | ----------- |
| 聊心       | 区块链后端  | qqliaoxin   | wxliaoxin   |
| 心       | 区块链后端     |321llljjjfff123|wxid_s598vo46kd8b22|
| Zzz     | 区块链后端   |Wydumn|lfmin369|
| yan       | 前端        |joeyan|boyan_ssss|
| 老张       | 前端        |radiancez|0xRadiance|
| h2na        | 产品        |zhorsex|AiYoNanaY|
