## 基本资料

项目名称：SubDev (全称: SubStrate Developer)

项目立项日期 ：2023/5/20

## 项目整体简介
```
CN 项目介绍

- 项目背景: 当前 web3 用户使用钱包，不紧消耗gas费，助记词有丢失和遗忘风险。所以基于Eip-4337 合约钱包本项目应运而生。

- 项目介绍: 使用web3 协议的 mpc wallet 钱包，基于 eip-4337 的抽象帐户创建的钱包，用户在合约转账中，不需要购买gas费，就可以完成转账功能。让用户更加方便的使用区块链钱包功能。利用Eip-4337全约,独特的抽象帐户，用户可以使用多种方式登录钱包。省去了购买gas 费问题和钱包丢失问题。

- 技术架构: 钱包登陆-》邮箱验证登录-》钱包地址-》提交转账信息-》后台系统批量添加捆绑交易信息。-》执行 Eip-4337合约-》完成转账.
```
```
Introduction to EN Project

- Project background: Currently, web3 users are using wallets and do not consume gas fees. There is a risk of loss and forgetting mnemonics. So based on the Eip-4337 contract wallet, this project emerged as the times require.

- Project introduction: MPC wallet using web3 protocol, created based on abstract account of EIP-4337, allows users to complete the transfer function without purchasing gas fees during contract transfer. Make it more convenient for users to use the blockchain wallet function. With the Eip-4337 full contract and unique abstract account, users can log in to their wallet in multiple ways. Eliminated the issue of gas purchase fees and wallet loss.

- Technical architecture: Wallet login ->Email verification login ->Wallet address ->Submit transfer information ->Batch add bundled transaction information to the backend system Execute the Eip-4337 contract to complete the transfer
```
## 黑客松期间计划完成的事项

```
阶段一：

1. 部署，Eip-4337 合约到，基于 moonbeam --dev 测试网络。时间 2023/5/22
2. 钱包app 实现用户钱包邮箱创建绑定，eip-4337 帐户。 时间 2023/5/26
2. 钱包帐户恢复。 时间 2023/5/26
```
```
阶段二：

1. 钱包用户之间相互相互转账实现。时间 2023/5/31
2. 合约Token 代扣gas 比例设置。时间 2023/5/31
```
```
阶段三：

1. uniswap 兑换合约部署，创建兑换池子。 时间 2023/6/9
2. transferFrom 转帐实现,实现 eip-4337 帐户转erc20用户。时间 2023/6/15
3. 实现Eip-4337合约用户，使用TUSDT兑换成Token。时间 2023/6/10
3. 实现钱包兑换Token功能。时间 2023/6/15
```

**客户端**

- app 端 (flutter)
  - [ ] 用户创建鲍页面
  - [ ] 绑定邮箱
  - [ ] PIN 码设置
  - [ ] EOA 转帐
  - [ ] Eip4337 合约交互

**后端**

- `wallet-service`
  - [ ] Eip4337 创建用户 (`fn create_account()`)
  - [ ] Eip4337 转帐函数 (`fn transfer()`)
  - [ ] Eip4337 授权函数 (`fn approve()`)
  - [ ] Eip4337 授权转帐函数 (`fn transferForm()`)

**合约**

- `Eip-4337合约官方仓库地址`
  - https://github.com/eth-infinitism/account-abstraction

## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)

- 2023年7月4日上午11:59前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt等大文件不要提交。可以在readme中存放它们的链接地址

## 队员信息

#### 赛者名称及介绍:

| 姓名         | 角色         | GitHub 帐号  | 微信账号     |
| ----------- | ----------- | ----------- | ----------- |
| 郭光志       | 合约和链部署  | qqliaoxin   | wxliaoxin   |
| 姚竣洛       | 钱包前端     | yaojunluo   | inxlove   |
| 赵国荣       | 区块链后端   | 89365767@qq.com  | zgr89365767   |
| 古超豪       | 产品        |             | kk452720898   |