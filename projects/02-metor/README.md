## 基本资料

项目名称：metor

项目立项日期 ：2023-05-17

## 项目整体简介

- 项目背景/原由/要解决的问题 (如有其他附件，可放到 `docs` 目录内。英文提交)。
  -  
  - Why  do this project ?
    - Existing decentralized storage programs not only have high requirements on hardware, but also the participation process is very complicated and requires certain professional knowledge to participate. There is a certain threshold, and it is very unfriendly to novices. For example, FilCoin decentralized storage has very high hardware requirements, and the participation process is very complicated.
      We hope to build a decentralized storage program that has a low threshold for participation, and users can participate as long as they have free storage space and a set of common hardware devices.
- 项目介绍
  -
  This is a storage chain, and you don't need a powerful server to run it. 
  Divided into on-chain and off-chain,metadata is stored on the chain to implement punishment and incentives.
  Under the chain are storage nodes and verification nodes. We are lightweight enough that storage nodes can be combined with any blockchain.

  
- 技术架构
 1. The client node splits the file through the erasure code
 2. Match storage nodes on the chain
 3. Send and store point-to-point fragmented data
 4. Smart contract records metadata
 5. The verification node verifies the storage status of the storage node through the space-time proof
 6. The smart contract completes the economic model
 

## 黑客松期间计划完成的事项

 1. Smart contract (pledge, space purchase, metadata storage, economic model)
 2. Client (erasure code, metadata model, file distribution, file retrieval, p2p, RPC)
 3. Storage nodes (p2p, file storage, proof of space)
 4. Verification node (p2p, space-time proof)


## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)

- 2023年7月4日上午11:59前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt等大文件不要提交。可以在readme中存放它们的链接地址

## 队员信息

| name  | role                        | github    | wechat     |
|-------|-----------------------------|-----------|------------|
| samir | distributor miner validator | samirshao | inasmaker  |
| mayue | smart contract              | KavenLE          | Y_M_Y_KING |
