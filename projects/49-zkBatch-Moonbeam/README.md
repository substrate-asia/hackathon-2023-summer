## 基本资料

项目名称：zkBatch-Moonbeam

项目立项日期 (哪年哪月)：2023-06-20

## 项目整体简介

### 项目背景/原由/要解决的问题:
当前区块链行业面临着一个重要的问题：对于复杂逻辑的处理往往需要大量的计算资源，而链上的gas limit却限制了这一点。另外，每当开发者需要实现特定功能时，他们需要从头开始开发和验证零知识证明，这种情况使得开发过程变得冗余且繁杂。此外，针对金融交易、机器学习或各种复杂逻辑的各类零知识证明组件缺乏标准化，导致大量的资源在重新创建和验证已有的证明上被浪费。

### 项目介绍:
在这个黑客马拉松项目中，我们在zk-base-Moonbeam项目的基础上为Moonbeam提供了批量验证ZoKrates零知识证明的能力。如果验证通过，将成功执行所有的交易，否则交易将失败。这样，开发者可以直接使用链上已有的零知识证明验证器来实现自己的功能，无需进行繁琐的重新开发。它增加了使用不同基础零知识证明组件来组合实现复杂功能的可能性，可能是金融交易、机器学习，或各种复杂的逻辑。

### 项目Demo:
本项目的demo展示了如何利用zkBatch-Moonbeam的批量验证功能来实现复杂的逻辑。在demo中，我们创建了一些交易并生成了相应的ZoKrates零知识证明，然后使用zkBatch-Moonbeam的批量验证器对它们进行验证。如果所有证明都通过验证，那么所有交易都会成功执行。这些交易可以是金融交易，机器学习模型的训练，或者各种复杂的逻辑。这里为了方便起见，我们使用了平方根的验证，具体操作如下：

```JavaScript
cd src/
node verify.js
```
默认配置下交易应当成功。

如果需要尝试伪造的证明，可以使用verify.js中的mockTxCallData替换batch.batchAll中的任意verifyTxCallData。交易将会失败，或者无法发送，并返回错误信息和以及可能由于失败导致的乱码。这里在verifyFake.js文件里提供了一个样例，使用方式如下：
```JavaScript
cd src/
node verifyFake.js
```

### 技术架构:
本项目基于Moonbeam构建，主要利用了ZoKrates，一个开源的工具箱，用于在区块链上开发和验证零知识证明。我们在zk-base-Moonbeam的基础上扩展了批量验证功能。批量验证器是链上的一个智能合约，它接受一组证明作为输入，然后对其进行验证。验证通过的交易将被执行，而失败的则将被驳回。由于验证器本身可以被查看，这也使得在现有gas limit之下就可以实现很多复杂的逻辑。

总的来说，这个项目旨在将零知识证明的应用更加标准化，减少开发者的负担，同时提升了对复杂逻辑处理的能力。

### Project Background/Reason/Problem to Solve:
Currently, the blockchain industry faces a critical issue: processing complex logic often requires substantial computational resources, yet this is limited by the gas limit on-chain. Furthermore, each time developers need to implement specific functionalities, they need to start from scratch to develop and validate zero-knowledge proofs, making the development process redundant and cumbersome. Moreover, there is a lack of standardization in various zero-knowledge proof components used for financial transactions, machine learning, or various complex logics, causing a waste of resources in recreating and validating existing proofs.

### Project Introduction:
In this hackathon project, we have empowered Moonbeam with the ability to batch verify ZoKrates zero-knowledge proofs based on the zk-base-Moonbeam project. If the verification is passed, all transactions will be successfully executed; otherwise, the transactions will fail. In this way, developers can directly use the existing zero-knowledge proof verifier on the chain to implement their own functionalities without the need for cumbersome re-development. It has increased the possibility of combining different basic zero-knowledge proof components to implement complex functionalities, such as financial transactions, machine learning, or various complex logics.

### Project Demo.
The demo for this project shows how to implement complex logic using zkBatch-Moonbeam's batch verification feature. In the demo, we create a number of transactions and generate the corresponding ZoKrates zero-knowledge proofs, and then validate them using zkBatch-Moonbeam's batch verification. If all the proofs pass the verification, then all the transactions are executed successfully. These transactions can be financial transactions, training of machine learning models, or various complex logics. Here, for convenience, we use square root verification, which is done as follows:

``` JavaScript
cd src/
node verify.js
```
The transaction should succeed by default configuration.

If you need to try a faked proof, you can replace any verifyTxCallData in batch.batchAll with a mockTxCallData in verify.js. The transaction will fail, or fail to send, and return an error message and and possibly garbled code due to the failure. A sample is provided here in the verifyFake.js file and is used in the following way:
``` JavaScript
cd src/
node verifyFake.js
```

### Technical Architecture:
The project is built based on Moonbeam, mainly leveraging ZoKrates, an open-source toolbox for developing and verifying zero-knowledge proofs on the blockchain. We have extended the batch verification feature on the basis of zk-base-Moonbeam. The batch verifier is a smart contract on the chain that takes a set of proofs as input and then verifies them. Transactions that pass the verification will be executed, while failed ones will be rejected. Since the verifier itself can be viewed, many complex logics can be implemented under the existing gas limit.

In summary, this project aims to standardize the application of zero-knowledge proofs, reduce the burden on developers, and enhance the ability to handle complex logic.

## 黑客松期间计划完成的事项

**零知识证明**

- `square root proof`
  - [ ] Proof Constraint (`main.zok`)
  - [ ] Verification Contract with Assert (`verifier.sol`)
  - [ ] Basic Machine Learning Model (`model.zok`, `model_verifier.sol`)


**Web端**
- `batch verification`
  - [ ] Verificaton Compiler (`compile.js`)
  - [ ] Proof Verification (`verify.js`)



## 黑客松期间所完成的事项
在黑客松期间，我们主要实现了零知识证明的批量验证。由于批量验证中难以直接获得合约函数的返回值，我们为此特意调整了合约的验证函数，是的无法通过的证明直接被废弃，这样，一旦batchAll交易成功，就说明所有的验证都获得了通过。具体完成的事项如下：

**零知识证明**

- `square root proof`
  - [x] Proof Constraint (`main.zok`)
  - [x] Verification Contract with Assert (`verifier.sol`)


**Web端**
- `batch verification`
  - [x] Verificaton Compiler (`compile.js`)
  - [x] Proof Verification (`verify.js`)


## 队员信息

Name: Li@only4sim
GitHub: https://github.com/only4sim
Wechat: v136177849
