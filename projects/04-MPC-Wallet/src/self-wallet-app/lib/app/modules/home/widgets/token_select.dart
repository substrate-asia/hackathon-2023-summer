import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/widgets/image_widget.dart';
import 'package:sunrise/core/utils/common.dart';

class TokenSelectWidget extends StatefulWidget {
  int chainId;
  int status; // 0 全部 1 eoa账号 2 合约账号
  TokenSelectWidget({super.key, this.chainId = 1, this.status = 0});

  @override
  State<TokenSelectWidget> createState() => _TokenSelectWidgetState();
}

class _TokenSelectWidgetState extends State<TokenSelectWidget> {
  RxList<Balance> rxAccount = Get.find<RxList<Balance>>();

  // 主币资产列表
  List<Balance> mainCoinList = [];
  // token资产列表
  List<Balance> tokenList = [];

  int currenChainId = 1;

  @override
  void initState() {
    super.initState();
    // 获取账号列表
    accountListHandle(rxAccount);
  }

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
    currenChainId = widget.chainId;

    List<Balance> mainTemp =
        list.where((element) => element.contractAddress == null).toList();
    List<Balance> tokenTemp =
        list.where((element) => element.chainId == currenChainId).toList();

    // 获取主币资产列表
    setState(() {
      // 去除mainTemp中相同chainId的子项

      mainCoinList = _handleMainCoinList(mainTemp);
      tokenList = _filterAccountList(tokenTemp);
    });
  }

  // 切换链
  void changeChain(int chainId) {
    setState(() {
      currenChainId = chainId;
      tokenList = _filterAccountList(rxAccount
          .where((element) => element.chainId == currenChainId)
          .toList());
    });
  }

  void selectCoin(Balance coin) {
    print(
        'selectCoin ${coin.tokenName == "" ? coin.networkName : coin.tokenName}');
    Get.back(result: coin);
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
                      child: Text(mainCoinList[index].networkName,
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
                trailing: Text(
                    "${weiToEth(tokenList[index].balance)} ${tokenList[index].isContract ? tokenList[index].tokenSymbol : tokenList[index].nativeSymbol}",
                    style: TextStyle(
                        fontSize: 16.sp, fontWeight: FontWeight.w600)),
                leading: SizedBox(
                  width: 36.w,
                  height: 36.w,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20.w),
                    child: ImageWidget(
                      imageUrl: tokenList[index].isContract
                          ? tokenList[index].tokenIconUrl
                          : tokenList[index].iconUrl,
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
                        Text(
                            tokenList[index].isContract
                                ? tokenList[index].tokenName
                                : tokenList[index].networkName,
                            style: TextStyle(
                                fontSize: 14.sp, fontWeight: FontWeight.w600)),
                        SizedBox(width: 5.w),
                        tokenList[index].isProxy
                            ? Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 2.w, vertical: 2.w),
                                decoration: BoxDecoration(
                                    color: Colors.green[500],
                                    borderRadius: BorderRadius.circular(2.w)),
                                child: Text("代理账号",
                                    style: TextStyle(fontSize: 8.sp)),
                              )
                            : const SizedBox()
                      ],
                    ),
                    SizedBox(height: 2.w),
                    Text(
                        addressFormat(tokenList[index].isContract
                            ? tokenList[index].contractAddress ?? ''
                            : tokenList[index].nativeSymbol),
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
