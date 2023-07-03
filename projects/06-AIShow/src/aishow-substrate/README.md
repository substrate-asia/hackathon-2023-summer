# AiShow &middot; [![GitHub license](https://img.shields.io/badge/license-GPL3%2FApache2-blue)](#LICENSE) [![GitLab Status](https://gitlab.parity.io/parity/substrate/badges/master/pipeline.svg)](https://gitlab.parity.io/parity/substrate/pipelines) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/CONTRIBUTING.adoc) [![Stack Exchange](https://img.shields.io/badge/Substrate-Community%20&%20Support-24CC85?logo=stackexchange)](https://substrate.stackexchange.com/)

## Vision

Become the most popular AI model sharing and creation platform in the web3 era.

## Introduction

With the hype of Chat GPT, people have realized the capabilities and wide range of applications of AI. However, as an advanced production tool, AI needs a more suitable production relationship to better promote the development of productivity. We believe that the blockchain provides just such a production relationship, so a decentralized AI model sharing and creation platform AIShow was born.
In AIShow, users can publish their own AI models. Creators can create based on their favorite models, and at the same time mint their creative works as NFTs in the market. All data uses distributed storage, we will integrate with Chat GPT, introduce evolvable NFT technology, let users train the best companion models and endow them with evolvable digital images.
Users are not only builders and users, but also beneficiaries. AIShow uses incentive mechanisms and behavior mining. All behaviors that contribute to the platform, such as publishing AI models, creating works, model training, liking and commenting, will be rewarded.
Due to the constraints of low TPS, difficult upgrades, and insufficient composability of blockchain applications, taking into account comprehensively, we will use Pokka parallel chain to realize the construction of AIShow platform, and store data on CESS.

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

