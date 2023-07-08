import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';

import '../controllers/account_controller.dart';
import 'package:flutter_animate/flutter_animate.dart';

class LoginView extends GetView {
  const LoginView({Key? key}) : super(key: key);
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
            Icons.close_rounded,
            size: 24.sp,
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
                  children: [
                    Expanded(
                        child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text("欢迎来到Self Wallet",
                                  style: TextStyle(
                                      fontSize: 24.sp,
                                      fontWeight: FontWeight.w700))
                              .animate()
                              .fade(
                                duration: 300.ms,
                              ),
                          SizedBox(height: 10.w),
                          Text("很高兴见到您，让我们开始Web3之旅吧！",
                              style: TextStyle(
                                  fontSize: 14.sp, color: Colors.grey[500])),
                          SizedBox(height: 50.w).animate().fade(
                                duration: 300.ms,
                              ) // uses `Animate.defaultDuration`
                          ,
                          // Expanded(child: SizedBox()),
                          // 邮箱输入框
                          SizedBox(
                            child: TextField(
                              controller: controller.emailController,
                              maxLength: 30,
                              decoration: InputDecoration(
                                contentPadding: EdgeInsets.symmetric(
                                    vertical: 0, horizontal: 15.w),
                                hintText: "请输入邮箱",
                                hintStyle: TextStyle(
                                    fontSize: 16.sp,
                                    color:
                                        Theme.of(context).colorScheme.primary),
                                errorText: controller.emailError,
                                counterText: "",
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(15.w),
                                  borderSide: BorderSide.none,
                                ),
                                suffixIcon: controller
                                        .emailController.text.isNotEmpty
                                    ? IconButton(
                                        icon: Transform.rotate(
                                          angle: 180 / 45,
                                          child: const Icon(
                                              Icons.add_circle_outline_rounded),
                                        ),
                                        onPressed: () {
                                          controller.emailController.clear();
                                          controller.updateEmailError("");
                                        },
                                      )
                                    : null,
                                filled: true,
                                fillColor: const Color(0xFF262626),
                              ),
                              onChanged: (value) {
                                // debugPrint(value);
                                // 判断邮箱格式
                                if (!GetUtils.isEmail(value)) {
                                  controller.updateEmailError("邮箱格式不正确");
                                } else {
                                  controller.updateEmailError("");
                                }
                              },
                            ),
                          )
                              .animate()
                              .fade(
                                duration: 300.ms,
                              ) // uses `Animate.defaultDuration`
                              .move(
                                  duration: 300.ms,
                                  begin: const Offset(0, 50),
                                  end: const Offset(0, 0)),
                          SizedBox(
                            child: TextField(
                              controller: controller.codeController,
                              maxLength: 6,
                              decoration: InputDecoration(
                                contentPadding: EdgeInsets.symmetric(
                                    vertical: 0, horizontal: 15.w),
                                hintText: "请输入验证码",
                                hintStyle: TextStyle(
                                    fontSize: 16.sp,
                                    color:
                                        Theme.of(context).colorScheme.primary),
                                // errorText: controller.emailError,
                                counterText: "",
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(15.w),
                                  borderSide: BorderSide.none,
                                ),
                                suffixIcon: TextButton(
                                    style: ButtonStyle(
                                      overlayColor: MaterialStateProperty.all(
                                          Colors.transparent),
                                    ),
                                    child: Text(
                                      controller.countdown == 0
                                          ? "发送验证码"
                                          : "重新发送(${controller.countdown}秒)",
                                      style: TextStyle(
                                          fontSize: 14.sp,
                                          color: Colors.white70),
                                    ),
                                    onPressed: controller.countdown == 0
                                        ? () {
                                            controller.sendVerificationCode();
                                          }
                                        : null),
                                filled: true,
                                fillColor: const Color(0xFF262626),
                              ),
                              onSubmitted: (value) {
                                controller.createWalletAccount();
                              },
                            ),
                          )
                              .animate()
                              .fade(
                                duration: 300.ms,
                              ) // uses `Animate.defaultDuration`
                              .move(
                                  duration: 300.ms,
                                  begin: const Offset(0, 50),
                                  end: const Offset(0, 0)),
                        ],
                      ),
                    )),
                    Text.rich(
                      TextSpan(
                        text: '点击下一步代表您同意了MPC WALLET的 ',
                        style: TextStyle(
                            fontSize: 12.sp,
                            color: Theme.of(context).colorScheme.outline),
                        children: [
                          TextSpan(
                            text: '服务条款',
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.primary,
                              // decoration: TextDecoration.underline
                            ),
                            recognizer: TapGestureRecognizer()
                              ..onTap = () {
                                // TODO: 处理服务条款点击事件
                                debugPrint("hello world2");
                                Get.toNamed('/website', arguments: {
                                  "title": "服务条款",
                                  "url":
                                      "https://www.subdev.studio/agreement/service"
                                });
                              },
                          ),
                          const TextSpan(text: '、'),
                          TextSpan(
                            text: '隐私政策与声明',
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.primary,
                              // decoration: TextDecoration.underline,
                            ),
                            recognizer: TapGestureRecognizer()
                              ..onTap = () {
                                debugPrint("hello world");
                                Get.toNamed('/website', arguments: {
                                  "title": "隐私政策与声明",
                                  "url":
                                      "https://www.subdev.studio/agreement/privacy"
                                });
                              },
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 15.w),
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
                          onPressed: controller.isEmailValid
                              ? () {
                                  controller.createWalletAccount();
                                }
                              : null,
                          child: Text(
                            "下一步",
                            style: TextStyle(
                                color: Theme.of(context).colorScheme.background,
                                fontSize: 16.sp,
                                fontWeight: FontWeight.w600),
                          )),
                    ),
                    SizedBox(
                      height: 50.w,
                    )
                  ],
                ),
              )),
    );
  }
}
