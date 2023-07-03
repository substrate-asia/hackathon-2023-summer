# AiShow &middot; [![GitHub license](https://img.shields.io/badge/license-GPL3%2FApache2-blue)](#LICENSE) [![GitLab Status](https://gitlab.parity.io/parity/substrate/badges/master/pipeline.svg)](https://gitlab.parity.io/parity/substrate/pipelines) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/CONTRIBUTING.adoc) [![Stack Exchange](https://img.shields.io/badge/Substrate-Community%20&%20Support-24CC85?logo=stackexchange)](https://substrate.stackexchange.com/)

## 愿景

成为web3时代最受欢迎的Ai模型分享和创作平台

## 项目介绍

随着Chat GPT的火热，让大家认识到了IA的能力及其广泛的应用场景。然而，作为先进生产工具的 AI，需要更合适的生产关系加持，才能更好的促进生产力的发展。我们认为，区块链正好提供了这种生产关系，于是一个去中心化的AI模型分享与创作平台AIShow应运而生。
在AIShow中，用户可以将发布自己的AI模型，创作者可以基于喜欢的模型进行创作，同时可以将自己创作出来的作品铸造成NFT在市场流流通。不但所有数据采用分布式存储，我们将接入Chat GPT，引入可进化NFT的技术，让用户训练出最佳伴侣模型并赋予其可进化的数字形象。
用户不仅是建设者和使用者，同时也是受益者，AIShow采用激励机制和行为挖坑，如发布AI模型、创作作品、模型训练、点赞评论等所有对平台有贡献的行为都将获得奖励。
由于区块链应用有TPS过低、升级困难、可组合性不足等因素制约，综合考虑，我们将采用波卡平行链的方式来实现AIShow平台的搭建，并将数据存储在CESS上。

## Getting Started

Head to [docs.substrate.io](https://docs.substrate.io) and follow the [installation](https://docs.substrate.io/install/) instructions.
Then try out one of the [tutorials](https://docs.substrate.io/tutorials/).
Refer to the [Docker instructions](./docker/README.md) to quickly run Substrate, Substrate Node Template, Subkey, or to build a chain spec.

## Community & Support

Join the highly active and supportive community on the [Substrate Stack Exchange](https://substrate.stackexchange.com/) to ask questions about use and problems you run into using this software.
Please do report bugs and [issues here](https://github.com/paritytech/substrate/issues) for anything you suspect requires action in the source.

## Contributions & Code of Conduct

Please follow the contributions guidelines as outlined in [`docs/CONTRIBUTING.adoc`](docs/CONTRIBUTING.adoc).
In all communications and contributions, this project follows the [Contributor Covenant Code of Conduct](docs/CODE_OF_CONDUCT.md).

## Security

The security policy and procedures can be found in [`docs/SECURITY.md`](docs/SECURITY.md).

## License

- Substrate Primitives (`sp-*`), Frame (`frame-*`) and the pallets (`pallets-*`), binaries (`/bin`) and all other utilities are licensed under [Apache 2.0](LICENSE-APACHE2).
- Substrate Client (`/client/*` / `sc-*`) is licensed under [GPL v3.0 with a classpath linking exception](LICENSE-GPL3).

The reason for the split-licensing is to ensure that for the vast majority of teams using Substrate to create feature-chains, then all changes can be made entirely in Apache2-licensed code, allowing teams full freedom over what and how they release and giving licensing clarity to commercial teams.

In the interests of the community, we require any deeper improvements made to Substrate's core logic (e.g. Substrate's internal consensus, crypto or database code) to be contributed back so everyone can benefit.

