import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/modules/account/views/security_setting_view.dart';
import 'package:sunrise/app/modules/base/views/about_us_view.dart';
import 'package:sunrise/app/modules/base/views/assets_view.dart';
import 'package:sunrise/app/modules/base/views/preferences_view.dart';
import 'package:sunrise/app/modules/home/widgets/wallet_account_list.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

import '../controllers/home_controller.dart';

class TabProfileView extends StatelessWidget {
  const TabProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    WalletController walletController = Get.find<WalletController>();
    HomeController homeController = Get.find<HomeController>();
    return Scaffold(
      // appBar: AppBar(
      //   title: Text(
      //     "我的",
      //     style: TextStyle(fontSize: 18.sp),
      //   ),
      //   centerTitle: true,
      //   elevation: 0,
      //   actions: [
      //     IconButton(
      //         onPressed: () {
      //           Get.to(() => SecuritySettingView());
      //         },
      //         icon: Icon(Icons.settings_rounded, size: 24.sp))
      //   ],
      // ),
      body: Padding(
        padding: EdgeInsets.symmetric(vertical: 15.w),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                height: MediaQuery.of(context).padding.top,
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 15.w),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20.w),
                      child: Image.asset(
                        'assets/images/wallet-avatar.png',
                        width: 50.w,
                        height: 50.w,
                      ),
                    ),
                    SizedBox(width: 15.w),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Obx(() => Text(
                                  homeController.userEmail.value,
                                  style: TextStyle(
                                      fontSize: 24.sp,
                                      fontWeight: FontWeight.w600),
                                )),
                          ],
                        ),
                        SizedBox(height: 10.w),
                        GestureDetector(
                          onTap: () {
                            Get.bottomSheet(
                              const WalletAccountList(),
                              useRootNavigator: true,
                              backgroundColor: const Color(0xFF0a0a0a),
                              barrierColor: Colors.black.withOpacity(0.5),
                            );
                          },
                          child: Container(
                            padding: EdgeInsets.only(
                                left: 10.w, top: 3.w, bottom: 4.w, right: 5.w),
                            decoration: BoxDecoration(
                                color: Colors.white12,
                                borderRadius: BorderRadius.circular(20.w)),
                            child: Row(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  Text(
                                    "钱包信息",
                                    style: TextStyle(fontSize: 14.sp),
                                  ),
                                  SizedBox(width: 5.w),
                                  Icon(Icons.keyboard_arrow_right_rounded,
                                      size: 20.sp, color: Colors.white70)
                                ]),
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),
              SizedBox(height: 15.w),
              // Padding(
              //     padding: EdgeInsets.symmetric(horizontal: 15.w),
              //     child: Text("基本功能",
              //         style:
              //             TextStyle(fontSize: 12.sp, color: Colors.white54))),
              // SizedBox(height: 10.w),
              SizedBox(
                width: double.infinity,
                child: Wrap(
                  spacing: 8.0, // 子组件之间的水平间距
                  runSpacing: 8.0, // 行之间的垂直间距
                  alignment: WrapAlignment.spaceAround,
                  children: [
                    ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            padding: EdgeInsets.symmetric(
                                horizontal: 10.w, vertical: 10.w),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10.w)),
                            backgroundColor: Colors.transparent,
                            surfaceTintColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            foregroundColor: Colors.white),
                        onPressed: () {
                          Get.to(() => SecuritySettingView(),
                              transition: Transition.cupertino);
                        },
                        child: Column(
                          children: [
                            Container(
                              width: 40.w,
                              height: 40.w,
                              margin: EdgeInsets.only(bottom: 10.w),
                              decoration: BoxDecoration(
                                  color: Colors.white12,
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(10.w))),
                              child: Center(
                                child: Icon(Icons.security_rounded,
                                    size: 24.sp, color: Colors.white70),
                              ),
                            ),
                            Text(
                              "钱包安全",
                              style: TextStyle(fontSize: 12.sp),
                            )
                          ],
                        )),
                    ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            padding: EdgeInsets.symmetric(
                                horizontal: 10.w, vertical: 10.w),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10.w)),
                            backgroundColor: Colors.transparent,
                            surfaceTintColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            foregroundColor: Colors.white),
                        onPressed: () {
                          Get.to(() => AssetsView(),
                              transition: Transition.cupertino);
                        },
                        child: Column(
                          children: [
                            Container(
                              width: 40.w,
                              height: 40.w,
                              margin: EdgeInsets.only(bottom: 10.w),
                              decoration: BoxDecoration(
                                  color: Colors.white12,
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(10.w))),
                              child: Center(
                                child: Icon(
                                    Icons.account_balance_wallet_rounded,
                                    size: 24.sp,
                                    color: Colors.white70),
                              ),
                            ),
                            Text(
                              "资产管理",
                              style: TextStyle(fontSize: 12.sp),
                            )
                          ],
                        )),
                    ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            padding: EdgeInsets.symmetric(
                                horizontal: 10.w, vertical: 10.w),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10.w)),
                            backgroundColor: Colors.transparent,
                            surfaceTintColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            foregroundColor: Colors.white),
                        onPressed: () {
                          walletController.testsomething();
                        },
                        child: Column(
                          children: [
                            Container(
                              width: 40.w,
                              height: 40.w,
                              margin: EdgeInsets.only(bottom: 10.w),
                              decoration: BoxDecoration(
                                  color: Colors.white12,
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(10.w))),
                              child: Center(
                                child: Icon(Icons.book_rounded,
                                    size: 24.sp, color: Colors.white70),
                              ),
                            ),
                            Text(
                              "地址本",
                              style: TextStyle(fontSize: 12.sp),
                            )
                          ],
                        )),
                    ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            padding: EdgeInsets.symmetric(
                                horizontal: 10.w, vertical: 10.w),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10.w)),
                            backgroundColor: Colors.transparent,
                            surfaceTintColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            foregroundColor: Colors.white),
                        onPressed: () {
                          Get.to(() => PreferencesView(),
                              transition: Transition.cupertino);
                        },
                        child: Column(
                          children: [
                            Container(
                              width: 40.w,
                              height: 40.w,
                              margin: EdgeInsets.only(bottom: 10.w),
                              decoration: BoxDecoration(
                                  color: Colors.white12,
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(10.w))),
                              child: Center(
                                child: Icon(Icons.settings,
                                    size: 24.sp, color: Colors.white70),
                              ),
                            ),
                            Text(
                              "偏好设置",
                              style: TextStyle(fontSize: 12.sp),
                            )
                          ],
                        )),
                  ],
                ),
              ),
              SizedBox(
                height: 15.w,
              ),
              GestureDetector(
                onTap: () {
                  homeController.selectTab(1);
                },
                child: Container(
                    // height: 80.w,
                    margin: EdgeInsets.symmetric(horizontal: 10.w),
                    padding: EdgeInsets.only(
                        top: 10.w, bottom: 10.w, left: 15.w, right: 15.w),
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10.w),
                        color: Colors.white10),
                    child: Row(
                      children: [
                        Expanded(
                            child: SizedBox(
                          height: 60.w,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "参与兑换，赢取专属福利",
                                style: TextStyle(
                                    fontSize: 16.sp,
                                    fontWeight: FontWeight.bold),
                              ),
                              Row(
                                children: [
                                  Text("立即参与",
                                      style: TextStyle(
                                          fontSize: 12.sp,
                                          color: Colors.greenAccent)),
                                  SizedBox(width: 5.w),
                                  Icon(Icons.arrow_forward_ios_rounded,
                                      size: 12.sp, color: Colors.greenAccent)
                                ],
                              )
                            ],
                          ),
                        )),
                        Container(
                            margin: EdgeInsets.only(left: 15.w),
                            child: Image.asset(
                              "assets/images/ethelement.png",
                              fit: BoxFit.cover,
                              height: 80.w,
                            ))
                      ],
                    )),
              ),

              SizedBox(
                height: 15.w,
              ),
              Padding(
                  padding: EdgeInsets.symmetric(horizontal: 15.w),
                  child: Text("更多",
                      style:
                          TextStyle(fontSize: 12.sp, color: Colors.white54))),
              SizedBox(height: 10.w),
              Container(
                margin: EdgeInsets.symmetric(horizontal: 10.w),
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20.w),
                    color: Colors.white10),
                child: Column(
                  children: [
                    ListTile(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(0),
                      ),
                      leading: const Icon(Icons.help_outline_outlined,
                          color: Colors.white70),
                      trailing: Icon(
                        Icons.arrow_forward_ios_rounded,
                        size: 16.sp,
                      ),
                      minLeadingWidth: 5.w,
                      title: Text(
                        "帮助中心",
                        style: TextStyle(fontSize: 16.sp),
                      ),
                      onTap: () {
                        Get.toNamed('/website', arguments: {
                          "title": "帮助中心",
                          "url": "https://www.subdev.studio/help"
                        });
                      },
                    ),
                    ListTile(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(0),
                      ),
                      leading: Icon(
                        Icons.discord_rounded,
                        color: Colors.white70,
                      ),
                      trailing: Icon(
                        Icons.arrow_forward_ios_rounded,
                        size: 16.sp,
                      ),
                      minLeadingWidth: 5.w,
                      title: Text(
                        "加入社群",
                        style: TextStyle(fontSize: 16.sp),
                      ),
                      onTap: () {
                        Get.toNamed('/website', arguments: {
                          "title": "加入社群",
                          "url": "https://www.subdev.studio/help/community"
                        });
                      },
                    ),
                    ListTile(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(0),
                      ),
                      leading: const Icon(
                        Icons.info_outline_rounded,
                        color: Colors.white70,
                      ),
                      trailing: SizedBox(
                        width: 60.w,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "v1.0.0",
                              style: TextStyle(fontSize: 12.sp),
                            ),
                            Icon(
                              Icons.arrow_forward_ios_rounded,
                              size: 16.sp,
                            )
                          ],
                        ),
                      ),
                      minLeadingWidth: 5.w,
                      title: Text(
                        "关于我们",
                        style: TextStyle(fontSize: 16.sp),
                      ),
                      onTap: () {
                        Get.to(() => AboutUsView(),
                            transition: Transition.cupertino);
                      },
                    ),
                  ],
                ),
              ),
              SizedBox(height: 20.w),
              Container(
                margin: EdgeInsets.symmetric(horizontal: 10.w),
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20.w),
                    color: Colors.white10),
                child: Column(
                  children: [
                    ListTile(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(0),
                      ),
                      leading: const Icon(Icons.exit_to_app_rounded,
                          color: Colors.white70),
                      minLeadingWidth: 5.w,
                      title: Text(
                        "退出登录",
                        style: TextStyle(fontSize: 16.sp),
                      ),
                      onTap: () {
                        homeController.logout();
                      },
                    ),
                  ],
                ),
              ),
              SizedBox(
                height: 50.w,
              ),
              Center(
                child: Text(
                  "Self Wallet v1.0.0",
                  style: TextStyle(fontSize: 12.sp, color: Colors.white54),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
