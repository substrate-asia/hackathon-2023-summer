import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/providers/rpc_providers.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/core/utils/isar_db.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

/// 处理全局的钱包数据
class WalletController extends GetxController {
  // 节点配置列表
  List<Mainnet> nodeConfigList = [];
  // token列表
  List<String> tokenList = [];
  // token配置列表
  List<Contract> tokenConfigList = [];
  // final RxString rxdata = RxString('0');
  final RxList<Balance> rxAccount = RxList<Balance>();
  // Get.put(rxdata);

  // 定时器
  Timer? timer;

  // final RxString rxdata = Get.find();
  @override
  void onInit() {
    initAppConfig();
    super.onInit();
    // testInit();
    print("Wallet Controller Init");
    // Get.put(rxdata);
    Get.put(rxAccount);
    // refreshAllBalance();
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
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

  // "https://rpc-mumbai.maticvigil.com/v1/b8ad974a05bb017a5da09dc548e6a75a837648db";

  // 加载evm的合约（erc20）
  Future<void> _loadContract() async {
// 查询数据库中的合约配置
    List<Contract>? contractList =
        await IsarService.isar?.contracts.where().findAll();
    print(contractList?.length);
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
    // LocalKeyList.tokenList
    // final tempTokenMapList = tokenConfigList.map((e) => e.toJson()).toList();
    // HiveService.saveData(LocalKeyList.tokenList, tempTokenMapList);

    // print(tempTokenMapList.length);
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
      }

      // 遍历localBalanceList多出来的差集部分，删除数据
      for (Balance element in difference) {
        await IsarService.isar?.balances.delete(element.id);
      }

      // 遍历tempBalance多出来的差集部分，添加到数据库
      for (Balance element in difference2) {
        element.balance = tempBalance
            .firstWhere((element2) => element2.chainId == element.chainId)
            .balance;
        // 更新余额
        await IsarService.isar?.balances.put(element);
        await element.network.save();
        print("添加余额记录");
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
    var _rootAccount =
        await HiveService.getWalletData(LocalKeyList.rootAddress);
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

      refreshAllBalance();
      // await IsarService.isar?.writeTxn(() async {
      //   final success =
      //       await IsarService.isar?.mainnets.delete(4); // 通过 Id 删除指定用户
      //   await IsarService.isar?.mainnets.delete(5);
      //   print('We deleted $success');
      // });
    } catch (e) {
      print(e);
    }
  }
}
