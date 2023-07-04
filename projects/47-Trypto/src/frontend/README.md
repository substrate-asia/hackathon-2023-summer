## 基本资料

项目名称：Trypto

项目立项日期 (哪年哪月)：2023 年 6 月

## 项目整体简介

### 项目背景

区块链技术和 ai 人工智能高速发展，隐私和安全成为了区块链钱包、物联网、社交、协作、DAO 基础设施和 AI 人工智能等领域关注的重点。为了保护用户的隐私和数据安全，以及提高智能系统的可信度，各类分布式系统和密码学方案层出不穷，同时也受到广泛研究和关注。

各类头部机构出具了前瞻的分析报告，其中信誉、协作、可验证计算、AIGC、人工智能等等关键词频繁出现，区块链应用开始走向正轨，零知识证明在许多场景下被证明可以解决大多数问题，是一个绝佳的方案。我们是在密码学领域深耕的实验室，针对 ibe 加密、zk、mpc 等等领域有多年研究，察觉到需要有解决方案快速的解决在可信场景下的协作问题，协作遍及各个领域，包括企业协作工具、去中心社交、多签、人工智能算法训练、zkml、去中心化存储等等，几乎所有需要通信的场景都会涉及到协作，所有我们从协作入手寻找到了合适的加密算法。

我们实际已经实现了协议的设计和 go 实现，可以在
[TSC-2023](https://github.com/CommuSA/TSC-2023)
这里看到我们的工作，已经发表了文章成果在 TSC 和 TIFS

### 项目介绍

Trypto 是一个基于用户个性化特征进行秘密共享的协作管理系统，旨在提供一种安全、可靠且用户友好的方式，让用户可以在去中心化环境中共享秘密信息，并保护其个人隐私和数据安全。个性化特征可以包括用户的生物特征（如指纹、面部识别等）、资产地址或其他可唯一识别用户的特征。这些特征可以用来生成一个个性化的加密密钥，将用户的私密信息加密，并将加密的份额分发给协作网络中的不同参与者。系统可以用于 DAO 工具、多签钱包、资产管理、公司协作系统等等场景，有望在去中心化应用和数字资产管理领域提供更安全、便捷的解决方案。
项目 PPT: [Trypto PPT](https://docs.google.com/presentation/d/13mOA3i1bS59xsobaufVEoI6y_on-xLFWQwYAYVIl2gs/edit?usp=sharing)

### 项目 Demo

http://trypto.club/

### 技术架构

![](架构.png)

### 项目 logo

![](logo.png)

### 项目的启始的 commit

https://github.com/CommuSA/polkadot-trypto/tree/587c139bba965157f9d33d6b8bf42dbef7500c94

587c139bba965157f9d33d6b8bf42dbef7500c94

## 黑客松期间计划完成的事项

**区块链端**

- trypto 加密算法合约
  - [✅] setup 函数，启动加密系统
  - [✅] 属性电路生成
  - [✅] 加解密
  - [✅] 子密钥生成
  - [❎] 用户加入加密系统
  - [❎] 用户撤销
  - [❎] 属性撤销
  - [❎] 存储加密
  - [❎] 通信加密

**客户端**

- web 端
  - [✅] homepage
  - [✅] 用户登录/退出波卡钱包、授权网站访问、签名信息
  - [✅] 用户上传文件至 CESS 网络
  - [✅] 用户查询 DeOss 网络上的文件信息，文件下载
  - [✅] 消息通信

主要是加密算法的基本实现，属性电路生成、加解密、登陆注册、文件上传和消息通信

## 服务信息

- DeOss
  - Version: v0.2.0 dev , git: 7afb38f3939009f2eba0c6d09d386573371e0062
  - Rpc: wss://devnet-rpc.cess.cloud/ws/
  - Public key: cXhPqEC3c5Gmvt1HHzMUMhx8X5AUjbCWTu59fYGGC7iryy8L5
  - HTTP gateway: http://43.139.148.169:8080
- web 端
  - web 部署站点： http://trypto.club
  - 编译方式： npm run build

## 队员信息

Spencer： CEO https://github.com/Jackieyewang 负责算法设计、合约开发、前端开发
Dick: CTO https://github.com/lyd0 负责前后端开发和交互
Wendy : CMO https://github.com/Tron-Di 负责产品思考和调研
Barron : CS https://github.com/guanjiech 首席科学家，负责协议设计和研究

## Tips

[Trypto PPT](https://docs.google.com/presentation/d/13mOA3i1bS59xsobaufVEoI6y_on-xLFWQwYAYVIl2gs/edit?usp=sharing)
[Demo](http://trypto.club/)
[TSC-2023](https://github.com/CommuSA/TSC-2023)
