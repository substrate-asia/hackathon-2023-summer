import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class TokenAssetsController extends GetxController {
  WalletController walletController = Get.find<WalletController>();
  // 搜索token
  TextEditingController tokenController = TextEditingController();

  // token列表
  List<Contract> tokenConfigList = [];
  // 要现实的列表
  List<Contract> showTokenConfigList = [];

  @override
  void onInit() {
    super.onInit();
    loadTokenList();
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    super.onClose();
  }

  /// 读取节点配置数据
  void loadTokenList() async {
    try {
      print("🥷 loadTokenList");

      var tokenListData = HiveService.getData(LocalKeyList.tokenList);
      print("🥷 tokenListData: $tokenListData");
      // 遍历获取
      if (tokenListData != null) {
        for (var element in tokenListData) {
          Contract tokenConfig =
              Contract.fromJson(Map<String, dynamic>.from(element));
          tokenConfigList.add(tokenConfig);
        }
      }

      IsarService.isar?.contracts.where().findAll().then((contractList) {
        print(contractList.length);

        // 打印contractList
        for (var element in contractList) {
          print("🥷 element: ${element.toJson()} ${element.id}");
        }

        // 如果tokenListData和tokenConfigList长度不一致，说明有新的token，需要保存
        // if (tokenListData == null ||
        //     tokenListData?.length != contractList.length) {
        print("come in");
        final tempTokenMapList =
            tokenConfigList.map((e) => e.toJson()).toList();
        HiveService.saveData(LocalKeyList.tokenList, tempTokenMapList);
        tokenConfigList = contractList;
        // }
        showTokenConfigList = tokenConfigList;
        update();
      });
    } catch (e) {
      print(e);
    }
    showTokenConfigList = tokenConfigList;

    update();
  }

  // 搜索token
  void searchToken() {
    print("🥷 searchToken");
    print("🥷 tokenController: ${tokenController.text}");
    showTokenConfigList = [];
    if (tokenController.text.isEmpty) {
      showTokenConfigList = tokenConfigList;
      update();
      return;
    }
    // 遍历获取
    for (var element in tokenConfigList) {
      // name symbol contractAddress不区分大小说包含tokenController.text
      if (element.name
              .toLowerCase()
              .contains(tokenController.text.toLowerCase()) ||
          element.symbol
              .toLowerCase()
              .contains(tokenController.text.toLowerCase()) ||
          element.contractAddress
              .toLowerCase()
              .contains(tokenController.text.toLowerCase())) {
        print("🥷 element: $element");
        showTokenConfigList.add(element);
      }
    }
    // showTokenConfigList 排序 enabled在前面
    showTokenConfigList.sort((a, b) {
      if (a.enabled == b.enabled) {
        return 0;
      } else if (a.enabled) {
        return -1;
      } else {
        return 1;
      }
    });
    update();
  }

  // 设置token enabled状态
  void setTokenEnabled(bool enabled, int index) async {
    Contract tokenConfig = showTokenConfigList[index];

    tokenConfig.enabled = enabled;

    await IsarService.isar?.writeTxn(() async {
      await IsarService.isar?.contracts.put(tokenConfig);
    });

    showTokenConfigList[index].enabled = enabled;
    // 修改tokenConfigList的enabled
    for (var element in tokenConfigList) {
      if (element.contractAddress == tokenConfig.contractAddress) {
        element.enabled = enabled;
      }
    }

    final tempTokenMapList = tokenConfigList.map((e) => e.toJson()).toList();
    HiveService.saveData(LocalKeyList.tokenList, tempTokenMapList);

    update();
  }

  void saveTokenConfig() async {
    print("🥷 saveTokenConfig");
    EasyLoading.show(
        maskType: EasyLoadingMaskType.black,
        dismissOnTap: false,
        status: "保存中");
    // await IsarService.isar?.writeTxn(() async {
    //   await IsarService.isar?.balances.clear();
    // });
    await walletController.initAppConfig();
    await walletController.removeBalance();
    await walletController.refreshAllBalance();
    EasyLoading.dismiss();
    Get.back();
  }
}
