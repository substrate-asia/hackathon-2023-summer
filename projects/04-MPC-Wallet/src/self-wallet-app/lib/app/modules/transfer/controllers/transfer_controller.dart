import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/modules/transfer/views/transfer_form.dart';
import 'package:sunrise/core/utils/common.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class TransferController extends GetxController
    with SingleGetTickerProviderMixin {
  RxList<Balance> rxAccount = Get.find<RxList<Balance>>();
  GlobalKey<TransferFormState> eoaKey = GlobalKey<TransferFormState>();
  GlobalKey<TransferFormState> proxyKey = GlobalKey<TransferFormState>();

  late TabController tabController;
  // 支付者账号信息
  Balance? paymentBalance;
  // 默认tab
  int defaultTab = 0;

  bool isProxyAccount = false;

  final count = 0.obs;
  @override
  void onInit() {
    isProxyAccount = Get.arguments ?? false;
    super.onInit();
    tabController = TabController(length: 2, vsync: this);
    initTransferAccount(rxAccount);
    print("isProxyAccount $isProxyAccount");
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    tabController.dispose();
    super.onClose();
  }

  // 获取选中的账号信息
  void initTransferAccount(List<Balance> list) async {
    // List<Balance> list = rxAccount;
    var _account = await HiveService.getData(LocalKeyList.transferSelected);
    print("list $list $_account");
    // await HiveService.saveData(LocalKeyList.transferSelected, null);

    if (_account != null && list.isNotEmpty) {
      print("list ${list.length}");
      paymentBalance = list.firstWhere((element) =>
          element.toSelected().toString() ==
          Map<String, dynamic>.from(_account).toString());
      print("paymentBalance ${paymentBalance?.toSelected()}");

      if (_account["isProxy"]) {
        tabController.animateTo(1, duration: const Duration(milliseconds: 500));
      }
    } else {
      // changeTab(0);
      changeAccount(list.first);
    }

    update();
  }

  bool _checkTabNetwork(Balance element, Map<String, dynamic>? _account) {
    if (_account != null) {
      Map<String, dynamic> temp = element.toSelected();
      // print(
      //     "对比 ${temp["chainId"] == _account["chainId"] && temp["isContract"] == _account["isContract"] && temp["contractAddress"] == _account["contractAddress"]}");
      return temp["chainId"] == _account["chainId"] &&
          temp["isContract"] == _account["isContract"] &&
          temp["contractAddress"] == _account["contractAddress"];
    } else {
      return paymentBalance != null
          ? element.chainId == paymentBalance!.chainId
          : true;
    }
  }

  void changeTab(int index) async {
    try {
      Balance? temp;

      var _account = await HiveService.getData(LocalKeyList.transferSelected);
      print("selected account $rxAccount");

      // 找到isProxy为false的第一个账号
      temp = rxAccount.firstWhere((element) =>
          element.isProxy == (index == 1) &&
          _checkTabNetwork(element, Map<String, dynamic>.from(_account)));
      print("changeTab ${temp.toSelected()}");
      if (index == 1) {
        proxyKey.currentState?.setNetwork(temp);
      } else {
        eoaKey.currentState?.setNetwork(temp);
      }

      changeAccount(temp);
    } on StateError catch (e) {
      // 没有找到匹配项的情况下的操作
      print('找不到匹配项: $e');
    }
  }

  // 切换账号
  void changeAccount(Balance balance) async {
    paymentBalance = balance;
    update();
    await HiveService.saveData(
        LocalKeyList.transferSelected, balance.toSelected());
  }

  void test() {
    print("test");
    initTransferAccount(rxAccount);
  }

  void showInfo() {
    print("showInfo");
    showHelpContent(
        title: "转账说明",
        content:
            "EOA转账：转账到其他钱包地址，需要支付GAS费用。\n免GAS转账：转账到其他钱包地址，无需支付GAS费用，需要收取xx数量的Token作为手续费。\n什么是GAS费： EVM网络上的每笔交易都需要支付一定的手续费，这个手续费就是GAS费用，GAS费用越高，交易确认速度越快。",
        confirmText: "我知道了");
  }
}
