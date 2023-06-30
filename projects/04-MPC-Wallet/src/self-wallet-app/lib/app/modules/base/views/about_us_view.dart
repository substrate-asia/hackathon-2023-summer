import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';

class AboutUsView extends GetView {
  const AboutUsView({Key? key}) : super(key: key);
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
      ),
      body: Column(
        children: [
          SizedBox(
            height: 20.h,
          ),
          Center(
            child: Image.asset(
              'assets/images/logo-mpc-light.png',
              width: 60.w,
              height: 60.w,
            ),
          ),
          SizedBox(
            height: 5.w,
          ),
          Text(
            "MPC WALLET",
            style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w500),
          ),
          SizedBox(
            height: 5.w,
          ),
          Text(
            "1.0.0",
            style: TextStyle(fontSize: 14.sp, color: Colors.white38),
          ),
          SizedBox(
            height: 60.w,
          ),
          ListTile(
            trailing: Icon(
              Icons.arrow_forward_ios_rounded,
              size: 16.sp,
            ),
            minLeadingWidth: 5.w,
            title: Text(
              "隐私政策与声明",
              style: TextStyle(fontSize: 16.sp),
            ),
            onTap: () {
              Get.toNamed('/website', arguments: {
                "title": "隐私政策与声明",
                "url": "https://www.subdev.studio/agreement/privacy"
              });
            },
          ),
          ListTile(
            trailing: Icon(
              Icons.arrow_forward_ios_rounded,
              size: 16.sp,
            ),
            minLeadingWidth: 5.w,
            title: Text(
              "隐私保护指引",
              style: TextStyle(fontSize: 16.sp),
            ),
            onTap: () {
              Get.toNamed('/website', arguments: {
                "title": "隐私保护指引",
                "url": "https://www.subdev.studio/agreement/privacy-guide"
              });
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
            trailing: SizedBox(
              width: 60.w,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "新版本",
                    style: TextStyle(fontSize: 14.sp),
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
              "检查更新",
              style: TextStyle(fontSize: 16.sp),
            ),
            onTap: () {},
          ),
          ListTile(
            trailing: SizedBox(
              width: 100.w,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    "12.34 MB",
                    style: TextStyle(fontSize: 14.sp),
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
              "清理缓存",
              style: TextStyle(fontSize: 16.sp),
            ),
            onTap: () {
              Get.to(() => AboutUsView(), transition: Transition.cupertino);
            },
          ),
        ],
      ),
    );
  }
}
