import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:get/get_connect/http/src/utils/utils.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/modules/home/controllers/swap_controller.dart';
import 'package:sunrise/app/modules/home/widgets/swap_token.dart';
import 'package:sunrise/app/widgets/image_widget.dart';
import 'package:sunrise/core/utils/common.dart';
import 'package:web3dart/web3dart.dart';

import '../widgets/token_select.dart';

class TabSwapView extends StatelessWidget {
  TabSwapView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text('兑换',
              style: TextStyle(
                  fontSize: 18.sp,
                  fontWeight: FontWeight.w600,
                  color: Colors.white))),
      body: GetBuilder(
          init: SwapController(),
          builder: (controller) => Padding(
                padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 15.w),
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      Stack(
                        children: [
                          Column(
                            children: [
                              Container(
                                height: 100.w,
                                padding: EdgeInsets.symmetric(
                                    horizontal: 10.w, vertical: 10.w),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF212020),
                                  borderRadius: BorderRadius.only(
                                      topLeft: Radius.circular(15.w),
                                      topRight: Radius.circular(15.w)),
                                ),
                                child: Column(
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          "支付",
                                          style: _smallTitle,
                                        ),
                                        const Expanded(child: SizedBox()),
                                        Text(
                                          "余额：",
                                          style: _smallTitle,
                                        ),
                                        Text(
                                          weiToEth(
                                              controller.enterAccount?.balance),
                                          style: _smallTitle.merge(TextStyle(
                                              color: Colors.green[500])),
                                        )
                                      ],
                                    ),
                                    SizedBox(height: 8.w),
                                    Row(
                                      children: [
                                        controller.enterAccount != null
                                            ? _swapButton(
                                                controller.enterAccount!, false,
                                                onTap: (account, isEnter) {
                                                controller.selectToken(
                                                    account, isEnter);
                                              },
                                                chainId: controller.swapChainId,
                                                status: 1)
                                            : const SizedBox(),
                                        const Expanded(child: SizedBox()),
                                        // TextField 输出金额
                                        SizedBox(
                                          width: 162.5.w,
                                          child: TextField(
                                              controller:
                                                  controller.enterController,
                                              keyboardType: const TextInputType
                                                      .numberWithOptions(
                                                  decimal: true),
                                              decoration: const InputDecoration(
                                                hintText: '0.00',
                                                border: InputBorder.none,
                                              ),
                                              textAlign: TextAlign.right,
                                              style: TextStyle(
                                                fontWeight: FontWeight.w600,
                                                fontSize: 24.sp, // 设置字体大小
                                              ),
                                              inputFormatters: [
                                                FilteringTextInputFormatter
                                                    .allow(RegExp(
                                                        r'^\d+\.?\d{0,6}')),
                                              ],
                                              onChanged: (value) {
                                                controller.calculate();
                                              }),
                                        )
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              SizedBox(
                                height: 4.w,
                                child: Center(
                                  child: LinearProgressIndicator(
                                    value: controller.progress,
                                    minHeight: 1.w,
                                    color: Colors.greenAccent,
                                    // valueColor: const AlwaysStoppedAnimation<Color>(
                                    //     Colors.greenAccent),
                                    backgroundColor: Colors.transparent,
                                  ),
                                ),
                              ),
                              Container(
                                height: 100.w,
                                padding: EdgeInsets.symmetric(
                                    horizontal: 10.w, vertical: 10.w),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF212020),
                                  borderRadius: BorderRadius.only(
                                      bottomLeft: Radius.circular(15.w),
                                      bottomRight: Radius.circular(15.w)),
                                ),
                                child: Column(
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          "接收",
                                          style: _smallTitle,
                                        ),
                                        const Expanded(child: SizedBox()),
                                        Text(
                                          "余额：",
                                          style: _smallTitle,
                                        ),
                                        Text(
                                          weiToEth(controller
                                              .outputAccount?.balance),
                                          style: _smallTitle.merge(TextStyle(
                                              color: Colors.green[500])),
                                        )
                                      ],
                                    ),
                                    SizedBox(height: 8.w),
                                    Row(
                                      children: [
                                        controller.outputAccount != null
                                            ? _swapButton(
                                                controller.outputAccount!, true,
                                                onTap: (account, isEnter) {
                                                controller.selectToken(
                                                    account, isEnter);
                                              },
                                                chainId: controller.swapChainId,
                                                status: 1)
                                            : const SizedBox(),
                                        const Expanded(child: SizedBox()),
                                        // TextField 输入金额
                                        SizedBox(
                                          width: 162.5.w,
                                          child: TextField(
                                              controller:
                                                  controller.outputController,
                                              keyboardType: const TextInputType
                                                      .numberWithOptions(
                                                  decimal: true),
                                              decoration: const InputDecoration(
                                                hintText: '0.00',
                                                border: InputBorder.none,
                                              ),
                                              textAlign: TextAlign.right,
                                              style: TextStyle(
                                                fontWeight: FontWeight.w600,
                                                fontSize: 24.sp, // 设置字体大小
                                              ),
                                              inputFormatters: [
                                                FilteringTextInputFormatter
                                                    .allow(RegExp(
                                                        r'^\d+\.?\d{0,6}')),
                                              ],
                                              onChanged: (value) {
                                                controller.reverseCalculate();
                                              }),
                                        )
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          Positioned(
                              top: 100.w - 20.w,
                              left: 310.w / 2,
                              child: Container(
                                height: 40.w,
                                width: 40.w,
                                padding: EdgeInsets.all(4.w),
                                decoration: BoxDecoration(
                                    color: Colors.black,
                                    borderRadius: BorderRadius.circular(20.w)),
                                child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                        backgroundColor: Theme.of(context)
                                            .colorScheme
                                            .primary,
                                        onPrimary: Colors.white,
                                        padding: EdgeInsets.zero),
                                    onPressed: () {
                                      controller.exchangeAccount();
                                    },
                                    child: Icon(
                                      Icons.swap_vert_outlined,
                                      size: 24.w,
                                      color: Colors.white,
                                    )),
                              ))
                        ],
                      ),
                      SizedBox(
                        height: 50.w,
                        child: Align(
                          alignment: Alignment.center,
                          child: Text(
                            "1 ${controller.enterAccount?.tokenName} ≈ ${controller.swapRatio.toStringAsFixed(6)} ${controller.outputAccount?.tokenName}",
                            style: TextStyle(
                                color: Colors.white70, fontSize: 10.sp),
                          ),
                        ),
                      ),
                      SizedBox(
                        height: 45.w,
                        width: 345.w,
                        child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 20.w, vertical: 10.w),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20.w)),
                                onPrimary: Colors.green[500],
                                backgroundColor: Colors.white30),
                            onPressed: controller.isValidInput &&
                                    controller.isSupportSwap
                                ? () {
                                    controller.swapToken();
                                  }
                                : null,
                            child: Text("兑换",
                                style: TextStyle(
                                    fontSize: 16.sp,
                                    color: controller.isValidInput &&
                                            controller.isSupportSwap
                                        ? Colors.white
                                        : Colors.white24))),
                      ),
                      SizedBox(height: 15.w),
                      Container(
                        height: 100.w,
                        padding: EdgeInsets.symmetric(
                            horizontal: 10.w, vertical: 10.w),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(15.w),
                          // 白色边框
                          border: Border.all(
                            color: Colors.white30,
                            width: 1.w,
                          ),
                        ),
                        child: Column(
                          children: [
                            Padding(
                              padding: EdgeInsets.symmetric(vertical: 3.w),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Text(
                                    "设置滑点",
                                    style: TextStyle(
                                        fontSize: 12.sp, color: Colors.white70),
                                  ),
                                  // SizedBox(width: 5.w),
                                  GestureDetector(
                                    behavior: HitTestBehavior.opaque,
                                    onTap: () {
                                      showHelpContent(
                                          title: "什么是滑点",
                                          content:
                                              "滑点是指在交易过程中，由于市场波动导致的交易价格与预期价格不一致的现象。滑点是交易所的正常现象，不可避免，也不是交易所的故意操作。滑点的大小与市场波动的大小有关，市场波动越大，滑点越大。",
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
                                  ),
                                  const Expanded(child: SizedBox()),
                                  GestureDetector(
                                    onTap: () {
                                      print("设置滑点");
                                    },
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.end,
                                      children: [
                                        Text(
                                          "1%",
                                          style: TextStyle(
                                              fontSize: 12.sp,
                                              color: Colors.white),
                                        ),
                                        SizedBox(width: 4.w),
                                        Icon(Icons.arrow_forward_ios_rounded,
                                            color: Colors.white, size: 12.sp)
                                      ],
                                    ),
                                  )
                                ],
                              ),
                            ),
                            Padding(
                              padding: EdgeInsets.symmetric(vertical: 3.w),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Text(
                                    "手续费",
                                    style: TextStyle(
                                        fontSize: 12.sp, color: Colors.white70),
                                  ),
                                  // SizedBox(width: 5.w),
                                  GestureDetector(
                                    behavior: HitTestBehavior.opaque,
                                    onTap: () {
                                      showHelpContent(
                                          title: "手续费",
                                          content:
                                              "手续费是指在支付时不需要输入交易密码，直接完成支付。免密支付开启后，您可以在支付时选择是否输入交易密码。",
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
                                  ),
                                  const Expanded(child: SizedBox()),
                                  Text(
                                    "3%",
                                    style: TextStyle(
                                        fontSize: 12.sp, color: Colors.white),
                                  )
                                ],
                              ),
                            ),
                            Padding(
                              padding: EdgeInsets.symmetric(vertical: 3.w),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Text(
                                    "预估网络费用",
                                    style: TextStyle(
                                        fontSize: 12.sp, color: Colors.white70),
                                  ),
                                  // SizedBox(width: 5.w),
                                  GestureDetector(
                                    behavior: HitTestBehavior.opaque,
                                    onTap: () {
                                      showHelpContent(
                                          title: "网络费用",
                                          content:
                                              "网络费用是指在支付时不需要输入交易密码，直接完成支付。免密支付开启后，您可以在支付时选择是否输入交易密码。",
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
                                  ),
                                  const Expanded(child: SizedBox()),
                                  Text(
                                    "${controller.estimatedFee} DEV",
                                    style: TextStyle(
                                        fontSize: 12.sp, color: Colors.white),
                                  )
                                ],
                              ),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              )),
    );
  }

  final TextStyle _smallTitle =
      TextStyle(fontSize: 12.sp, color: Colors.white54);

  Widget _swapButton(Balance account, bool isEnter,
      {int chainId = 1281,
      int status = 0,
      required Function(Balance account, bool isEnter) onTap}) {
    return SizedBox(
      height: 40.w,
      child: ElevatedButton(
          style: ElevatedButton.styleFrom(
              elevation: 0,
              padding: EdgeInsets.zero,
              backgroundColor: Colors.transparent),
          onPressed: () async {
            Balance? result = await Get.bottomSheet(
              SwapTokenWidget(chainId: chainId, status: status),
              isScrollControlled: true,
              useRootNavigator: true,
              backgroundColor: const Color(0xFF0a0a0a),
              barrierColor: Colors.black.withOpacity(0.5),
            );
            if (result != null) {
              print(result.address);
              onTap.call(result, isEnter);
            }
          },
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(20.w),
                child: ImageWidget(
                  imageUrl: account.tokenIconUrl,
                  width: 32.w,
                  height: 32.w,
                ),
              ),
              SizedBox(width: 8.w),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    account.isContract
                        ? account.tokenName
                        : account.nativeSymbol,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                        letterSpacing: 0,
                        fontSize: 14.sp,
                        fontWeight: FontWeight.w600),
                  ),
                  SizedBox(height: 2.w),
                  Text(
                    "Moonbase",
                    style: TextStyle(
                        letterSpacing: 0,
                        fontSize: 12.sp,
                        color: Colors.white54),
                  )
                ],
              ),
              Icon(Icons.arrow_drop_down_rounded, size: 32.sp)
            ],
          )),
    );
  }
}
