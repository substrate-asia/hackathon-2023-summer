import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/modules/account/views/active_proxy_account.dart';
import 'package:sunrise/app/modules/account/views/verify_pin_view.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

import '../views/verify_account.dart';

class AccountSafeController extends GetxController {
  WalletController walletController = Get.find();
  late RootAccount rootAccount;

  // 是否开启生物支付
  bool isEnableBiometrics = false;
  // 是否启用免密支付
  bool isEnableNoPassword = false;

  @override
  void onInit() {
    super.onInit();
    initAccountList();
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    super.onClose();
  }

  void setEnableBiometrics(bool value) async {
    if (value == false) {
      await HiveService.deleteWalletData(LocalKeyList.biometrics);
      await HiveService.deleteWalletData('${LocalKeyList.biometrics}_private');
      await HiveService.saveData(LocalKeyList.isBiometrics, false);
      isEnableBiometrics = value;
      update();
      return;
    }

    // 验证密码获得私钥
    String? privateKey = await Get.bottomSheet(
      VerifyAccountView(),
      isScrollControlled: true,
      useRootNavigator: true,
      backgroundColor: const Color(0xFF0a0a0a),
      barrierColor: Colors.black.withOpacity(0.5),
    );
    print("hash $privateKey");
    if (privateKey != null) {
      bool pass = await walletController.setAuthenticate(privateKey);
      if (pass) {
        await HiveService.saveData(LocalKeyList.isBiometrics, true);
        EasyLoading.showToast("开启成功");
        isEnableBiometrics = value;
        update();
      } else {
        EasyLoading.showToast("开启失败");
        return;
      }
    } else {
      EasyLoading.showToast("取消开启");
      return;
    }
  }

  void setEnableNoPassword(bool value) async {
    if (value == false) {
      await HiveService.deleteWalletData(LocalKeyList.noPassword);
      await HiveService.deleteWalletData('${LocalKeyList.noPassword}_private');
      await HiveService.saveData(LocalKeyList.isNoPassword, false);
      isEnableNoPassword = value;
      update();
      return;
    }

    // 验证密码获得私钥
    String? privateKey = await Get.bottomSheet(
      VerifyAccountView(),
      isScrollControlled: true,
      useRootNavigator: true,
      backgroundColor: const Color(0xFF0a0a0a),
      barrierColor: Colors.black.withOpacity(0.5),
    );
    print("hash $privateKey");
    if (privateKey != null) {
      bool pass = await walletController.setFreeAuthenticate(privateKey);
      if (pass) {
        await HiveService.saveData(LocalKeyList.isNoPassword, true);
        EasyLoading.showToast("开启成功");
        isEnableNoPassword = value;
        update();
      } else {
        EasyLoading.showToast("开启失败");
        return;
      }
    } else {
      EasyLoading.showToast("取消开启");
      return;
    }
  }

  // 初始化账号列表
  void initAccountList() async {
    // 读取root账号
    var rootAccountMap = HiveService.getWalletData(LocalKeyList.rootAddress);
    isEnableBiometrics =
        HiveService.getData(LocalKeyList.isBiometrics) ?? false;
    isEnableNoPassword =
        HiveService.getData(LocalKeyList.isNoPassword) ?? false;
    if (rootAccountMap == null) {
      return;
    }
    rootAccount =
        RootAccount.fromJson(Map<String, dynamic>.from(rootAccountMap));

    print("rootAccount ${rootAccount.toJson()}");
  }

  // 激活代理账号
  void activeProxyAccount() async {
    if (rootAccount.proxyAddressList.isNotEmpty) {
      EasyLoading.showToast("已激活代理账号");
      return;
    }

    // 当前账号
    String address = rootAccount.address;
    String? result = await Get.bottomSheet(
      ActiveProxyAccount(address: address),
      backgroundColor: const Color(0xFF0a0a0a),
      barrierColor: Colors.black.withOpacity(0.5),
    );
    print("result $result");
    if (result != null && result != "0x") {
      initAccountList();
      EasyLoading.showToast("激活成功");
    } else {
      EasyLoading.showToast("取消激活");
    }
  }
}
