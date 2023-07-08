import 'package:get/get.dart';

import '../controllers/refresh_controller.dart';

class RefreshBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<RefreshController>(
      () => RefreshController(),
    );
  }
}
