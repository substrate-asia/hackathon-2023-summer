## Basic Information

Project Name: CBIndex
Initation Date: 17 May 2023

## Project Overview

### Project Introduction


As a decentralized asset management platform, CBIndex provides various crypto investment tools built on the CBI protocol, fostering an innovative environment for individuals and entities to manage and grow their crypto assets.

CBIndex encompasses a comprehensive suite of tools that empower users with unprecedented access to crypto investment through various vehicles, such as copy-investing, actively managed on-chain funds, and on-chain index funds.

It delivers a democratized ecosystem where anyone can effortlessly make crypto investment decisions by copying seasoned investors or participating in active and index funds.

Using the CBIndex simulator, one can try out, learn and practice crypto investments in a well-simulated environment. With the index tool, anyone can become a crypto index provider by building, managing, and promoting their crypto indices.

### Project Background and Problem to Solve

**Most crypto investors make bad investment decisions:**

- Lead to financial losses and market volatility;

- Result in diminished market confidence;

- Trigger stricter regulatory scrutiny and hindered ecosystem growth.

**CBIndex solves the problems with various on-chain investment vehicles:**

- Provide copy-investing for newbies to gain profits via copying seasoned investors;


- Provide actively managed funds and index funds functionalities so that everyone can create, manage and invest in on-chain funds;

- Equip each user with powerful investment simulators to play with.

### Project Demo

https://dapp.cbindex.finance/ is the demo of CBIndex DApp (fully built on blockchain), which has the copy-investing feature now. The mutual fund (active fund and index fund) investment feature will be added in the future.

https://app.cbindex.finance/ is the demo of CBIndex App (mainly built on centralized server), which has crypto index fund building and management feature, mutual fund (active fund and index fund) creation and investment simulator, copy-investing simulator, and various analysis tools for crypto investment.

The project CBIndex is composed of both parts to best serve the users. Ideally, users can use the App to build and manage their crypto index funds, analyze the market with index indicators and tools, learn and practice fund manangement or fund investment with the fund simulator, practice copy-investing with the copy-investing simulator, and then use the DApp to copy-investing or invest in crypto funds in the real market.

### Project Architecture


The general framework or technical architecture of the CBIndex consists of several interconnected components designed to function seamlessly in the context of the blockchain and DeFi ecosystem. Here is a broad overview:

- **Frontend:** The frontend serves as the user interface. It is a web application that allows users to interact with the tools easily. The frontend is built using the popular JavaScript framework Next.js.
- **Backend:** The backend is responsible for executing complex operations that the frontend requests. It includes managing centralized functionalities of the simulator, such as user accounts and handling fund or index creation.
- **Blockchain Layer:** This layer interacts directly with the underlying blockchain. It is responsible for handling transactions, managing smart contracts, and ensuring the immutability and security of operations.
- **Smart Contracts:** Smart contracts handle functions like copy-investing, fund management, index creation, token swapping, and more.
- **Integration Layer:** The integration layer allows CBIndex to interact with other platforms and services in the DeFi ecosystem. It includes API gateways and other interfaces that enable CBIndex to connect with external applications, services, or exchanges.
- **Data Layer:** This layer manages all the data related to the platform. This includes data from centralized data aggregators and decentralized infrastructures.
- **Analytics Engine:** The analytics engine is responsible for generating insights from the data. It tracks and analyzes market trends, index performance, fund performance, etc., and presents this data to users in a digestible format.
- **Security Infrastructure:** This is the set of technologies and protocols that ensure the platform's overall security. It includes encryption protocols, user authentication mechanisms, smart contract audits, and more to ensure the safety of user data and funds.
- **Multi-chain Compatibility:** CBIndex platform will aim to become multi-chain compatible, meaning it will not just run on one blockchain. This will increase the availability of funds and assets for investors and fund managers.

### Project Logo

![CBIndexLogo](https://ipfs.io/ipfs/QmeRAn9YwAmeq4i6WwA8t4qCzqb5kpwx1o2u9B3Gu6m4sp?filename=CBIndex_logo_square_480_solid_black.png "CBIndex Logo")

## Planned Tasks During Hackathon

- Coyp-investing fund Creation
- Coyp-investing fund Management
- DEX Integration
- Copy-investing fund Performance Analytics
- Copy-investing fund investment

**Blockchain**

- `copy-investing-fund`

  - Vault initiation (`fn create_copy_investing_vault()`)
  - Vault copying (`fn copy_vault()`)
  - Investing (`fn investing()`)
  - Redemption (`fn redemption()`)

- `copy-investing-fund-investment`
  - Investing (`fn investing()`)
  - Redemption (`fn redemption()`)

**Client**

- DApp

  - Connecting wallet (integrate Wallet Connect)
  - Copy-investing Fund Creation
  - Coyp-investing fund Management
  - Copy-investing fund investment

- App (Next.js)
  - Copy-investing fund Performance Analytics
  - Coyp-investing fund Management

## Completed Tasks During Hackathon (2023 年 7 月 4 日上午 11:59 初审前提交)


- 2023 年 7 月 4 日上午 11:59 前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt 等大文件不要提交。可以在 readme 中存放它们的链接地址

## Team Members

| Name   | Info   | Role   | GitHub | WeChat |
| ------ | ------ | ------ | ------ | ------ |
| Ray | tech background, 8+ years of web3 experience | product manager | DRGU0416 | baozhadexiaoshitou |
| Evan | full-stack, smart contract engineer | blockchain dev | mozhiyun | - |
| John | full-stack, smart contract engineer | blockchain dev | John_Suu | - |
| ZZ | 3 years of dev experience | frontend dev | zzqVip | - |

