import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:sunrise/app/data/providers/server_providers.dart';
import 'package:sunrise/core/utils/common.dart';

class ActiveProxyAccount extends StatefulWidget {
  final String address;
  const ActiveProxyAccount({super.key, required this.address});

  @override
  State<ActiveProxyAccount> createState() => _ActiveProxyAccountState();
}

class _ActiveProxyAccountState extends State<ActiveProxyAccount> {
  // 立即激活
  void activeProxyAccount() async {
    await EasyLoading.show(
        maskType: EasyLoadingMaskType.black,
        dismissOnTap: false,
        status: "创建中");
    String? proxyAddress = await Server.createUser(widget.address);
    if (proxyAddress != null) {
      Get.back(result: proxyAddress);
    } else {
      EasyLoading.showError('创建失败',
          dismissOnTap: true, duration: const Duration(seconds: 2));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 375.w,
      height: 350.w,
      decoration: BoxDecoration(
        // color: Colors.white,
        borderRadius: BorderRadius.circular(20.w),
      ),
      child: Column(
        children: [
          // ElevatedButton(
          //     onPressed: () {
          //       Get.back();
          //     },
          //     child: Text("取消")),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 5.w),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                    onPressed: () {
                      showHelpContent(
                          title: "什么是代理账号",
                          content:
                              "代理账号是一种特殊的账号，它可以帮助您在转账时节省GAS费用，但是代理账号不会拥有您的资产，也不会拥有您的私钥，您的私钥仍然由您自己保管。",
                          confirmText: "我知道了");
                    },
                    icon: Icon(Icons.help_outline_rounded)),

                // TextButton(onPressed: () {}, child: Text("什么是代理账号？")),
                TextButton(
                    onPressed: () {
                      Get.back();
                    },
                    child: Text("暂不激活"))
              ],
            ),
          ),
          Expanded(
              child: Center(
            child: Text("激活代理账号，转账支付免GAS", style: TextStyle(fontSize: 16.sp)),
          )),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 15.w),
            child: Text.rich(
              TextSpan(
                text: '点击立即激活代表您同意了Self Wallet的 ',
                style: TextStyle(
                    fontSize: 12.sp,
                    color: Theme.of(context).colorScheme.outline),
                children: [
                  TextSpan(
                    text: '代理账号服务条款',
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
                          "url": "https://www.subdev.studio/agreement/service"
                        });
                      },
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 15.w),
          Container(
            width: 375.w,
            padding: EdgeInsets.only(bottom: 50.w),
            decoration: BoxDecoration(
              color: Colors.black54,
              // border: Border(
              //     top: BorderSide(
              //         color: Theme.of(context).colorScheme.onBackground,
              //         width: 0.5.w)),
              borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(20.w),
                  bottomRight: Radius.circular(20.w)),
            ),
            child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.amberAccent,
                    padding: EdgeInsets.only(
                        top: 15.w,
                        bottom: MediaQuery.of(context).padding.bottom),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                            bottomLeft: Radius.circular(20),
                            bottomRight: Radius.circular(20))),
                    backgroundColor: Colors.transparent),
                onPressed: () {
                  activeProxyAccount();
                },
                child: Text(
                  "立即激活",
                  style: TextStyle(fontSize: 16.sp),
                )),
          )
        ],
      ),
    );
  }
}
