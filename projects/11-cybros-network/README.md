## 基本资料

项目名称：Cybros Network

项目立项日期：6/1/2023

## 项目整体简介

The design of Smart Contracts is for asset-related use cases, not generic computation. To make Web 3 become the natural successor of Web 2, we need to expand the border of Blockchain usage.

There are already a few blockchain networks for domain-specific usages, such as Oracle service, automation service, GPU render service, etc.
Compared with the rich ecosystem of Web 2, it's easy to think that we also need to have push notifications service, post-processing videos or images service, integration with AI service, etc.
Although these scenarios are different, they have such common: they are off-chain computing, latency-insensitive, and require scale on-demand.

Traditional software architecture, especially for Web 2 applications, will use an async jobs scheduler, and developers only need to focus on business logic. A well-designed async jobs scheduler can earn millions of dollars annually, for example, Sidekiq.

If we can work out a Blockchain-based async jobs scheduler, we could introduce tons of classic Web 2 features into the Web 3 world in a native way. Combined with Web 3 composability, it could derive new product forms.
In addition, Blockchain tokenomic could help reduce end-user fees and improve computing power providers' income.

The Blockchain should help manage off-chain job executor nodes, job queues, job lifecycles, scheduling jobs, and ensuring security.

We shall use Substrate to build the blockchain because we want complete control of low-level components to ensure scalability.

## Logo

![Cybros Network logo](./docs/logo.png)

## 黑客松期间计划完成的事项

**区块链端**

完成区块链功能到可公开 Demo 的程度

- [ ] 整理和清理技术验证原型的代码
- [ ] 调通完整的业务流程

**一个用于展示的用例**

- [ ] 实现链下作业的处理程序
- [ ] 基于网页可演示的 UI

## 黑客松期间所完成的事项

- 完整可用于演示的区块链程序
  - 受 Hackathon 赛期限制，部分功能（如调度器）采用了初步的简单实现
  - 所有实现的功能都是真实可用的，没有 mock 伪造的
- 完整可用于演示的 Job executor
  - 受 Hackathon 赛期限制，整体架构以快速实现为主
  - 包含了 Demo 需要的所有代码
  - 所有实现的功能都是真实可用的，没有 mock 伪造的
- 用于技术评审的参考文档参见 [./docs/README.md](./docs/README.md)
- 一个 dApp 用于演示一种使用场景（AIGC + NFT）
  - 演示视频：https://youtu.be/_6F8YvPHwDI
  - Demo 站点：https://www.cybros.network/imaginator
    - 合约部署在 Polygon 主网，需要有 Metamask 钱包（不需要波卡钱包）和少量 Matic 才能发送 Prompt
    - 测试网浏览器：https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fnode-rpc.cybros.network#/explorer
      - 实现了一个 ETH 钱包映射到波卡账号的机制，可以导出 ETH 私钥，用 ECDSA 方式导入到波卡 app，便能够用这个账号管理在 Polygon 创建的 jobs
    - 生成成功会铸造 NFT，可在 OpenSea 浏览和销售 https://opensea.io/collection/cybrosnft
    - NFT 的 metadata 中包含了对 Prompt 发明权的证明（精心配置的 SD 能够做到确定性生成），参考 [metadata](https://arweave.net/JNKtIUZXPSQTe6l2vVjhhvSC5TWzL3P6Lz1BmOD2taI)
    - 参考 prompt：`closeup portrait of nkoctst cat in a misty field, dream landscape, simulation, physical particles, translucence, cinematic lighting, iridescence, digital painting --neg blurry, artifacts, duplicate, mutilated, mutation, deformed, ugly, blurry, bad anatomy, lowres, bad anatomy, text, error, cropped, worst quality, low quality, normal quality, jpeg, signature, username, blurry, artist name, longhair, clothes, too many ears, border, --steps 20`
      - 支持 `--neg` 反向 prompt
      - 支持 `--steps` 采样次数
      - 支持 `--seed` 随机种子
      - 锁定了使用 `https://civitai.com/models/8123/nekothecat` 模型避免产生 NSFW 内容
    - 运行 AIGC 任务的是一块低功耗单板机，存在生成失败的可能性

## 队员信息

| 姓名        | 角色         | GitHub 帐号  | 微信账号     |
| ----------- | ----------- | ----------- | ----------- |
| Jun Jiang      | 技术负责人  | jasl   | jasl123   |
| Zhe Wang       | 项目经理   | skysummerice | skysummerice  |
| Jiacheng Zhang | 产品经理   | krhougs  | - |
| Song Wu        | 开发        | wsof401 | -   |
| Zhaoming Pan   | 开发        | RandyPen | -   |
