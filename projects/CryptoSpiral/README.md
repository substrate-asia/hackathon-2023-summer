<img  src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-tech-0.png"><br/>
</p>


<p align="center">
<img  src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-tech-1.png"><br/>
</p>




### 项目 logo (如有)，这 logo 会印制在文宣，会场海报或贴子上。


<p align="center">
<img width="200" src="./docs/NFT-Fi-Twitter.png"><br/>
</p>


### 项目的启始的commit，对于全新的项目可以是一个开源框架的clone，比如区块链clone自substrate-node-template, react框架等，请给出说明。对于成熟项目可以是一个branch，要求在2023年5月12号之后生成，说明有哪些功能是已经有了的


<p>
Pallet start from commit：https://github.com/paritytech/substrate/tree/v3.0.0   


，Simultaneously integrated with Substrate-dex:  https://github.com/paritytech/substrate-dex
</p>


<p>
Pivate Contract  start from  commit：https://github.com/Phala-Network/tokenomic-contract
</p>


<p>
data index(subquery)  start from  commit：https:github.com/subquery/nodle-subql-starter.git
</p>






## 黑客松期间计划完成的事项


- 请团队在报名那一周 git clone 这个代码库并创建团队目录，在 readme 里列出黑客松期间内打算完成的代码功能点。 并提交 PR 到本代码库。 例子如下 (这只是一个 nft 项目的例子，请根据团队项目自身定义具体工作)：


**objective:**  __The main objective of this hackathon is to validate the feasibility of a completely decentralized and fully private promotion platform. Additionally, combining the establishment of promoter DAOs with crowdfunding and ensuring that each DAO has its own token is an interesting endeavor. Lastly, building upon these foundations, the aim is to make the project as comprehensive as possible.__


**区块链端**


- `pallet\spiral-dao`
  - [ ] advertise, Creating Adverise Page and definition of data structures. (`fn app_advertise_create()`)
  - [ ] promoter-dao, Creating DAO and launching crowdfunding simultaneously.  (`fn union_dao_create()`)
  - [ ] promoter-dao, Participating in crowdfunding. (`fn union_dao_mint()`)
  - [ ] promoter-dao, Extensive action types to reach, acquire, convert, and retain your users. (`fn union_task_action_pay()`)
  - [ ] promoter-dao, Close one action the action have been Verified & reward in private contract. (`fn union_task_action_finish()`)



- `pallet\spiral-collective` : Enhancing the collective module to support multiple collectives.



**隐私合约**


- `sprial-contract/src/lib.rs`
  - [ ] PRIVTE-CONTRACT Creation and data structure definition, generating privacy accounts. (`fn new()`)
  - [ ] PRIVTE-CONTRACT Seal the account  of S3 storage and others. (`fn seal_credentials()`)
  - [ ] PRIVTE-CONTRACT Seal action of task  (`fn seal_actions()`)
  - [ ] PRIVTE-CONTRACT Generating hierarchical propagation relationships. (`fn invite_from()`)
  - [ ] PRIVTE-CONTRACT Verified & reward  the action of user taken(will call pallet) (`fn do_task_action()`)
  - [ ] PRIVTE-CONTRACT Draw the reward for promoter (`fn reward_draw()`)




**数据索引**


- `spiral-subquery`
  - [ ] Index promoter-dao data. (`fn handleUnionDaoAddedEvent()`)


**客户端**


- web 端
  - [ ] 用户注册页面
  - [ ] NFT 产品创建流程
  - [ ] NFT 产品购买流程






## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)


TBD


## 队员信息


Name: Bruce
Role: Full Stack Developer![logo](https://github.com/web3pioneer/hackathon-2023-summer/assets/92438448/5e7dee7a-041a-40df-aaaa-6a58b24b6205)![image](https://github.com/web3pioneer/hackathon-2023-summer/assets/92438448/50791b1f-7774-4e08-a6ee-5426d95217e9)## 基本资料

项目名称：CryptoSpiral

项目立项日期 (哪年哪月)：2023-0517

## 项目整体简介

项目简介，英文提交。包括但不限于：

### 项目背景/原由/要解决的问题 (如有其他附件，可放到 `docs` 目录内。英文提交)。

<p align="center">
<img  src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-background0.png"><br/>
</p>

<p align="center">
<img  src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-background.png"><br/>
</p>


### 项目介绍

The project named "cryptoSpiral" is a decentralized privacy promotion platform. Its key feature revolves around localized and specialized promoters, utilizing DAO and privacy to facilitate efficient and secure promotion and dissemination for web3 projects.

<p align="center">
<img  src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-background-2.png"><br/>
</p>




### 项目更新



### 项目Demo

TBD

### 技术架构

<p align="center">
<img  src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-tech-0.png"><br/>
</p>

<p align="center">
<img  src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-tech-1.png"><br/>
</p>


### 项目 logo (如有)，这 logo 会印制在文宣，会场海报或贴子上。

<p align="center">
<img width="200" src="./docs/NFT-Fi-Twitter.png"><br/>
</p>

### 项目的启始的commit，对于全新的项目可以是一个开源框架的clone，比如区块链clone自substrate-node-template, react框架等，请给出说明。对于成熟项目可以是一个branch，要求在2023年5月12号之后生成，说明有哪些功能是已经有了的

<p>
Pallet start from commit：https://github.com/paritytech/substrate/tree/v3.0.0   

，Simultaneously integrated with Substrate-dex:  https://github.com/paritytech/substrate-dex
</p>

<p>
Pivate Contract  start from  commit：https://github.com/Phala-Network/tokenomic-contract
</p>

<p>
data index(subquery)  start from  commit：https://github.com/subquery/nodle-subql-starter.git
</p>



## 黑客松期间计划完成的事项

- 请团队在报名那一周 git clone 这个代码库并创建团队目录，在 readme 里列出黑客松期间内打算完成的代码功能点。并提交 PR 到本代码库。例子如下 (这只是一个 nft 项目的例子，请根据团队项目自身定义具体工作)：
- `pallet\spiral-dao`


  - [ ] advertise, Creating Adverise Page and definition of data structures. (`fn app_advertise_create()`)
  - [ ] promoter-dao, Creating DAO and launching crowdfunding simultaneously.  (`fn union_dao_create()`)
  - [ ] promoter-dao, Participating in crowdfunding. (`fn union_dao_mint()`)
  - [ ] promoter-dao, Extensive action types to reach, acquire, convert, and retain your users. (`fn union_task_action_pay()`)
  - [ ] promoter-dao, Close one action the action have been Verified & reward in private contract. (`fn union_task_action_finish()`)
  

- `pallet\spiral-collective` : Enhancing the collective module to support multiple collectives.
 

**隐私合约**

- `sprial-contract/src/lib.rs`
  - [ ] PRIVTE-CONTRACT Creation and data structure definition, generating privacy accounts. (`fn new()`)
  - [ ] PRIVTE-CONTRACT Seal the account  of S3 storage and others. (`fn seal_credentials()`)
  - [ ] PRIVTE-CONTRACT Seal action of task  (`fn seal_actions()`)
  - [ ] PRIVTE-CONTRACT Generating hierarchical propagation relationships. (`fn invite_from()`)
  - [ ] PRIVTE-CONTRACT Verified & reward  the action of user taken(will call pallet) (`fn do_task_action()`)
  - [ ] PRIVTE-CONTRACT Draw the reward for promoter (`fn reward_draw()`)


**数据索引**

- `spiral-subquery`
  - [ ] Index promoter-dao data. (`fn handleUnionDaoAddedEvent()`)

**客户端**

- web 端
  - [ ] 用户注册页面
  - [ ] NFT 产品创建流程
  - [ ] NFT 产品购买流程



## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)

TBD

## 队员信息

Name: Bruce
Role: Full Stack Developer
Github: NftTopBest
Wx: Web3Hacker
