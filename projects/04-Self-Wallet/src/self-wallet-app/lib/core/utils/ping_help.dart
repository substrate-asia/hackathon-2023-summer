import 'package:dart_ping/dart_ping.dart';
import 'package:dart_ping_ios/dart_ping_ios.dart';
import 'package:get/get.dart';

class PingHelp {
  static Future<int> ping(String domain) async {
    if (GetPlatform.isIOS) DartPingIOS.register();
    String hostname = extractHostname(domain);
    PingData ping = await Ping(hostname, count: 5).stream.first;
    if (ping.response != null) {
      if (ping.response!.time != null) {
        int time = ping.response!.time!.inMilliseconds;
        print('PingHelp: ${time} ms');
        return time;
        // 把ms时间转成int
      }
    }
    return 0;
  }

  // 提取url的域名部分
  static String extractHostname(String url) {
    RegExp regExp = RegExp(
        r'^(?:https?:\/\/|wss?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)');
    return regExp.firstMatch(url)?.group(1) ?? '';
  }
}
