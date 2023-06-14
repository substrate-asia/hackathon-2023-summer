import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/core/utils/common.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class TokenDetailView extends StatefulWidget {
  Balance? asset;
  TokenDetailView({super.key, required this.asset});

  @override
  State<TokenDetailView> createState() => _TokenDetailViewState();
}

class _TokenDetailViewState extends State<TokenDetailView> {
  Balance get asset => widget.asset!;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '${asset.isContract ? asset.tokenName : asset.networkName} 详情',
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
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        // mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(height: 20.w),
          // Text("当前余额", style: TextStyle(fontSize: 12.sp)),
          SizedBox(
            height: 200,
            width: 200,
            child: QrImageView(
              data: asset.address,
              version: QrVersions.auto,
              size: 200.0,
              backgroundColor: Colors.white,
            ),
          ),
          SizedBox(
            height: 20,
            width: 375.w,
          ),
          Text(weiToEth(asset.balance),
              style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold)),
          Text("当前余额", style: TextStyle(fontSize: 12.sp)),

          // 地址
          SizedBox(
            height: 20.w,
          ),
          Text(
            asset.address,
            style: TextStyle(fontSize: 12.sp, color: Colors.grey),
          ),
          TextButton(
              onPressed: () {
                copyToClipboard(asset.address);
              },
              child: Text("复制地址")),
          // 立即转账
          SizedBox(
            height: 50.w,
          ),
          SizedBox(
            height: 45.w,
            width: 300.w,
            child: ElevatedButton(
              style: ButtonStyle(
                backgroundColor: MaterialStateProperty.all(Colors.white),
                shape: MaterialStateProperty.all(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(22.5.w),
                  ),
                ),
              ),
              onPressed: () async {
                await HiveService.saveData(
                    LocalKeyList.transferSelected, asset.toSelected());

                Get.toNamed('/transfer');
              },
              child: Text("立即转账",
                  style: TextStyle(fontSize: 16.sp, color: Colors.black)),
            ),
          ),
        ],
      ),
    );
  }
}
