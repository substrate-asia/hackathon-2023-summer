import 'package:flutter_cache_manager/src/cache_store.dart';
import 'package:get/get.dart';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';

class BaseController extends GetxController {
  //TODO: Implement BaseController

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

  // 查询缓存大小
  Future<String> getCacheSize() async {
    var cache = DefaultCacheManager();
    CacheStore store = cache.store;
    return '';
  }
}
