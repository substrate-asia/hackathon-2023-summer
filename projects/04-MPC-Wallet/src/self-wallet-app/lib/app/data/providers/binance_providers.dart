import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:sunrise/app/data/models/server_models.dart';

String baseUrl = 'https://testnet.binancefuture.com';

class Binance {
  static Future<String?> tickerPrice() async {
    var headers = {'Content-Type': 'application/json'};
    try {
      var response = await http.get(Uri.parse('$baseUrl/fapi/v1/ticker/price'),
          headers: headers);
      final responseBody = utf8.decode(response.bodyBytes);
      print(responseBody);
      var result = jsonDecode(responseBody)[0];
      print(result);

      if (result['data'] == "") {
        print("createUser error");
        // EasyLoading.showError("该账号已经创建了子账号,无法重复创建");
        return '0x';
      } else {
        ServerProxyAddress user = ServerProxyAddress.fromMap(
          Map<String, dynamic>.from(result['data']),
        );
        return user.accountChildAddress;
      }
    } catch (e) {
      return null;
    }
  }
}
