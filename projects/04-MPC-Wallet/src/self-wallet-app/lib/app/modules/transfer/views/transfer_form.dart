import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/modules/home/widgets/token_select.dart';
import 'package:sunrise/app/widgets/image_widget.dart';
import 'package:sunrise/core/utils/common.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

import '../../account/views/verify_pin_view.dart';

class TransferForm extends StatefulWidget {
  bool isFree = false;
  Balance payment;
  TransferForm({Key? key, required this.isFree, required this.payment})
      : super(key: key);
  @override
  TransferFormState createState() => TransferFormState();
}

// 使用状态保存
class TransferFormState extends State<TransferForm>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;
  // 表单的key
  final GlobalKey<FormState> transferKey = GlobalKey<FormState>();

  late Balance selectedAccount;

  // 收款人
  final toAddressController = TextEditingController(text: '');
  final amoutController = TextEditingController();

  // 切换网络
  void changeNetwork() async {
    print("切换网络");

    Balance? result = await Get.bottomSheet(
      TokenSelectWidget(
        chainId: 1281,
        status: widget.isFree ? 2 : 1,
      ),
      isScrollControlled: true,
      useRootNavigator: true,
      backgroundColor: const Color(0xFF0a0a0a),
      barrierColor: Colors.black.withOpacity(0.5),
    );
    if (result != null) {
      print(result.nativeSymbol);

      await HiveService.saveData(
          LocalKeyList.transferSelected, result.toSelected());

      // setState(() {
      //   selectedAccount = result;
      // });
      setNetwork(result);
    }
  }

  // 设置网络
  void setNetwork(Balance come) async {
    print("设置网络 ${come.toSelected()}");
    setState(() {
      selectedAccount = come;
      print("object ${selectedAccount.chainId} ${widget.isFree}");
    });
  }

  @override
  void initState() {
    super.initState();
    setState(() {
      selectedAccount = widget.payment;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 15.w),
      child: SingleChildScrollView(
          child: Form(
        key: transferKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            SizedBox(
              height: 10.w,
            ),
            Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Colors.grey,
                    width: 1.0,
                  ),
                  borderRadius: BorderRadius.circular(15.w),
                ),
                child: ListTile(
                    onTap: () {
                      changeNetwork();
                    },
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 15.w, vertical: 0.w),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15.w)),
                    leading: SizedBox(
                      width: 32.w,
                      child: Center(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(20.w),
                          child: ImageWidget(
                            imageUrl: selectedAccount.isContract
                                ? selectedAccount.tokenIconUrl
                                : selectedAccount.iconUrl,
                            width: 32.w,
                            height: 32.w,
                          ),
                        ),
                      ),
                    ),
                    minLeadingWidth: 5.w,
                    title: Text(
                      selectedAccount.isContract
                          ? selectedAccount.tokenSymbol
                          : selectedAccount.nativeSymbol,
                      style: TextStyle(
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w700,
                          color: Colors.white),
                    ),
                    subtitle: Text(
                      selectedAccount.networkName,
                      style: TextStyle(
                          fontSize: 12.sp,
                          fontWeight: FontWeight.w400,
                          color: Colors.greenAccent),
                    ),
                    trailing: SizedBox(
                      width: 100.w,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Text(
                            "切换网络",
                            style:
                                TextStyle(fontSize: 14.sp, color: Colors.white),
                          ),
                          SizedBox(
                            width: 5.w,
                          ),
                          Icon(
                            Icons.arrow_forward_ios_rounded,
                            size: 16.sp,
                            color: Colors.white,
                          )
                        ],
                      ),
                    ))),
            SizedBox(
              height: 20.w,
            ),
            Text("收款地址",
                style: TextStyle(fontSize: 16.sp, color: Colors.white)),
            SizedBox(height: 10.w),
            TextFormField(
              controller: toAddressController,
              maxLength: 42,
              // inputFormatters: [
              //   FilteringTextInputFormatter.allow(RegExp("[a-exA-EX0-9]"))
              // ],
              decoration: InputDecoration(
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 15.w, vertical: 0),
                  // labelText: '收款地址',
                  hintText: '请输入收款地址',
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(15.w),
                      borderSide: const BorderSide(color: Colors.white24)),
                  filled: true,
                  counterText: "",
                  suffixIcon: toAddressController.text.isNotEmpty
                      ? IconButton(
                          icon: Transform.rotate(
                            angle: 180 / 45,
                            child: const Icon(Icons.add_circle_outline_rounded),
                          ),
                          onPressed: () {
                            toAddressController.clear();
                            setState(() {});
                          },
                        )
                      : null,
                  fillColor: Colors.white10),
              validator: (value) {
                if (value == null || value == '') {
                  return '请输入收款地址';
                }
                return null;
              },
              onChanged: (value) {
                setState(() {});
              },
            ),
            SizedBox(
              height: 20.w,
            ),
            Row(children: [
              Text("转账金额",
                  style: TextStyle(fontSize: 16.sp, color: Colors.white)),
              const Expanded(child: SizedBox()),
              Text(
                "余额：${weiToEth(selectedAccount.balance)}",
                style: TextStyle(
                  fontSize: 12.sp,
                ),
              )
            ]),
            SizedBox(height: 10.w),
            TextFormField(
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp("[0-9.]")),
              ],
              keyboardType: TextInputType.number,
              controller: amoutController,
              maxLength: 30,
              decoration: InputDecoration(
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 15.w, vertical: 0.0),
                  suffix: SizedBox(
                    height: 20.w,
                    child: TextButton(
                        style: ButtonStyle(
                            overlayColor:
                                MaterialStateProperty.all(Colors.transparent),
                            minimumSize: MaterialStateProperty.all(Size.zero),
                            padding:
                                MaterialStateProperty.all(EdgeInsets.zero)),
                        child: const Text("全部"),
                        onPressed: () {}),
                  ),
                  hintText: '请输入转账金额',
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(15.w),
                      borderSide: const BorderSide(color: Colors.white24)),
                  filled: true,
                  counterText: "",
                  fillColor: Colors.white10),
              validator: (value) {
                if (value == null || value == '') {
                  return '请输入转账数量';
                }
                return null;
              },
            ),
            SizedBox(
              height: 20.w,
            ),
            widget.isFree == false
                ? Column(
                    children: [
                      Row(children: [
                        Text("矿工费",
                            style: TextStyle(
                                fontSize: 16.sp, color: Colors.white)),
                        const Expanded(child: SizedBox()),
                      ]),
                      SizedBox(height: 10.w),
                      Container(
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: Colors.grey,
                              width: 1.0,
                            ),
                            borderRadius: BorderRadius.circular(15.w),
                          ),
                          child: ListTile(
                              onTap: () {},
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 15.w, vertical: 0.w),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(15.w)),
                              title: Text(
                                "0.0002 ETH",
                                style: TextStyle(
                                    fontSize: 14.sp, color: Colors.white),
                              ),
                              trailing: SizedBox(
                                width: 100.w,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    Text(
                                      "0.12 GWEI",
                                      style: TextStyle(
                                          fontSize: 14.sp,
                                          color: Colors.white54),
                                    ),
                                    // SizedBox(
                                    //   width: 5.w,
                                    // ),
                                    // Icon(
                                    //   Icons.arrow_forward_ios_rounded,
                                    //   size: 16.sp,
                                    //   color: Colors.white,
                                    // )
                                  ],
                                ),
                              ))),
                    ],
                  )
                : const SizedBox(),
            SizedBox(height: 30.w),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: SizedBox(
                  width: 345.w,
                  height: 45.w,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      foregroundColor: Colors.greenAccent,
                      backgroundColor:
                          Theme.of(context).colorScheme.onBackground,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(22.5.w),
                      ),
                    ),
                    onPressed: () async {
                      if (transferKey.currentState?.validate() == true) {
                        // TODO: 实现转账逻辑
                        String? hash = await Get.bottomSheet(
                          VerifyPinView(
                            owner: selectedAccount,
                            to: toAddressController.text,
                            amount: double.parse(amoutController.text),
                          ),
                          isScrollControlled: true,
                          useRootNavigator: true,
                          backgroundColor: const Color(0xFF0a0a0a),
                          barrierColor: Colors.black.withOpacity(0.5),
                        );
                        if (hash != null) {
                          print("交易hash: $hash");
                          toAddressController.text = '';
                          amoutController.text = '';
                        }
                      }
                    },
                    child: Text('确认',
                        style: TextStyle(
                            color: Theme.of(context).colorScheme.background,
                            fontSize: 16.sp,
                            fontWeight: FontWeight.w600)),
                  )),
            ),
          ],
        ),
      )),
    );
  }
}
