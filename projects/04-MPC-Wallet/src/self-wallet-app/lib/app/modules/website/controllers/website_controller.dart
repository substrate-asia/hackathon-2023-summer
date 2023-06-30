import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:get/get.dart';

class WebsiteController extends GetxController {
  late InAppWebViewController _webViewController;
  // 页面加载状态
  bool loading = true;
  // 页面标题
  String title = '';
  // webview加载的url
  String url = '';
  // 页面加载的进度
  int progress = 0;

  final count = 0.obs;
  @override
  void onInit() {
    super.onInit();
    getUrlFromArgs();
  }

  @override
  void onReady() {
    super.onReady();
    debugPrint("current url: ${Get.arguments.toString()}");
    // loadingCompleted();
  }

  @override
  void onClose() {
    super.onClose();
  }

  void increment() => count.value++;

  // 加载完成
  void loadingCompleted() {
    loading = false;
    update();
  }

  // 从参数中获取url
  void getUrlFromArgs() {
    url = Get.arguments['url'] ?? 'http://www.subdev.studio';
    title = Get.arguments['title'] ?? 'Subdev';
    loading = false;
    update();
  }

  /// 页面创建
  void onWebViewCreated(InAppWebViewController controller) {
    _webViewController = controller;
    debugPrint("websiteCreated");
  }

  /// 页面加载进度
  void onProgressChanged(InAppWebViewController controller, int p) {
    progress = p;
    debugPrint("onProgressChanged：$progress");
    update();
  }
}
