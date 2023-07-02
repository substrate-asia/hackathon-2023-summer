## 基本资料

项目名称：CryptoSpiral

项目立项日期 (哪年哪月)：2023-0517

## 项目整体简介

项目简介，英文提交。包括但不限于：

### 项目背景/原由/要解决的问题 (如有其他附件，可放到 `docs` 目录内。英文提交)。

The project named "cryptoSpiral" is a decentralized privacy promotion platform. Its key feature revolves around localized and specialized promoters, utilizing DAO and privacy to facilitate efficient and secure promotion and dissemination for web3 projects.

<p align="center">
<img width="200" src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-background.png"><br/>
</p>

We will build a Chrome Extension to provide a web3 way of payment platform with every Twitter timeline and comment.

### 项目介绍

The project named "cryptoSpiral" is a decentralized privacy promotion platform. Its key feature revolves around localized and specialized promoters, utilizing DAO and privacy to facilitate efficient and secure promotion and dissemination for web3 projects.



### 项目更新

* [05/20](https://github.com/parity-asia/hackathon-2023-summer/pull/4/commits) 项目代码初始化, 添加项目说明
* [05/24](https://github.com/parity-asia/hackathon-2023-summer/pull/7/commits) 新增 RWA 钱包的基本 layout 设计 UI 代码（无逻辑）
* [05/30](https://github.com/parity-asia/hackathon-2023-summer/pull/11/commits) 新增 RWA 钱包登录页面 UI
* [06/03](https://github.com/parity-asia/hackathon-2023-summer/pull/18/commits) RWA 钱包的新用户 onboard 模块的 UI/UX 几近完成！
* [06/04](https://github.com/parity-asia/hackathon-2023-summer/pull/23/commits) 完成了最核心的助记词的安全缓存逻辑！
* [06/23](https://github.com/parity-asia/hackathon-2023-summer/pull/76) 项目迁移到新的 repo 并添加更多支持性的分包代码
  * RWA 钱包代码: <https://github.com/Web3Hacker-World/web3-rwa-wallet>
  * RWA-JS-SDK 代码：<https://github.com/Web3Hacker-World/RWA-JS-SDK> （在 RWA 钱包项目中依赖此代码库），此代码库未来作为 RWA 的通用库发展

### 项目Demo

TBD

### 技术架构

We use the [vitesse-webext](https://github.com/antfu/vitesse-webext) open-source code to init our chrome extension.

- ⚡️ **Instant HMR** - use **Vite** on dev (no more refresh!)
- 🥝 Vue 3 - Composition API, [`<script setup>` syntax](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md) and more!
- 💬 Effortless communications - powered by [`webext-bridge`](https://github.com/antfu/webext-bridge) and [VueUse](https://github.com/antfu/vueuse) storage
- 🌈 [UnoCSS](https://github.com/unocss/unocss) - The instant on-demand Atomic CSS engine.
- 🦾 [TypeScript](https://www.typescriptlang.org/) - type safe
- 📦 [Components auto importing](./src/components)
- 🌟 [Icons](./src/components) - Access to icons from any iconset directly
- 🖥 Content Script - Use Vue even in content script
- 🌍 WebExtension - isomorphic extension for Chrome, Firefox, and others
- 📃 Dynamic `manifest.json` with full type support


### 项目 logo (如有)，这 logo 会印制在文宣，会场海报或贴子上。

<p align="center">
<img width="200" src="./docs/NFT-Fi-Twitter.png"><br/>
</p>

### 项目的启始的commit，对于全新的项目可以是一个开源框架的clone，比如区块链clone自substrate-node-template, react框架等，请给出说明。对于成熟项目可以是一个branch，要求在2023年5月12号之后生成，说明有哪些功能是已经有了的

起始 commit 是这个： https://github.com/NftTopBest/NFT-Fi-Twitter
这是基于 [vitesse-webext](https://github.com/antfu/vitesse-webext) 开源代码基础上加了一些 ReadMe 说明，还未开始开发功能代码的状态下。

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

## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)

TBD

## 队员信息

Name: Bruce
Role: Full Stack Developer
Github: NftTopBest
Wx: Web3Hacker
