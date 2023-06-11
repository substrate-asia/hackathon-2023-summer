import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';

import '../controllers/guide_controller.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class GuideView extends GetView<GuideController> {
  const GuideView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    // 页面一半的高度
    final double halfHeight = MediaQuery.of(context).size.height / 2;
    // 页面宽度
    final double screenWidth = MediaQuery.of(context).size.width;

    // 引导页内容
    const guideContentList = [
      {"title": "安全保障", "content": "我们采用最先进的加密技术来保护您的个人信息，让您的数字资产更加安全可靠。"},
      {"title": "匿名交易", "content": "通过创建抽象账号，确保您在区块链中的隐私，让您的交易更加私密安全。"},
      {"title": "免费交易", "content": "我们将为您支付所有GAS费用，让您的交易更加便捷，让您的数字资产更有价值！"}
    ];
    const guideImageList = [
      "mountains-sunrise.png",
      "moon-sun.png",
      "four-men.png"
    ];

    return Scaffold(
      body: GetBuilder(
          init: GuideController(),
          builder: (controller) => Stack(
                children: [
                  // 下半为白色页面
                  Container(
                    width: screenWidth,
                    height: MediaQuery.of(context).size.height,
                    color: Colors.transparent,
                  ),
                  SizedBox(
                    height: halfHeight * 2,
                    width: screenWidth,
                    child: PageView(
                      onPageChanged: (index) {
                        controller.onPageChanged(index);
                      },
                      physics: const PageScrollPhysics(),
                      controller: controller.pageController,
                      children: [
                        ...guideImageList
                            .map((e) => _guidePage(context, e))
                            .toList(),
                      ],
                    ),
                  ),

                  /// 图片添加模糊效果
                  // Positioned(
                  //     child: IgnorePointer(
                  //         child: BackdropFilter(
                  //   filter: ImageFilter.blur(sigmaX: 1, sigmaY: 1),
                  //   child: Container(
                  //     color: Colors.black.withOpacity(0),
                  //     width: screenWidth,
                  //     height: halfHeight,
                  //   ),
                  // ))),
                  Positioned(
                      bottom: 0,
                      child: IgnorePointer(
                          child: Container(
                        width: screenWidth,
                        height: halfHeight,
                        padding: EdgeInsets.symmetric(
                            horizontal: 15.w, vertical: 30.w),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            SizedBox(
                                width: screenWidth,
                                child: Text(
                                  guideContentList[controller.currentPage]
                                          ["title"] ??
                                      'MPC',
                                  textAlign: TextAlign.left,
                                  style: TextStyle(
                                      fontSize: 24.sp,
                                      fontWeight: FontWeight.w600),
                                )).animate().fade(),
                            SizedBox(height: 30.w),
                            SizedBox(
                                width: screenWidth,
                                child: Text(
                                  guideContentList[controller.currentPage]
                                          ["content"] ??
                                      'MPC',
                                  textAlign: TextAlign.left,
                                  style: TextStyle(
                                      height: 1.6,
                                      color: Colors.white60,
                                      fontSize: 16.sp),
                                )),
                          ],
                        ),
                      ))),

                  Positioned(
                      bottom: MediaQuery.of(context).padding.bottom + 80,
                      child: SizedBox(
                        width: screenWidth,
                        child: Center(
                          child: controller.currentPage == 2
                              ? SizedBox(
                                  height: 40.w,
                                  width: 150.w,
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      foregroundColor: Colors.greenAccent,
                                      backgroundColor: Colors.white,
                                    ),
                                    child: Text(
                                        controller.currentPage == 2
                                            ? "完成"
                                            : "下一页",
                                        style: TextStyle(
                                            fontSize: 16.sp,
                                            color: Colors.black)),
                                    onPressed: () {
                                      controller.finshGuide();
                                    },
                                  ),
                                ).animate().fade()
                              : SizedBox(
                                  height: 40.w,
                                  width: 100.w,
                                  child: TextButton(
                                      onPressed: () {
                                        controller.pageController.nextPage(
                                            duration: const Duration(
                                                milliseconds: 300),
                                            curve: Curves.easeIn);
                                      },
                                      child: const Text("下一页"))),
                        ),
                      )),

                  Positioned(
                      bottom: MediaQuery.of(context).padding.bottom + 30,
                      child: Container(
                        width: screenWidth,
                        child: Center(
                            child: SmoothPageIndicator(
                          controller: controller.pageController,
                          count: 3,
                          effect: CustomizableEffect(
                            activeDotDecoration: DotDecoration(
                              width: 24,
                              height: 8,
                              color: Theme.of(context)
                                  .colorScheme
                                  .primary
                                  .withOpacity(0.8),
                              rotationAngle: 180,
                              verticalOffset: 0,
                              borderRadius: BorderRadius.circular(24),
                            ),
                            dotDecoration: DotDecoration(
                              width: 12,
                              height: 6,
                              color: Colors.white12,
                              borderRadius: BorderRadius.circular(8),
                              verticalOffset: 0,
                            ),
                            spacing: 6.0,
                            // activeColorOverride: (i) => colors[i],
                            // inActiveColorOverride: (i) => colors[i],
                          ),
                        )),
                      ))
                ],
              )),
    );
  }

  Widget _guidePage(BuildContext context, String image) {
    final double screenHeight = MediaQuery.of(context).size.height;
    final double screenWidth = MediaQuery.of(context).size.width;
    return SizedBox(
      width: screenWidth,
      height: screenHeight,
      child: Stack(children: [
        SizedBox(
          width: screenWidth,
          height: screenHeight / 2,
          child: Image.asset('assets/images/$image', fit: BoxFit.cover),
        ),
        Positioned(
            top: 0,
            child: Container(
              width: screenWidth,
              height: screenHeight / 2,
              decoration: BoxDecoration(
                  gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                    Colors.black.withOpacity(1),
                    Colors.black.withOpacity(0.2),
                    Colors.black.withOpacity(0.0),
                  ])),
            )),
      ]),
    );
  }
}
