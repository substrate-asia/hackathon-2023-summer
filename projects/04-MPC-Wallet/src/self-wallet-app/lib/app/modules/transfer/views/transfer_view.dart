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
      builder: (controller) => controller.paymentBalance == null
          ? SizedBox()
          : Scaffold(
              appBar: AppBar(
                title: Text(controller.isProxyAccount ? '代理账号转账' : 'Web3账号转账',
                    style: TextStyle(fontSize: 18.sp)),
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
              body: controller.isProxyAccount
                  ? TransferForm(
                      key: controller.proxyKey,
                      isFree: true,
                      payment: controller.paymentBalance!)
                  : TransferForm(
                      key: controller.eoaKey,
                      isFree: false,
                      payment: controller.paymentBalance!,
                    ),
            ),
    );
  }
}
