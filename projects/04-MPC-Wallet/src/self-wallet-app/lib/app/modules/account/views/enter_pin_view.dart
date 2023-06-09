import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:hex/hex.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/providers/ipfs_providers.dart';
import 'package:sunrise/app/data/providers/server_providers.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/app/modules/account/controllers/account_controller.dart';
import 'package:sunrise/core/utils/encryption.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class EnterPinView extends StatefulWidget {
  const EnterPinView({super.key});

  @override
  _EnterPinViewState createState() => _EnterPinViewState();
}

class _EnterPinViewState extends State<EnterPinView> {
  AccountController controller = Get.find<AccountController>();
  WalletController walletController = Get.find<WalletController>();
  // await HiveService.saveData("test", list);
  String _pin = '';
  String errorText = '';

  // 第一次输入的密码
  String firstPin = '';

  void _onNumberPressed(String number) {
    setState(() {
      if (_pin.length < 6) {
        _pin += number;
        errorText = '';
      }
    });

    if (_pin.length == 6 && firstPin == '') {
      setState(() {
        firstPin = _pin;
        _pin = '';
      });
    }

    if (_pin.length == 6 && firstPin != '') {
      // Submit the verification code
      print('Verification code submitted: $_pin');

      if (firstPin != '' && _pin != firstPin) {
        setState(() {
          errorText = '两次密码不相等, 请重试';
        });
      } else if (firstPin == _pin) {
        _saveWalletAccount();
      }
    }
  }

  void _onDeletePressed() {
    // _saveWalletAccount();
    setState(() {
      if (_pin.isNotEmpty) {
        _pin = _pin.substring(0, _pin.length - 1);
      }
    });
  }

  /// 重置第一次输入的密码
  void _resetFirstPin() {
    setState(() {
      firstPin = '';
      _pin = '';
      errorText = '';
    });
  }

  // 上传cid
  Future<List<String>> uploadPrivateKeys(List<String> list) async {
    List<String> cidList = [];
    // 遍历上传
    for (var privateStr in list) {
      String? cid = await NftStorage.uploadString(privateStr);
      print("privateString $cid");
      if (cid != null) {
        cidList.add(cid);
      }
    }
    return cidList;
  }

  // 下载cid
  Future<List<String>> downloadPrivateKeys(List<String> cidList) async {
    List<String> list = [];
    // 遍历下载
    for (var cid in cidList) {
      String? privateString = await NftStorage.getPrivateString(cid);
      print("privateString $privateString");
      if (privateString != null) {
        list.add(privateString);
      }
    }
    return list;
  }

  /// 保存钱包账号
  void _saveWalletAccount() async {
    print(controller.walletAccount?.address);
    print(controller.emailController.text);
    try {
      EasyLoading.show(
          maskType: EasyLoadingMaskType.black,
          dismissOnTap: false,
          status: "信息同步中");
      // 情况1：用户已经注册过且已经保存钱包到IPFS
      if (controller.userStatus == 2) {
        print(controller.walletAddress);
        print(controller.cidList);
        List<String> list = await downloadPrivateKeys(controller.cidList);
        print(list);

        String _encrypted = mpcJoin(list);
        // 解密
        String decryptedKey = decryptAES(_encrypted, firstPin);
        print("decryptedKey $decryptedKey ${controller.walletAddress}");

        await EasyLoading.show(
            maskType: EasyLoadingMaskType.black,
            dismissOnTap: false,
            status: "导入中");

        RootAccount rootAccount = RootAccount(
            email: controller.emailController.text,
            address: controller.walletAddress ?? '');

        await HiveService.saveWalletData(
            LocalKeyList.rootAddress, rootAccount.toJson());
        // 把加密私钥保存到本地
        await HiveService.saveEncryptedPrivateKey(
            controller.walletAddress ?? '', _encrypted);
        // await EasyLoading.dismiss();
        _finsihAccount([]);
        return;
      }

      // 情况2：用户已经验证过但是没有保存过钱包
      if (controller.walletAccount != null) {
        RootAccount rootAccount = RootAccount(
            email: controller.emailController.text,
            address: controller.walletAccount?.address ?? '');

        await HiveService.saveWalletData(
            LocalKeyList.rootAddress, rootAccount.toJson());

        String encryptedKey =
            encryptAES(controller.walletAccount?.privateKey ?? '', firstPin);
        print("encryptedKey $encryptedKey ${encryptedKey.length}");

        List<String> list = mpcSplit(encryptedKey);
        List<String> cidList = await uploadPrivateKeys(list);
        if (list.length != cidList.length) {
          EasyLoading.showError('同步失败，请重试',
              dismissOnTap: true, duration: const Duration(seconds: 2));
          // 重置
          _resetFirstPin();
          return;
        }
        print(list);
        print(cidList);

        await Server.saveWallet(
            userId: controller.userId,
            email: controller.emailController.text,
            code: controller.codeController.text,
            cids: cidList,
            address: controller.walletAccount!.address);

        await EasyLoading.show(
            maskType: EasyLoadingMaskType.black,
            dismissOnTap: false,
            status: "生成中");
        await HiveService.saveEncryptedPrivateKey(
            controller.walletAccount!.address, encryptedKey);
        List<String>? result =
            await Server.getUser(controller.walletAccount!.address);
        print(result);
        if (result != null && result.isNotEmpty) {
          _finsihAccount(result);
        } else {
          String? proxyAddress =
              await Server.createUser(controller.walletAccount!.address);
          if (proxyAddress != null) {
            _finsihAccount([proxyAddress]);
          } else {
            EasyLoading.showError('创建失败',
                dismissOnTap: true, duration: const Duration(seconds: 2));
            // 重置
            _resetFirstPin();
          }
        }
      }
    } catch (e) {
      print(e);
      EasyLoading.showError('创建失败',
          dismissOnTap: false, duration: const Duration(seconds: 2));
      // 重置
      _resetFirstPin();
    }
  }

  void _finsihAccount(List<String> addressList) async {
    try {
      String entryPoint = dotenv.env["ENTRY_POINT_ADDRESS"] ?? "";
      var _account = HiveService.getWalletData(LocalKeyList.rootAddress);
      RootAccount account =
          RootAccount.fromJson(Map<String, dynamic>.from(_account));
      account.proxyAddressList = addressList;
      await HiveService.saveWalletData(
          LocalKeyList.rootAddress, account.toJson());
      if (addressList.isNotEmpty) {
        // 查询 IsarService.isar?.proxyAccounts 中是否有这个地址
        final checkList = await IsarService.isar?.proxyAccounts
            .filter()
            .addressEqualTo(addressList[0])
            .findAll();
        print("checkList $checkList");
        // 如果没有就插入代理账号
        if (checkList == null || checkList.isEmpty) {
          ProxyAccount proxyAccount = ProxyAccount(
              address: addressList[0],
              rootAddress: controller.walletAccount!.address,
              entryPointAddress: entryPoint);

          await IsarService.isar?.writeTxn(() async {
            await IsarService.isar?.proxyAccounts.put(proxyAccount);
          });
        }
      }
      // 刷新余额
      await walletController.refreshAllBalance();

      EasyLoading.showSuccess(controller.userStatus == 2 ? '导入成功' : '创建成功',
          dismissOnTap: true, duration: const Duration(seconds: 2));
      Get.offAllNamed('/home');
    } catch (e) {
      print(e);
      EasyLoading.showError(controller.userStatus == 2 ? '导入失败' : '创建失败',
          dismissOnTap: true, duration: const Duration(seconds: 2));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: null,
        centerTitle: true,
        leading: IconButton(
          onPressed: () {
            Get.back();
          },
          icon: Icon(
            Icons.arrow_back_ios_rounded,
            size: 18.sp,
          ),
        ),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
                  height: 50.w,
                  child: firstPin != ''
                      ? AnimatedSwitcher(
                          duration: const Duration(milliseconds: 500),
                          child: Row(
                            key: ValueKey('resetPinRow'),
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text("请再次输入PIN码",
                                  style: TextStyle(
                                      fontSize: 18.sp,
                                      fontWeight: FontWeight.w700)),
                              IconButton(
                                  onPressed: () {
                                    _resetFirstPin();
                                  },
                                  icon: Icon(Icons.restore_outlined))
                            ],
                          ),
                        )
                      : AnimatedSwitcher(
                          duration: const Duration(milliseconds: 500),
                          child: Text(
                              controller.userStatus == 2
                                  ? "请输入PIN码恢复账号"
                                  : "为您的账户设置PIN码",
                              style: TextStyle(
                                  fontSize: 18.sp,
                                  fontWeight: FontWeight.w700)),
                        ))
              .animate()
              .fadeIn()
              .move(duration: 500.ms),
          SizedBox(height: 30.w),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ...List.generate(
                  6,
                  (index) => Container(
                        width: 15.w,
                        height: 15.w,
                        margin: EdgeInsets.symmetric(horizontal: 5.w),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(7.5.w),
                          color: _pin.length > index
                              ? Theme.of(context).colorScheme.primary
                              : Colors.transparent,
                          border: Border.all(
                              width: 2.w,
                              color: Colors.grey[300] ?? Colors.grey),
                        ),
                      ))
            ],
          ).animate().fadeIn().move(duration: 500.ms),
          SizedBox(
            height: 80.w,
            child: errorText != ''
                ? Center(
                    child: Text(
                    errorText,
                    style: TextStyle(fontSize: 14.sp, color: Colors.red[300]),
                  ).animate().shake(duration: 500.ms).fadeIn().callback(
                        callback: (_) {
                    setState(() {
                      _pin = '';
                    });
                  }))
                : null,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildNumberButton('1'),
              _buildNumberButton('2'),
              _buildNumberButton('3'),
            ],
          )
              .animate()
              .fadeIn(delay: 100.ms) // uses `Animate.defaultDuration`
              .move(duration: 500.ms),
          SizedBox(height: 20.w),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildNumberButton('4'),
              _buildNumberButton('5'),
              _buildNumberButton('6'),
            ],
          )
              .animate()
              .fadeIn(delay: 100.ms) // uses `Animate.defaultDuration`
              .move(duration: 500.ms),
          SizedBox(height: 20.w),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildNumberButton('7'),
              _buildNumberButton('8'),
              _buildNumberButton('9'),
            ],
          )
              .animate()
              .fadeIn(delay: 100.ms) // uses `Animate.defaultDuration`
              .move(duration: 500.ms),
          SizedBox(height: 20.w),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              SizedBox(
                width: 80.w,
              ),
              _buildNumberButton('0'),
              SizedBox(
                width: 80.w,
                height: 80.w,
                child: IconButton(
                  icon: Icon(
                    Icons.backspace_rounded,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  onPressed: _onDeletePressed,
                  iconSize: 35.sp,
                ),
              ),
            ],
          )
              .animate()
              .fadeIn(delay: 100.ms) // uses `Animate.defaultDuration`
              .move(duration: 500.ms),
          SizedBox(height: 50.w),
          Text(
            controller.userStatus == 2
                ? "请输入创建钱包时设置的PIN码"
                : "PIN码用于确认您的身份，不可以更改，请妥善保管",
            style: TextStyle(fontSize: 14.sp, color: Colors.grey[500]),
          )
        ],
      ),
    );
  }

  Widget _buildNumberButton(String number) {
    return Container(
      width: 70.w,
      height: 70.w,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: Theme.of(context).colorScheme.primary.withOpacity(0.8),
          onPrimary: Colors.black,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(50),
          ),
        ),
        child: Text(
          number,
          style: TextStyle(fontSize: 28.sp, color: Colors.white),
        ),
        onPressed: () => _onNumberPressed(number),
      ),
    );
  }
}
