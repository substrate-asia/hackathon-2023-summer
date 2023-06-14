import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/data/services/hive_service.dart';

class GuideController extends GetxController {
  //TODO: Implement GuideController
  PageController pageController = PageController(keepPage: true);
  int currentPage = 0;

  // 监听pageController滑动
  void onPageChanged(int index) {
    currentPage = index;
    update();
  }

  @override
  void onInit() {
    super.onInit();
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    super.onClose();
  }

  void finshGuide() async {
    await HiveService.saveData("is-guide", 1);
    Get.offAllNamed('/account');
  }
}
