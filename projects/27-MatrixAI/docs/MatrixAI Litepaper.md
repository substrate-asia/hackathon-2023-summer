## 1介绍
### A 背景
在过去5年中，深度学习取得的许多显著进展是由于持续增加的训练计算量来开发先进模型[9, 10]。这样的大规模训练是通过同时使用数百或数千个具有高内部芯片通信带宽的专用加速器（如Google TPUs、NVIDIA A100和H100 GPU，或AMD MI250 GPU）来实现的，这些加速器用于几周或几个月的时间来计算数千或数百万次梯度更新。因此，构建这些基础模型所需的巨大资源要求给获取访问权造成了重大障碍，并且如果没有一种在捕获价值的同时共享资源的方法，可能会导致AI进展停滞。
目前提供计算资源的解决方案要么是寡头垄断且昂贵，要么是由于大规模AI所需的复杂计算而不可行。满足不断增长的需求需要一种能够以成本效益的方式利用所有可用计算资源。目前的问题是，计算资源本身受到微处理器性能渐近进展的限制，再加上供应链和地缘政治方面的芯片短缺。
另一方面，全球云计算数据中心的平均利用率始终不高，这意味着仍然存在大量闲置的计算资源。并且，随着消费级计算设备的计算能力不断攀升，个人计算机、服务器和移动设备等个人和企业的闲置计算资源也是潜在的可用资源。此外，如IPFS、Fileoin和Storj等去中心化的数据传输与存储基础设施不断完善。
### B 动机
每一波技术创新的引子都是某种昂贵的东西变得廉价到可以浪费。
当前，在物理基础设施领域，主要由垂直一体化寡头垄断市场，包括AWS、GCP、Azure、Nvidia、Cloudflare、Akamai等公司，这些公司在行业中拥有高利润率。这导致新进入者在AI领域，尤其是LLM领域，面临着极高的计算成本，这对推动AI技术的发展和普及不利。然而，去中心化算力服务通过分散化的资源、弹性和可扩展性、降低成本、保护隐私、高度可信度以及创新和合作机会等方面带来了许多优势。我们坚信，去中心化算力服务将成为突破当前高昂算力成本的关键，使其变得廉价且可随意使用，从而打开AI行业技术创新的大门，迈向AI时代的未来。
为了实现这一目标，我们迈出了第一步，建立一个去中心化的AI算力交易市场，即MatrixAI，旨在集结来自全球各地的闲置AI算力资源。MatrixAI的愿景是通过公平透明的激励机制吸引全球的算力供应方参与网络，从而建立一个庞大的闲置算力资源池。我们将MatrixAI打造成为Web3时代下的AI算力资源层网络，为小规模的AI计算服务和高性能计算集群服务提供支持，以满足不同规模的需求。
MatrixAI致力于打破当前中心化垄断的局面，为各行各业的AI应用带来创新和进步，为AI算力服务带来更大的开放性和可持续性，推动整个行业迈向新的高度。我们相信，通过MatrixAI的努力，全球范围内的算力供应方将能够充分发挥他们的潜力，而算力需求方将获得更灵活、高效和经济实惠的AI算力解决方案。我们期待与您一起开创这个充满潜力的去中心化算力领域的未来。
## 2 约束

- 规模化：经济模型 + 消费模式（量贩式）
- 可靠性：工作验证（Proof of Learning） + 算力验证（芯片固件活动记录：入网+定期）
- 隐私性：数据隐私（同态加密） >> 模型隐私
- 角色：Inspector-Trainer-User
- 支持流行的中心化存储服务接口或去中心化的商用存储协议
## 3 设计
### A 角色与架构
MatrixAI Network是一个基于Substrate[5]的去中心化AI算力基础设施，包括以下角色：
#### a 用户（User）
有训练模型需求的用户。
#### b 训练者（Trainer）
任何拥有闲散算力资源的用户都能够无门槛加入MatrixAI Network成为训练者。训练者作为网络的共识节点，其通过贡献有效算力来获得出块奖励。有效算力可通过以下两类方式来积累：

1. **Drilling：完成网络自动分配的可测量计算任务。**训练者在加入网络即可流水线式处理此类任务。计算任务由与MatrixAI Network社区合作的项目发布，通常具有实际应用价值。所发布的计算任务都属于机器学习范畴，可用于预估训练者的实际算力。同时由于状态独立性，计算任务可以轻松地进行拆分和验证，适合各类硬件条件的机器。
2. **Training：通过在算力交易市场挂单出售算力资源，与用户达成承诺并完成预期的模型训练。**加入网络的训练者可随时选择在算力交易市场挂单。在发起订单和定价之前，可参考算力市场实际情况。用户在选择训练机器时可以浏览其上报的机器关键硬件配置信息，以及历史有效算力值作为参照。一旦订单敲定，训练者从用户指定的位置下载所需的数据，并按要求完成模型的训练。
### B 共识机制（PoH，Hashrate）
PoH与Bitcoin的PoW类似，都是以共识节点在每个周期内的工作量来竞争出块。不同的是，在PoH中训练者无需进行大量哈希运算来寻找满足条件的哈希值，而是可以通过Drilling和Training来计算有效算力值。同时，PoH引入VRF算法[6]，将每位训练者的有效算力值与VRF的权重绑定。算力值越高的训练者将以更高的概率生成满足条件的随机数，并获得出块权及附属奖励。
### C 算力评估体系

1. 算力评估体系是PoH共识机制的基石，是算力交易市场的有序和透明性的保障。
2. 算力评估体系将为每位训练者进行动态算力评估，以数值形式表示，记为有效算力值。评估标准以训练者历史完成Drilling和Training任务的质量和数量为准。
3. 为了鼓励训练者向网络提供更多的算力资源，从而完成更多的计算任务，PoH将有效算力值用作每个节点的VRF权重。算力值越高的训练者将以更高的概率获得出块权及附属奖励。
4. 同时，鉴于训练者的硬件配置不是外部可感知的，那么当训练者定价时单方面提供的硬件配置很难直接用于参考。为了让用户获得更具价值的指标作为参照，算力交易市场将公开各训练者的有效算力值。
5. 算力评估体系将针对Drilling和Training任务分别计算有效算力值，可分为![](https://cdn.nlark.com/yuque/__latex/f99812d9f9dfd1c2707b0f3fd9829297.svg#card=math&code=D_%7BECP%7D&id=GiKaT)和![](https://cdn.nlark.com/yuque/__latex/a61b622d4113a1134229615d7a6e48d7.svg#card=math&code=T_%7BECP%7D&id=rcvS2)。他们之间的关系可表示为：![](https://cdn.nlark.com/yuque/__latex/776829213a0739fd339437bf07d8373e.svg#card=math&code=Total_%7BECP%7D%20%3D%200.4%20%5Ctimes%20D_%7BECP%7D%20%2B%200.6%20%5Ctimes%20T_%7BECP%7D&id=WVhBM)。
#### a 算力值定义
为了让算力资源可被测量，我们设计了一套算力数值化的规则。在该规则下，算力值的最小单位是![](https://cdn.nlark.com/yuque/__latex/45da23c4f4225133498d89fd4869b2b3.svg#card=math&code=ut&id=T14fo)，它表示在基准计算机上执行1,000 MFLOPS的Whetstone[7]基准测试所需的1/200天的CPU时间。比如某机器的算力值为200![](https://cdn.nlark.com/yuque/__latex/45da23c4f4225133498d89fd4869b2b3.svg#card=math&code=ut&id=UpQt0)，则表示它已经执行了等同于1 GigaFLOPS[8]基准计算机满负荷执行了1整天的计算任务（包含Drilling和Training）。
在MatrixAI Network中，有两个算力值被维护：

- 总算力值：训练者从入网伊始，历史所获得的算力值总和。 
- 有效算力值：最近一段时间内每天获得的算力平均值。这个平均值每周减少一半。
#### b ![](https://cdn.nlark.com/yuque/__latex/f99812d9f9dfd1c2707b0f3fd9829297.svg#card=math&code=D_%7BECP%7D&id=k8sAW)评分规则
Drilling任务由与MatrixAI Network社区合作的项目发布。每个任务在发布时都会由合作项目对所发布的任务设置难度，并由社区验证通过。难度的衡量标准为算力值。因此，![](https://cdn.nlark.com/yuque/__latex/f99812d9f9dfd1c2707b0f3fd9829297.svg#card=math&code=D_%7BECP%7D&id=K499A)的评分计算规则如下：
![](https://cdn.nlark.com/yuque/__latex/e8606d533abd3a9146365bda7f076b16.svg#card=math&code=D_%7BECP%7D%20%3D%20The%20%5C%3B%20Task%20%5C%3B%20Difficulty%20%5C%3B%20%5Ctimes%20The%20%5C%3B%20Number%20%5C%3B%20of%20%5C%3B%20Tasks&id=nu8aE)
#### c ![](https://cdn.nlark.com/yuque/__latex/a61b622d4113a1134229615d7a6e48d7.svg#card=math&code=T_%7BECP%7D&id=E1gdH)评分规则
Training任务由与训练者接单而来，![](https://cdn.nlark.com/yuque/__latex/a61b622d4113a1134229615d7a6e48d7.svg#card=math&code=T_%7BECP%7D&id=NCafk)的评分计算规则与![](https://cdn.nlark.com/yuque/__latex/f99812d9f9dfd1c2707b0f3fd9829297.svg#card=math&code=D_%7BECP%7D&id=f3Wl1)类似，都由任务的难度决定。不同的是，![](https://cdn.nlark.com/yuque/__latex/a61b622d4113a1134229615d7a6e48d7.svg#card=math&code=T_%7BECP%7D&id=p5PXM)的任务难度是通过估算模型训练所需的浮点数运算总数来确认。
### D 钻孔证明（Proof of Drilling） 

1. PoD设计旨在验证训练者是否如实完成了Drilling任务，并授予![](https://cdn.nlark.com/yuque/__latex/f99812d9f9dfd1c2707b0f3fd9829297.svg#card=math&code=D_%7BECP%7D&id=zjrDq)评分。
2. PoD验证的基本原理是通过多个训练者完成相同的任务，并返回相同的工作单位来达成共识。如果它们都达成一致意见，那么算力将被计算，并且所有训练者将获得相同数量的信用，而不考虑它们的硬件情况。
3. 相反，如果多个训练者对于相同的Drilling任务，却输出了不同的结果。那么，所有参与的训练者都将损失该算力值。
### E 训练证明（Proof of Training）

1. 模型训练外包服务的必要条件是确保训练过程的真实可靠。
2. 在去中心化算力网络中，用户不应该无条件信任提供算力的训练者将如实工作。相反地，训练者通常会为了牟利而违反约定和承诺。例如训练者可能会任意行为，不按要求训练模型，并向用户返回错误的模型数据。
3. 在加密世界中，我们通常遵循“无需信任，验证即可”法则。
4. 2021年，Jia et al在工作量证明和可验证计算的研究启发下提出了学习证明（PoL）[1]。PoL使用基于梯度的优化过程中的元数据来构建工作完成的证书，以证明训练方已经进行了必要的计算工作来正确地获得一组模型参数。2022年，Zhang et al认为PoL的"对抗样本"是脆弱的，并通过理论和实证方面证明，他们能够以明显低于证明者生成证明的成本生成一个有效的证明[2]。Zhang et al在PoL的基础上，于2023年提出了训练溯源方案，利用在模型训练过程中保存的中间检查点构建一个连贯的模型链，作为所有权证书[3]。Shavit在2023年提出了一种基于芯片固件的轻量级活动记录策略，实现对该芯片的监测[4]。
5. 以上述所提方案为基础，我们进一步深入研究并提出了训练证明（PoT）。PoT的原理是通过实证对比如验证准确率，参数分布距离等定量度量指标，来验证模型训练过程产出的中间检查点是否与输出的模型匹配。
6. 在PoT的支持下，训练方仅需完成模型的初始化，并在常规的模型训练过程中将每一轮训练的检查点依次保存为一个连贯的证明包。任何获取证明包的人都可作为验证人，根据一系列的验证算法，我们将其称为“全过规则”，来验证训练方是否如实完成了模型训练。
7. 全过规则包含以下六条验证条件，只有全部条件都满足才算验证通过。
   1. **验证准确率的单调性**。给定一个与训练数据集类似的验证数据集![](https://cdn.nlark.com/yuque/__latex/b42594175857e5f3302f527bdf87303c.svg#card=math&code=D_%7Bval%7D&id=jjtiD)，对于![](https://cdn.nlark.com/yuque/__latex/b42594175857e5f3302f527bdf87303c.svg#card=math&code=D_%7Bval%7D&id=vLtME)上的各检查点的验证准确率是单调非递减的。
   2. **参数分布连续性**。假设模型使用足够小的学习率进行训练，对于任意两个相邻的检查点![](https://cdn.nlark.com/yuque/__latex/b3e446f65eb8aeac98b741ad30fcea2e.svg#card=math&code=C_i&id=XBbeN)和![](https://cdn.nlark.com/yuque/__latex/8bbe0132f5bf69e21916a4e7bba9715a.svg#card=math&code=C_%7Bi%2B1%7D&id=s1bYS)以及一个小阈值![](https://cdn.nlark.com/yuque/__latex/b366096db7f8095739886cce8854eaec.svg#card=math&code=%5Cdelta&id=P2L1k)，所有层中的权重应满足限定条件。
   3. **初始参数的分布**。初始模型的参数应符合所需的GMM分布。给定初始模型![](https://cdn.nlark.com/yuque/__latex/fd76ffb7632102f3f1be6e64e822e4a9.svg#card=math&code=C_0&id=q0uPB)，其所有层中的权重应满足限定条件。
   4. **初始参数的独立性**。初始模型的参数应该是独立的。对于初始化层中的权重![](https://cdn.nlark.com/yuque/__latex/c9b08ae6d9fed72562880f75720531bc.svg#card=math&code=w&id=kELIv)，如果我们将其中的两个不同的参数![](https://cdn.nlark.com/yuque/__latex/d99fd2df7b5f652a4b7fc593fb9df750.svg#card=math&code=w_i&id=Z26Ir)和![](https://cdn.nlark.com/yuque/__latex/e962475aca62e7f210f40004870bd692.svg#card=math&code=w_j&id=RD24y)视为随机变量，它们两个的协方差应为0。
   5. **权重距离的单调性**。假设模型的训练正常收敛，那么中间检查点与收敛模型之间的距离应单调递减至零。
   6. **初始模型与收敛模型之间的小距离**。假设深度神经网络模型足够复杂，收敛模型与同一模型链中的初始模型之间的距离很可能远小于与其他随机初始化模型之间的距离。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/12491446/1687252475069-118bd194-8fbb-4d8a-8701-d7c1d7883f16.png#averageHue=%23ebf0e7&clientId=u3936d2c9-fa6d-4&from=paste&height=508&id=u4262968f&originHeight=508&originWidth=666&originalType=binary&ratio=1&rotation=0&showTitle=false&size=118897&status=done&style=none&taskId=u443af4f3-b0c1-44c0-8744-9ea8c33435a&title=&width=666)


## 4 工作流（Walkthroughs）

### A 算力注册

### A 数据处理

### B 算力购置

### C 任务初始化

### D 模型训练

### E 成果检验

## 5 通证经济

- 质押
- 奖惩
- 释放规则
## 6 未来工作

## 参考文献
[1] Jia, Hengrui, et al. "Proof-of-learning: Definitions and practice." _2021 IEEE Symposium on Security and Privacy (SP)_. IEEE, 2021.
[2] Zhang, Rui, et al. "“Adversarial Examples” for Proof-of-Learning." _2022 IEEE Symposium on Security and Privacy (SP)_. IEEE, 2022.
[3] Liu, Yunpeng, et al. "Provenance of Training without Training Data: Towards Privacy-Preserving DNN Model Ownership Verification." _Proceedings of the ACM Web Conference 2023_. 2023.
[4] Shavit, Yonadav. "What does it take to catch a Chinchilla? Verifying Rules on Large-Scale Neural Network Training via Compute Monitoring." _arXiv preprint arXiv:2303.11341_ (2023).
[5] The Blockchain Framework for a Multichain Future: [https://substrate.io/](https://substrate.io/)
[6] Micali, Silvio, Michael Rabin, and Salil Vadhan. "Verifiable random functions." _40th annual symposium on foundations of computer science (cat. No. 99CB37039)_. IEEE, 1999.
[7] [https://en.wikipedia.org/wiki/Whetstone_(benchmark)](https://en.wikipedia.org/wiki/Whetstone_(benchmark))
[8] [https://en.wikipedia.org/wiki/FLOPS](https://en.wikipedia.org/wiki/FLOPS)
[9] Jared Kaplan et al. 2020. Scaling Laws for Neural Language Models.
[10] Jordan Hoffmann et al. 2022. Training Compute-Optimal Large Language Models. (2022).
## 当前用例：去中心化小规模AI计算服务

- 价格优势
## 未来规划：去中心化的高性能计算（HPC）集群服务

- 高性能：并行

当前云计算中使用深度学习模型训练有哪些问题？
