技术评审参考文档
====

## 背景

Cybros Network 是一个基于区块链的任务调度器 (Job Scheduler) 网络，
计算机科学的相关概念适用于本项目，但也有所调整以适应区块链系统。

- Job scheduler: https://en.wikipedia.org/wiki/Job_scheduler
- Job queue: https://en.wikipedia.org/wiki/Job_queue

## 名词解释

- Job：具体要执行的任务，包含进度（状态）、输入、结果
  - 可以理解成合约，是最基本的执行单元，内部封装一个完整的业务逻辑
  - 计算过程运行在链下，根据程序的设计可以访问到任何资源
- Implementation (简写 Impl): Job 的处理程序
- Implementation Build (简写 impl build): Job 的处理程序的 release
  - 开发者需要在链上声明那些 impl build 可以注册上链
- Worker: 某个 impl build 的运行实例，用于处理任务
- Pool: 计算池，作为 Job queue，也管理了用于处理任务的 workers
  - Pool 必须关联某个特定的 impl 且要求 worker 必须是其实例
- Job policy: 用于定义谁可以创建 job、创建 job 的定价、Pool 和 Worker 的分成方式等配置
  - 隶属于 Pool，一个 Pool 可以创建多个

## 技术特性

### Implementation

- 允许开发者自由注册，仅需要支付一笔押金
  - 需要在注册时声明是否去中心化：任何人皆可部署、白名单许可部署、仅提交者自己可部署
    - 网络会在 worker 申请上线时检查是否符合上线标准
  - 需要在注册时声明机密性：无保证、部署者担保、可信任计算环境（TEE）
    - 网络会提供验证部署者担保和可信任计算环境（TEE）的标准和相应的验证逻辑
- 通过一组 signed extrinsics 与链交互
  - 用于上链、声明即将离线等状态变更
  - 用于响应在线挑战
    - 类似波卡验证人的 offences，处于在线（online）状态下会随机被发起在线挑战，如果不及时响应会判定离线并有可能被 slash
  - （可选）用于刷新认证（attestation）状态
    - 用于支持认证可信任计算环境（TEE）和中心化项目
  - 用于推送任务处理进度和结果
- 不限制开发语言、运行环境
  - 唯一的要求是能与区块链交互

### Implementation build

- 开发者需要声明允许上链的版本
  - 由于只有可信任计算环境（TEE）才能严格保证提交上链的信息不可复制、篡改，所以非 TEE 环境不会做严格检查
- 开发者可以声明 build 的许可状态
  - released: 正常的状态
  - deprecated: 软淘汰，在线的 worker 可以正常工作，但是新的 worker 无法使用该版本上线
  - blocked: 强制淘汰，在线的 worker 会被强制下线

### Worker

- Worker 不限制设备种类，只需要能够与链交互即可
  - 在普通设备上可以部署网络的节点
  - 在边缘设备上可以通过连接到网络的 RPC gateway 进行通信
  - 在浏览器上可以利用 Smoldot 轻节点和 WASM
- 每个 worker 都会生成对应的钱包
  - 在首次启动的时候随机生成
  - 用于收集执行任务获得的收入，Worker 的所有者可以随时 withdraw
  - 用于支付与链交互用的 signed extrinsics 的 gas 费
- Worker 必须加入到一个或者多个 Pool 中才会收到任务
- Worker 需要定期接受在线状态挑战，每次成功会更新 `uptime`
  - 可以根据首次上线时间和 `uptime` 计算出在线率

### Pool

- 必须关联一个特定的 Impl（一个 Impl 可以创建多个 Pool），且不能更改
- 是调度任务的单元
- 加入的 Worker 的数量影响了这个 Pool 处理任务的吞吐量
  - 目前的设计是必须由 Pool 的拥有者（管理员）许可才能让 Worker 加入
- 可以设置元数据（metadata），用来支持如 e2e 通信等需求

### Job Policy

- 只可创建和删除，不可修改
  - 作为“契约”防止 Pool 的管理者随意更改费用和分成方式损害消费者和Worker运营者的权益
- 付费和分成支持免费、固定费用和固定比例，也可支持智能合约（Ink）
- 可以创建多条、可以设定有效期（基于区块）和受众
  - 可以实现如优惠、白名单使用等各种需要

### Job

- 任务的状态和业务的状态分离
  - 任务的状态包括等待、正在处理、已处理和终止
  - 业务的状态包括成功、失败、错误、异常（指预期外的情况）
- 作为工作量证明的基本单位
  - 智能合约可以访问执行时间、结果、执行的 Worker等信息用于计算费用
- 任务可包含两份证明
  - 如果是 TEE 环境，可以提交区块链可验证的证明来证明运行环境是 TEE 以及执行的代码和输入的完整性
  - 可以通过业务层面的设计或者 ZK，来证明结果的真实性
- 任务的输入输出数据都暂存在链上
  - 有最大容量限制（目前是 2KB）
  - 任务的创建者和 Worker 要为存储支付押金
  - 任务完成或者超时后可以通过删除任务来释放押金
- 任务有 spec version 标明任务的版本（类比 ABI）
  - 一个 Pool 不可能保证所有的 Worker 都严格运行一致的版本，并且 impl 也有可能升级自己的格式，这个字段保证任务调度到能处理的 worker 去
- 任务的调度由区块链的验证人节点完成，受 NPoS 保护可靠和公平
- 未来有望支持基于 DAG 的任务间依赖和计划任务

### 其他

综合以上介绍，Cybros 链提供了任务调度和节点管理的一切必要基础设施，有两点不在网络解决的范围里：
- Worker 的经济激励
- 去中心化的任务处理程序分发

针对 “Worker 的经济激励” 鼓励去中心化项目的开发者自行开发智能合约或者结合如 LSD 产品构建对 Worker 的激励层。

针对 “去中心化的任务处理程序分发”，可研发一种可用于部署提供 FaaS 能力的代码执行环境：
- 作为一种 Impl 部署在网络上
- 能够通过类似智能合约部署的方式部署到 Worker 上
- 能够支持“可信任计算环境”（TEE）保障敏感数据的机密性
- 能够引入 ZK 等密码学技术辅助开发者产生对执行结果的证明
- 开发智能合约或者结合 LSD 产品对 Worker 的部署者提供经济激励

## `src` 目录关键内容介绍

- `/node` Cybros 节点工程
- `/pallets` Cybros 相关的 pallets
  - `offchain_computing_workers` 用于管理实例（Worker）和处理程序（Implementation）的 pallet
  - `offchain_computing` 用于管理计算池、任务和任务调度等功能的 pallet
- `/runtimes/primal` 开发网络的 runtime
- `/protocol_impl` 参考的 Impl build，实现了所有的与链交互的调用以及 spawn 任务处理进程
  - `examples/simple_echo` 最基本的任务处理逻辑的例子，Worker 会直接返回输入
  - `examples/echo` 一个复杂的支持端到端加密（e2e）通信的任务处理逻辑的例子
  - `examples/imaginator` 一个支持端到端加密（e2e）通信的 AIGC 例子

## 如何运行

> 在 Demo 我们会演示 `imaginator` （AIGC demo）作为例子，但是由于需要部署 Stable Diffusion 以及准备 Arweave 钱包，
对运行环境要求很高，所以这里我们使用 `simple_echo` 来演示完整流程，使用 polkadot.js app 即可

### 必须依赖

- 编译区块链需要 Rust 1.70.0
- 运行 `protocol_impl` 需要 Deno 1.34.3 https://github.com/denoland/deno/releases/tag/v1.34.3

### 准备工作

#### 编译区块链节点

`cargo build --release`

#### 预载 Deno 依赖

```bash
cd protocol_impl
rm deno.lock # Polkadot.js API 发新版时会覆盖某些文件导致哈希无法跟本地锁定的版本对上，导致拉取失败
deno cache --reload ./main.ts
```

如果想运行 `echo` 需要额外运行

```bash
cd examples/simple_echo
rm deno.lock # Polkadot.js API 发新版时会覆盖某些文件导致哈希无法跟本地锁定的版本对上，导致拉取失败
deno cache --reload ./main.ts
```

如果想运行 `imaginator` 需要额外运行

```bash
cd examples/imaginator
rm deno.lock # Polkadot.js API 发新版时会覆盖某些文件导致哈希无法跟本地锁定的版本对上，导致拉取失败
deno cache --reload ./main.ts
```

#### Imaginator 配置

运行 `cp examples/imaginator/.env.defaults examples/imaginator/.env`

编辑 `examples/imaginator/.env`
其中 `AKORD_API_KEY`、`AKORD_ACCOUNT_BACKUP_PHRASE` 和 `AKORD_VAULT_ID` 需要注册 https://akord.com/ 获得
`SD_API_BASE` 需要部署 https://github.com/AUTOMATIC1111/stable-diffusion-webui 并且在启动命令包含 `--api`

### 运行和配置区块链

#### 启动本地开发网络

`target/release/cybros-node --dev`

浏览器打开 Polkadot.js app
https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/extrinsics

#### 注册一个 Impl 和 Impl Build

使用 Alice 钱包发送交易 `offchainComputingWorkers.registerImpl(attestationMethod, deploymentPermission)`
- `attestationMethod` 选择 `OptOut` 表示不进行任何认证
- `deploymentPermission` 可以选择 `Public` 这样可以让任何人都可以部署这个 Impl

提交后可在 `Network -> Explorer` 页可看到事件：
- `offchainComputingWorkers.ImplRegistered`，点开可以看到被分配了 `ImplId` 为 `101`

接着使用 Alice 钱包发送交易 `offchainComputingWorkers.registerImplBuild(implId, version, magicBytes)`
- `implId` 填写 `101` 即刚才申请到的 ImplId
- `version` 可填写 `1`（任何大于 0 的数字都可）
- `magicBytes` 保持 `None` 不填写（非 TEE 环境无法可信的验证这个字段，故省略）

提交后可在 `Network -> Explorer` 页可看到事件：
- `offchainComputingWorkers.ImplBuildRegistered`

#### 注册一个 Pool

使用 Alice 钱包发送交易 `offchainComputingWorkers.createPool(implId)`
- `implId` 填写 `101` 即刚才申请到的 ImplId

成功后可在 `Network -> Explorer` 页看到创建成功的事件 `offchainComputing.PoolCreated` 点开可以看到被分配了 PoolId `101`

#### 创建一个 Job Policy

使用 Alice 钱包发送交易 `offchainComputingWorkers.createJobPolicy(poolId, applicableScope, startBlock, endBlock)`
- `poolId` 填写 `101` 即刚才申请到的 PoolId
- `applicableScope` 可以选择 `Public` 即适用于所有人
- `startBlock` 和 `endBlock` 可保持 `None` 即永不失效

提交后可在 `Network -> Explorer` 页可看到事件：
- `offchainComputing.JobPolicyCreated` 点开可以看到被分配了 `PolicyId` 为 `1`

#### 启动 Worker

以下命令将启动 `simple_echo` 例子

```bash
cd protocol_impl
EXECUTOR_PATH="./examples/simple_echo" ./run.sh --owner-phrase "//Alice" --subscribe-pool 101 --impl 101 --rpcUrl ws://127.0.0.1:9944
```

如果要启动 `echo` 或者 `imaginator` 例子，将 `EXECUTOR_PATH` 路径切换到对应的目录即可

启动后可以看到日志中的

```
Worker address: 5CmLkeupoN7tSthSD6hFj9wHYc9RyMRAWb38uo5BD6LEViGw
```

这是随机生成的 Worker 钱包地址

在 `Network -> Explorer` 页可看到事件：
- `offchainComputingWorkers.WorkerRegistered` Worker 注册成功
- `offchainComputingWorkers.WorkerOnline` Worker 上线成功

#### 将 Worker 添加到 Pool

使用 Alice 钱包发送交易 `offchainComputingWorkers.authorizeWorker(poolId, worker)`
- `poolId` 填写 `101` 即刚才申请到的 PoolId
- `worker` 填写 `5CmLkeupoN7tSthSD6hFj9wHYc9RyMRAWb38uo5BD6LEViGw` 即刚启动的 worker 的钱包地址

提交后可在 `Network -> Explorer` 页可看到事件：
- `offchainComputing.WorkerAuthorized`

稍后可看到
- `offchainComputing.WorkerSubscribed` Worker 开始监听该 Pool

#### 创建一个任务

发送交易 `offchainComputing.createJob(poolId, policyId, implSpecVersion, input, softExpiresIn)`
- `poolId` 填写 `101` 即刚才申请到的 PoolId
- `policyId` 填写 `1` 即刚才创建的 Job Policy 的 id
- `implSpecVersion` 填写 `1`
- `autoDestroyAfterProcessed` 保持 `No`
- `input` 为任务的输入，在 `simple_echo` 例子可任意填写内容
- `softExpiresIn` 可保持 `None` 不填写

提交后可在 `Network -> Explorer` 页可看到事件：
- `offchainComputing.JobCreated` 点开可以看到被分配了 `JobId` 为 `1`

稍后可以在 Worker 的程序日志观察到监听到新任务，此时观察区块链事件可以陆续看到：
- `offchainComputing.JobAssigned` 任务被分配给 Worker
- `offchainComputing.JobStatusUpdated` Worker 收到任务，更新状态到 `Processing`
- `offchainComputing.JobResultUpdated` Worker 提交任务的处理结果，`result` 为 `Success`，`output` 为创建时填写的 `input`
- `offchainComputing.JobStatusUpdated` Worker 已处理完任务，更新状态到 `Processed`

#### 删除已结束的任务，释放抵押的代币

任务的创建者发送交易 `offchainComputing.destroyJob(poolId, jobId)`
- `poolId` 填写 `101` 即刚才申请到的 PoolId
- `jobId` 填写 `1` 即刚才创建的任务的 Id

提交后可在 `Network -> Explorer` 页可看到事件：
- `offchainComputing.JobDestroyed`

同时账号因为该任务而锁定的代币会被释放
