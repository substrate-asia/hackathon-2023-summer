import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:flutter_animate/flutter_animate.dart';
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
import 'package:sunrise/core/utils/eth_wallet.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

import 'active_proxy_account.dart';

/// 设置密码
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

  // 钱包账号
  EthWallet? get walletAccount => controller.walletAccount;
  String? get walletAddress => controller.walletAddress;

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

    // 第二次输入密码
    if (_pin.length == 6 && firstPin != '') {
      if (firstPin != '' && _pin != firstPin) {
        setState(() {
          errorText = '两次密码不相等, 请重试';
        });
      } else if (firstPin == _pin) {
        _saveWalletAccount();
      }
    }
  }

  // 删除
  void _onDeletePressed() async {
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

      if (cid != null) {
        cidList.add(cid);
      }
    }
    return cidList;
  }

  // 缓存cid列表
  List<String> cacheList = [];
  // 下载cid
  Future<List<String>> downloadPrivateKeys(List<String> cidList) async {
    List<String> list = [];
    if (cacheList.isNotEmpty) {
      return cacheList;
    }
    // 遍历下载
    for (var cid in cidList) {
      String? privateString = await NftStorage.getPrivateString(cid);
      print("privateString $privateString");
      if (privateString != null) {
        list.add(privateString);
      }
    }
    cacheList = list;
    return list;
  }

  /// 查询代理账号
  Future<void> _checkProxyAccount(String address) async {
    List<String>? result = await Server.getUser(address);
    print(result);
    await EasyLoading.show(
        maskType: EasyLoadingMaskType.black,
        dismissOnTap: false,
        status: "代理账号检查中");
    // 有代理账号
    if (result != null && result.isNotEmpty) {
      _finsihAccount(result);
    } else {
      // 没有代理账号
      EasyLoading.dismiss();
      String? result = await Get.bottomSheet(
        ActiveProxyAccount(address: address),
        backgroundColor: const Color(0xFF0a0a0a),
        barrierColor: Colors.black.withOpacity(0.5),
      );

      if (result != null && result != "0x") {
        await EasyLoading.show(
            maskType: EasyLoadingMaskType.black,
            dismissOnTap: false,
            status: "激活成功，正在跳转");
        _finsihAccount([result]);
      } else {
        await EasyLoading.show(
            maskType: EasyLoadingMaskType.black,
            dismissOnTap: false,
            status: "同步中");
        // 重置
        _resetFirstPin();
        _finsihAccount([]);
      }
    }
  }

  /// 保存钱包账号
  void _saveWalletAccount() async {
    try {
      EasyLoading.show(
          maskType: EasyLoadingMaskType.black,
          dismissOnTap: false,
          status: "信息同步中");
      // 情况1：用户已经注册过且已经保存钱包到IPFS
      if (controller.userStatus == 2) {
        List<String> list = await downloadPrivateKeys(controller.cidList);

        String encrypted = mpcJoin(list);
        // 解密
        String decryptedKey = decryptAES(encrypted, firstPin);
        debugPrint("decryptedKey $decryptedKey $walletAddress");

        await EasyLoading.show(
            maskType: EasyLoadingMaskType.black,
            dismissOnTap: false,
            status: "导入中");

        RootAccount rootAccount = RootAccount(
            email: controller.emailController.text,
            address: walletAddress ?? '');

        await HiveService.saveWalletData(
            LocalKeyList.rootAddress, rootAccount.toJson());
        // 把加密私钥保存到本地
        await HiveService.saveEncryptedPrivateKey(
            walletAddress ?? '', encrypted);

        // 初始化xmtp节点进程
        // walletController.initChatIsolate(privateKey: decryptedKey);

        // 查询代理账号
        await _checkProxyAccount(walletAddress ?? '');
        return;
      }

      // 情况2：用户已经验证过但是没有保存过钱包
      if (walletAccount != null) {
        RootAccount rootAccount = RootAccount(
            email: controller.emailController.text,
            address: walletAccount?.address ?? '');

        await HiveService.saveWalletData(
            LocalKeyList.rootAddress, rootAccount.toJson());

        String encryptedKey =
            encryptAES(walletAccount?.privateKey ?? '', firstPin);
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

        // 地址绑定
        await Server.saveWallet(
            userId: controller.userId,
            email: controller.emailController.text,
            code: controller.codeController.text,
            cids: cidList,
            address: walletAccount!.address);

        await EasyLoading.show(
            maskType: EasyLoadingMaskType.black,
            dismissOnTap: false,
            status: "生成中");
        // 保存加密私钥
        await HiveService.saveEncryptedPrivateKey(
            walletAccount!.address, encryptedKey);
        // walletController.initChatIsolate(
        //     privateKey: walletAccount?.privateKey ?? '');

        // 查询代理账号
        await _checkProxyAccount(walletAccount!.address);
      }
    } catch (e) {
      EasyLoading.showError(controller.userStatus == 2 ? '恢复失败' : '创建失败',
          dismissOnTap: false, duration: const Duration(seconds: 2));
      // 重置
      _resetFirstPin();
    }
  }

  void _finsihAccount(List<String> addressList) async {
    try {
      String entryPoint = dotenv.env["ENTRY_POINT_ADDRESS"] ?? "";
      // 把代理账号保存到本地
      var accountMap = HiveService.getWalletData(LocalKeyList.rootAddress);
      RootAccount account =
          RootAccount.fromJson(Map<String, dynamic>.from(accountMap));
      account.proxyAddressList = addressList;
      await HiveService.saveWalletData(
          LocalKeyList.rootAddress, account.toJson());
      if (addressList.isNotEmpty) {
        // 查询 IsarService.isar?.proxyAccounts 中是否有这个地址
        final checkList = await IsarService.isar?.proxyAccounts
            .filter()
            .addressEqualTo(addressList[0])
            .findAll();

        // 如果没有就插入代理账号
        if (checkList == null || checkList.isEmpty) {
          ProxyAccount proxyAccount = ProxyAccount(
              address: addressList[0],
              rootAddress: walletAddress ?? '',
              entryPointAddress: entryPoint);

          await IsarService.isar?.writeTxn(() async {
            await IsarService.isar?.proxyAccounts.put(proxyAccount);
          });
        }
      }
      await EasyLoading.show(
          maskType: EasyLoadingMaskType.black,
          dismissOnTap: false,
          status: "网络同步中");
      // 刷新余额
      await walletController.initAppConfig();
      await walletController.removeBalance();
      walletController.refreshAllBalance();

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
        elevation: 0,
        actions: [
          IconButton(
              onPressed: () {
                // Get.toNamed('/help');
              },
              icon: Icon(
                Icons.help_outline_rounded,
                size: 18.sp,
              ))
        ],
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
                            key: const ValueKey('resetPinRow'),
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
                                  icon: const Icon(Icons.restore_outlined))
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
