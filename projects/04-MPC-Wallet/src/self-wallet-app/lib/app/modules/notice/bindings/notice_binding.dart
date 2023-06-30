import 'package:get/get.dart';
import 'package:sunrise/app/modules/home/controllers/chat_controller.dart';

import '../controllers/notice_controller.dart';

class NoticeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ChatController>(
      () => ChatController(),
    );
  }
}
