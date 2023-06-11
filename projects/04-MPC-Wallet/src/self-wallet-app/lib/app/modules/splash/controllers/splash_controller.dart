import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class SplashController extends GetxController {
  @override
  void onInit() {
    super.onInit();
  }

  @override
  void onReady() {
    super.onReady();
    initSplash();
  }

  @override
  void onClose() {
    super.onClose();
  }

  /// 判断是否已经创建了钱包
  /// 如果是第一次进入应用没通过引导页，那么就跳转到引导页
  /// 如果是第一次创建钱包，那么就跳转到创建钱包页面
  /// 如果已经创建了钱包，那么就跳转到首页
  void initSplash() async {
    // 配置loading样式
    EasyLoading.instance.indicatorType = EasyLoadingIndicatorType.ring;
    EasyLoading.instance.loadingStyle = EasyLoadingStyle.light;

    // 是否进入过引导页
    var _isGuide = HiveService.getData(LocalKeyList.guideStatus);
    // 获取钱包信息
    var _account = HiveService.getWalletData(LocalKeyList.rootAddress);
    // 等待3秒
    await Future.delayed(const Duration(seconds: 3));
    print("_isGuide $_isGuide");
    // Get.offAllNamed('/guide');
    // return;

    if (_isGuide == null) {
      Get.offAllNamed('/guide');
    } else if (_account == null) {
      Get.offAllNamed('/account');
    } else {
      Get.offAllNamed('/home');
    }
  }
}
