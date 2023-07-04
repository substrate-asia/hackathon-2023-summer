import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:sunrise/core/utils/common.dart';

class CollectionAccount extends StatefulWidget {
  const CollectionAccount({super.key});

  @override
  State<CollectionAccount> createState() => _CollectionAccountState();
}

class _CollectionAccountState extends State<CollectionAccount> {
  @override
  Widget build(BuildContext context) {
    String walletAddress = Get.arguments['address'] ?? '';
    bool isProxy = Get.arguments['proxy'] ?? '';
    print("walletAddress $walletAddress");
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '接收',
          style: TextStyle(fontSize: 18.sp),
        ),
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
          SizedBox(height: 30.w),
          Center(
            child: ClipRRect(
              borderRadius: BorderRadius.all(Radius.circular(15.w)),
              child: QrImageView(
                data: walletAddress,
                version: QrVersions.auto,
                size: 200.0,
                backgroundColor: Colors.white,
              ),
            ),
          ),
          SizedBox(height: 30.w),
          Container(
            width: 300.w,
            padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 10.w),
            decoration: BoxDecoration(
              color: Colors.white10,
              borderRadius: BorderRadius.all(Radius.circular(10.w)),
            ),
            child: Text(walletAddress),
          ),

          // 复制地址
          SizedBox(height: 30.w),
          SizedBox(
            height: 45.w,
            width: 300.w,
            child: ElevatedButton(
              style: ButtonStyle(
                backgroundColor: MaterialStateProperty.all(Colors.white10),
                shape: MaterialStateProperty.all(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(22.5.w),
                  ),
                ),
              ),
              onPressed: () {
                copyToClipboard(walletAddress);
              },
              child: Text("复制地址",
                  style: TextStyle(fontSize: 16.sp, color: Colors.white)),
            ),
          ),

          SizedBox(height: 30.w),

          isProxy
              ? Container(
                  padding:
                      EdgeInsets.symmetric(horizontal: 20.w, vertical: 10.w),
                  child: Text(
                    "请勿向上述地址充值任何非 ${Get.arguments['symbol']} 资产，否则资产将不可找回。",
                    style: TextStyle(fontSize: 14.sp, color: Colors.white54),
                  ),
                )
              : Container(),
        ],
      ),
    );
  }
}
