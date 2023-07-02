import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/core/utils/encryption.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class VerifyAccountView extends StatefulWidget {
  VerifyAccountView({super.key});

  @override
  _VerifyAccountViewState createState() => _VerifyAccountViewState();
}

class _VerifyAccountViewState extends State<VerifyAccountView> {
  // await HiveService.saveData("test", list);
  String _pin = '';
  String errorText = '';

  void _onNumberPressed(String number) {
    setState(() {
      if (_pin.length < 6) {
        _pin += number;
        errorText = '';
      }
    });

    if (_pin.length == 6) {
      // Submit the verification code
      print('Verification code submitted: $_pin');
      _verifyPin();
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

  // 校验是否被锁定，如果十次返回false，如果十次且时间大于24小时返回true
  bool _checkLockStatus() {
    var _lockStatus = HiveService.getWalletData(LocalKeyList.passwordLock);
    if (_lockStatus != null) {
      var lockStatus = Map.from(_lockStatus);
      var _lockCount = lockStatus["lockCount"];
      var _lockTime = lockStatus["lockTime"];
      if (_lockCount >= 5 &&
          DateTime.now().millisecondsSinceEpoch - _lockTime < 60000) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  // 密码错误锁定次数增加
  void addPasswordErrorLock() {
    var _lockStatus = HiveService.getWalletData(LocalKeyList.passwordLock);
    print(_lockStatus);
    if (_lockStatus != null) {
      var lockStatus = Map.from(_lockStatus);
      var _lockCount = lockStatus["lockCount"];
      var _lockTime = lockStatus["lockTime"];
      if (_lockCount < 5) {
        HiveService.saveWalletData(LocalKeyList.passwordLock, {
          "lockCount": _lockCount + 1,
          "lockTime": DateTime.now().millisecondsSinceEpoch
        });
      } else {
        if (DateTime.now().millisecondsSinceEpoch - _lockTime > 60000) {
          HiveService.saveWalletData(LocalKeyList.passwordLock, {
            "lockCount": 1,
            "lockTime": DateTime.now().millisecondsSinceEpoch
          });
        } else {
          EasyLoading.showToast("密码错误次数过多，请稍后再试");
        }
      }
    } else {
      HiveService.saveWalletData(LocalKeyList.passwordLock,
          {"lockCount": 1, "lockTime": DateTime.now().millisecondsSinceEpoch});
    }
  }

  // 校验密码
  void _verifyPin() async {
    try {
      if (_checkLockStatus() == false) {
        setState(() {
          errorText = '当前密码错误次数过多，请次日再试';
          _pin = '';
        });
        return;
      }
      await EasyLoading.show(status: '校验中');
      var accountMap = HiveService.getWalletData(LocalKeyList.rootAddress);
      RootAccount account =
          RootAccount.fromJson(Map<String, dynamic>.from(accountMap));

      // 获取加密后的私钥
      String? encryptedPrivateKey =
          HiveService.getEncryptedPrivateKey(account.address);
      print(encryptedPrivateKey);
      if (encryptedPrivateKey != null) {
        String privateKey = decryptAES(encryptedPrivateKey, _pin);

        print("decryptedKey $privateKey");

        // 重置错误次数
        HiveService.saveWalletData(LocalKeyList.passwordLock, {
          "lockCount": 0,
          "lockTime": DateTime.now().millisecondsSinceEpoch
        });

        EasyLoading.dismiss();
        Get.back(result: privateKey);
      }
    } catch (e) {
      print("catch error $e");
      EasyLoading.dismiss();
      if (e.toString().contains("Invalid or corrupted pad block")) {
        addPasswordErrorLock();
        setState(() {
          errorText = '密码错误';
          _pin = '';
        });
        return;
      } else {
        final regex = RegExp(r'"([^"]+)"');
        final match = regex.firstMatch(e.toString());
        if (match != null) {
          print('Match found: ${match.group(1)}');
          setState(() {
            errorText = match.group(1) ?? '';
            // _pin = '';
          });
          EasyLoading.showError(match.group(1) ?? '');
        } else {
          setState(() {
            errorText = '未知错误, 请稍后重试';
            _pin = '';
          });
          print('No match found.');
        }
      }
      EasyLoading.dismiss();
    }
  }

  @override
  void initState() {
    super.initState();
    // _saveWalletAccount();
    // // owner = widget.owner;
    // print(
    //     "owner ${widget.owner.toSelected()} to ${widget.to} amount ${widget.amount}");
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20.w), topRight: Radius.circular(20.w)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            height: 15.w,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SizedBox(width: 15.w),
              IconButton(
                  onPressed: () {
                    Get.back();
                  },
                  icon: Icon(Icons.close_rounded,
                      size: 28.w, color: Colors.grey[600])),
              Expanded(
                  child: Center(
                child: Text("验证交易密码",
                    style: TextStyle(
                        fontSize: 18.sp, fontWeight: FontWeight.w700)),
              )),
              IconButton(
                  onPressed: () {},
                  icon: Icon(Icons.close_rounded,
                      size: 28.w, color: Colors.transparent)),
              SizedBox(width: 15.w),
            ],
          ).animate().fadeIn().move(duration: 500.ms),
          // SizedBox(height: 30.w),
          const Expanded(child: SizedBox()),
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
          Expanded(child: SizedBox()),
          // SizedBox(height: 50.w)
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
