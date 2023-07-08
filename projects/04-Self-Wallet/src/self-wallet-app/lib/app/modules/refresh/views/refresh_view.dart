import 'package:easy_refresh/easy_refresh.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/widgets/skeleton_item.dart';
import 'package:sunrise/app/widgets/wallet_sliver_delegate.dart';
import 'package:sunrise/core/utils/common.dart';

import '../controllers/refresh_controller.dart';

class RefreshView extends GetView<RefreshController> {
  const RefreshView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    double statusBarHeight = MediaQuery.of(context).padding.top;
    return Scaffold(
        // appBar: AppBar(
        //   title: const Text('RefreshView'),
        //   centerTitle: true,
        // ),
        backgroundColor: Color(0xFF262626),
        body: GetBuilder(
            init: RefreshController(),
            builder: (controller) => Center(
                  child: Text("测试"),
                )));
  }

  Widget _assetsCard(Balance asset, Function networkName) {
    return Container(
      width: 200.w,
      height: 138.w,
      margin: EdgeInsets.only(right: 15.w),
      padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 10.w),
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16.w),
          color: const Color(0xFF212020),
          image: const DecorationImage(
              image: AssetImage('assets/images/assets-bg.png'),
              alignment: Alignment.center,
              opacity: 0.7,
              fit: BoxFit.contain)),
      child: Container(
        color: Colors.black,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(networkName(asset.chainId),
                style: TextStyle(
                    fontSize: 24.sp,
                    color: Colors.white54,
                    fontWeight: FontWeight.w600)),
            SizedBox(height: 5.w),

            const Expanded(child: SizedBox()),
            Text("${weiToEth(asset.balance)} ${asset.tokenSymbol}",
                style: TextStyle(fontSize: 16.sp, color: Colors.white)),
            // Text("\$512.43",
            //     style: TextStyle(
            //         fontSize: 24.sp,
            //         color: Colors.white,
            //         fontWeight:
            //             FontWeight.w600)),
            SizedBox(
              height: 10.w,
            )
          ],
        ),
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
