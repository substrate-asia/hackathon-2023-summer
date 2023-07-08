import 'dart:convert';
import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:encrypt/encrypt.dart';
import 'package:hex/hex.dart';

String _padTo32Bytes(String str) {
  const targetLength = 32;
  const padChar = '0';
  final currentLength = str.length;
  final needsPadding = targetLength - currentLength;
  if (needsPadding <= 0) {
    return str; // 字符串已经达到或超过了32个字符
  }
  final padding = List.filled(needsPadding, padChar).join();
  return '$str$padding';
}

String encryptAES(String plaintext, String keyStr) {
  final key = Key.fromUtf8(_padTo32Bytes(keyStr));
  final iv = IV.fromUtf8("wallet");

  final encrypter = Encrypter(AES(key));

  final encrypted = encrypter.encrypt(plaintext, iv: iv);
  return encrypted.base64;
}

String decryptAES(String ciphertext, String keyStr) {
  final key = Key.fromUtf8(_padTo32Bytes(keyStr));
  final iv = IV.fromUtf8("wallet");

  final encrypter = Encrypter(AES(key));

  Encrypted e = Encrypted.fromBase64(ciphertext);

  final decrypted = encrypter.decrypt(e, iv: iv);

  return decrypted;
}

// 随机生成的字符串
String _letterString = 'abcdefghijklmnopqrstuvwxyz';
// mpc分割字符串
List<String> mpcSplit(String ciphertext) {
  List<String> list = [];

  for (int i = 0; i < ciphertext.length; i += 32) {
    String temp = '';
    if (i + 32 > ciphertext.length) {
      temp = ciphertext.substring(i, ciphertext.length);
    } else {
      temp = ciphertext.substring(i, i + 32);
    }

    // 根据在_letterString中取出对应的字符
    temp = _letterString[(i / 32).floor()] + temp;

    list.add(HEX.encode(utf8.encode(temp)));
  }
  return list;
}

// 还原字符串
String mpcJoin(List<String> list) {
  String ciphertext = '';
  for (int i = 0; i < list.length; i++) {
    String temp = list[i];
    temp = utf8.decode(HEX.decode(temp.substring(2, temp.length)));

    ciphertext += temp.substring(0, temp.length);
  }
  return ciphertext;
}

// 文件的md5
Future<String?> fileMd5(String path) async {
  var file = File(path);
  if (!await file.exists()) {
    return null;
  }
  final bytes = await file.readAsBytes();
  final hash = md5.convert(bytes);
  return hash.toString();
}

// 字符串的md5
String stringMd5(String str) {
  final bytes = utf8.encode(str);
  final hash = md5.convert(bytes);
  return hash.toString();
}
