import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:sunrise/app/data/models/server_models.dart';
import 'package:sunrise/app/data/models/user_operation.dart';

String baseUrl = 'https://api.nft.storage';
String secretKey = dotenv.env['API_SECRET'] ?? '';

bool isHex(String value) {
  final pattern = RegExp(r'^[0-9a-fA-F]+$');
  return pattern.hasMatch(value);
}

class NftStorage {
  // 上传文件
  static Future<String?> uploadString(String content) async {
    try {
      http.MultipartRequest request =
          http.MultipartRequest('POST', Uri.parse('$baseUrl/upload'));
      final bytes = utf8.encode(content);
      final stream = http.ByteStream.fromBytes(bytes);
      final length = bytes.length;

      final multipartFile = http.MultipartFile(
        'file',
        stream,
        length,
        filename: 'private',
        contentType: MediaType('text', 'plain'),
      );

      request.files.add(multipartFile);
      request.headers['Authorization'] = "Bearer $secretKey";
      // request.headers['Content-Type'] = "application/json";

      // print(request.headers);
      // return null;
      final response = await request.send();
      final responseBody = await response.stream.bytesToString();
      var result = jsonDecode(responseBody);
      // print(result);
      if (result['ok']) {
        return result['value']['cid'];
      }
      return null;
    } catch (e) {
      print(" error $e");
      return null;
    }
  }

  // 获取文件
  static Future<String?> getPrivateString(String cid) async {
    try {
      var response = await http
          .get(Uri.parse('https://${cid}.ipfs.nftstorage.link/private'));
      String content = response.body;
      print(content);
      // 判断是否为16进制字符串
      if (isHex(content)) {
        return content;
      } else {
        return null;
      }
    } catch (e) {
      print(e);
      return null;
    }
  }
}
