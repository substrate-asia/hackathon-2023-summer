import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/widgets/image_widget.dart';
import 'package:sunrise/core/utils/common.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

import 'colletcion_account.dart';

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
        title: SizedBox(
          width: 150.w,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(14.w),
                child: ImageWidget(
                  imageUrl: asset.tokenIconUrl,
                  width: 28.w,
                  height: 28.w,
                ),
              ),
              SizedBox(width: 5.w),
              Text(
                (asset.isContract ? asset.tokenSymbol : asset.nativeSymbol)
                    .toUpperCase(),
                style: TextStyle(fontSize: 18.sp),
              )
            ],
          ),
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
        crossAxisAlignment: CrossAxisAlignment.center,
        // mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            height: 30.w,
          ),
          Text(weiToEth(asset.balance),
              style: TextStyle(fontSize: 38.sp, fontWeight: FontWeight.bold)),

          SizedBox(
            height: 15.w,
          ),
          Text("当前余额",
              style: TextStyle(fontSize: 12.sp, color: Colors.white70)),

          // 地址
          SizedBox(
            height: 20.w,
          ),
          SizedBox(
              width: 160.w,
              child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.only(
                          left: 10.w, top: 10.w, bottom: 10.w, right: 10.w),
                      backgroundColor: Colors.white10),
                  onPressed: () {
                    copyToClipboard(asset.address);
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        addressFormat(asset.address),
                        style: TextStyle(
                            fontSize: 12.sp,
                            color: Colors.grey,
                            letterSpacing: 0.7),
                      ),
                      Icon(
                        Icons.copy_all_rounded,
                        size: 20.sp,
                        color: Colors.grey,
                      )
                    ],
                  ))),

          // 立即转账
          SizedBox(
            height: 50.w,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _homeButton(context,
                  name: "转账", icon: const Icon(Icons.arrow_upward_rounded),
                  onPressed: () async {
                await HiveService.saveData(
                    LocalKeyList.transferSelected, asset.toSelected());
                Get.toNamed('/transfer', arguments: asset.isProxy);
              }),
              SizedBox(
                width: 50.w,
              ),
              _homeButton(context,
                  name: "收款", icon: const Icon(Icons.arrow_downward_rounded),
                  onPressed: () {
                Get.to(() => const CollectionAccount(),
                    arguments: {
                      "address": asset.address,
                      "proxy": asset.isProxy
                    },
                    transition: Transition.cupertinoDialog);
              }),
            ],
          ),

          Expanded(
              child: Center(
                  child: SizedBox(
                      width: 160.w,
                      child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                              padding: EdgeInsets.only(
                                  left: 10.w,
                                  top: 10.w,
                                  bottom: 10.w,
                                  right: 10.w),
                              backgroundColor: Colors.white10),
                          onPressed: () {
                            Get.toNamed('/website', arguments: {
                              "title": "交易记录",
                              "url":
                                  "https://moonbase.moonscan.io/address/${asset.address}"
                            });
                          },
                          child: Text(
                            "去浏览器查看",
                            style:
                                TextStyle(fontSize: 12.sp, color: Colors.white),
                          )))))
        ],
      ),
    );
  }

  Widget _homeButton(BuildContext context,
      {Function? onPressed, String? name, Widget? icon}) {
    return Container(
        margin: EdgeInsets.symmetric(horizontal: 5.w),
        width: 45.w,
        child: ElevatedButton(
            style: ButtonStyle(
              padding: MaterialStateProperty.all(EdgeInsets.zero),
              backgroundColor: MaterialStateProperty.all(Colors.transparent),
              shadowColor: MaterialStateProperty.all(Colors.transparent),
              elevation: MaterialStateProperty.all(0),
              overlayColor: MaterialStateProperty.resolveWith(
                  (states) => Colors.transparent),
            ),
            onPressed: () {
              onPressed?.call();
            },
            child: Column(
              children: [
                Container(
                  width: 45.w,
                  height: 45.w,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(23.w),
                    border: Border.all(color: Colors.white.withOpacity(0.5)),
                  ),
                  child: icon ?? const Icon(Icons.arrow_upward_rounded),
                ),
                SizedBox(height: 10.w),
                Text(name ?? "",
                    style: TextStyle(
                        color: Colors.white.withOpacity(0.5), fontSize: 12.sp))
              ],
            )));
  }
}
