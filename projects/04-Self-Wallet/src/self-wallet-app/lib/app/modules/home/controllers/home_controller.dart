import 'dart:async';

import 'package:easy_refresh/easy_refresh.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/app/modules/account/views/security_setting_view.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class HomeController extends GetxController {
  // final RxString rxdata = Get.find();
  // WalletController walletController = Get.find<WalletController>();
  // RxList<Balance> rxAccount = Get.find<RxList<Balance>>();
  RxBool refreshList = Get.find<RxBool>();
  EasyRefreshController refreshController = EasyRefreshController(
      controlFinishRefresh: true, controlFinishLoad: true);

  final ScrollController scrollController = ScrollController();

  double scrollOffset = 0.0;

  RootAccount? rootAccount;

  bool loadFinish = false;

  bool isProxyAccount = false;

  // 主币资产列表
  List<Balance> mainCoinList = [];
  // token资产列表
  List<Balance> tokenList = [];

  List<Balance> balanceList = [];

  // 用户邮箱地址
  final userEmail = ''.obs;

  // 账号地址 根据isProxyAccount显示
  String get accountAddress => isProxyAccount
      ? rootAccount?.proxyAddressList[0] ?? ''
      : rootAccount?.address ?? '';

  Timer? timer;
  late double progress;

  // 当前tab
  int currentIndex = 0;
  // 切换tab
  void selectTab(int index) {
    currentIndex = index;
    // if (index == 2) {
    //   getRootAccount();
    // }
    update();
  }

  int count = 0;
  @override
  void onInit() {
    getRootAccount();
    super.onInit();

    _refreshBalances();
    // accountListHandle(rxAccount);
    // 监听rxdata对象的变化
    ever(refreshList, (test) {
      // 处理rxdata对象的变化
      print("home rxdata change $test");
      if (test) {
        _refreshBalances();
      }
    });

    scrollController.addListener(_scrollListener);
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    scrollController.removeListener(_scrollListener);
    scrollController.dispose();
    refreshController.dispose();
    super.onClose();
  }

  // 设置count
  void setCount(int count) {
    this.count = count;
    update();
  }

  // 交易记录
  void toTransactionRecord(String address) {
    Get.toNamed('/website', arguments: {
      "title": "交易记录",
      "url": "https://moonbase.moonscan.io/address/$address"
    });
  }

  // 切换账号类型
  void switchProxyAccount() {
    // 先判断是否有代理账号
    if (rootAccount?.proxyAddressList != null &&
        rootAccount!.proxyAddressList.isEmpty) {
      EasyLoading.showError("请先激活代理账号");
      // 跳转钱包安全
      Get.to(() => const SecuritySettingView(),
          transition: Transition.cupertino);
      return;
    }
    isProxyAccount = !isProxyAccount;

    accountListHandle(balanceList);
    update();
  }

  /// 从数据库中获取余额
  ///
  Future<void> _refreshBalances() async {
    balanceList = await IsarService.isar?.balances.where().findAll() ?? [];
    print("balanceList ${balanceList.length}");
    // 遍历查看余额
    for (var element in balanceList) {
      print("balance ${element.balance}");
    }

    accountListHandle(balanceList);
  }

  void _scrollListener() {
    // print(scrollController.offset);
    if (scrollController.offset >= 0) {
      scrollOffset = scrollController.offset;
      update();
    }
  }

  // 获取root账号
  void getRootAccount() async {
    var _account = await HiveService.getWalletData(LocalKeyList.rootAddress);
    print(_account);
    RootAccount account =
        RootAccount.fromJson(Map<String, dynamic>.from(_account));
    print(account.address);
    rootAccount = account;
    userEmail.value = account.email;
    loadFinish = true;
    update();
  }

  // 账号列表处理
  void accountListHandle(List<Balance> list) async {
    print("accountListHandle ${list.length}");
    // 获取主币资产列表
    mainCoinList = list
        .where((element) =>
            element.contractAddress == null &&
            element.isContract == false &&
            element.isProxy == isProxyAccount)
        .toList();
    tokenList = list
        .where((element) =>
            element.contractAddress != null &&
            element.isContract == true &&
            element.isProxy == isProxyAccount)
        .toList();
    update();
  }

  /// 退出登录
  ///
  /// 清空数据库banlances表数据
  /// 移除root数据
  /// 移除转账数据
  void logout() async {
    await IsarService.isar?.writeTxn(() async {
      // 清理余额
      await IsarService.isar?.balances.clear();
      // 删除网络数据
      await IsarService.isar?.mainnets.clear();
      // 删除token数据
      await IsarService.isar?.contracts.clear();
    });
    // 删除兑换缓存
    await HiveService.deleteData(LocalKeyList.transferSelected);
    // 删除root数据
    await HiveService.deleteWalletData(LocalKeyList.rootAddress);
    // 移除指纹和免密支付
    await HiveService.saveData(LocalKeyList.isBiometrics, false);
    await HiveService.saveData(LocalKeyList.isNoPassword, false);

    await HiveService.saveData("xmtp-client-key", null);
    Get.offAllNamed('/account');
  }
}
