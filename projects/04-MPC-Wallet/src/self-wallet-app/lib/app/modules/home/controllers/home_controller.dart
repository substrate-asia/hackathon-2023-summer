import 'dart:async';

import 'package:easy_refresh/easy_refresh.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class HomeController extends GetxController {
  // final RxString rxdata = Get.find();
  // WalletController walletController = Get.find<WalletController>();
  RxList<Balance> rxAccount = Get.find<RxList<Balance>>();
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

  // 用户邮箱地址
  String userEmail = '';

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
    update();
  }

  int count = 0;
  @override
  void onInit() {
    getRootAccount();
    super.onInit();
    accountListHandle(rxAccount);
    // 监听rxdata对象的变化
    ever(rxAccount, (test) {
      // 处理rxdata对象的变化
      print("rxdata change $test");
      accountListHandle(test);
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

  void switchProxyAccount() {
    isProxyAccount = !isProxyAccount;
    accountListHandle(rxAccount);
    update();
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
    userEmail = account.email;
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
}
