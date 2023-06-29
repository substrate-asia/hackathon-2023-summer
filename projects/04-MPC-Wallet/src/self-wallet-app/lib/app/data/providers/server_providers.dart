import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:sunrise/app/data/models/server_models.dart';
import 'package:sunrise/app/data/models/user_operation.dart';

String baseUrl = dotenv.env['BASE_URL'] ?? 'https://www.subdev.studio/api';

class Server {
  static Future<String?> createUser(String address) async {
    var headers = {
      'Accept-Charset': 'utf-8',
      'Content-Type': 'application/json'
    };
    var body = jsonEncode({
      "owner_address": address.toLowerCase(),
    });
    try {
      var response = await http.post(Uri.parse('$baseUrl/chain/createUser'),
          headers: headers, body: body);
      final responseBody = utf8.decode(response.bodyBytes);
      var result = jsonDecode(responseBody)['content'];
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

  // get请求 getUser
  static Future<List<String>?> getUser(String address) async {
    var headers = {
      'Accept-Charset': 'utf-8',
      'Content-Type': 'application/json'
    };
    try {
      var response = await http.get(
          Uri.parse('$baseUrl/chain/getUser?owner_address=$address'),
          headers: headers);
      final responseBody = utf8.decode(response.bodyBytes);
      var result = jsonDecode(responseBody)['content'];
      print(result);

      if (result['data'] == "") {
        print("getUser error");
        // EasyLoading.showError("该账号已经创建了子账号,无法重复创建");
        return null;
      } else {
        List<String> list = [];
        for (var item in result['data']) {
          print(item);
          ServerProxyAddress user = ServerProxyAddress.fromMap(
            Map<String, dynamic>.from(item),
          );
          list.add(user.accountChildAddress);
        }

        return list;
      }
    } catch (e) {
      print(e);
      return null;
    }
  }

  static Future<String?> fundsTransfer(UserOperation userOp) async {
    var headers = {
      'Accept-Charset': 'utf-8',
      'Content-Type': 'application/json'
    };
    var body = jsonEncode(userOp.toWeb3Json());

    print("fundsTransfer $body");
    try {
      var response = await http.post(Uri.parse('$baseUrl/chain/fundsTransfer'),
          headers: headers, body: body);
      final responseBody = utf8.decode(response.bodyBytes);
      var result = jsonDecode(responseBody)['content'];
      print(response.body.toString());
      return result['data'];
    } catch (e) {
      print("fundsTransfer error $e");
      return null;
    }
  }

  // 发送邮件
  static Future<dynamic> sendEmail(String email) async {
    var headers = {
      'Accept-Charset': 'utf-8',
      'Content-Type': 'application/json'
    };
    var body = jsonEncode({
      "email": email,
    });
    try {
      var response = await http.post(Uri.parse('$baseUrl/wallet/sendEmail'),
          headers: headers, body: body);
      final responseBody = utf8.decode(response.bodyBytes);
      var result = jsonDecode(responseBody)['content'];
      print(result);
      return result['data'];
    } catch (e) {
      print("sendEmail error $e");
      return null;
    }
  }

  // 验证邮箱
  static Future<Map<String, dynamic>?> verifyEmail(
      String email, String code) async {
    var headers = {
      'Accept-Charset': 'utf-8',
      'Content-Type': 'application/json'
    };
    var body = jsonEncode({
      "email": email,
      "code": code,
    });
    try {
      var response = await http.post(Uri.parse('$baseUrl/wallet/verifyEmail'),
          headers: headers, body: body);
      final responseBody = utf8.decode(response.bodyBytes);
      var result = jsonDecode(responseBody)['content'];
      print(result);
      // if (result['data'] == "") {
      //   EasyLoading.showError(result['msg'] ?? "验证码错误");
      //   return null;
      // }

      return result;
    } catch (e) {
      print("verifyEmail error $e");
      return null;
    }
  }

  // saveWallet 保存钱包
  static Future<bool> saveWallet({
    required int userId,
    required String email,
    required String code,
    required List<String> cids,
    required String address,
  }) async {
    var headers = {
      'Accept-Charset': 'utf-8',
      'Content-Type': 'application/json'
    };
    var body = jsonEncode({
      "user_id": userId,
      "code": code,
      "email": email,
      "wallet_address": address,
      "ipfs_address": cids.join(","),
    });
    try {
      var response = await http.post(Uri.parse('$baseUrl/wallet/saveWallet'),
          headers: headers, body: body);
      final responseBody = utf8.decode(response.bodyBytes);
      var result = jsonDecode(responseBody)['content'];
      print(result);
      return result['data'];
    } catch (e) {
      print("saveWallet error $e");
      return false;
    }
  }

  // 恢复钱包
  static Future<Map<String, dynamic>?> recoverWallet(
      {required String email, required String code}) async {
    var headers = {
      'Accept-Charset': 'utf-8',
      'Content-Type': 'application/json'
    };
    var body = jsonEncode({
      "email": email,
      "code": code,
    });
    try {
      var response = await http.post(
          Uri.parse('$baseUrl/wallet/getUserAllWallet'),
          headers: headers,
          body: body);
      final responseBody = utf8.decode(response.bodyBytes);
      var result = jsonDecode(responseBody)['content'];
      print(result);
      return result;
    } catch (e) {
      print("recoverWallet error $e");
      return null;
    }
  }
}
