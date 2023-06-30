import 'package:easy_refresh/easy_refresh.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:get/get_connect/http/src/utils/utils.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/modules/base/views/assets_view.dart';
import 'package:sunrise/app/modules/transfer/views/colletcion_account.dart';
import 'package:sunrise/app/modules/transfer/views/token_detail_view.dart';
import 'package:sunrise/app/widgets/image_widget.dart';
import 'package:sunrise/app/widgets/wallet_sliver_delegate.dart';
import 'package:sunrise/core/utils/common.dart';

import '../controllers/home_controller.dart';

class TabHomeView extends StatelessWidget {
  TabHomeView({super.key});

  WalletController walletController = Get.find<WalletController>();

  @override
  Widget build(BuildContext context) {
    double statusBarHeight = MediaQuery.of(context).padding.top;
    return Scaffold(
      backgroundColor: const Color(0xFF262626),
      body: GetBuilder(
          init: HomeController(),
          builder: (controller) => EasyRefresh.builder(
              controller: controller.refreshController,
              refreshOnStart: true,
              header: const CupertinoHeader(
                  clamping: true,
                  position: IndicatorPosition.locator,
                  backgroundColor: Colors.black),
              footer: null,
              onRefresh: () async {
                // await Future.delayed(const Duration(seconds: 5));
                // controller.setCount(10);
                await walletController.refreshAllBalance();
                controller.refreshController.finishRefresh();
                controller.refreshController.resetFooter();
              },
              childBuilder: (context, physics) {
                return NestedScrollView(
                    physics: physics,
                    controller: controller.scrollController,
                    headerSliverBuilder:
                        (BuildContext context, bool innerBoxIsScrolled) {
                      return <Widget>[
                        SliverToBoxAdapter(
                          child: Container(
                            height: statusBarHeight,
                            color: Color(0xFF262626),
                          ),
                        ),
                        const HeaderLocator.sliver(clearExtent: false),
                        SliverAppBar(
                            title: null,
                            floating: false,
                            snap: false,
                            pinned: false,
                            expandedHeight: 220.w,
                            collapsedHeight: 150.w, // statusBarHeight + 10,
                            flexibleSpace: FlexibleSpaceBar(
                              background: Container(
                                  color: const Color(0xFF262626),
                                  padding:
                                      EdgeInsets.symmetric(horizontal: 15.w),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      // SizedBox(height: statusBarHeight),
                                      SizedBox(
                                        height: 40.w,
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            GestureDetector(
                                                onTap: () {
                                                  controller
                                                      .switchProxyAccount();
                                                },
                                                child: Container(
                                                  height: 35.w,
                                                  width: 150.w,
                                                  padding: EdgeInsets.all(2.w),
                                                  decoration: BoxDecoration(
                                                      color: Colors.white12,
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              20.w)),
                                                  child: Stack(children: [
                                                    Positioned(
                                                        child:
                                                            AnimatedContainer(
                                                      duration: const Duration(
                                                          milliseconds: 300),
                                                      width: controller
                                                              .isProxyAccount
                                                          ? 70.w
                                                          : 75.w,
                                                      // height: double.infinity,
                                                      margin: EdgeInsets.only(
                                                          left: controller
                                                                  .isProxyAccount
                                                              ? 75.w
                                                              : 0),
                                                      decoration: BoxDecoration(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(
                                                                      18.w),
                                                          color: Colors.black),
                                                    )),
                                                    SizedBox(
                                                      height: 36.w,
                                                      child: Row(
                                                        mainAxisAlignment:
                                                            MainAxisAlignment
                                                                .spaceAround,
                                                        crossAxisAlignment:
                                                            CrossAxisAlignment
                                                                .center,
                                                        children: [
                                                          Text(
                                                            "Web3账号",
                                                            style: TextStyle(
                                                                fontSize: 12.sp,
                                                                color: controller
                                                                        .isProxyAccount
                                                                    ? Colors
                                                                        .white54
                                                                    : Colors
                                                                        .white),
                                                          ),
                                                          Text(
                                                            "代理账号",
                                                            style: TextStyle(
                                                                fontSize: 12.sp,
                                                                color: controller
                                                                        .isProxyAccount
                                                                    ? Colors
                                                                        .white
                                                                    : Colors
                                                                        .white54),
                                                          ),
                                                        ],
                                                      ),
                                                    )
                                                  ]),
                                                )),
                                            const Expanded(child: SizedBox()),
                                            SizedBox(
                                              height: 40.w,
                                              width: 40.w,
                                              child: ElevatedButton(
                                                  style:
                                                      ElevatedButton.styleFrom(
                                                          elevation: 0,
                                                          backgroundColor:
                                                              Colors.white12,
                                                          padding:
                                                              EdgeInsets.zero),
                                                  onPressed: () =>
                                                      {Get.toNamed('/notice')},
                                                  child: Icon(
                                                    Icons.message_rounded,
                                                    color: Colors.white,
                                                    size: 18.sp,
                                                  )),
                                            ),
                                            SizedBox(width: 10.w),
                                            SizedBox(
                                              height: 40.w,
                                              width: 40.w,
                                              child: ElevatedButton(
                                                  style:
                                                      ElevatedButton.styleFrom(
                                                          elevation: 0,
                                                          backgroundColor:
                                                              Colors.white12,
                                                          padding:
                                                              EdgeInsets.zero),
                                                  onPressed: () {},
                                                  child: Image.asset(
                                                    'assets/icons/scan.png',
                                                    width: 20.w,
                                                  )),
                                            )
                                          ],
                                        ),
                                      ),
                                      SizedBox(height: 10.w),
                                      Text("\$0.00",
                                          style: TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.w600,
                                              fontSize: 36.sp)),
                                      SizedBox(height: 20.w),
                                      Row(
                                        children: [
                                          Text(
                                            "钱包地址",
                                            style: TextStyle(
                                                color: Colors.white30,
                                                fontWeight: FontWeight.w600,
                                                fontSize: 16.sp),
                                          ),
                                          SizedBox(width: 5.w),
                                          IconButton(
                                              padding: EdgeInsets.zero,
                                              onPressed: () {
                                                copyToClipboard(
                                                    controller.accountAddress);
                                              },
                                              icon: Icon(Icons.copy_all_rounded,
                                                  color: Colors.white30,
                                                  size: 20.sp))
                                        ],
                                      ),
                                      // SizedBox(height: 10.w),
                                      Text(
                                          addressFormat(
                                              controller.accountAddress),
                                          style: TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.w600,
                                              fontSize: 16.sp)),
                                      const Expanded(child: SizedBox()),
                                      Row(
                                        children: [
                                          SizedBox(
                                            width: 160.w,
                                            // height: 46.w,
                                            child: Image.asset(
                                                "assets/icons/line.png"),
                                          ),
                                          const Expanded(child: SizedBox()),
                                          _homeButton(context,
                                              name: "转账",
                                              icon: const Icon(
                                                  Icons.arrow_upward_rounded),
                                              onPressed: () {
                                            Get.toNamed('/transfer',
                                                arguments:
                                                    controller.isProxyAccount);
                                          }),
                                          _homeButton(context,
                                              name: "收款",
                                              icon: const Icon(
                                                  Icons.arrow_downward_rounded),
                                              onPressed: () {
                                            Get.to(
                                                () => const CollectionAccount(),
                                                arguments: {
                                                  "address":
                                                      controller.accountAddress
                                                },
                                                transition:
                                                    Transition.cupertinoDialog);
                                          }),
                                          _homeButton(context,
                                              name: "记录",
                                              icon: const Icon(Icons.history),
                                              onPressed: () {
                                            //
                                            // Get.toNamed('/website', arguments: {
                                            //   "title": "交易记录",
                                            //   "url":
                                            //       "http://vdxchain-dev-blockscout.xlipfs.com:8083/address/${controller.rootAccount?.address}"
                                            // });
                                          }),
                                        ],
                                      ),
                                      SizedBox(height: 15.w),
                                    ],
                                  )),
                            )),
                        controller.isProxyAccount
                            ? SliverPadding(padding: EdgeInsets.zero)
                            : SliverOverlapAbsorber(
                                handle: NestedScrollView
                                    .sliverOverlapAbsorberHandleFor(context),
                                sliver: SliverPersistentHeader(
                                  delegate:
                                      WalletSliverPersistentHeaderDelegate(
                                    minHeight: statusBarHeight + 60.w,
                                    maxHeight: 220.w,
                                    collapsedChild: Container(
                                      decoration: const BoxDecoration(
                                        color: Colors.black,
                                      ),
                                      padding: EdgeInsets.only(
                                          top: statusBarHeight,
                                          bottom: 10.w,
                                          left: 15.w,
                                          right: 15.w),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          const Expanded(child: SizedBox()),
                                          Text("\$0.00",
                                              style: TextStyle(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.w600,
                                                  fontSize: 24.sp)),
                                        ],
                                      ),
                                    ),
                                    expandedChild: Container(
                                      color: controller.scrollOffset > 100
                                          ? Colors.black
                                          : const Color(0xFF262626),
                                      child: Container(
                                        decoration: BoxDecoration(
                                            color: Colors.black,
                                            borderRadius: BorderRadius.only(
                                                topLeft: Radius.circular(30.w),
                                                topRight:
                                                    Radius.circular(30.w))),
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Padding(
                                              padding: EdgeInsets.symmetric(
                                                  vertical: 10.h),
                                              child: Center(
                                                child: Container(
                                                  width: 44.w,
                                                  height: 4.w,
                                                  decoration: BoxDecoration(
                                                      color: Colors.white
                                                          .withOpacity(0.5),
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              2.w)),
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding: EdgeInsets.symmetric(
                                                  horizontal: 15.w),
                                              child: Text(
                                                "您的资产",
                                                style: TextStyle(
                                                    fontSize: 16.sp,
                                                    fontWeight:
                                                        FontWeight.w700),
                                              ),
                                            ),
                                            SizedBox(height: 15.w),
                                            SizedBox(
                                              height: 138.w,
                                              child: ListView(
                                                scrollDirection:
                                                    Axis.horizontal,
                                                children: <Widget>[
                                                  SizedBox(width: 15.w),
                                                  // 生成五个sizedbox
                                                  ...List.generate(
                                                    controller
                                                        .mainCoinList.length,
                                                    (index) => _assetsCard(
                                                        controller.mainCoinList[
                                                            index]),
                                                  ).toList(),
                                                  SizedBox(width: 15.w),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                  pinned: true,
                                )),
                      ];
                    },
                    // body: Container(
                    //     decoration: BoxDecoration(
                    //         color: Colors.black,
                    //         borderRadius: BorderRadius.only(
                    //             topLeft: Radius.circular(30.w),
                    //             topRight: Radius.circular(30.w))),
                    //     child: Column(
                    //       children: [
                    //         Expanded(
                    //             child: ListView.builder(
                    //           physics: physics,
                    //           itemCount: 20,
                    //           itemBuilder: (context, index) {
                    //             return ListTile(
                    //               title: Text("_items[$index]"),
                    //             );
                    //           },
                    //         )),
                    //       ],
                    //     ))
                    body: Container(
                      decoration: BoxDecoration(
                          color: Colors.black,
                          borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(30.w),
                              topRight: Radius.circular(30.w))),
                      child: Builder(
                        builder: (BuildContext context) {
                          return CustomScrollView(physics: physics, slivers: <
                              Widget>[
                            controller.isProxyAccount
                                ? SliverPadding(
                                    padding: EdgeInsets.only(
                                        top: controller.scrollOffset > 100
                                            ? MediaQuery.of(context).padding.top
                                            : 15.w))
                                : SliverOverlapInjector(
                                    handle: NestedScrollView
                                        .sliverOverlapAbsorberHandleFor(
                                            context),
                                  ),
                            SliverToBoxAdapter(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      SizedBox(width: 15.w),
                                      Text(
                                        "代币",
                                        style: TextStyle(
                                            fontSize: 16.sp,
                                            fontWeight: FontWeight.w600,
                                            color: Colors.white),
                                      ),

                                      const Expanded(child: SizedBox()),
                                      IconButton(
                                          onPressed: () {
                                            // 跳转到资产管理
                                            Get.to(() => AssetsView(),
                                                transition:
                                                    Transition.cupertino);
                                          },
                                          icon: Icon(Icons.more_horiz_rounded)),
                                      // SizedBox(width: 15.w),
                                    ],
                                  ),
                                  // SizedBox(height: 10.w),

                                  ...List.generate(
                                      controller.tokenList.length,
                                      (index) => _tokenCard(
                                          controller.tokenList[index]))
                                ],
                              ),
                            )
                          ]);
                        },
                      ),
                    ));
              })),
    );
  }

  Widget _assetsCard(Balance asset) {
    return GestureDetector(
      onTap: () {
        Get.to(() => TokenDetailView(asset: asset));
      },
      child: Container(
        width: 200.w,
        height: 138.w,
        margin: EdgeInsets.only(right: 15.w),
        padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 10.w),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16.w),
          color: const Color(0xFF212020),
          // image: const DecorationImage(
          //     image: AssetImage('assets/images/assets-bg.png'),
          //     alignment: Alignment.center,
          //     opacity: 0.7,
          //     fit: BoxFit.contain)
        ),
        child: Stack(children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(asset.networkName,
                  style: TextStyle(
                      fontSize: 20.sp,
                      color: Colors.green[500],
                      fontWeight: FontWeight.w600)),
              SizedBox(height: 5.w),
              Text("${weiToEth(asset.balance)} ${asset.nativeSymbol}",
                  style: TextStyle(fontSize: 16.sp, color: Colors.white)),
              const Expanded(child: SizedBox()),
              Text("\$${weiToEth(asset.balance)}",
                  style: TextStyle(
                      fontSize: 24.sp,
                      color: Colors.white,
                      fontWeight: FontWeight.w600)),
              SizedBox(
                height: 10.w,
              ),
            ],
          ),
          asset.isProxy
              ? Positioned(
                  top: 3.w,
                  right: 0,
                  child: Container(
                    padding:
                        EdgeInsets.symmetric(horizontal: 2.w, vertical: 2.w),
                    decoration: BoxDecoration(
                        color: Colors.green[500],
                        borderRadius: BorderRadius.circular(2.w)),
                    child: Text("代理账号", style: TextStyle(fontSize: 8.sp)),
                  ))
              : const SizedBox()
        ]),
      ),
    );
  }

  Widget _tokenCard(Balance asset) {
    return ListTile(
      onTap: () {
        Get.to(() => TokenDetailView(asset: asset));
      },
      leading: SizedBox(
        width: 36.w,
        height: 36.w,
        child: Stack(children: [
          Center(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20.w),
              child: ImageWidget(
                imageUrl: asset.tokenIconUrl,
                width: 32.w,
                height: 32.w,
              ),
            ),
          ),
          Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                width: 14.w,
                height: 14.w,
                padding: EdgeInsets.all(2.w),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10.w),
                  color: Colors.black,
                ),
                child: Center(
                    child: ClipRRect(
                        borderRadius: BorderRadius.circular(10.w),
                        child: ImageWidget(
                          imageUrl: asset.iconUrl,
                          width: 10.w,
                          height: 10.w,
                        ))),
              ))
        ]),
      ),
      minLeadingWidth: 5.w,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(asset.tokenName,
                  style:
                      TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w600)),
              SizedBox(width: 5.w),
              asset.isProxy
                  ? Container(
                      padding:
                          EdgeInsets.symmetric(horizontal: 2.w, vertical: 2.w),
                      decoration: BoxDecoration(
                          color: Colors.green[500],
                          borderRadius: BorderRadius.circular(2.w)),
                      child: Text("代理账号", style: TextStyle(fontSize: 8.sp)),
                    )
                  : const SizedBox()
            ],
          ),
          SizedBox(height: 2.w),
          Text("${weiToEth(asset.balance)} ${asset.tokenSymbol}",
              style: TextStyle(
                  fontSize: 12.sp, color: Colors.white.withOpacity(0.6)))
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
