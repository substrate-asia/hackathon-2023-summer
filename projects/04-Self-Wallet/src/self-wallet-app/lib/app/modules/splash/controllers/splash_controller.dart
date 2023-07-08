import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class SplashController extends GetxController {
  final appVerson = "1.0.0".obs;

  @override
  void onInit() {
    super.onInit();
  }

  @override
  void onReady() {
    super.onReady();
    initSplash();
    getVersion();
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
    EasyLoading.instance.dismissOnTap = true;

    // 是否进入过引导页
    var _isGuide = HiveService.getData(LocalKeyList.guideStatus);
    // 获取钱包信息
    var _account = HiveService.getWalletData(LocalKeyList.rootAddress);
    // 等待3秒
    await Future.delayed(const Duration(seconds: 3));
    if (_isGuide == null) {
      Get.offAllNamed('/guide');
    } else if (_account == null) {
      Get.offAllNamed('/account');
    } else {
      Get.offAllNamed('/home');
    }
  }

  // 获取当前版本号
  void getVersion() async {
    PackageInfo packageInfo = await PackageInfo.fromPlatform();
    appVerson.value = packageInfo.version;
  }
}
