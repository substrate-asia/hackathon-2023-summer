import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/app/modules/account/controllers/account_controller.dart';
import 'package:sunrise/app/widgets/verification_code_input.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'enter_pin_view.dart';
import 'sign_up_view.dart';

class PinCodeView extends GetView {
  const PinCodeView({Key? key}) : super(key: key);
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
        backgroundColor: Colors.black,
      ),
      backgroundColor: Colors.black,
      body: GetBuilder(
          init: AccountController(),
          builder: (controller) => Padding(
                padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 15.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text("输入验证码",
                            style: TextStyle(
                                fontSize: 24.sp, fontWeight: FontWeight.w700))
                        .animate()
                        .fadeIn() // uses `Animate.defaultDuration`
                        .move(duration: 300.ms),
                    SizedBox(height: 10.w),
                    Text("验证码已发送到 ${controller.emailController.text}",
                            style: TextStyle(
                                fontSize: 14.sp,
                                color: Theme.of(context).colorScheme.outline))
                        .animate()
                        .fadeIn(delay: 100.ms) // uses `Animate.defaultDuration`
                        .move(duration: 300.ms),
                    SizedBox(height: 30.w),
                    VerificationCodeInput(
                      key: controller.verificationCodeInputKey,
                      onChange: (p0) {
                        debugPrint("code: $p0");
                        controller.codeChange(p0);
                      },
                      onCompleted: (code) {
                        debugPrint("code: $code");
                        // controller.codeChange(code);

                        controller.createWalletAccount();
                      },
                    )
                        .animate()
                        .fadeIn(delay: 200.ms) // uses `Animate.defaultDuration`
                        .move(duration: 300.ms),
                    SizedBox(height: 30.w),
                    TextButton(
                            style: ButtonStyle(
                              overlayColor:
                                  MaterialStateProperty.all(Colors.transparent),
                            ),
                            onPressed: controller.countdown == 0
                                ? () {
                                    controller.sendVerificationCode();
                                  }
                                : null,
                            child: Text(controller.countdown == 0
                                ? "重新发送"
                                : "重新发送(${controller.countdown}秒)"))
                        .animate()
                        .fadeIn(delay: 300.ms) // uses `Animate.defaultDuration`
                        .move(duration: 300.ms),
                    const Expanded(child: SizedBox()),
                    SizedBox(
                      width: double.infinity,
                      height: 45.w,
                      child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Colors.greenAccent,
                            backgroundColor:
                                Theme.of(context).colorScheme.onBackground,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(22.5.w),
                            ),
                          ),
                          onPressed: controller.codeController.text.length != 6
                              ? null
                              : () {
                                  // Get.off(() => EnterPinView());
                                  // 关闭所有页面进入首页
                                  // Get.offAllNamed("/home");
                                  controller.createWalletAccount();
                                },
                          child: Text(
                            "进入钱包",
                            style: TextStyle(
                                color: Theme.of(context).colorScheme.background,
                                fontSize: 16.sp,
                                fontWeight: FontWeight.w600),
                          )),
                    )
                        .animate()
                        .fadeIn(delay: 400.ms) // uses `Animate.defaultDuration`
                        .move(duration: 300.ms),
                    SizedBox(
                      height: 50.w,
                    )
                  ],
                ),
              )),
    );
  }
}
