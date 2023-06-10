import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/core/utils/common.dart';

import '../controllers/transfer_controller.dart';
import 'transfer_form.dart';

class TransferView extends GetView<TransferController> {
  const TransferView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return GetBuilder(
        init: TransferController(),
        builder: (controller) => DefaultTabController(
              length: 2,
              initialIndex: controller.defaultTab,
              child: Scaffold(
                appBar: AppBar(
                  title: TabBar(
                    // indicator: BoxDecoration(),
                    controller: controller.tabController,
                    overlayColor: MaterialStateProperty.all(Colors.transparent),
                    dividerColor: Colors.transparent,
                    onTap: (index) {
                      print("切换tab $index");
                      controller.changeTab(index);
                    },
                    tabs: const [
                      Tab(text: "EOA转账"),
                      Tab(text: "免GAS转账"),
                    ],
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
                  actions: [
                    IconButton(
                        onPressed: () {
                          controller.test();
                          // controller.showInfo();
                        },
                        icon: const Icon(Icons.info_outline))
                  ],
                ),
                // backgroundColor: Colors.transparent,
                body: TabBarView(
                  controller: controller.tabController,

                  // physics: NeverScrollableScrollPhysics(),
                  children: [
                    controller.paymentBalance == null
                        ? const SizedBox()
                        : TransferForm(
                            key: controller.eoaKey,
                            isFree: false,
                            payment: controller.paymentBalance!,
                          ),
                    controller.paymentBalance == null
                        ? const SizedBox()
                        : TransferForm(
                            // key: Key("PROXY"),
                            key: controller.proxyKey,
                            isFree: true,
                            payment: controller.paymentBalance!),
                  ],
                ),
              ),
            ));
  }
}
