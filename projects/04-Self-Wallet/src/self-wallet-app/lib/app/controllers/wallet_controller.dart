import 'dart:async';
import 'dart:convert';
import 'dart:isolate';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_isolate/flutter_isolate.dart';
import 'package:get/get.dart';
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

import '../widgets/payment_widget.dart';

/// 处理全局的钱包数据
class WalletController extends GetxController {
  // 节点配置列表
  List<Mainnet> nodeConfigList = [];

  // token配置列表
  List<Contract> tokenConfigList = [];
  // final RxString rxdata = RxString('0');
  // 账号列表
  final RxList<Balance> rxAccount = RxList<Balance>();
  final RxBool refreshList = RxBool(false);
  // 联系人列表
  final RxList<ChatConversation> rxContacts = RxList<ChatConversation>();
  LocalAuthentication? auth;
  // 核心账号
  RootAccount? rootAccount;

  // 跟chat节点通讯的
  SendPort? sendPort;
  // 跟chat节点通讯命令
  Rx<Operation> rxOperation = Get.find<Rx<Operation>>();

  // 定时器
  Timer? timer;
  // 线程
  FlutterIsolate? isolate;

  // final RxString rxdata = Get.find();
  @override
  void onInit() {
    _initStart();
    super.onInit();
    initChatIsolate();
    Get.put(rxAccount);
    Get.put(refreshList);
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

  Future<void> _initStart() async {
    await initAppConfig();
    refreshAllBalance();
  }

  // 初始化配置
  Future<void> initAppConfig() async {
    // 初始化钱包节点配置
    await _loadNodeNetwork();
    // 初始化token列表
    await _loadContract();
    // 读取root账号
    var rootAccountMap = HiveService.getWalletData(LocalKeyList.rootAddress);
    if (rootAccountMap == null) {
      return;
    }
    rootAccount =
        RootAccount.fromJson(Map<String, dynamic>.from(rootAccountMap));

    // 判断是否为release模式
    if (kReleaseMode) {
      startRefreshBalance();
    }
  }

  // 移除没用到的balance
  Future<void> removeBalance() async {
    if (rootAccount == null) {
      return;
    }

    List<String> addressList = [
      rootAccount!.address,
      ...rootAccount!.proxyAddressList
    ];

    // // 初始化钱包节点配置
    // await _loadNodeNetwork();
    // // 初始化token列表
    // await _loadContract();

    print("addressList $addressList");
    bool isProxy = true;
    List<Contract> configTokens = [];

    for (var token in tokenConfigList) {
      if (token.proxy == isProxy) {
        configTokens.add(token);
      }
    }

    List<Balance> balances = [];

    final futures0 = tokenConfigList.map((config) async {
      // 根据chainId从nodeConfigList获取Mainnet
      Mainnet? mainnet = nodeConfigList
          .firstWhereOrNull((element) => element.chainId == config.chainId);

      return Balance(
          address: rootAccount!.address,
          chainId: config.chainId,
          isContract: true,
          isProxy: false,
          contractAddress: config.contractAddress,
          contract: ContractEnum()
            ..contractAddress = config.contractAddress
            ..name = config.name
            ..symbol = config.symbol
            ..decimals = config.decimals
            ..chainId = config.chainId
            ..iconUrl = config.iconUrl,
          balance: '0')
        ..network.value = mainnet;
    }).toList();

    final futures1 = nodeConfigList.map((config) async {
      print(config.toJson());
      return Balance(
          address: rootAccount!.address,
          chainId: config.chainId,
          isProxy: false,
          isContract: false,
          balance: '0')
        ..network.value = config;
    }).toList();

    balances.addAll(await Future.wait(futures0));
    balances.addAll(await Future.wait(futures1));
    if (rootAccount!.proxyAddressList.isNotEmpty) {
      String address = addressList[1];
      final futures2 = configTokens.map((config) async {
        // 根据chainId从nodeConfigList获取Mainnet
        Mainnet? mainnet = nodeConfigList
            .firstWhereOrNull((element) => element.chainId == config.chainId);

        return Balance(
            address: address,
            chainId: config.chainId,
            isContract: true,
            isProxy: true,
            contractAddress: config.contractAddress,
            contract: ContractEnum()
              ..contractAddress = config.contractAddress
              ..name = config.name
              ..symbol = config.symbol
              ..decimals = config.decimals
              ..chainId = config.chainId
              ..iconUrl = config.iconUrl,
            balance: '0')
          ..network.value = mainnet;
      }).toList();
      balances.addAll(await Future.wait(futures2));
    }

    for (var element in balances) {
      print(
          "${element.address} 👉 balance ${element.balance} [${element.contractAddress} ${element.toSelected()}]");
    }
    print("balances ${balances.length}");

    await IsarService.isar?.writeTxn(() async {
      // 清空所有
      await IsarService.isar?.balances.clear();
      // 保存balances
      await IsarService.isar?.balances.putAll(balances);
      for (var item in balances) {
        await item.network.save();
      }
    });
  }

  /// 加载evm的合约（erc20）
  ///
  /// 1. 从网络中加载
  /// 2. 从数据库中获取 如果数据库为空就把网络配置插入到数据库
  Future<void> _loadContract() async {
    // 从网络中加载
    Map<String, dynamic>? result = await readJsonFile(
        "https://www.subdev.studio/config/wallet_tokens.json");

    List<Contract> tokens = [];
    if (result != null) {
      for (var element in result["tokens"]) {
        Contract newContract = Contract.fromJson(element);
        Mainnet? net = nodeConfigList
            .firstWhereOrNull((n) => newContract.chainId == n.chainId);
        if (net == null) {
          continue;
        }
        tokens.add(newContract);
      }
    }

    bool reset = false;

    // 查询数据库中的合约配置
    List<Contract>? contractList = await IsarService.isar?.contracts
        .filter()
        .enabledEqualTo(true)
        .findAll();

    // if (contractList == null || contractList.length < tokens.length) {
    //   reset = true;
    // }

    if (contractList != null && contractList.isNotEmpty && !reset) {
      tokenConfigList = contractList;
      print("come in");
    } else if (tokens.isEmpty) {
      // 如果没有合约配置，从json文件读取网络配置
      // 读取json文件 assets/json/TokenList.json
      var tokensJson =
          await rootBundle.loadString("assets/json/TokenList.json");

      var tokenFileList = jsonDecode(tokensJson);

      await IsarService.isar?.writeTxn(() async {
        // 重置网络
        await IsarService.isar?.contracts.clear();
        for (int i = 0; i < tokenFileList.length; i++) {
          Contract newContract = Contract.fromJson(tokenFileList[i]);
          await IsarService.isar?.contracts.put(newContract); // 将新数据写入到 Isar
          // tokenConfigList.add(newContract);
          print("token contract id ${newContract.id}");
        }
      });
    } else {
      print("reset tokens");
      // token添加到数据库
      await IsarService.isar?.writeTxn(() async {
        // 重置网络
        await IsarService.isar?.contracts.clear();
        // 使用同步的方式遍历network
        for (var element in tokens) {
          await IsarService.isar?.contracts.put(element);
        }

        // tokenConfigList = await IsarService.isar?.contracts
        //         .filter()
        //         .enabledEqualTo(true)
        //         .findAll() ??
        //     [];
      });
    }

    tokenConfigList = await IsarService.isar?.contracts
            .filter()
            .enabledEqualTo(true)
            .findAll() ??
        [];
    print("tokenConfigList ==== ${tokenConfigList}");
  }

  /// 初始化加载节点网络
  Future<void> _loadNodeNetwork() async {
    // 从网络中加载
    List<dynamic> result = await readJsonFile(
            "https://www.subdev.studio/config/swap_network.json") ??
        [];

    print(result);
    List<Mainnet> configList = [];
    // 遍历result
    for (int i = 0; i < result.length; i++) {
      Mainnet newMainnet = Mainnet.fromJson(result[i]);
      configList.add(newMainnet);
    }

    // 查询数据库中的网络配置
    List<Mainnet>? mainnetList =
        await IsarService.isar?.mainnets.where().findAll();

    print("数量相等 ${mainnetList?.length} ${result.length}");

    bool reset = false;
    if (mainnetList == null || mainnetList.length < result.length) {
      print("数量不相等");
      reset = true;
    }
    if (mainnetList != null && mainnetList.isNotEmpty && !reset) {
      nodeConfigList = mainnetList;
    } else if (configList.isEmpty) {
      // 如果没有网络配置，从json文件读取网络配置
      // 读取json文件 assets/json/Network.json
      var networkJson = await rootBundle.loadString("assets/json/Network.json");
      var network = jsonDecode(networkJson);
      print(network);
      await IsarService.isar?.writeTxn(() async {
        // 重置网络
        await IsarService.isar?.mainnets.clear();
        // 使用同步的方式遍历network
        for (var element in network) {
          Mainnet newMainnet = Mainnet.fromJson(element);
          await IsarService.isar?.mainnets.put(newMainnet);
          nodeConfigList.add(newMainnet);
        }
      });
      // await IsarService.isar?.writeTxn(() async {
      //   // 使用同步的方式遍历network
      //   for (var key in network) {
      //     Mainnet newMainnet = Mainnet.fromJson(network[key]);
      //     await IsarService.isar?.mainnets.put(newMainnet); // 将新数据写入到 Isar
      //     nodeConfigList.add(newMainnet);
      //   }
      // });
    } else {
      await IsarService.isar?.writeTxn(() async {
        // 重置网络
        await IsarService.isar?.mainnets.clear();
        // 使用同步的方式遍历network
        for (var element in configList) {
          await IsarService.isar?.mainnets.put(element);
        }
        nodeConfigList = configList;
      });
    }

    for (var element in nodeConfigList) {
      HiveService.saveNetworkRpc(element.chainId, element.rpc);
    }
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
    List<Contract> configTokens = [];
    if (isProxy) {
      for (var token in tokenConfigList) {
        if (token.proxy == isProxy) {
          configTokens.add(token);
        }
      }
    } else {
      configTokens = tokenConfigList;
    }

    print(configTokens);

    final futures = configTokens.map((config) async {
      print(config.contractAddress);
      BigInt? balance = await getTokenBalance(
          tokenAddress: config.contractAddress,
          walletAddress: address,
          rpcUrl: _getRpcByChainId(config.chainId));

      print("👉= $address ${config.contractAddress} tempTokenBalance $balance");

      // 根据chainId从nodeConfigList获取Mainnet
      Mainnet? mainnet = nodeConfigList
          .firstWhereOrNull((element) => element.chainId == config.chainId);

      print("tempTokenBalance $balance");

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
      print("💻 initChatIsolate");
      if (isolate != null) {
        isolate?.kill();
      }
      var stored = HiveService.getData("xmtp-client-key");
      debugPrint("stored: ${stored.toString()}");
      // 当有privateKey说明是新用户，需要重新生成clientKey
      if (stored != null || privateKey != "") {
        // FlutterIsolate.killAll();
        ReceivePort receivePort = ReceivePort();
        if (ChatService.init != null && receivePort != null) {
          // 创建一个新线程
          isolate = await FlutterIsolate.spawn(
              ChatService.init, [privateKey, receivePort.sendPort]);
          _listenReceivePort(receivePort);
        } else {
          print("参数错误");
        }
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

  // 一个get bool变量根据参数element2和element返回true或false
  bool _getBool(element2, element) {
    return element2.chainId == element.chainId &&
        element2.isContract == element.isContract &&
        element2.contractAddress == element.contractAddress;
  }

  /// 刷新Balance的余额
  ///
  /// 返回更新后的Balance
  Future<String> refreshBalance(Balance current) async {
    String tempBalance = current.balance;
    try {
      if (current.isContract && current.contractAddress != null) {
        BigInt? balance = await getTokenBalance(
            tokenAddress: current.contractAddress!,
            walletAddress: current.address,
            rpcUrl: _getRpcByChainId(current.chainId));

        print("👉debug $balance");
        tempBalance = balance.toString();
      } else {
        BigInt? balance = await getEtherBalance(
            current.address, _getRpcByChainId(current.chainId));

        print("👉debug $balance");

        tempBalance = balance.toString();
      }

      if (current.balance != tempBalance) {
        // current.balance = tempBalance;
        // await IsarService.isar?.balances.put(current);
        // 更新数据库
        // await current.network.save();
        // print("余额更新完毕 ${current.id} ${current.balance}");
      }

      return tempBalance;
    } catch (e) {
      print(e);
      return tempBalance;
    }
  }

  /// 刷新单个账号的主币余额和token余额
  Future<List<Balance>> refreshSingleBalance(String address,
      {bool isProxy = false}) async {
    // 查询主币余额
    List<Balance> tempMainBalance = await batchBalances(address, isProxy);
    // 查询token余额
    List<Balance> tempTokenBalance = await batchTokenBalances(address, isProxy);

    // 合并tempMainBalance和tempTokenBalance
    List<Balance> tempBalance = tempMainBalance + tempTokenBalance;

    // 打印长度
    print(
        "👉 tempBalance.length: ${tempBalance.length} tempMainBalance: ${tempMainBalance.length} tempTokenBalance: ${tempTokenBalance.length}");

    List<Balance> localBalanceList = [];

    if (isProxy) {
      localBalanceList = await IsarService.isar?.balances
              .filter()
              .addressEqualTo(address)
              .isProxyEqualTo(isProxy)
              .findAll() ??
          [];
    } else {
      localBalanceList = await IsarService.isar?.balances
              .filter()
              .addressEqualTo(address)
              .findAll() ??
          [];
    }

    // 遍历tempTokenBalance
    // for (var element in tempTokenBalance) {
    //   print(
    //       "👉= localBalanceList start: ${element.address} ${element.contractAddress} ${element.balance} ${element.chainId} contract-${element.isContract}");
    // }

    // 获取localBalanceList和tempBalance的交集
    List<Balance> intersection = localBalanceList
        .where((element) =>
            tempBalance.any((element2) => _getBool(element2, element)))
        .toList();

    // 获取localBalanceList和tempBalance的差集（localBalanceList有，tempBalance没有）
    List<Balance> difference = localBalanceList
        .where((element) =>
            !tempBalance.any((element2) => !_getBool(element2, element)))
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
          // 当前余额
          final currentBalance = tempBalance
              .firstWhere((element2) =>
                  element2.chainId == element.chainId &&
                  element2.isContract == element.isContract &&
                  element2.contractAddress == element.contractAddress)
              .balance;
          print(
              "👉debug balance ${element.id} ${element.contractAddress} $currentBalance");
          // 数据库余额跟当前余额比对 如果不等就更新余额
          if (element.balance != currentBalance) {
            print(
                "👉debug balance change balance ${element.id} $currentBalance");
            element.balance = currentBalance;
            // 更新余额
            await IsarService.isar?.balances.put(element);
            await element.network.save();
          }
        } catch (e) {
          print(e);
        }
      }

      // 遍历localBalanceList多出来的差集部分，删除多余的数据
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

    return tempBalance;
  }

  /// 刷新所有账号余额
  ///
  /// 1. 获取root账号
  /// 2. 获取root账号的proxy账号
  /// 3. 获取root账号和proxy账号的余额 先把数据库中已有的余额读取出来，然后获取新的余额，更新余额
  Future<void> refreshAllBalance() async {
    print("refresh all account balance");
    List<Balance> tempList =
        await IsarService.isar?.balances.where().findAll() ?? [];
    if (tempList.isEmpty) {
      await removeBalance();
      tempList = await IsarService.isar?.balances.where().findAll() ?? [];
    }

    // List<Balance> tempList =
    //     await IsarService.isar?.balances.where().findAll() ?? [];
    rxAccount.value = tempList;
    refreshList.value = false;

    await IsarService.isar?.writeTxn(() async {
      for (var element in tempList) {
        try {
          final tempBalance = await refreshBalance(element.copyWith());
          if (tempBalance != element.balance) {
            print("余额 ${element.balance} $tempBalance");
            element.balance = tempBalance;
            // 更新余额
            await IsarService.isar?.balances.put(element.copyWith());
            await element.network.save();
          }
        } catch (e) {
          debugPrint(e.toString());
        }
      }
    });

    // await IsarService.isar?.writeTxn(() async {
    //   await IsarService.isar?.balances.putAll(tempList);
    // });
    // await IsarService.isar?.writeTxn(() async {
    //   // 更新余额
    //   for (var i = 0; i < tempList.length; i++) {
    //     try {
    //       final recipe = await IsarService.isar?.balances.get(tempList[i].id);
    //       await IsarService.isar?.balances.put(recipe!);
    //       // final tempBalance = await refreshBalance(tempList[i]);
    //       // refreshList.value = true;
    //       // try {
    //       //   refreshList.value = true;
    //       //   print("余额2 ${tempBalance} ${tempList[i].balance}");
    //       // if (tempBalance != tempList[i].balance) {
    //       print("余额 ${tempList[i].address} ${tempList[i].balance}");
    //       //   tempList[i].balance = tempBalance;
    //       //   // rxAccount.value = tempList;
    //       // }

    //       //   // rxAccount.value = tempList;
    //       // } catch (e) {
    //       //   continue;
    //       // }
    //     } catch (e) {
    //       print(e);
    //     }
    //   }
    //   // await IsarService.isar?.balances.clear();
    //   // await IsarService.isar?.balances.putAll(tempList);
    // });

    rxAccount.value = tempList;

    refreshList.value = true;

    print("refresh all account balance end");
    update();
  }

  void testList() async {
    List<Balance> tempList =
        await IsarService.isar?.balances.where().findAll() ?? [];
    for (var element in tempList) {
      try {
        print("余额 ${element.networkName}");
        // final tempBalance = await refreshBalance(element.copyWith());
        // final tempBalance = '10';
        // if (tempBalance != element.balance) {
        //   print("余额 ${element.balance} $tempBalance");
        //   element.balance = '10';

        //   // 更新余额
        //   // await IsarService.isar?.balances.delete(element.id);
        //   await IsarService.isar?.balances.put(
        //       Balance(address: element.address, chainId: element.chainId));
        // await IsarService.isar?.balances.put(tempList[i]);
        // await tempList[i].network.save();
        // refreshList.value = true;
        // }
      } catch (e) {
        debugPrint(e.toString());
      }
    }
  }

  // 设置一个定时器30秒刷新一次余额
  void startRefreshBalance() {
    print("start refresh balance");
    if (timer != null) {
      timer?.cancel();
    }
    timer = Timer.periodic(const Duration(seconds: 30), (timer) async {
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

  // 恢复默认网络
  Future<void> resetDefaultNetwork() async {
    await IsarService.isar?.writeTxn(() async {
      // 清理余额
      await IsarService.isar?.balances.clear();
      // 删除网络数据
      await IsarService.isar?.mainnets.clear();
      // 删除token数据
      await IsarService.isar?.contracts.clear();
    });
    HiveService.saveData(LocalKeyList.networkList, null);
    tokenConfigList = [];
    nodeConfigList = [];
    await _initStart();
  }

  void testsomething() async {
    print("test something");
    try {
      EasyLoading.showInfo("敬请期待");
      // refreshAllBalance();
      // await removeBalance();
      // 查询所有地址
      // List<Balance> temp =
      //     await IsarService.isar?.balances.where().findAll() ?? [];
      // print(
      //     "👉debug balances 👉 balances: ${temp.length} \n ==========================================");
      // // 遍历打印
      // for (var element in temp) {
      //   print(
      //       "ID:${element.id} ${element.address} ${element.chainId} ${element.isContract}  [${element.contractAddress}] 👉debug ${element.balance}");
      // }
      // return;

      // List<Balance> balances = [];
      // List<String> addressList = [
      //   rootAccount!.address,
      //   ...rootAccount!.proxyAddressList
      // ];
      // print(addressList);
      // // 刷新余额
      // for (var address in addressList) {
      //   final temp = await refreshSingleBalance(address,
      //       isProxy: address != rootAccount!.address);
      //   balances.addAll(temp);
      // }
      // for (var element in balances) {
      //   print(
      //       "${element.address} 👉 balance ${element.balance} ${element.chainId} [${element.contractAddress}]");
      // }
    } catch (e) {
      print(e);
    }
  }
}
