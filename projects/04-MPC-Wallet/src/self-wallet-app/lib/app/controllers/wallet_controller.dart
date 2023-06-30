import 'dart:async';
import 'dart:convert';
import 'dart:isolate';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_isolate/flutter_isolate.dart';
import 'package:get/get.dart';
import 'package:hex/hex.dart';
import 'package:http/http.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/chat_collection.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/providers/rpc_providers.dart';
import 'package:sunrise/app/data/services/chat_service.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/core/utils/common.dart';
import 'package:sunrise/core/utils/encryption.dart';
import 'package:sunrise/core/values/hive_boxs.dart';
import 'package:local_auth/local_auth.dart';
import 'package:local_auth/error_codes.dart' as auth_error;
import 'package:web3dart/json_rpc.dart';
import 'package:web3dart/web3dart.dart';

import '../widgets/payment_widget.dart';

/// 处理全局的钱包数据
class WalletController extends GetxController {
  // 节点配置列表
  List<Mainnet> nodeConfigList = [];
  // token列表
  List<String> tokenList = [];
  // token配置列表
  List<Contract> tokenConfigList = [];
  // final RxString rxdata = RxString('0');
  // 账号列表
  final RxList<Balance> rxAccount = RxList<Balance>();
  // 联系人列表
  final RxList<ChatConversation> rxContacts = RxList<ChatConversation>();
  LocalAuthentication? auth;

  // 跟chat节点通讯的
  SendPort? sendPort;
  // 跟chat节点通讯命令
  Rx<Operation> rxOperation = Get.find<Rx<Operation>>();

  // 定时器
  Timer? timer;

  // final RxString rxdata = Get.find();
  @override
  void onInit() {
    initAppConfig();
    super.onInit();
    initChatIsolate();
    Get.put(rxAccount);
    Get.put(rxContacts);
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    FlutterIsolate.killAll();
    timer?.cancel();
    super.onClose();
  }

  // 初始化配置
  void initAppConfig() async {
    // 初始化钱包节点配置
    await _loadNodeNetwork();
    // 初始化token列表
    await _loadContract();
    await refreshAllBalance();

    // 判断是否为release模式
    if (kReleaseMode) {
      startRefreshBalance();
    }
  }

  // 加载evm的合约（erc20）
  Future<void> _loadContract() async {
// 查询数据库中的合约配置
    List<Contract>? contractList =
        await IsarService.isar?.contracts.where().findAll();
    print(contractList?.length);
    contractList = null;
    if (contractList != null && contractList.isNotEmpty) {
      tokenConfigList = contractList;
    } else {
      // 如果没有合约配置，从json文件读取网络配置
      // 读取json文件 assets/json/TokenList.json
      var tokensJson =
          await rootBundle.loadString("assets/json/TokenList.json");

      var tokenFileList = jsonDecode(tokensJson);

      await IsarService.isar?.writeTxn(() async {
        for (int i = 0; i < tokenFileList.length; i++) {
          Contract newContract = Contract.fromJson(tokenFileList[i]);
          await IsarService.isar?.contracts.put(newContract); // 将新数据写入到 Isar
          tokenConfigList.add(newContract);
          print("token contract id ${newContract.id}");
        }
      });
    }
  }

  /// 初始化加载节点网络
  Future<void> _loadNodeNetwork() async {
    // 查询数据库中的网络配置
    List<Mainnet>? mainnetList =
        await IsarService.isar?.mainnets.where().findAll();
    if (mainnetList != null && mainnetList.isNotEmpty) {
      nodeConfigList = mainnetList;
    } else {
      // 如果没有网络配置，从json文件读取网络配置
      // 读取json文件 assets/json/Network.json
      var networkJson = await rootBundle.loadString("assets/json/Network.json");
      var network = jsonDecode(networkJson);
      await IsarService.isar?.writeTxn(() async {
        // 使用同步的方式遍历network
        for (var key in network.keys) {
          Mainnet newMainnet = Mainnet.fromJson(network[key]);
          await IsarService.isar?.mainnets.put(newMainnet); // 将新数据写入到 Isar
          nodeConfigList.add(newMainnet);
          print("network id ${newMainnet.id}");
        }
      });
    }

    for (var element in nodeConfigList) {
      HiveService.saveNetworkRpc(element.chainId, element.rpc);
    }

    // final tempNodeString = nodeConfigList.map((e) => e.toJson());

    // 把nodeConfigList转成json字符串 并组成数组
    // final tempNodeMapList = nodeConfigList.map((e) => e.toJson()).toList();
    // HiveService.saveData(LocalKeyList.networkList, tempNodeMapList);
    // print("tempNodeString ${tempNodeMapList.length}");
  }

  // 批量获取账号余额
  Future<List<Balance>> batchBalances(String address, bool isProxy) async {
    final futures = nodeConfigList.map((config) async {
      print(config.rpc);
      BigInt? balance = await getEtherBalance(address, config.rpc);
      // 等一秒
      // await Future.delayed(Duration(seconds: 1));
      return Balance(
          address: address,
          chainId: config.chainId,
          isProxy: isProxy,
          balance: balance.toString())
        ..network.value = config;
    }).toList();

    final balances = await Future.wait(futures);
    return balances;
  }

  // 批量获取账号token余额
  Future<List<Balance>> batchTokenBalances(String address, bool isProxy) async {
    final futures = tokenConfigList.map((config) async {
      print(config.contractAddress);
      BigInt? balance = await getTokenBalance(
          tokenAddress: config.contractAddress,
          walletAddress: address,
          rpcUrl: _getRpcByChainId(config.chainId));

      // 根据chainId从nodeConfigList获取Mainnet
      Mainnet mainnet = nodeConfigList
          .firstWhere((element) => element.chainId == config.chainId);

      return Balance(
          address: address,
          chainId: config.chainId,
          isContract: true,
          isProxy: isProxy,
          contractAddress: config.contractAddress,
          contract: ContractEnum()
            ..contractAddress = config.contractAddress
            ..name = config.name
            ..symbol = config.symbol
            ..decimals = config.decimals
            ..chainId = config.chainId
            ..iconUrl = config.iconUrl,
          balance: balance.toString())
        ..network.value = mainnet;
    }).toList();

    final balances = await Future.wait(futures);
    return balances;
  }

  /// 初始化聊天线程
  Future<void> initChatIsolate({privateKey = ""}) async {
    try {
      var stored = HiveService.getData(ChatService.clientKey);
      debugPrint("stored: ${stored.toString()}");
      // 当有privateKey说明是新用户，需要重新生成clientKey
      if (stored != null || privateKey != "") {
        // FlutterIsolate.killAll();
        ReceivePort receivePort = ReceivePort();
        // 创建一个新线程
        await FlutterIsolate.spawn(
            ChatService.init, [privateKey, receivePort.sendPort]);
        _listenReceivePort(receivePort);
      }
    } catch (e) {
      debugPrint(e.toString());
    }
  }

  // 监听port
  void _listenReceivePort(ReceivePort receivePort) {
    receivePort.listen((message) {
      print("some message $message");
      // 判断message是否为SendPort
      if (message is SendPort) {
        sendPort = message;
        sendPort?.send('Hello from main thread!');
      } else if (message is Map<String, dynamic>) {
        Operation op = Operation.fromMap(message);
        print('Received message: ${op.type}');
        // 更新rxOperation
        rxOperation.value = op;
        // handleChatOperation(op);
      }
    });
  }

  // 根据chainId返回rpc
  String _getRpcByChainId(int chainId) {
    for (var config in nodeConfigList) {
      if (config.chainId == chainId) {
        return config.rpc;
      }
    }
    return "";
  }

  // 根据chainId返回ICON
  String _getIconByChainId(int chainId) {
    for (var config in nodeConfigList) {
      if (config.chainId == chainId) {
        return config.iconUrl;
      }
    }
    return "";
  }

  // 一个get bool变量根据参数element2和element返回true或false
  bool _getBool(element2, element) {
    return element2.chainId == element.chainId &&
        element2.isContract == element.isContract &&
        element2.contractAddress == element.contractAddress;
  }

  // 刷新单个账号余额
  Future<List<Balance>> refreshSingleBalance(String address,
      {bool isProxy = false}) async {
    // 查询主币余额
    List<Balance> tempMainBalance = await batchBalances(address, isProxy);
    // 查询token余额
    List<Balance> tempTokenBalance = await batchTokenBalances(address, isProxy);
    List<Balance> tempBalance = tempMainBalance + tempTokenBalance;

    List<Balance> localBalanceList = await IsarService.isar?.balances
            .filter()
            .addressEqualTo(address)
            .findAll() ??
        [];

    // 获取localBalanceList和tempBalance的交集
    List<Balance> intersection = localBalanceList
        .where((element) =>
            tempBalance.any((element2) => _getBool(element2, element)))
        .toList();

    // 获取localBalanceList和tempBalance的差集（localBalanceList有，tempBalance没有）
    List<Balance> difference = localBalanceList
        .where((element) =>
            !tempBalance.any((element2) => _getBool(element2, element)))
        .toList();

    // 获取tempBalance和localBalanceList的差集（tempBalance有，localBalanceList没有）
    List<Balance> difference2 = tempBalance
        .where((element) =>
            !localBalanceList.any((element2) => _getBool(element2, element)))
        .toList();

    print("交集 ${intersection} 差集 ${difference} 差集2 ${difference2}");

    await IsarService.isar?.writeTxn(() async {
      // 更新交集部分余额
      for (Balance element in intersection) {
        // 如果余额不一样，更新余额
        try {
          if (element.balance !=
              tempBalance
                  .firstWhere((element2) => element2.chainId == element.chainId)
                  .balance) {
            element.balance = tempBalance
                .firstWhere((element2) => element2.chainId == element.chainId)
                .balance;
            // 更新余额
            await IsarService.isar?.balances.put(element);
            await element.network.save();
            print("更新余额");
          }
        } catch (e) {
          print(e);
        }
      }

      // 遍历localBalanceList多出来的差集部分，删除数据
      for (Balance element in difference) {
        await IsarService.isar?.balances.delete(element.id);
      }

      // 遍历tempBalance多出来的差集部分，添加到数据库
      for (Balance element in difference2) {
        try {
          element.balance = tempBalance
              .firstWhere((element2) => element2.chainId == element.chainId)
              .balance;
          // 更新余额
          await IsarService.isar?.balances.put(element);
          await element.network.save();
          print("添加余额记录");
        } catch (e) {
          print(e);
        }
      }
    });

    print("tempBalance $tempBalance");
    print("localBalanceList $localBalanceList");
    return tempBalance;
  }

  // 刷新所有账号余额
  Future<void> refreshAllBalance() async {
    print("refresh all account balance");
    List<Balance> balances = [];

    // 读取root账号
    var _rootAccount = HiveService.getWalletData(LocalKeyList.rootAddress);
    if (_rootAccount == null) {
      return;
    }

    RootAccount rootAccount =
        RootAccount.fromJson(Map<String, dynamic>.from(_rootAccount));
    List<String> addressList = [
      rootAccount.address,
      ...rootAccount.proxyAddressList
    ];

    print("addressList $addressList");
    // 先从数据库读取余额
    List<Balance> tempList = [];
    for (var address in addressList) {
      final temp = await IsarService.isar?.balances
              .filter()
              .addressEqualTo(address)
              .findAll() ??
          [];
      tempList.addAll(temp);
    }
    rxAccount.value = tempList;

    for (var address in addressList) {
      final temp = await refreshSingleBalance(address,
          isProxy: address != rootAccount.address);
      balances.addAll(temp);
    }

    // 更新账号余额
    rxAccount.value = balances;
    print("refresh all account balance end");
    update();
  }

  // 设置一个定时器30秒刷新一次余额
  void startRefreshBalance() {
    print("start refresh balance");
    if (timer != null) {
      timer?.cancel();
    }
    timer = Timer.periodic(const Duration(seconds: 30), (timer) async {
      print("定时器刷新余额");
      await refreshAllBalance();
    });
  }

  /// 生物识别状态
  Future<bool> authenticate() async {
    auth ??= LocalAuthentication();
    bool authenticated = false;
    try {
      authenticated = await auth?.authenticate(
            localizedReason: GetPlatform.isIOS ? '生物识别以进行身份验证' : '扫描指纹以进行身份验证',
            // options: const AuthenticationOptions(biometricOnly: true)
          ) ??
          false;
    } on PlatformException catch (e) {
      if (e.code == auth_error.notEnrolled) {
        // Add handling of no hardware here.
      } else if (e.code == auth_error.lockedOut ||
          e.code == auth_error.permanentlyLockedOut) {
        // ...
      } else {
        // ...
      }
    }

    print("faceId $authenticated");
    return authenticated;
  }

  /// 设定生物支付
  /// [privateKey] 私钥
  Future<bool> setAuthenticate(String privateKey) async {
    bool authenticated = await authenticate();

    print("faceId $authenticated");
    if (authenticated) {
      // 生成一个随机的key用来加密私钥
      final key = generateRandomString();

      String encryptedKey = encryptAES(privateKey, key);
      print("encryptedKey $encryptedKey ${encryptedKey.length}");
      // 保存生物识别key
      await HiveService.saveWalletData(LocalKeyList.biometrics, key);
      // 保存加密后的私钥
      await HiveService.saveWalletData(
          '${LocalKeyList.biometrics}_private', encryptedKey);
    }

    return authenticated;
  }

  /// 识别生物认证获取私钥
  Future<String?> getAuthenticate() async {
    bool authenticated = await authenticate();

    print("faceId $authenticated");
    if (authenticated) {
      // 读取生物识别key
      final key = HiveService.getWalletData(LocalKeyList.biometrics);
      if (key == null) {
        return null;
      }
      // 读取加密后的私钥
      final encryptedKey =
          HiveService.getWalletData('${LocalKeyList.biometrics}_private');
      if (encryptedKey == null) {
        return null;
      }
      // 解密私钥
      String privateKey = decryptAES(encryptedKey, key);
      return privateKey;
    }

    return null;
  }

  /// 免密支付 生成一个随机的key用来加密私钥
  /// [privateKey] 私钥
  Future<bool> setFreeAuthenticate(String privateKey) async {
    // 生成一个随机的key用来加密私钥
    final key = generateRandomString();

    String encryptedKey = encryptAES(privateKey, key);
    print("encryptedKey $encryptedKey ${encryptedKey.length}");
    // 保存生物识别key
    await HiveService.saveWalletData(LocalKeyList.noPassword, key);
    // 保存加密后的私钥
    await HiveService.saveWalletData(
        '${LocalKeyList.noPassword}_private', encryptedKey);

    return true;
  }

  /// 免密支付 读取加密后的私钥
  Future<String?> getFreeAuthenticate() async {
    // 读取生物识别key
    final key = HiveService.getWalletData(LocalKeyList.noPassword);
    if (key == null) {
      return null;
    }
    // 读取加密后的私钥
    final encryptedKey =
        HiveService.getWalletData('${LocalKeyList.noPassword}_private');
    if (encryptedKey == null) {
      return null;
    }
    // 解密私钥
    String privateKey = decryptAES(encryptedKey, key);
    return privateKey;
  }

  /// 调起订单确认弹窗
  Future<bool> showConfirmDialog() async {
    await Get.bottomSheet(
      PaymentWidget(
        networkId: 1,
        type: 0,
      ),
      backgroundColor: const Color(0xFF0a0a0a),
      barrierColor: Colors.black.withOpacity(0.5),
    );

    return true;
  }

  void testsomething() async {
    print("test something");
    try {
      // final newMainnet = Mainnet(
      //   chainName: "VDX",
      //   rpc: "http://vdxchain-dev-rpc.xlipfs.com:8083",
      //   chainId: 1281,
      //   explorer: "http://vdxchain-dev-blockscout.xlipfs.com:8083/",
      //   chainColor: "#000000",
      //   iconUrl: "https://www.subdev.studio/icon/eth.svg",
      //   shortName: "vdx",
      //   nativeCurrencyName: "VDX",
      //   nativeCurrencySymbol: "VDX",
      //   nativeCurrencyDecimals: 18,
      //   isTestnet: false,
      // );

      // await isarTest?.writeTxn(() async {
      //   await isarTest?.mainnets.put(newMainnet); // 将新用户数据写入到 Isar
      // });

      // print(newMainnet.id);

      // List<Mainnet>? existingUser =
      //     await IsarService.isar?.mainnets.where().findAll(); // 通过 Id 读取用户数据

      // print(existingUser?.length);

      // _loadNodeNetwork();

      // final baseUrl = dotenv.env['BASE_URL'];
      // print(baseUrl);
      // List<String>? result =
      //     await Server.getUser("0xe0de685670e887744b6964dbf02981ef3afc4dca");
      // print(result);

      // List<Balance> localBalanceList =
      //     await IsarService.isar?.balances.where().findAll() ?? [];
      // print(localBalanceList);
      // // 清空balances数据库
      // await IsarService.isar?.writeTxn(() async {
      //   for (Balance element in localBalanceList) {
      //     await IsarService.isar?.balances.delete(element.id);
      //   }
      // });

      // refreshAllBalance();
      // await IsarService.isar?.writeTxn(() async {
      //   final success =
      //       await IsarService.isar?.mainnets.delete(4); // 通过 Id 删除指定用户
      //   await IsarService.isar?.mainnets.delete(5);
      //   print('We deleted $success');
      // });
      // setAuthenticate('123');
      // showConfirmDialog();
      // await IsarService.isar?.writeTxn(() async {
      //   // await IsarService.isar?.contracts.clear();
      //   // await IsarService.isar?.mainnets.clear();
      //   List<Contract>? contractList =
      //       await IsarService.isar?.contracts.where().findAll();
      //   print(contractList?.length);
      //   Map<String, dynamic>? result = await readJsonFile(
      //       "https://www.subdev.studio/config/wallet_tokens.json");
      //   print(result);
      //   print(result?["tokens"]);

      //   for (var element in result?["tokens"]) {
      //     Contract newContract = Contract.fromJson(element);
      //     print(newContract.contractAddress);
      //     // 如果重复就删掉重复的
      //     List<Contract>? existingContract = await IsarService.isar?.contracts
      //         .filter()
      //         .contractAddressEqualTo(newContract.contractAddress)
      //         .findAll();
      //     print(existingContract?.length);
      //     if (existingContract != null) {
      //       List<int> ids = existingContract.map((e) => e.id).toList();
      //       await IsarService.isar?.contracts.deleteAll(ids);
      //     }
      //     await IsarService.isar?.contracts.put(newContract); // 将新数据写入到 Isar
      //   }

      //   List<dynamic> result1 = await readJsonFile(
      //           "https://www.subdev.studio/config/swap_network.json") ??
      //       [];

      //   print(result1);
      //   for (var element in result1) {
      //     Mainnet newMainnet = Mainnet.fromJson(element);
      //     print(newMainnet.chainId);
      //     // 判断chainId是否在IsarService.isar?.mainnets中
      //     Mainnet? existingMainnet = await IsarService.isar?.mainnets
      //         .filter()
      //         .chainIdEqualTo(newMainnet.chainId)
      //         .findFirst();
      //     print(existingMainnet?.toJson());
      //     // if (existingMainnet == null) {
      //     //   await IsarService.isar?.mainnets.put(newMainnet); // 将新数据写入到 Isar
      //     // }
      //   }
      // });
      // // return;

      // final abi = [
      //   {
      //     "constant": false,
      //     "inputs": [
      //       {
      //         "internalType": "uint256",
      //         "name": "amount0Out",
      //         "type": "uint256"
      //       },
      //       {
      //         "internalType": "uint256",
      //         "name": "amount1Out",
      //         "type": "uint256"
      //       },
      //       {"internalType": "address", "name": "to", "type": "address"},
      //       {"internalType": "bytes", "name": "data", "type": "bytes"}
      //     ],
      //     "name": "swap",
      //     "outputs": [],
      //     "payable": false,
      //     "stateMutability": "nonpayable",
      //     "type": "function"
      //   },
      //   {
      //     "inputs": [],
      //     "name": "getReserves",
      //     "outputs": [
      //       {"internalType": "uint112", "name": "_reserve0", "type": "uint112"},
      //       {"internalType": "uint112", "name": "_reserve1", "type": "uint112"},
      //       {
      //         "internalType": "uint32",
      //         "name": "_blockTimestampLast",
      //         "type": "uint32"
      //       }
      //     ],
      //     "stateMutability": "view",
      //     "type": "function"
      //   }
      // ];
      // const routerAbi = [
      //   {
      //     "inputs": [
      //       {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
      //       {
      //         "internalType": "uint256",
      //         "name": "amountOutMin",
      //         "type": "uint256"
      //       },
      //       {"internalType": "address[]", "name": "path", "type": "address[]"},
      //       {"internalType": "address", "name": "to", "type": "address"},
      //       {"internalType": "uint256", "name": "deadline", "type": "uint256"}
      //     ],
      //     "name": "swapExactTokensForTokens",
      //     "outputs": [
      //       {
      //         "internalType": "uint256[]",
      //         "name": "amounts",
      //         "type": "uint256[]"
      //       }
      //     ],
      //     "stateMutability": "nonpayable",
      //     "type": "function"
      //   }
      // ];
      // final httpClient = Client();
      // final ethClient =
      //     Web3Client('https://rpc.api.moonbase.moonbeam.network', httpClient);
      // // print(object)
      // final contractAddress =
      //     EthereumAddress.fromHex('0x083b71bF4FAb1A361E6d439DfADF379129Ce152d');
      // final routerContractAddress =
      //     EthereumAddress.fromHex('0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4');
      // final contract = DeployedContract(
      //     ContractAbi.fromJson(jsonEncode(abi), 'UniswapV2Pair'),
      //     contractAddress);
      // final routerContract = DeployedContract(
      //     ContractAbi.fromJson(jsonEncode(routerAbi), 'UniswapV2Router02'),
      //     routerContractAddress);
      // // return;
      // final addressResult = await ethClient.call(
      //     contract: contract,
      //     function: contract.function('getReserves'),
      //     params: []);

      // final reserves = contract.function('getReserves').encodeCall([]);
      // print(reserves);
      // print(addressResult);
      // final reserveIn = BigInt.parse(addressResult[0].toString());
      // final reserveOut = BigInt.parse(addressResult[1].toString());

      // const privateKety =
      //     "0xc54b1b200172a573ef429671483fb71bea4e3e2e3b98c736e5acb47b4cddda47";

      // // dubdev 0x8d81a3dcd17030cd5f23ac7370e4efb10d2b3ca4
      // // tusdt 0xcc4c41415fc68b2fbf70102742a83cde435e0ca7
      // final credentials = EthPrivateKey.fromHex(privateKety);

      // print('Reserve in: $reserveIn');
      // print('Reserve out: $reserveOut');

      // final amountIn = BigInt.from(1) * BigInt.from(10).pow(18);
      // final amountOutMin = BigInt.from(9.96974) * BigInt.from(10).pow(18);

      // final fee = 0.003;

      // final amountOut =
      //     amountIn * reserveOut / (reserveIn + amountIn) * (1 - fee);
      // print("Amount in: $amountIn"); // 1000000000000000000
      // print(
      //     'Amount out: $amountOut ${BigInt.from(amountOut)}'); // 996963165859174144

      // return;
      // final path = [
      //   EthereumAddress.fromHex(
      //       '0x8d81a3dcd17030cd5f23ac7370e4efb10d2b3ca4'), // WETH
      //   EthereumAddress.fromHex(
      //       '0xcc4c41415fc68b2fbf70102742a83cde435e0ca7') // DAI
      // ];
      // final to =
      //     EthereumAddress.fromHex('0xa1eD666D1125b8D606C44cf573B75127E257EB31');
      // final deadline = DateTime.now().millisecondsSinceEpoch ~/ 1000 + 60 * 20;

      // final function = routerContract.function('swapExactTokensForTokens');
      // final tx = Transaction.callContract(
      //   contract: routerContract,
      //   function: function,
      //   parameters: [amountIn, amountOutMin, path, to, BigInt.from(deadline)],
      //   // maxGas: 1000000,
      //   // gasPrice: EtherAmount.inWei(BigInt.one),
      // );
      // print("so tx is ${HEX.encode(tx.data!)}");
      // final signedTx = await ethClient.signTransaction(credentials, tx, chainId: 1287);
      // final txHash =
      //     await ethClient.sendTransaction(credentials, tx, chainId: 1287);

      // print('Transaction hash: $txHash');

      // final httpClient = Client();
      // Web3Client ethClient = Web3Client(
      //     'https://rpc-mumbai.maticvigil.com/v1/b8ad974a05bb017a5da09dc548e6a75a837648db',
      //     httpClient);
      // ethClient.addedBlocks().listen((event) {
      //   print("block added $event");
      // });
      EasyLoading.showSuccess("敬请期待");
    } catch (e) {
      print(e);
    }
  }
}
