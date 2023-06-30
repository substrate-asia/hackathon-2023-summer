import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:flutter_animate/flutter_animate.dart';
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
      backgroundColor: Colors.black,
      body: NestedScrollView(
          headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
            return [
              SliverOverlapAbsorber(
                handle:
                    NestedScrollView.sliverOverlapAbsorberHandleFor(context),
                sliver: SliverAppBar(
                  backgroundColor: Colors.black,
                  expandedHeight: 200.w,
                  floating: false,
                  pinned: true,
                  flexibleSpace: FlexibleSpaceBar(
                    title: null,
                    background: Image.asset(
                      'assets/images/temp06.png',
                      fit: BoxFit.cover,
                    ),
                  ),
                  centerTitle: true,
                  surfaceTintColor: Colors.black,
                  title: Text(
                    '我的',
                    style: TextStyle(
                        fontSize: 18.sp,
                        fontWeight: FontWeight.w600,
                        color: Colors.white),
                  ),
                  actions: [
                    IconButton(
                      icon: const Icon(Icons.message_rounded),
                      onPressed: () {
                        Get.toNamed('/notice');
                      },
                    )
                  ],
                ),
              )
            ];
          },
          body: Padding(
            padding: EdgeInsets.symmetric(vertical: 15.w),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    height: MediaQuery.of(context).padding.top * 2,
                  ),
                  Container(
                    padding:
                        EdgeInsets.symmetric(horizontal: 15.w, vertical: 15.w),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Text(
                              homeController.userEmail,
                              style: TextStyle(
                                  fontSize: 24.sp, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        SizedBox(height: 10.w),
                        GestureDetector(
                          onTap: () {
                            Get.bottomSheet(
                              WalletAccountList(),
                              useRootNavigator: true,
                              backgroundColor: const Color(0xFF0a0a0a),
                              barrierColor: Colors.black.withOpacity(0.5),
                            );
                          },
                          child: Container(
                            width: 100.w,
                            color: Colors.transparent,
                            child: Row(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  Text(
                                    "钱包信息",
                                    style: TextStyle(fontSize: 14.sp),
                                  ),
                                  SizedBox(width: 5.w),
                                  Icon(Icons.remove_red_eye_rounded,
                                      size: 20.sp, color: Colors.white70)
                                ]),
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 15.w),
                  Padding(
                      padding: EdgeInsets.symmetric(horizontal: 15.w),
                      child: Text("基本功能",
                          style: TextStyle(
                              fontSize: 12.sp, color: Colors.white54))),
                  SizedBox(height: 10.w),
                  Container(
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20.w),
                        color: Colors.transparent),
                    child: Column(
                      children: [
                        ListTile(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(0),
                          ),
                          leading: Icon(
                            Icons.account_balance_wallet_rounded,
                            color: Colors.white70,
                          ),
                          trailing: Icon(
                            Icons.arrow_forward_ios_rounded,
                            size: 16.sp,
                          ),
                          minLeadingWidth: 5.w,
                          title: Text(
                            "钱包安全",
                            style: TextStyle(fontSize: 16.sp),
                          ),
                          onTap: () {
                            Get.to(() => SecuritySettingView(),
                                transition: Transition.cupertino);
                          },
                        ),
                        ListTile(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(0),
                          ),
                          leading: Icon(
                            Icons.generating_tokens_rounded,
                            color: Colors.white70,
                          ),
                          trailing: Icon(
                            Icons.arrow_forward_ios_rounded,
                            size: 16.sp,
                          ),
                          minLeadingWidth: 5.w,
                          title: Text(
                            "资产管理",
                            style: TextStyle(fontSize: 16.sp),
                          ),
                          onTap: () {
                            Get.to(() => AssetsView(),
                                transition: Transition.cupertino);
                          },
                        ),
                        ListTile(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(0),
                          ),
                          leading:
                              Icon(Icons.book_rounded, color: Colors.white70),
                          trailing: Icon(
                            Icons.arrow_forward_ios_rounded,
                            size: 16.sp,
                          ),
                          minLeadingWidth: 5.w,
                          title: Text(
                            "地址本",
                            style: TextStyle(fontSize: 16.sp),
                          ),
                          onTap: () {
                            walletController.testsomething();
                          },
                        ),
                        ListTile(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(0),
                          ),
                          leading: Icon(Icons.settings, color: Colors.white70),
                          trailing: Icon(
                            Icons.arrow_forward_ios_rounded,
                            size: 16.sp,
                          ),
                          minLeadingWidth: 5.w,
                          title: Text(
                            "偏好设置",
                            style: TextStyle(fontSize: 16.sp),
                          ),
                          onTap: () {
                            Get.to(() => PreferencesView(),
                                transition: Transition.cupertino);
                          },
                        ),
                      ],
                    ),
                  ),
                  Divider(
                    height: 30.w,
                    thickness: 1.w,
                    color: Colors.white12,
                  ),
                  Padding(
                      padding: EdgeInsets.symmetric(horizontal: 15.w),
                      child: Text("更多",
                          style: TextStyle(
                              fontSize: 12.sp, color: Colors.white54))),
                  SizedBox(height: 10.w),
                  Container(
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20.w),
                        color: Colors.transparent),
                    child: Column(
                      children: [
                        ListTile(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(0),
                          ),
                          leading: Icon(Icons.help_outline_outlined),
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
                          leading: Icon(Icons.discord_rounded),
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
                          onTap: () async {
                            await HiveService.deleteData(
                                LocalKeyList.transferSelected);
                            await HiveService.deleteWalletData(
                                LocalKeyList.rootAddress);
                            Get.offAllNamed('/account');
                          },
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          )),
    );
  }
}
