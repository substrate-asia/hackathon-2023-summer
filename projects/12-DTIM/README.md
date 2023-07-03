## 基本资料

项目名称：DTIM

项目立项日期： 2023-02-15

## 项目整体简介

项目简介

DTIM is a distributed instant messaging software based on the matrix communication protocol, it represents a decentralized team (Decentralize team). Our goal is to provide a secure, efficient and transparent working communication environment. The main functions include real-time communication and collaboration, integrating chat, voice / video conference and other functions, allowing interaction, sharing ideas and effective communication at any time.

DTIM provides a decentralized governance mechanism based on substrate to ensure the sustainable development and community participation of the platform. Users can participate in the decision-making process through voting, proposals and other means, and promote the development of the project.

At the same time, the task management driven by smart contracts enables the creation of unique and reliable tasks. All state changes are automatically updated by smart contracts and broadcast to all relevant parties, so as to improve transparency and accuracy. Users can also get real-time project income and share information, which ensures the fair distribution and transparency of benefits to contributors.

DTIM is striving to integrate the Polkadot ecology DAPP, seeking DAPP application solutions in the office field. 

DTIM是一款基于matrix通信协议的分布式即时通讯软件，它代表着分布式团队（Decentralize team）。我们旨在提供安全、高效和透明的工作沟通环境。主要功能包括实时沟通与协作，集成了聊天、语音/视频会议等功能，可以随时进行交流、分享想法以及有效地沟通。

<img width="600" src="https://wetee.app/icons/shot/im.png"/>

DTIM基于substrate为组织提供了去中心化治理插件，组织可使用Gov插件实现去中心化治理功能。用户可以通过投票、提案等方式参与决策过程，并推动项目发展。

<img width="600" src="https://wetee.app/icons/shot/gov.png"/>

同时也通过智能合约驱动的Kanban使得创建独特而可靠的任务。所有状态变更都由智能合约存证，并广播给所有相关方，从而提高透明度和准确性。用户还可以实时获取项目收益和股份信息，这确保了对贡献者权益的公正分配和透明度。

<img width="600" src="https://wetee.app/icons/shot/kanban.png"/>

DTIM正在集成波卡生态DAPP，寻找DAPP在办公领域应用方案。

<img width="600" src="https://wetee.app/icons/shot/app.png"/>

### 技术简介
 - DTIM 通讯客户端： 我们使用[flutter](https://flutter.dev/)构建客户端，目标是构建全平台（window/macos/linux/android/ios/web）通用应用程序
 - 独立部署的组织底座：  我们提供了部署文档，组织自主部署组织的底座，企业和组织可完全掌控自己的数据和主权，无任何收费，以及副作用 [https://github.com/DAOent/dao-entrance-node](https://github.com/DAOent/dao-entrance-node)
 - DTIM connect： 我们基于subsrate构建了去中心化治理和去中心化看板的DAPP，组织可可方便集成到客户端，同时未来我们会通过平行链集成更多的 DAPP 到 DTIM 的应用列表
 - flutter substrate桥接： 我们使用 [flutter_rust_bridge](https://cjycode.com/flutter_rust_bridge/quickstart.html) 将 substrate sdk集成到（window/macos/linux/android/ios）中，使用 dart:js 完成了web端和polkadot钱包的互交

### 项目文档
 - deck： [https://drive.google.com/file/d/1YBGuvRsEeaZ6hEdQh2_68NsGUdvLooCp/view?usp=sharing](https://drive.google.com/file/d/1YBGuvRsEeaZ6hEdQh2_68NsGUdvLooCp/view?usp=sharing)
 - DTIM 客户端运行文档：[https://github.com/DAOent/DTIM/blob/main/docs/install_and_run.md](https://github.com/DAOent/DTIM/blob/main/docs/install_and_run.md)
 - 区块链运行文档：[https://github.com/DAOent/chain/tree/hackathon-2023-summer](https://github.com/DAOent/chain/tree/hackathon-2023-summer)


### 项目演示

 - linux 演示客户端下载： [https://dtim.wetee.app/download/linux.zip](https://dtim.wetee.app/download/linux.zip) 
 - window 演示客户端下载： [https://dtim.wetee.app/download/window.zip](https://dtim.wetee.app/download/window.zip) 
 - macos 演示客户端下载： [https://dtim.wetee.app/download/macos.zip](https://dtim.wetee.app/download/macos.zip) 
 - web 端演示地址： [https://dtim.wetee.app/](https://dtim.wetee.app/) 
 - 客户端项目地址： [https://github.com/DAOent/DTIM/tree/hackathon-2023-summer](https://github.com/DAOent/DTIM/tree/hackathon-2023-summer)
 - 区块链项目地址： [https://github.com/DAOent/chain/tree/hackathon-2023-summer](https://github.com/DAOent/chain/tree/hackathon-2023-summer)
 - flutter-rust兼容层：[https://github.com/DAOent/rust-sdk](https://github.com/DAOent/rust-sdk)
 - flutter-js兼容层：[https://github.com/DAOent/js-sdk/tree/hackathon-2023-summer](https://github.com/DAOent/js-sdk/tree/hackathon-2023-summer)
 - 区块链浏览器: [https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fchain-api.tc.asyou.me#/explorer](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fchain-api.tc.asyou.me#/explorer)


### 项目 logo (如有)，这 logo 会印制在文宣，会场海报或贴子上。

<p align="center">
<img width="100" src="https://wetee.app/static/web3/img/icon.png"><br/>
</p>

## 黑客松期间计划完成的事项

**IM服务端**
> 代码库 https://github.com/DAOent/dao-entrance-node/tree/hackathon-2023-summer
 - [ ] 使用 zkSBT 或 zkBAB 为软件提供 KYC 功能
 - [ ] 完成内置DAO工具IM机器人

**客户端**
> 代码库 https://github.com/DAOent/dao-entrance/tree/hackathon-2023-summer

- web 端
  - [x] flutter 通过接入 polkadot-js 实现兼容web端(现客户端使用flutter_rust代码桥接与链通信)
  - [x] web 端接入 Polkadot{.js} extension

- flutter desktop
  - [x] 用户信息展示
  - [x] 使用 zkSBT 或 zkBAB 为软件提供 KYC 功能
  - [x] 完成P2P通话功能
  - [x] 完成P2P在线会议
  - [ ] NFT铸币
  - [ ] NFT转账
 
## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)

**客户端**
- web 兼容桥 ==> [https://github.com/DAOent/js-sdk/tree/hackathon-2023-summer](https://github.com/DAOent/js-sdk/tree/hackathon-2023-summer)
  - [x] flutter 通过接入 polkadot-js 实现兼容web端(现客户端使用flutter_rust代码桥接与链通信) ==> 
  - [x] web 端接入 Polkadot{.js} extension

- desktop  ==> [https://github.com/DAOent/DTIM/tree/hackathon-2023-summer](https://github.com/DAOent/DTIM/tree/hackathon-2023-summer)
  - [x] 用户信息展示
  - [x] 完成P2P通话功能 
  - [x] 完成P2P在线会议 
  - [x] Manta nnetwork zkBAB 接入 ==> [https://github.com/DAOent/DTIM-zkBAB/tree/hackathon-2023-summer](https://github.com/DAOent/DTIM-zkBAB/tree/hackathon-2023-summer)
  - [x] DAPP 应用中心
  - [x] 去中心化治理 DAPP
  - [x] Kanban DAPP

**区块链端** 
- wetee_org ==> [https://github.com/DAOent/chain/tree/hackathon-2023-summer/apps/pallets/wetee-org](https://github.com/DAOent/chain/tree/hackathon-2023-summer/apps/pallets/wetee-org)
  - [x] 组织注册
  - [x] 应用上传
  - [x] 组织集成应用
- wetee-assets ==> [https://github.com/DAOent/chain/tree/hackathon-2023-summer/apps/pallets/wetee-assets](https://github.com/DAOent/chain/tree/hackathon-2023-summer/apps/pallets/wetee-assets)
  - [x] 用户KYC key存储

## 队员信息

包含参赛者名称及介绍
在团队中担任的角色
GitHub 帐号
微信账号（如有请留下，方便及时联系）

| 姓名         | 角色         | GitHub 帐号  | 微信账号     |
| ----------- | ----------- | ----------- | ----------- |
| BaiL       | 区块链全栈工程师  | bai-3   | dao-door000001   |
| Erica       | 产品     |        |        |
| Wyatt     | 前端   |       |        |