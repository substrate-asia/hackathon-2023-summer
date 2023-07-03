import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';

import '../widgets/language_setting.dart';
import '../widgets/mode_setting.dart';
import '../widgets/unit_setting.dart';
import 'node_manage_view.dart';

class PreferencesView extends GetView {
  const PreferencesView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    WalletController walletController = Get.find();
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '偏好设置',
          style: TextStyle(fontSize: 18.sp),
        ),
        centerTitle: false,
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
      body: SingleChildScrollView(
        child: Column(
          children: [
            ListTile(
              trailing: SizedBox(
                width: 100.w,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      "默认",
                      style: TextStyle(fontSize: 12.sp),
                    ),
                    SizedBox(width: 10.w),
                    Icon(
                      Icons.arrow_forward_ios_rounded,
                      size: 16.sp,
                    )
                  ],
                ),
              ),
              minLeadingWidth: 5.w,
              title: Text(
                "语言",
                style: TextStyle(fontSize: 16.sp),
              ),
              onTap: () {
                Get.bottomSheet(
                  const LanguageSettingWidget(),
                  useRootNavigator: true,
                  backgroundColor: const Color(0xFF0a0a0a),
                  barrierColor: Colors.black.withOpacity(0.5),
                );
              },
            ),
            ListTile(
              trailing: SizedBox(
                width: 100.w,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      "CNY",
                      style: TextStyle(fontSize: 12.sp),
                    ),
                    SizedBox(width: 10.w),
                    Icon(
                      Icons.arrow_forward_ios_rounded,
                      size: 16.sp,
                    )
                  ],
                ),
              ),
              minLeadingWidth: 5.w,
              title: Text(
                "货币单位",
                style: TextStyle(fontSize: 16.sp),
              ),
              onTap: () {
                Get.bottomSheet(
                  UnitSettingWidget(),
                  useRootNavigator: true,
                  backgroundColor: const Color(0xFF0a0a0a),
                  barrierColor: Colors.black.withOpacity(0.5),
                );
              },
            ),
            ListTile(
              trailing: SizedBox(
                width: 100.w,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      "深色模式",
                      style: TextStyle(fontSize: 12.sp),
                    ),
                    SizedBox(width: 10.w),
                    Icon(
                      Icons.arrow_forward_ios_rounded,
                      size: 16.sp,
                    )
                  ],
                ),
              ),
              minLeadingWidth: 5.w,
              title: Text(
                "主题模式",
                style: TextStyle(fontSize: 16.sp),
              ),
              onTap: () {
                Get.bottomSheet(
                  ModeSettingWidget(),
                  useRootNavigator: true,
                  backgroundColor: const Color(0xFF0a0a0a),
                  barrierColor: Colors.black.withOpacity(0.5),
                );
              },
            ),
            Padding(
                padding: EdgeInsets.symmetric(horizontal: 15.w),
                child: Divider(
                  height: 20.w,
                  thickness: 1.w,
                  color: Colors.white12,
                )),
            ListTile(
              trailing: Icon(
                Icons.arrow_forward_ios_rounded,
                size: 16.sp,
              ),
              minLeadingWidth: 5.w,
              title: Text(
                "节点设置",
                style: TextStyle(fontSize: 16.sp),
              ),
              onTap: () {
                Get.to(() => const NodeManageView(),
                    transition: Transition.cupertino);
              },
            ),
            ListTile(
              minLeadingWidth: 5.w,
              title: Text(
                "默认节点",
                style: TextStyle(fontSize: 16.sp),
              ),
              onTap: () async {
                EasyLoading.show(status: '恢复中');
                walletController.resetDefaultNetwork();
                EasyLoading.dismiss();
              },
            ),
          ],
        ),
      ),
    );
  }
}
