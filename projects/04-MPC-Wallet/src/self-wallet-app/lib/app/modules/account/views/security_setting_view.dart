import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/core/utils/common.dart';

class SecuritySettingView extends GetView {
  const SecuritySettingView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '账号安全',
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ListTile(
              trailing: SizedBox(
                width: 100.w,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Transform.scale(
                        scale: 0.8,
                        alignment: Alignment.centerRight,
                        child: Switch.adaptive(
                          value: true,
                          onChanged: (newValue) async {},
                          activeColor: Theme.of(context).colorScheme.primary,
                          // activeTrackColor:
                          //     Theme.of(context).colorScheme.primary,
                        ))
                  ],
                ),
              ),
              leading: Icon(Icons.fingerprint_rounded, color: Colors.white70),
              minLeadingWidth: 5.w,
              title: Text(
                "生物识别",
                style: TextStyle(fontSize: 16.sp),
              ),
            ),
            ListTile(
              trailing: SizedBox(
                width: 100.w,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Transform.scale(
                        scale: 0.8,
                        alignment: Alignment.centerRight,
                        child: Switch.adaptive(
                          value: false,
                          onChanged: (newValue) async {},
                          activeColor: Theme.of(context).colorScheme.primary,
                          activeTrackColor:
                              Theme.of(context).colorScheme.primary,
                        ))
                  ],
                ),
              ),
              leading:
                  const Icon(Icons.lock_open_rounded, color: Colors.white70),
              minLeadingWidth: 5.w,
              title: Row(
                children: [
                  Text(
                    "免密支付",
                    style: TextStyle(fontSize: 16.sp),
                  ),
                  // SizedBox(width: 5.w),
                  GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () {
                      showHelpContent(
                          title: "免密支付",
                          content:
                              "免密支付是指在支付时不需要输入交易密码，直接完成支付。免密支付开启后，您可以在支付时选择是否输入交易密码。",
                          confirmText: "我知道了");
                    },
                    child: Container(
                      width: 20.sp,
                      height: 20.sp,
                      color: Colors.transparent,
                      child: Center(
                        child: Icon(Icons.help_outline_rounded,
                            color: Colors.white54, size: 16.sp),
                      ),
                    ),
                  )
                ],
              ),
            ),
            ListTile(
              trailing: Icon(
                Icons.arrow_forward_ios_rounded,
                size: 16.sp,
              ),
              leading: Icon(Icons.password_rounded, color: Colors.white70),
              minLeadingWidth: 5.w,
              title: Text(
                "修改交易密码",
                style: TextStyle(fontSize: 16.sp),
              ),
              onTap: () {},
            ),
            Padding(
                padding: EdgeInsets.symmetric(horizontal: 15.w),
                child: Divider(
                  height: 20.w,
                  thickness: 1.w,
                  color: Colors.white12,
                )),
            Padding(
                padding: EdgeInsets.only(
                    left: 15.w, right: 15.w, top: 15.w, bottom: 15.w),
                child: Text(
                  "安全案例",
                  style: TextStyle(fontSize: 16.sp, color: Colors.white54),
                )),
            Container(
              margin: EdgeInsets.symmetric(horizontal: 15.w, vertical: 5.w),
              decoration: BoxDecoration(
                border: Border.all(
                  color: Colors.white24,
                  width: 1.0,
                ),
                borderRadius: BorderRadius.circular(10.w),
              ),
              child: ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.w),
                ),
                title: Text('假代币诈骗'),
                onTap: () {
                  Get.toNamed('/website', arguments: {
                    "title": "假代币诈骗",
                    "url": "https://www.subdev.studio/security/case/1"
                  });
                },
              ),
            ),
            Container(
              margin: EdgeInsets.symmetric(horizontal: 15.w, vertical: 5.w),
              decoration: BoxDecoration(
                border: Border.all(
                  color: Colors.white24,
                  width: 1.0,
                ),
                borderRadius: BorderRadius.circular(10.w),
              ),
              child: ListTile(
                onTap: () {
                  Get.toNamed('/website', arguments: {
                    "title": "假二维码诈骗",
                    "url": "https://www.subdev.studio/security/case/2"
                  });
                },
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.w),
                ),
                title: Text('假二维码诈骗'),
              ),
            ),
            // Generated code for this Switch Widget...
          ],
        ),
      ),
    );
  }
}
