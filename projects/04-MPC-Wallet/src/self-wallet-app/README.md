# Self Wallet

实现“MPC+Eip-4337+Uniswap+Web3社交”的产品形态，实现创建账户简单号管理、交易便捷安全公平无门槛、社交隐私安全有保障，达到降低用户进入Web3的门槛的目的。

## APP下载地址
[官网下载](https://www.subdev.studio/)

### 钱包功能演示视频
[演示链接](https://drive.google.com/file/d/1H1ZRuZaInE3N9sauNa5Lgr4OKGQ1I4Qb/view?usp=sharing)

### 截图
#### 首页
![](images/home.png)

#### 兑换池
![](images/swap.png)

#### 个人中心
![](images/profile.png)

## 实现功能

- [x] 账号
  - [x] MPC账号创建
  - [x] 4337合约账号创建
  - [ ] 账号找回
- [x] 钱包
  - [x] EOA转账
  - [x] 4337转账
  - [x] uniswap兑换功能
  - [x] 简单的资产管理
  - [ ] 自定义节点
  - [ ] NFT
  - [ ] 多链4337转账
- [x] WEB3社交
  - [x] 加密聊天
  - [ ] 社区
- [x] 用户
  - [x] 登录/注册
  - [ ] 地址本



## 开始

在开始之前，你需要安装 Flutter 开发环境。请参考 [Flutter 官方文档](https://flutter.dev/docs/get-started/install) 安装 Flutter。


### 安装依赖

在获取代码之后，你需要安装项目的依赖。你可以使用以下命令安装依赖：

```bash
cd self-wallet-app
flutter pub get
```

### 运行应用程序

在安装依赖之后，你可以使用以下命令运行应用程序：

```bash
flutter run
```

这将会启动一个模拟器或连接到你的设备，并在其中运行应用程序。

## 配置

在运行应用程序之前，你需要配置一些参数。你可以在 `.env` 文件中配置这些参数。以下是一个示例 `.env` 文件：

```dotenv
NFT_STORAGE_API_SECRET=YOUR_NFT_STORAGE_API_SECRET
BASE_URL=YOUR_SERVER_BASE_URL
ENTRY_POINT_ADDRESS=0x14898a577436d45911F63576CF68645965DBf95d
BENEFICIARY_ADDRESS=0x4759e94177AD2DcCa42AC05f83054CCF655b0785
SWAP_ROUTER_ADDRESS=0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4
SWAP_FACTORY_ADDRESS=0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4
```

在这个例子中，我们定义了以下参数：
- `NFT_STORAGE_API_SECRET`: 
- `BASE_URL`：服务器的基本 URL
- `ENTRY_POINT_ADDRESS`：4337入口点合约的地址
- `BENEFICIARY_ADDRESS`：受益人地址
- `SWAP_ROUTER_ADDRESS`：uniswap_v2路由器合约的地址
- `SWAP_FACTORY_ADDRESS`：uniswap_v2工厂合约的地址

你需要根据你的应用程序需求修改这些参数。

