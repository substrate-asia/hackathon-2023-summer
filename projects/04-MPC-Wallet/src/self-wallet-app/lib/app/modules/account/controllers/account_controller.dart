import 'dart:math';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/data/providers/server_providers.dart';
import 'package:sunrise/app/widgets/verification_code_input.dart';
import 'package:sunrise/core/utils/eth_wallet.dart';
import 'package:web3dart/credentials.dart';

import '../views/enter_pin_view.dart';

class AccountController extends GetxController {
  GlobalKey<VerificationCodeInputState> verificationCodeInputKey =
      GlobalKey<VerificationCodeInputState>();

  final count = 0.obs;
  final smoothController =
      PageController(viewportFraction: 0.8, keepPage: true);

  // 钱包账号
  EthWallet? walletAccount;
  // 邮箱输入框
  final emailController = TextEditingController(text: "");
  // 验证码
  final codeController = TextEditingController();

  // 邮箱输入框的错误提示
  String emailError = "";

  // 发送验证码倒计时
  int countdown = 0;

  int userStatus = -1;
  int userId = 0;
  // cid列表
  List<String> cidList = [];
  // 钱包地址
  String? walletAddress;

  bool get isEmailValid =>
      GetUtils.isEmail(emailController.text) && emailError == "";

  @override
  void onInit() {
    super.onInit();
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    super.onClose();
  }

  void increment() => count.value++;

  // 更新邮箱输入框的错误提示
  void updateEmailError(String error) {
    emailError = error;
    update();
  }

  // 发送验证码
  void sendVerificationCode() async {
    await EasyLoading.show(
      maskType: EasyLoadingMaskType.black,
      dismissOnTap: false,
    );
    final result = await Server.sendEmail(emailController.text);
    if (result == null) {
      await EasyLoading.dismiss();
      EasyLoading.showError('发送失败');
      return;
    }
    userStatus = result["user_status"] ?? 0;
    print("userStatus $userStatus");
    await EasyLoading.dismiss();
    countdown = 60;
    update();
    // 倒计时
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      countdown--;
      update();
      return countdown > 0;
    });
  }

  // 验证码
  void codeChange(String code) {
    codeController.text = code;
    update();
  }

  // 创建钱包
  void createWalletAccount() async {
    if (userStatus == -1) {
      EasyLoading.showError('请先发送验证码');
      return;
    }

    try {
      await EasyLoading.show(
        maskType: EasyLoadingMaskType.black,
        dismissOnTap: false,
      );

      // 恢复账号 把私钥从ipfs中拉下来
      if (userStatus == 2) {
        // 通过邮箱获取私钥
        Map<String, dynamic>? result = await Server.recoverWallet(
            email: emailController.text, code: codeController.text);
        if (result == null) {
          EasyLoading.showError('验证失败');
        }

        if (result?["msg"] != "success") {
          EasyLoading.showError(result?["msg"] ?? '验证码错误');
          return;
        }

        List<dynamic>? resultData = result?["data"];
        String cids = resultData?[0]["ipfs_address"];
        walletAddress = resultData?[0]["wallet_address"];
        cidList = cids.split(",");

        print("cids: $cids walletAddress: $walletAddress ${cidList.length}");

        await EasyLoading.dismiss();

        Get.off(() => const EnterPinView());
        return;
      }

      // 未进行账号验证
      // if (userStatus == 0) {
      Map<String, dynamic>? result =
          await Server.verifyEmail(emailController.text, codeController.text);
      if (result == null) {
        EasyLoading.showError('验证失败');
      }

      if (result?["data"] == "") {
        EasyLoading.showError(result?["msg"] ?? '验证码错误');
        return;
      }

      userId = result?["data"]['id'] ?? 0;

      // 把状态变成已验证
      userStatus = 1;
      // }

      /// 生成随机的私钥

      // 生成助记词
      String mnemonic = EthWallet.createMnemonic();
      // 通过助记词生成私钥
      EthWallet _account = await EthWallet.fromMnemonic(mnemonic);

      walletAccount = _account;
      walletAddress = _account.address;
      await EasyLoading.dismiss();
      Get.off(() => EnterPinView());
    } catch (e) {
      EasyLoading.showError('账号创建失败');
      print("error: ${e.toString()}");
    }
  }
}
