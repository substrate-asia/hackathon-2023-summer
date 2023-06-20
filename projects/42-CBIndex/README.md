## 基本资料

项目名称：CBIndex

项目立项日期：2023.05.17

## 项目整体简介

### Project Introduction

The project is named CBIndex. CBIndex is a transformative decentralized crypto investment tool and protocol fostering an innovative environment for individuals and entities to manage and grow their crypto assets. CBIndex encompasses a comprehensive suite of tools that empower users with unprecedented access to crypto investment through various vehicles, such as copy-investing, actively managed on-chain funds, and index funds. It presents a truly democratized ecosystem where anyone can effortlessly create, manage, and integrate crypto indices regardless of background or expertise. With CBIndex, setting up, managing, and investing in diverse investment vehicles becomes accessible and user-friendly.

### Project Background and Problem to Solve

Most crypto investors make bad investment decisions:

(1) Lead to financial losses and market volatility;

(2) Result in diminished market confidence;

(3) Trigger stricter regulatory scrutiny and hindered ecosystem growth.

CBIndex solves the problems with various on-chain investment vehicles:

(1) Provide mirrored investing for newbies to gain profits via copying seasoned investors;

(2) Provide actively managed funds and index funds functionalities so that everyone can create, manage and invest in on-chain funds;

(3) Equip each user with powerful investment simulators to play with.

### Project Demo

https://app.cbindex.finance/

### Project Architecture

The general framework or technical architecture of the CBIndex consists of several interconnected components designed to function seamlessly in the context of the blockchain and DeFi ecosystem. Here is a broad overview:

- Frontend: The frontend serves as the user interface. It is a web application that allows users to interact with the tools easily. The frontend is built using the popular JavaScript framework Next.js.
- Backend: The backend is responsible for executing complex operations that the frontend requests. It includes managing centralized functionalities of the simulator, such as user accounts and handling fund or index creation.
- Blockchain Layer: This layer interacts directly with the underlying blockchain. It is responsible for handling transactions, managing smart contracts, and ensuring the immutability and security of operations.
- Smart Contracts: Smart contracts handle functions like mirrored investing, fund management, index creation, token swapping, and more.
- Integration Layer: The integration layer allows CBIndex to interact with other platforms and services in the DeFi ecosystem. It includes API gateways and other interfaces that enable CBIndex to connect with external applications, services, or exchanges.
- Data Layer: This layer manages all the data related to the platform. This includes data from centralized data aggregators and decentralized infrastructures.
- Analytics Engine: The analytics engine is responsible for generating insights from the data. It tracks and analyzes market trends, index performance, fund performance, etc., and presents this data to users in a digestible format.
- Security Infrastructure: This is the set of technologies and protocols that ensure the platform's overall security. It includes encryption protocols, user authentication mechanisms, smart contract audits, and more to ensure the safety of user data and funds.
- Multi-chain Compatibility: CBIndex platform will aim to become multi-chain compatible, meaning it will not just run on one blockchain. This will increase the availability of funds and assets for investors and fund managers.

### Project Logo

![avatar](http://drive.google.com/file/d/1gzhPBZ2YGQaVE6lKBEuycpHe4Vlj84RJ/view?usp=sharing)

## 黑客松期间计划完成的事项

- 请团队在报名那一周 git clone 这个代码库并创建团队目录，在 readme 里列出黑客松期间内打算完成的代码功能点。并提交 PR 到本代码库。例子如下 (这只是一个 nft 项目的例子，请根据团队项目自身定义具体工作)：

**区块链端**

- `pallet-nft`
  - [ ] NFT 创建及数据结构定义 (`fn create_nft()`)
  - [ ] NFT 转帐函数 (`fn transfer()`)
  - [ ] NFT 销毁函数 (`fn burn_token()`)

**客户端**

- web 端

  - [ ] 用户注册页面
  - [ ] NFT 产品创建流程
  - [ ] NFT 产品购买流程

- hybrid (react-native)
  - [ ] 用户注册页面
  - [ ] NFT 产品创建流程
  - [ ] NFT 产品购买流程

## 黑客松期间所完成的事项 (2023 年 7 月 4 日上午 11:59 初审前提交)

- 2023 年 7 月 4 日上午 11:59 前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt 等大文件不要提交。可以在 readme 中存放它们的链接地址

## 队员信息

包含参赛者名称及介绍
在团队中担任的角色
GitHub 帐号
微信账号（如有请留下，方便及时联系）
