## 基本信息

项目名称：Coup Protocol

项目立项日期：2023/06

## 概述

该项目的主要目标是通过 IBC 协议实现 Substrate 区块链之间的跨链连接，使用 ICS06 Solomachine 客户端作为轻量级客户端基准。该工作也可以在平行链上实现。进一步的研究包括通过 IBC 实现 Substrate 区块链和任何 Rust 合约链（以 Solana 为例）之间的连接，同样使用 ICS06 Solomachine 客户端作为轻量级客户端基准。

## 黑客松期间计划完成的事项

- 使用 ICS06 Solomachine 客户端作为轻量级客户端基准，在两个 Substrate 区块链之间实现 IBC 连接。
- 使用 ICS06 Solomachine 客户端作为轻量级客户端基准，在 Substrate 区块链和 Rust 合约链（以 Solana 为例）之间实现 IBC 连接。
- 开发基本的用户界面，以演示 Substrate 区块链和 Rust 合约链之间的跨链连接。

### substrate pallet

- substrate-ibc
- hermes (ibc的relayer)
- solana-ibc (待定)
- 两个substrate-node-template 链集成了substrate-ibc

## 黑客松期间所完成的事项

待定

## 队员信息

- [Davirain](https://github.com/DaviRain-Su)：软件工程师，具有 Rust 和区块链开发经验。团队领导。
- Clayon：区块链开发人员，具有 Substrate 和 Solidity, Solana 开发经验。负责实现 IBC 连接。
- Leo：用户界面和用户体验设计师，具有区块链相关项目经验。负责开发基本的用户界面。
