import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/core/utils/common.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class WalletAccountList extends StatefulWidget {
  const WalletAccountList({super.key});

  @override
  State<WalletAccountList> createState() => _WalletAccountListState();
}

class _WalletAccountListState extends State<WalletAccountList> {
  List<String> accountList = [];
  String rootAddress = "";

  void _initRootAccount() {
    var _account = HiveService.getWalletData(LocalKeyList.rootAddress);
    RootAccount account =
        RootAccount.fromJson(Map<String, dynamic>.from(_account));
    setState(() {
      rootAddress = account.address;
      accountList.add(account.address);
      accountList.addAll(account.proxyAddressList);
    });
  }

  @override
  void initState() {
    super.initState();
    _initRootAccount();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.height * 0.8,
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
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 15.w),
            child: Text(
              "钱包地址",
              style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w700),
            ),
          ),
          SizedBox(height: 20.w),
          Expanded(
              child: ListView.builder(
            padding: EdgeInsets.only(bottom: 50.sp),
            itemCount: accountList.length,
            itemBuilder: (BuildContext context, int index) {
              return ListTile(
                leading: Container(
                  width: 32.w,
                  height: 32.w,
                  decoration: BoxDecoration(
                      color: Colors.white24,
                      borderRadius: BorderRadius.circular(16.w)),
                  child: Center(
                    child:
                        Image.asset('assets/icons/icon_eth.png', height: 18.w),
                  ),
                ),
                minLeadingWidth: 5.w,
                trailing: IconButton(
                    padding: EdgeInsets.zero,
                    onPressed: () {
                      copyToClipboard(accountList[index]);
                    },
                    icon: Icon(Icons.copy_all_rounded,
                        color: Colors.white30, size: 20.sp)),
                title: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                        rootAddress == accountList[index]
                            ? "EOA Address"
                            : "Contract Address",
                        style: TextStyle(
                            fontSize: 16.sp, fontWeight: FontWeight.w600)),
                    SizedBox(height: 2.w),
                    Text(addressFormat(accountList[index]),
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
