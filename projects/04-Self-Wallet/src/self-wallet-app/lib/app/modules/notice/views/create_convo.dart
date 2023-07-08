import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';
import 'package:sunrise/app/data/services/chat_service.dart';
import 'package:sunrise/core/utils/common.dart';

class CreateConvo extends StatefulWidget {
  const CreateConvo({super.key});

  @override
  State<CreateConvo> createState() => _CreateConvoState();
}

class _CreateConvoState extends State<CreateConvo> {
  WalletController walletController = Get.find<WalletController>();
  final TextEditingController _accountController =
      TextEditingController(text: '');

  Rx<Operation> rxOperation = Get.find<Rx<Operation>>();

  bool searchVisible = false;

  bool isEthAddress(String address) {
    // 0x开头 42位 16进制
    return address.startsWith('0x') && address.length == 42;
  }

  Worker? subscription;

  @override
  void initState() {
    super.initState();

    subscription = ever(rxOperation, (op) {
      // 处理rxdata对象的变化
      print("=========rxdata change ${op.type} ========== \n $op");
      _handleNewConvo(op);
    });
  }

  @override
  void dispose() {
    subscription?.dispose();
    super.dispose();
  }

  // 搜索好友
  void searchFriend() async {
    if (_accountController.text.isEmpty) {
      return;
    }
    if (isEthAddress(_accountController.text)) {
      print(_accountController.text);
      EasyLoading.show();
      walletController.sendPort
          ?.send({"type": 2, "data": _accountController.text});
      // 等待30s 如果没结束就提示失败
      await Future.delayed(Duration(seconds: 30));
      EasyLoading.dismiss();
    } else {
      EasyLoading.showError("地址格式不正确");
    }
  }

  void _handleNewConvo(Operation op) {
    if (op.type == 6) {
      EasyLoading.showSuccess("添加成功");
    }

    if (op.type == -1) {
      EasyLoading.showError("该地址未注册");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('添加会话',
            style: TextStyle(fontSize: 18.sp, color: Colors.white)),
        centerTitle: false,
        leading: IconButton(
          onPressed: () {
            Get.back();
          },
          icon: Icon(
            Icons.arrow_back_ios_rounded,
            size: 18.sp,
          ),
        ),
      ),
      body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 15),
          child: SingleChildScrollView(
            child: Column(
              children: [
                Container(
                  height: 50,
                  padding: const EdgeInsets.only(left: 20),
                  decoration: BoxDecoration(
                    color: Colors.white12,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _accountController,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.zero,
                            hintText: '输入好友地址',
                            border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(5),
                                borderSide: BorderSide.none),
                          ),
                          onSubmitted: (value) {
                            searchFriend();
                          },
                        ),
                      ),
                      const SizedBox(width: 10),
                      TextButton(
                        onPressed: () {
                          searchFriend();
                        },
                        child: const Text('搜索'),
                      )
                    ],
                  ),
                ),
                SizedBox(height: 30.w),
                searchVisible
                    ? Container(
                        child: Row(children: [
                          SizedBox(
                            width: 40,
                            height: 40,
                            child: CircleAvatar(
                              backgroundColor: Colors.white12,
                              child: ClipRRect(
                                  borderRadius: BorderRadius.circular(10),
                                  child: SvgPicture.network(
                                      'https://api.dicebear.com/6.x/thumbs/svg?seed=${avatarName(_accountController.text)}')),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Text(addressFormat(_accountController.text),
                              style: const TextStyle(fontSize: 18)),
                          const Expanded(child: SizedBox()),
                          TextButton(
                              onPressed: () {
                                // goChat();
                              },
                              child: Text("给TA发信息"))
                        ]),
                      )
                    : SizedBox()
              ],
            ),
          )),
    );
  }
}
