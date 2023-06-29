import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/app/modules/home/controllers/swap_controller.dart';
import 'package:sunrise/app/widgets/image_widget.dart';
import 'package:sunrise/core/utils/common.dart';

class SwapTokenWidget extends StatefulWidget {
  int chainId;
  int status; // 0 全部 1 锁定链
  SwapTokenWidget({super.key, this.chainId = 1, this.status = 0});

  @override
  State<SwapTokenWidget> createState() => _SwapTokenWidgetState();
}

class _SwapTokenWidgetState extends State<SwapTokenWidget> {
  RxList<Balance> rxAccount = Get.find<RxList<Balance>>();
  SwapController swapController = Get.find<SwapController>();

  // 主币资产列表
  List<Mainnet> get mainCoinList => swapController.mainnetList;

  // token资产列表
  List<Contract> get tokenContractList => swapController.tokenContractList;
  // token资产列表
  List<Contract> tokenList = [];

  int get currenChainId => widget.chainId;

  @override
  void initState() {
    super.initState();
    // 获取账号列表
    accountListHandle(rxAccount);
    print("currenChainId $currenChainId");
  }

  // 初始化mainCoinList

  List<Balance> _handleMainCoinList(List<Balance> list) {
    // 去除mainTemp中相同chainId的子项
    List<Balance> m = [];
    for (var element in list) {
      if (m.where((item) => item.chainId == element.chainId).toList().isEmpty) {
        m.add(element);
      }
    }
    return m;
  }

  // 根据widget.status筛选账号
  List<Balance> _filterAccountList(List<Balance> list) {
    if (widget.status == 0) {
      return list;
    } else if (widget.status == 1) {
      return list.where((element) => element.isProxy == false).toList();
    } else {
      return list.where((element) => element.isProxy == true).toList();
    }
  }

  // 账号列表处理
  void accountListHandle(List<Balance> list) async {
    // currenChainId = widget.chainId;

    List<Balance> mainTemp =
        list.where((element) => element.contractAddress == null).toList();
    List<Contract> tokenTemp = tokenContractList
        .where((element) => element.chainId == currenChainId)
        .toList();

    // 获取主币资产列表
    setState(() {
      // 去除mainTemp中相同chainId的子项

      // mainCoinList = _handleMainCoinList(mainTemp);
      // tokenList = _filterAccountList(tokenTemp);

      tokenList = tokenTemp;
    });
  }

  // 切换链
  void changeChain(int chainId) async {
    print('changeChain $chainId');
    setState(() {
      if (widget.status == 0) {
        widget.chainId = chainId;
      }
      tokenList = tokenContractList
          .where((element) => element.chainId == currenChainId)
          .toList();
    });
    if (widget.status == 1) {
      // 提示暂不支持跨链
      EasyLoading.showToast('暂不支持跨链');
    }
  }

  void selectCoin(Contract coin) async {
    EasyLoading.show();
    print('selectCoin ${coin.symbol}');
    Balance? result = await swapController.getSingleBalance(
        contract: coin.contractAddress, chainId: currenChainId);
    print("result ${result?.toSelected()}");
    EasyLoading.dismiss();
    Get.back(result: result);
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.height / 2 + 50.w,
      // color: Colors.amber,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 10.h),
              child: Center(
                child: Container(
                  width: 44.w,
                  height: 4.w,
                  decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(2.w)),
                ),
              ),
            ),
          ),
          SizedBox(height: 10.w),
          SizedBox(
            height: 35.w,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: <Widget>[
                // 生成五个sizedbox
                ...List.generate(
                  mainCoinList.length,
                  (index) => Container(
                    margin: EdgeInsets.only(left: 15.w),
                    child: MaterialButton(
                      shape: RoundedRectangleBorder(
                          side: BorderSide(
                              color:
                                  currenChainId == mainCoinList[index].chainId
                                      ? Colors.blueAccent
                                      : Colors.white.withOpacity(0.1),
                              width: 1.w),
                          borderRadius: BorderRadius.circular(10.w)),
                      padding: EdgeInsets.symmetric(horizontal: 10.w),
                      color: Colors.white.withOpacity(0.1),
                      onPressed: () {
                        changeChain(mainCoinList[index].chainId);
                      },
                      child: Text(mainCoinList[index].chainName,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 16.sp,
                              letterSpacing: 0,
                              fontFamily: 'Roboto',
                              fontWeight: FontWeight.normal,
                              color:
                                  currenChainId == mainCoinList[index].chainId
                                      ? Colors.blueAccent
                                      : Colors.white.withOpacity(0.5))),
                    ),
                  ),
                ).toList(),
                SizedBox(width: 15.w),
              ],
            ),
          ),
          Container(
            height: 1.w,
            margin: EdgeInsets.symmetric(vertical: 15.w),
            color: Colors.white.withOpacity(0.1),
          ),
          Expanded(
              child: ListView.builder(
            padding: EdgeInsets.only(bottom: 50.sp),
            itemCount: tokenList.length,
            itemBuilder: (BuildContext context, int index) {
              return ListTile(
                onTap: () {
                  selectCoin(tokenList[index]);
                },
                minLeadingWidth: 5.w,
                trailing: Text("",
                    style: TextStyle(
                        fontSize: 16.sp, fontWeight: FontWeight.w600)),
                leading: SizedBox(
                  width: 36.w,
                  height: 36.w,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20.w),
                    child: ImageWidget(
                      imageUrl: tokenList[index].iconUrl,
                      width: 32.w,
                      height: 32.w,
                    ),
                  ),
                ),
                title: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(tokenList[index].name,
                            style: TextStyle(
                                fontSize: 14.sp, fontWeight: FontWeight.w600)),
                        SizedBox(width: 5.w),
                        // tokenList[index].proxy
                        //     ? Container(
                        //         padding: EdgeInsets.symmetric(
                        //             horizontal: 2.w, vertical: 2.w),
                        //         decoration: BoxDecoration(
                        //             color: Colors.green[500],
                        //             borderRadius: BorderRadius.circular(2.w)),
                        //         child: Text("支持代理",
                        //             style: TextStyle(fontSize: 8.sp)),
                        //       )
                        //     : const SizedBox()
                      ],
                    ),
                    SizedBox(height: 2.w),
                    Text(addressFormat(tokenList[index].contractAddress),
                        style: TextStyle(
                            fontSize: 12.sp,
                            color: Colors.white.withOpacity(0.6)))
                  ],
                ),
              );
            },
          ))
        ],
      ),
    );
  }
}
