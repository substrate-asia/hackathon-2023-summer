import 'package:hive_flutter/hive_flutter.dart';
import 'package:sunrise/core/values/hive_boxs.dart';

class HiveService {
  static Box? appBox;
  static Box? modeBox;
  static Box? walletBox;

  static bool get isDarkMode => modeBox?.get('darkMode') ?? false;

  static Future<void> init() async {
    // final appDocumentDir = await getApplicationDocumentsDirectory();
    // Hive.init(appDocumentDir.path);
    await Hive.initFlutter();
    appBox = await Hive.openBox(appSettingBox);
    modeBox = await Hive.openBox(darkModeBox);
    walletBox = await Hive.openBox(walletDataBox);
  }

  static Future<void> saveData(String key, dynamic value) async {
    await appBox?.put(key, value);
  }

  static dynamic getData(String key) {
    return appBox?.get(key);
  }

  static Future<void> deleteData(String key) async {
    await appBox?.delete(key);
  }

  static Future<void> clearData() async {
    await appBox?.clear();
  }

  // walletBox 的数据操作方法
  static Future<void> saveWalletData(String key, dynamic value) async {
    await walletBox?.put(key, value);
  }

  static dynamic getWalletData(String key) {
    return walletBox?.get(key);
  }

  static Future<void> deleteWalletData(String key) async {
    await walletBox?.delete(key);
  }

  static Future<void> clearWalletData() async {
    await walletBox?.clear();
  }

  static String? getNetworkRpc(int chainId) {
    return walletBox?.get("chain-$chainId");
  }

  static Future<void> saveNetworkRpc(int chainId, String rpc) async {
    await walletBox?.put("chain-$chainId", rpc);
  }

  static String? getEncryptedPrivateKey(String address) {
    // 获取地址除0x的前6位
    String addressName = address.substring(2, 8);
    return walletBox?.get(addressName);
  }

  // 保存私钥
  static Future<void> saveEncryptedPrivateKey(
      String address, String privateKey) async {
    // 获取地址除0x的前6位
    String addressName = address.substring(2, 8);
    await walletBox?.put(addressName, privateKey);
  }
}
