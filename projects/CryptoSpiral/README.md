![logo](https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-icon2-0.jpg)

## 基本资料

项目名称：CryptoSpiral

项目立项日期 (哪年哪月)：2023-0517

<p align="center">
<img  src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-info.png?v=1"><br/>
</p>


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

**Objective:** __The main objective of our hackathon is to validate the feasibility of a completely decentralized and fully private promotion platform. Additionally, combining the establishment of promoter DAOs with crowdfunding and ensuring that each DAO has its own token is an interesting endeavor. Lastly, building upon these foundations, the aim is to make the project as comprehensive as possible.__

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
  - [ ] Creating an advertising landing page
  - [ ] Creating a promotion DAO.
  - [ ] Participating in crowdfunding.
  - [ ] Translation: Initiating a task (including providing the privacy contract address, prepayment, etc.).
  - [ ] Displaying advertisements that can be clicked to redirect to third-party applications/websites.
  - [ ] Providing API documentation: Actions performed within the third-party application/website as part of the promotional task, invoking the privacy contract to validate the actions and reward accordingly.(see in spiral-front/README.md)



## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)

- 2023年7月4日上午11:59前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt等大文件不要提交。可以在readme中存放它们的链接地址

## 队员信息


| 姓名  | 角色         | GitHub 帐号 | 微信账号   |
|-----| ----------- | -- |--------|
| anthony | 区块链后端  |  web3pionner  | .. |
