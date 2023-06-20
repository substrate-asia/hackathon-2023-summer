import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/providers/rpc_providers.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/app/data/services/swap_service.dart';
import 'package:sunrise/app/modules/account/views/verify_account.dart';
import 'package:sunrise/app/widgets/payment_widget.dart';
import 'package:sunrise/core/values/hive_boxs.dart';
import 'package:web3dart/json_rpc.dart';
import 'package:web3dart/web3dart.dart';

import 'home_controller.dart';

class SwapController extends GetxController {
  WalletController walletController = Get.find<WalletController>();
  HomeController homeController = Get.find<HomeController>();
  final TextEditingController enterController = TextEditingController();
  final TextEditingController outputController = TextEditingController();

  bool get isValidInput =>
      enterController.text.isNotEmpty || outputController.text.isNotEmpty;

  Balance? enterAccount;
  Balance? outputAccount;

  List<Mainnet> mainnetList = [];
  // token资产列表
  List<Contract> tokenContractList = [];

  int swapChainId = 1287;
  double swapFee = 0.003;

  String? rootAddress;

  BigInt _swapIn = BigInt.zero;
  BigInt _swapOut = BigInt.zero;

  // 预估网络费用
  double estimatedFee = 0;
  // 刷新进度条
  double progress = 0; // 最大是1

  // 支持兑换
  bool isSupportSwap = true;

  // 储备量
  List<BigInt> reserves = [BigInt.one, BigInt.one];

  // 交换比例
  double swapRatio = 0;

  @override
  void onInit() {
    super.onInit();

    initSwap();
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    super.onClose();
  }

  // 初始化交换
  void initSwap() async {
    // 读取root账号
    var _rootAccount =
        await HiveService.getWalletData(LocalKeyList.rootAddress);
    print(_rootAccount);
    if (_rootAccount == null) {
      return;
    }
    // EasyLoading.show(
    //   maskType: EasyLoadingMaskType.black,
    // );
    RootAccount rootAccount =
        RootAccount.fromJson(Map<String, dynamic>.from(_rootAccount));
    rootAddress = rootAccount.address;
    await _initNetwork();
    await _initContracts();

    // 从缓存中获取数据
    List<dynamic>? cacheData = HiveService.getData(LocalKeyList.swapSelected);
    print("cacheData $cacheData");
    // 如果缓存中没有数据，就设置默认值
    cacheData ??= [
      "0xcc4c41415fc68b2fbf70102742a83cde435e0ca7",
      "0x8d81a3dcd17030cd5f23ac7370e4efb10d2b3ca4"
    ];
    // if (cacheData != null) {
    // 从缓存中获取数据
    var enterContractAddress = cacheData[0];
    var outputContractAddress = cacheData[1];
    print("enterContractAddress $enterContractAddress");
    print("outputContractAddress $outputContractAddress");
    // tokenContractList 结合 getSingleBalance 设置enterAccount和outputAccount
    for (var token in tokenContractList) {
      if (token.contractAddress == enterContractAddress) {
        enterAccount = await getSingleBalance(
            contract: token.contractAddress, chainId: swapChainId);
      } else if (token.contractAddress == outputContractAddress) {
        outputAccount = await getSingleBalance(
            contract: token.contractAddress, chainId: swapChainId);
      }
    }
    // } else {
    //   // 遍历tokenContractList 找到 chainId为swapChainId的两个合约token
    //   for (var token in tokenContractList) {
    //     print(token.chainId);
    //     if (token.chainId == swapChainId &&
    //         (enterAccount == null || outputAccount == null)) {
    //       var balance = await getSingleBalance(
    //           contract: token.contractAddress, chainId: swapChainId);
    //       if (balance != null) {
    //         if (enterAccount == null) {
    //           enterAccount = balance;
    //         } else {
    //           outputAccount ??= balance;
    //         }
    //       }
    //     }
    //   }

    // 把enterAccount和outputAccount 的合约地址保存到本地存储
    //   _saveSelectedToken();
    // }
    await _getReserves();
    await estimateSwapGas();
    // EasyLoading.dismiss();
    timedRefresh();
    update();
  }

  /// 获取主网列表
  Future<void> _initNetwork() async {
    List<Mainnet>? existingMainnet =
        await IsarService.isar?.mainnets.where().sortByChainId().findAll();
    print(existingMainnet);
    if (existingMainnet != null) {
      mainnetList = existingMainnet;
    }
  }

  /// 获取token资产列表
  Future<void> _initContracts() async {
    List<Contract>? existingContracts =
        await IsarService.isar?.contracts.where().findAll();
    print(existingContracts?.length);
    if (existingContracts != null) {
      tokenContractList = existingContracts;
    }
  }

  // 缓存选中的token合约地址
  void _saveSelectedToken() {
    if (enterAccount != null && outputAccount != null) {
      HiveService.saveData(LocalKeyList.swapSelected,
          [enterAccount!.contractAddress, outputAccount!.contractAddress]);
    }
  }

  /// 定时执行
  /// 1. 获取储备量
  /// 2. 获取网络费用
  /// 3. 更新UI
  Future<void> timedRefresh() async {
    // 每100毫秒执行一次
    Timer.periodic(const Duration(milliseconds: 100), (timer) async {
      if (homeController.currentIndex == 1 && isSupportSwap) {
        if (progress < 1) {
          progress += 1 / 300;
          update();
        }

        if (progress >= 1) {
          if (enterAccount != null && outputAccount != null) {
            progress = 0;
            await _getReserves();
            await estimateSwapGas();
            _refreshBalance();
          }
        }
      }
    });
  }

  // 更新余额
  Future<void> _refreshBalance() async {
    if (enterAccount != null && outputAccount != null) {
      enterAccount = await getSingleBalance(
          contract: enterAccount!.contractAddress!, chainId: swapChainId);
      outputAccount = await getSingleBalance(
          contract: outputAccount!.contractAddress!, chainId: swapChainId);
    }
  }

  // 选中token
  void selectToken(Balance accountBalance, bool isEnter) {
    print("hhhhhh====== $isEnter ${accountBalance.toSelected()}");
    if (isEnter) {
      enterAccount = accountBalance;
    } else {
      outputAccount = accountBalance;
      swapChainId = accountBalance.chainId;
      print("selectToken $swapChainId");
    }

    _saveSelectedToken();
    _getReserves();
    update();
  }

  /// 获取token储备量
  ///
  /// 1. 先获取pair合约地址
  /// 2. 获取pair合约
  /// 3. 获取储备量
  Future<void> _getReserves() async {
    if (enterAccount != null && outputAccount != null) {
      List<EthereumAddress> tokens = [
        EthereumAddress.fromHex(enterAccount!.contractAddress!),
        EthereumAddress.fromHex(outputAccount!.contractAddress!)
      ];
      String pairAddress =
          await SwapService.getPairAddress(tokens[0], tokens[1]);
      if (pairAddress == "0x0000000000000000000000000000000000000000") {
        EasyLoading.showError("尚未支持兑换");
        isSupportSwap = false;
        return;
      }

      isSupportSwap = true;
      reserves = await SwapService.getReserves(pairAddress);

      _calcRatio();
      update();
    }
  }

  // 计算比例
  void _calcRatio() {
    swapRatio = ((reserves[1] * BigInt.one) /
            (reserves[0] + BigInt.one) *
            (1 - swapFee))
        .toDouble();
  }

  /// 获取单个token的余额
  /// [address] token地址
  /// [contract] token合约地址
  /// [chainId] 主网id
  /// return Balance
  Future<Balance?> getSingleBalance(
      {required String contract, required int chainId}) async {
    // 读取root账号
    if (rootAddress == null) {
      var _rootAccount =
          await HiveService.getWalletData(LocalKeyList.rootAddress);
      print(_rootAccount);
      if (_rootAccount == null) {
        return null;
      }
      RootAccount rootAccount =
          RootAccount.fromJson(Map<String, dynamic>.from(_rootAccount));
      rootAddress = rootAccount.address;
    }
    String address = rootAddress!;
    Mainnet? current =
        mainnetList.firstWhereOrNull((element) => element.chainId == chainId);
    Contract? config = tokenContractList.firstWhereOrNull((element) =>
        element.chainId == chainId && element.contractAddress == contract);

    if (current != null && config != null) {
      BigInt? balance = await getTokenBalance(
          tokenAddress: contract, walletAddress: address, rpcUrl: current.rpc);
      return Balance(
          address: address,
          chainId: chainId,
          isContract: true,
          isProxy: config.proxy,
          contractAddress: contract,
          contract: ContractEnum()
            ..contractAddress = config.contractAddress
            ..name = config.name
            ..symbol = config.symbol
            ..decimals = config.decimals
            ..chainId = config.chainId
            ..iconUrl = config.iconUrl,
          balance: balance.toString());
    }
    return null;
  }

  // 切换支付接收的token
  void exchangeAccount() {
    var temp = enterAccount;
    enterAccount = outputAccount;
    outputAccount = temp;
    reserves = [reserves[1], reserves[0]];
    _calcRatio();
    _saveSelectedToken();
    calculate();
    estimateSwapGas();
    // _getReserves();
    update();
  }

  // 根据输入的金额换算
  void calculate() {
    update();
    if (enterController.text.isEmpty) {
      outputController.text = '';
      return;
    }
    double input = double.parse(enterController.text);
    final amountIn = BigInt.from(input) * BigInt.from(10).pow(18);
    print("input $input $amountIn");
    final reserveIn = reserves[0];
    final reserveOut = reserves[1];

    final amountOut =
        amountIn * reserveOut / (reserveIn + amountIn) * (1 - swapFee);
    print("Amount out:  ${BigInt.from(amountOut)}");
    _swapOut = BigInt.from(amountOut);
    _swapIn = amountIn;
    var output = double.parse(BigInt.from(amountOut).toString()) /
        BigInt.from(10).pow(18).toDouble();
    outputController.text = output.toStringAsFixed(6);
    // update();
  }

  // 根据输出反推输入
  void reverseCalculate() {
    update();
    if (outputController.text.isEmpty) {
      enterController.text = '';
      return;
    }
    var output = double.parse(outputController.text);
    final amountOut = BigInt.from(output) * BigInt.from(10).pow(18);
    final reserveIn = reserves[0];
    final reserveOut = reserves[1];

    final amountIn =
        amountOut * reserveIn / (reserveOut - amountOut) * (1 - swapFee);
    print("Amount in:  ${BigInt.from(amountIn)}");
    _swapIn = BigInt.from(amountIn);
    _swapOut = amountOut;
    var input = double.parse(BigInt.from(amountIn).toString()) /
        BigInt.from(10).pow(18).toDouble();
    enterController.text = input.toStringAsFixed(6);
  }

  // 获取当前的交易价格
  Future<void> estimateSwapGas() async {
    EtherAmount? gasPrice = await SwapService.ethClient?.getGasPrice();
    if (gasPrice != null) {
      estimatedFee =
          (gasPrice.getInWei * BigInt.from(110185 + 29255)).toDouble() /
              BigInt.from(10).pow(18).toDouble();
      // print(
      //     "estimatedFee ${estimatedFee.toDouble() / BigInt.from(10).pow(18).toDouble()}");
    }
    update();
  }

  // 处理交易

  bool isApprove = false;

  /// 兑换
  ///
  /// 1. 监测是否有足够的token
  Future<void> swapToken() async {
    // _swapIn 和 enterAccount对比 判断余额
    print("$_swapIn > ${BigInt.parse(enterAccount!.balance)}");
    if (_swapIn > BigInt.parse(enterAccount!.balance)) {
      EasyLoading.showError("余额不足", dismissOnTap: true);
      return;
    }

    await EasyLoading.show();
    try {
      final deadline = DateTime.now().millisecondsSinceEpoch ~/ 1000 + 60 * 20;
      List<Uint8List>? result = await SwapService.swapExactTokensForTokensData(
          amountIn: _swapIn,
          amountOutMin: _swapOut,
          path: [
            EthereumAddress.fromHex(enterAccount!.contractAddress!),
            EthereumAddress.fromHex(outputAccount!.contractAddress!)
          ],
          to: EthereumAddress.fromHex(rootAddress!),
          deadline: BigInt.from(deadline));
      if (result != null) {
        print(result);
        // 授权
        if (isApprove == false) {
          String? approveHash = await Get.bottomSheet(
            PaymentWidget(
                networkId: swapChainId,
                type: 0,
                owner: enterAccount,
                to: outputAccount!.contractAddress,
                amount: 0,
                title: "Approve",
                data: result[0]),
            backgroundColor: const Color(0xFF0a0a0a),
            barrierColor: Colors.black.withOpacity(0.5),
          );
          print("approveHash $approveHash");
          if (approveHash == null) {
            EasyLoading.showError("授权失败");
            return;
          }
        }

        isApprove = true;

        String? swapHash = await Get.bottomSheet(
          PaymentWidget(
              networkId: swapChainId,
              type: 0,
              owner: enterAccount,
              to: rootAddress,
              toAddress: SwapService.routerAddress,
              amount: _swapIn.toDouble() / BigInt.from(10).pow(18).toDouble(),
              title: "兑换",
              data: result[1]),
          backgroundColor: const Color(0xFF0a0a0a),
          barrierColor: Colors.black.withOpacity(0.5),
        );
        if (swapHash == null) {
          EasyLoading.showError("兑换失败");
          return;
        }
        isApprove = false;
        await _refreshBalance();
        enterController.text = '';
        outputController.text = '';
        EasyLoading.showSuccess("兑换成功");
      } else {
        EasyLoading.showError("兑换失败");
      }
    } on RPCError catch (e) {
      print(e.toString());
      EasyLoading.showError(e.message);
    }
  }
}
