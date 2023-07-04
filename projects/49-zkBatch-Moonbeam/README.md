## 基本资料

项目名称：zkBatch-Moonbeam

项目立项日期 (哪年哪月)：2023-06-20

## 项目整体简介

项目背景/原由/要解决的问题:
当前区块链行业面临着一个重要的问题：对于复杂逻辑的处理往往需要大量的计算资源，而链上的gas limit却限制了这一点。另外，每当开发者需要实现特定功能时，他们需要从头开始开发和验证零知识证明，这种情况使得开发过程变得冗余且繁杂。此外，针对金融交易、机器学习或各种复杂逻辑的各类零知识证明组件缺乏标准化，导致大量的资源在重新创建和验证已有的证明上被浪费。

项目介绍:
在这个黑客马拉松项目中，我们在zk-base-Moonbeam项目的基础上为Moonbeam提供了批量验证ZoKrates零知识证明的能力。如果验证通过，将成功执行所有的交易，否则交易将失败。这样，开发者可以直接使用链上已有的零知识证明验证器来实现自己的功能，无需进行繁琐的重新开发。它增加了使用不同基础零知识证明组件来组合实现复杂功能的可能性，可能是金融交易、机器学习，或各种复杂的逻辑。

项目Demo:
本项目的demo展示了如何利用zk-base-Moonbeam的批量验证功能来实现复杂的逻辑。在demo中，我们创建了一些交易并生成了相应的ZoKrates零知识证明，然后使用zk-base-Moonbeam的批量验证器对它们进行验证。如果所有证明都通过验证，那么所有交易都会成功执行。我们使用的例子可以是金融交易，机器学习模型的训练，或者各种复杂的逻辑。

技术架构:
本项目基于Moonbeam构建，主要利用了ZoKrates，一个开源的工具箱，用于在区块链上开发和验证零知识证明。我们在zk-base-Moonbeam的基础上扩展了批量验证功能。批量验证器是链上的一个智能合约，它接受一组证明作为输入，然后对其进行验证。验证通过的交易将被执行，而失败的则将被驳回。由于验证器本身可以被查看，这也使得在现有gas limit之下就可以实现很多复杂的逻辑。

总的来说，这个项目旨在将零知识证明的应用更加标准化，减少开发者的负担，同时提升了对复杂逻辑处理的能力。

Project Background/Reason/Problem to Solve:
Currently, the blockchain industry faces a critical issue: processing complex logic often requires substantial computational resources, yet this is limited by the gas limit on-chain. Furthermore, each time developers need to implement specific functionalities, they need to start from scratch to develop and validate zero-knowledge proofs, making the development process redundant and cumbersome. Moreover, there is a lack of standardization in various zero-knowledge proof components used for financial transactions, machine learning, or various complex logics, causing a waste of resources in recreating and validating existing proofs.

Project Introduction:
In this hackathon project, we have empowered Moonbeam with the ability to batch verify ZoKrates zero-knowledge proofs based on the zk-base-Moonbeam project. If the verification is passed, all transactions will be successfully executed; otherwise, the transactions will fail. In this way, developers can directly use the existing zero-knowledge proof verifier on the chain to implement their own functionalities without the need for cumbersome re-development. It has increased the possibility of combining different basic zero-knowledge proof components to implement complex functionalities, such as financial transactions, machine learning, or various complex logics.

Project Demo:
The demo of this project shows how to use the batch verification feature of zk-base-Moonbeam to implement complex logic. In the demo, we created some transactions and generated corresponding ZoKrates zero-knowledge proofs, then used the zk-base-Moonbeam batch verifier to verify them. If all proofs pass the verification, then all transactions will be successfully executed. The examples we used could be financial transactions, training of machine learning models, or various complex logics.

Technical Architecture:
The project is built based on Moonbeam, mainly leveraging ZoKrates, an open-source toolbox for developing and verifying zero-knowledge proofs on the blockchain. We have extended the batch verification feature on the basis of zk-base-Moonbeam. The batch verifier is a smart contract on the chain that takes a set of proofs as input and then verifies them. Transactions that pass the verification will be executed, while failed ones will be rejected. Since the verifier itself can be viewed, many complex logics can be implemented under the existing gas limit.

In summary, this project aims to standardize the application of zero-knowledge proofs, reduce the burden on developers, and enhance the ability to handle complex logic.

## 黑客松期间计划完成的事项

**零知识证明**

- `square root proof`
  - [ ] Proof Constraint (`main.zok`)
  - [ ]  (`fn transfer()`)
  - [ ] NFT 销毁函数 (`fn burn_token()`)


**Web端**




## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)



## 队员信息

@only4sim
Wechat: v136177849
