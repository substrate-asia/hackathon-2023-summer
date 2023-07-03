import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/core/utils/encryption.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

/// 修改密码
///
/// [private] 私钥
class ResetPinView extends StatefulWidget {
  String private;
  String address;

  ResetPinView({super.key, required this.private, required this.address});

  @override
  _ResetPinViewState createState() => _ResetPinViewState();
}

class _ResetPinViewState extends State<ResetPinView> {
  // await HiveService.saveData("test", list);
  String _pin = '';
  String errorText = '';
  String get private => widget.private;
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
        _changePin();
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

  _changePin() async {
    String encryptedKey = encryptAES(private, firstPin);
    // 把加密私钥保存到本地
    await HiveService.saveEncryptedPrivateKey(widget.address, encryptedKey);
    Get.back(result: 'ok');
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
                child: Text(firstPin == '' ? "输入新的交易密码" : "再次输入交易密码",
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
