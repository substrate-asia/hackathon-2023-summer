import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/core/utils/ping_help.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class NodeNetworkController extends GetxController {
  //TODO: Implement BaseController

  // 节点网络列表
  List<Mainnet> nodeNetworkList = [];
  // 延时列表
  List<int> pingSpeedList = [];

  @override
  void onInit() {
    super.onInit();
    loadNodeList();
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
  void loadNodeList() {
    try {
      print("🥷 loadNodeList");
      List<dynamic>? keyList = HiveService.getData(LocalKeyList.networkList);
      print(keyList);
      if (keyList != null) {
        pingSpeedList = List.filled(keyList.length, 10);
        for (int i = 0; i < keyList.length; i++) {
          Mainnet temp =
              Mainnet.fromJson(Map<String, dynamic>.from(keyList[i]));
          nodeNetworkList.add(temp);

          PingHelp.ping(temp.rpc).then((value) {
            print("🥷 ping $value");
            pingSpeedList[i] = value;
            update();
          });
        }
      }

      IsarService.isar?.mainnets.where().findAll().then((mainnetList) async {
        // 如果tokenListData和tokenConfigList长度不一致，说明有新的token，需要保存
        if (keyList?.length != mainnetList.length) {
          final tempNodeMapList = mainnetList.map((e) => e.toJson()).toList();
          HiveService.saveData(LocalKeyList.networkList, tempNodeMapList);
          print("tempNodeString ${tempNodeMapList.length}");
          nodeNetworkList = mainnetList;
          if (pingSpeedList.isEmpty) {
            pingSpeedList = List.filled(nodeNetworkList.length, 10);
          }
          for (int i = 0; i < nodeNetworkList.length; i++) {
            int value = await PingHelp.ping(nodeNetworkList[i].rpc);
            pingSpeedList[i] = value;
          }
          update();
        }
      });
    } catch (e) {
      print(e);
    }

    update();
  }

  // 重新测速
  void rePing() async {
    await EasyLoading.show(status: '测速中');
    for (int i = 0; i < nodeNetworkList.length; i++) {
      int value = await PingHelp.ping(nodeNetworkList[i].rpc);

      pingSpeedList[i] = value;
    }

    EasyLoading.dismiss();
    update();
  }
}
