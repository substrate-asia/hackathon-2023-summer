import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';

import '../controllers/account_controller.dart';
import 'login_view.dart';

class AccountView extends GetView<AccountController> {
  const AccountView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    final double statusBarHeight = MediaQuery.of(context).padding.top;
    final double screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            Stack(
              children: [
                Image.asset(
                  'assets/images/temp-top.png',
                  fit: BoxFit.cover,
                  width: screenWidth,
                ),
                Container(
                  width: screenWidth,
                  height: screenWidth,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        Theme.of(context).colorScheme.background.withOpacity(1),
                        Theme.of(context)
                            .colorScheme
                            .background
                            .withOpacity(0.8),
                        Theme.of(context)
                            .colorScheme
                            .background
                            .withOpacity(0.3),
                        Colors.transparent,
                        Theme.of(context)
                            .colorScheme
                            .background
                            .withOpacity(0.2),
                        Theme.of(context).colorScheme.background.withOpacity(1),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 15.w),
            Text("开启全新体验",
                style: TextStyle(fontSize: 28.sp, fontWeight: FontWeight.w700)),
            SizedBox(height: 15.w),
            Text("无需 Gas 费用，让您的交易更加便捷！",
                style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.w700)),
            SizedBox(height: 50.w),
            SizedBox(
              width: screenWidth - 60.w,
              height: 45.w,
              child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.greenAccent,
                    backgroundColor: Theme.of(context).colorScheme.onBackground,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(22.5.w),
                    ),
                  ),
                  onPressed: () {
                    Get.to(() => const LoginView(),
                        transition: Transition.downToUp);
                  },
                  child: Text(
                    "注册/登录",
                    style: TextStyle(
                        color: Theme.of(context).colorScheme.background,
                        fontSize: 16.sp,
                        fontWeight: FontWeight.w600),
                  )),
            ),
            SizedBox(height: 30.w),
            // 分割线
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 30.w),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("了解更多", style: TextStyle(fontSize: 12.sp)),
                  GestureDetector(
                    onTap: () {
                      Get.toNamed('/website', arguments: {
                        "title": "探索",
                        "url": "https://www.subdev.studio/explore"
                      });
                    },
                    child: Text("探索",
                        style: TextStyle(
                            fontSize: 12.sp,
                            color: Theme.of(context).colorScheme.primary)),
                  ),
                ],
              ),
            ),
            SizedBox(height: 15.w),

            SizedBox(
              width: screenWidth,
              height: 200.w,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: <Widget>[
                  SizedBox(width: 30.w),
                  // 生成五个sizedbox
                  ...List.generate(
                    3,
                    (index) => GestureDetector(
                        onTap: () {
                          Get.toNamed('/website', arguments: {
                            "title": "了解更多",
                            "url": "https://www.subdev.studio/explore"
                          });
                        },
                        child: Container(
                          width: 200.w,
                          margin: EdgeInsets.only(right: 10.w),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(6.w),
                            color: Theme.of(context)
                                .colorScheme
                                .surfaceVariant
                                .withOpacity(0.2),
                          ),
                          child: Column(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(6.w),
                                child: Image.asset(
                                  'assets/images/temp07.png',
                                  width: double.infinity,
                                  height: 100.w,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              SizedBox(height: 10.w),
                              Padding(
                                  padding:
                                      EdgeInsets.symmetric(horizontal: 15.w),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text("MPC钱包",
                                          style: TextStyle(
                                              fontSize: 16.sp,
                                              fontWeight: FontWeight.w600)),
                                      SizedBox(height: 5.w),
                                      Text("MPC钱包是一个去中心化的数字资产钱包，支持多链资产管理。",
                                          style: TextStyle(
                                              fontSize: 10.sp,
                                              color: Theme.of(context)
                                                  .colorScheme
                                                  .onSurfaceVariant)),
                                    ],
                                  ))
                            ],
                          ),
                        )),
                  ).toList(),
                  SizedBox(width: 30.w),
                ],
              ),
            ),

            SizedBox(height: 50.w),
          ],
        ),
      ),
    );
  }
}
