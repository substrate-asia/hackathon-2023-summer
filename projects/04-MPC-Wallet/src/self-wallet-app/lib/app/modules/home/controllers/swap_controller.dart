import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class SwapController extends GetxController {
  final TextEditingController enterController = TextEditingController();
  final TextEditingController outputController = TextEditingController();

  bool get isValidInput =>
      enterController.text.isNotEmpty || outputController.text.isNotEmpty;

  Balance? enterAccount;
  Balance? outputAccount;

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
    RootAccount rootAccount =
        RootAccount.fromJson(Map<String, dynamic>.from(_rootAccount));
    List<Balance> localBalanceList = await IsarService.isar?.balances
            .filter()
            .addressEqualTo(rootAccount.address)
            .findAll() ??
        [];
    print("localBalanceList $localBalanceList");
    if (localBalanceList.length == 0) {
      return;
    }

    // 从缓存中获取数据
    var cacheData = HiveService.getData(LocalKeyList.swapSelected);
    if (cacheData != null) {
    } else {
      enterAccount = localBalanceList[0];
      outputAccount = localBalanceList[1];
    }

    update();
  }

  // 选中token
  void selectToken(Balance accountBalance, bool isEnter) {
    if (isEnter) {
      enterAccount = accountBalance;
    } else {
      outputAccount = accountBalance;
    }
    update();
  }

  // 切换支付接收的token
  void exchangeAccount() {
    var temp = enterAccount;
    enterAccount = outputAccount;
    outputAccount = temp;
    update();
  }

  // 根据输入的金额换算
  void calculate() {
    update();
    if (enterController.text.isEmpty) {
      outputController.text = '';
      return;
    }
    var input = double.parse(enterController.text);
    var output = input * 0.9;
    outputController.text = output.toStringAsFixed(2);
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
    var input = output / 0.9;
    enterController.text = input.toStringAsFixed(2);
  }
}
