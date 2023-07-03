import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';

import '../controllers/splash_controller.dart';

class SplashView extends GetView<SplashController> {
  const SplashView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    final double statusBarHeight = MediaQuery.of(context).padding.top;
    final double screenWidth = MediaQuery.of(context).size.width;
    SplashController controller = Get.put(SplashController());
    return Scaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          SizedBox(height: 50.w),
          Center(
            child: Opacity(
                opacity: 0.5, // 设置不透明度为50%
                child: Image.asset(
                  'assets/images/selfwallet_logo.png',
                  width: 300.w,
                  height: 300.w,
                )),
          ),
          SizedBox(
              height: 100.w,
              child: Column(
                children: [
                  Text("开启钱包全新旅程",
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 14.sp,
                      )),
                  SizedBox(height: 15.sp),
                  Obx(() => Text("${controller.appVerson}",
                      style: TextStyle(
                        color: Colors.white38,
                        fontSize: 12.sp,
                      )))
                ],
              )),
        ],
      ),
    );
  }
}
