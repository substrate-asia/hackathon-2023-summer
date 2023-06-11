import 'dart:convert';

import 'package:bip39/bip39.dart' as bip39;
import 'package:bip32/bip32.dart' as bip32;
import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
import 'package:hex/hex.dart';
import 'package:sunrise/app/data/models/user_operation.dart';
import 'package:web3dart/crypto.dart';
import 'package:web3dart/web3dart.dart';
import 'dart:typed_data';
import 'package:convert/convert.dart';

class AbiCoder {
  static String encode(List<dynamic> types, List<dynamic> values) {
    if (types.length != values.length) {
      throw Exception('types/values length mismatch');
    }

    List<String> encodedValues = [];

    for (int i = 0; i < types.length; i++) {
      String encodedValue = _encode(types[i], values[i]);
      encodedValues.add(encodedValue);
    }

    return encodedValues.join('');
  }

  static List<dynamic> decode(List<dynamic> types, String data) {
    List<dynamic> decodedValues = [];

    int dataIndex = 0;
    for (int i = 0; i < types.length; i++) {
      dynamic decodedValue = _decode(types[i], data, dataIndex);
      decodedValues.add(decodedValue);

      dataIndex += _getEncodedLength(types[i], data, dataIndex);
    }

    return decodedValues;
  }

  static String _encode(dynamic type, dynamic value) {
    if (type is String) {
      if (type == 'address') {
        return _encodeAddress(value);
      } else if (type.startsWith('uint')) {
        return _encodeUint(type, value);
      } else if (type.startsWith('int')) {
        return _encodeInt(type, value);
      } else if (type.startsWith('bytes')) {
        return _encodeBytes(type, value);
      } else if (type == 'bool') {
        return _encodeBool(value);
      } else if (type.startsWith('string')) {
        return _encodeString(value);
      } else {
        throw Exception('unsupported type: $type');
      }
    } else if (type is List) {
      return _encodeArray(type[0], value);
    } else {
      throw Exception('unsupported type: $type');
    }
  }

  static dynamic _decode(dynamic type, String data, int dataIndex) {
    if (type is String) {
      if (type == 'address') {
        return _decodeAddress(data, dataIndex);
      } else if (type.startsWith('uint')) {
        return _decodeUint(type, data, dataIndex);
      } else if (type.startsWith('int')) {
        return _decodeInt(type, data, dataIndex);
      } else if (type.startsWith('bytes')) {
        return _decodeBytes(type, data, dataIndex);
      } else if (type == 'bool') {
        return _decodeBool(data, dataIndex);
      } else if (type.startsWith('string')) {
        return _decodeString(data, dataIndex);
      } else {
        throw Exception('unsupported type: $type');
      }
    } else if (type is List) {
      return _decodeArray(type[0], data, dataIndex);
    } else {
      throw Exception('unsupported type: $type');
    }
  }

  static String _encodeAddress(String value) {
    if (value.startsWith('0x')) {
      value = value.substring(2);
    }

    // 如果是40位往前面补零
    if (value.length == 40) {
      value = value.padLeft(64, '0');
    }

    if (value.length != 64) {
      throw Exception('invalid address length');
    }

    return value;
  }

  static String _encodeUint(String type, int value) {
    int size = int.parse(type.substring(4));
    if (size % 8 != 0 || size < 8 || size > 256) {
      throw Exception('invalid uint size');
    }

    BigInt bigIntValue = BigInt.from(value);
    String hexValue = bigIntValue.toRadixString(16);
    if (hexValue.length % 2 != 0) {
      hexValue = '0$hexValue';
    }

    int byteSize = size ~/ 8;
    if (hexValue.length > byteSize * 2) {
      throw Exception('uint overflow');
    }

    hexValue = hexValue.padLeft(byteSize * 2, '0');
    return hexValue;
  }

  static String _encodeInt(String type, int value) {
    int size = int.parse(type.substring(3));
    if (size % 8 != 0 || size < 8 || size > 256) {
      throw Exception('invalid int size');
    }

    BigInt bigIntValue = BigInt.from(value);
    String hexValue = bigIntValue.toRadixString(16);
    if (hexValue.length % 2 != 0) {
      hexValue = '0$hexValue';
    }

    int byteSize = size ~/ 8;
    if (hexValue.length > byteSize * 2) {
      throw Exception('int overflow');
    }

    hexValue = hexValue.padLeft(byteSize * 2, '0');
    return hexValue;
  }

  static String _encodeBytes(String type, dynamic value) {
    int size = int.parse(type.substring(5));
    if (size < 1 || size > 32) {
      throw Exception('invalid bytes size');
    }

    if (value is String) {
      if (value.startsWith('0x')) {
        value = value.substring(2);
      }

      if (value.length % 2 != 0) {
        value = '0$value';
      }

      if (value.length > size * 2) {
        throw Exception('bytes overflow');
      }

      value = value.padLeft(size * 2, '0');
      return value;
    } else if (value is List<int>) {
      if (value.length > size) {
        throw Exception('bytes overflow');
      }

      Uint8List uint8List = Uint8List(size);
      uint8List.setRange(size - value.length, size, value);
      return hex.encode(uint8List);
    } else {
      throw Exception('invalid bytes value');
    }
  }

  static String _encodeBool(bool value) {
    return value ? '01' : '00';
  }

  static String _encodeString(String value) {
    Uint8List uint8List = Uint8List.fromList(utf8.encode(value));
    return _encodeBytes('bytes${uint8List.length}', hex.encode(uint8List));
  }

  static String _encodeArray(dynamic type, List<dynamic> value) {
    List<String> encodedValues = [];

    for (int i = 0; i < value.length; i++) {
      String encodedValue = _encode(type, value[i]);
      encodedValues.add(encodedValue);
    }

    String encodedLength = _encodeUint('uint256', value.length);
    return encodedLength + encodedValues.join('');
  }

  static String _decodeAddress(String data, int dataIndex) {
    String value = data.substring(dataIndex, dataIndex + 40);
    return '0x$value';
  }

  static int _decodeUint(String type, String data, int dataIndex) {
    int size = int.parse(type.substring(4));
    if (size % 8 != 0 || size < 8 || size > 256) {
      throw Exception('invalid uint size');
    }

    String hexValue = data.substring(dataIndex, dataIndex + size ~/ 4);
    BigInt bigIntValue = BigInt.parse(hexValue, radix: 16);
    return bigIntValue.toInt();
  }

  static int _decodeInt(String type, String data, int dataIndex) {
    int size = int.parse(type.substring(3));
    if (size % 8 != 0 || size < 8 || size > 256) {
      throw Exception('invalid int size');
    }

    String hexValue = data.substring(dataIndex, dataIndex + size ~/ 4);
    BigInt bigIntValue = BigInt.parse(hexValue, radix: 16);
    return bigIntValue.toSigned(size).toInt();
  }

  static dynamic _decodeBytes(String type, String data, int dataIndex) {
    int size = int.parse(type.substring(5));
    if (size < 1 || size > 32) {
      throw Exception('invalid bytes size');
    }

    String hexValue = data.substring(dataIndex, dataIndex + size * 2);
    return '0x$hexValue';
  }

  static bool _decodeBool(String data, int dataIndex) {
    String value = data.substring(dataIndex, dataIndex + 2);
    return value == '01';
  }

  static String _decodeString(String data, int dataIndex) {
    int length = _decodeUint('uint256', data, dataIndex);
    dataIndex += 64;

    String hexValue = data.substring(dataIndex, dataIndex + length * 2);
    Uint8List uint8List = Uint8List.fromList(hex.decode(hexValue));
    return utf8.decode(uint8List);
  }

  static List<dynamic> _decodeArray(dynamic type, String data, int dataIndex) {
    int length = _decodeUint('uint256', data, dataIndex);
    dataIndex += 64;

    List<dynamic> decodedValues = [];
    for (int i = 0; i < length; i++) {
      dynamic decodedValue = _decode(type, data, dataIndex);
      decodedValues.add(decodedValue);

      dataIndex += _getEncodedLength(type, data, dataIndex);
    }

    return decodedValues;
  }

  static int _getEncodedLength(dynamic type, String data, int dataIndex) {
    if (type is String) {
      if (type == 'address') {
        return 64;
      } else if (type.startsWith('uint') || type.startsWith('int')) {
        int size = int.parse(type.substring(4));
        return size ~/ 4;
      } else if (type.startsWith('bytes')) {
        int size = int.parse(type.substring(5));
        return size * 2;
      } else if (type == 'bool') {
        return 2;
      } else if (type.startsWith('string')) {
        int length = _decodeUint('uint256', data, dataIndex);
        return 64 + length * 2;
      } else {
        throw Exception('unsupported type: $type');
      }
    } else if (type is List) {
      int length = _decodeUint('uint256', data, dataIndex);
      return 64 + length * _getEncodedLength(type[0], data, dataIndex + 64);
    } else {
      throw Exception('unsupported type: $type');
    }
  }
}

/// Ethereum Wallet
///
/// 当与钱包相关的操作时，需要使用钱包对象
/// 创建钱包、导入钱包、导出钱包
class EthWallet {
  /// 钱包地址
  String address;

  /// 钱包私钥
  String privateKey;

  /// 钱包公钥
  String publicKey;

  /// 钱包助记词
  String? mnemonic;

  /// 钱包keystore
  // String keystore;
  /// 钱包keystore的json格式
  // String keystoreJson;

  EthWallet(
      {required this.address,
      required this.privateKey,
      required this.publicKey,
      this.mnemonic});

  /// 转换为json格式
  String toJson() {
    return jsonEncode({
      "address": address,
      "privateKey": privateKey,
      "publicKey": publicKey,
      "mnemonic": mnemonic
    });
  }

  /// 转成Map<String, dynamic>格式
  Map<String, dynamic> toMap() {
    return {
      "address": address,
      "privateKey": privateKey,
      "publicKey": publicKey,
      "mnemonic": mnemonic
    };
  }

  /// 通过json格式创建钱包
  static EthWallet fromJson(String json) {
    Map<String, dynamic> map = jsonDecode(json);
    return EthWallet(
        address: map["address"],
        privateKey: map["privateKey"],
        publicKey: map["publicKey"],
        mnemonic: map["mnemonic"]);
  }

  /// 通过助记词创建钱包
  ///
  /// [mnemonic] 助记词
  /// [path] 路径，默认为 m/44'/60'/0'/0/0
  static Future<EthWallet> fromMnemonic(
    String mnemonic, {
    String path = "m/44'/60'/0'/0/0",
  }) async {
    // var mnemonic = bip39.generateMnemonic();
    var seed = bip39.mnemonicToSeed(mnemonic);
    var root = bip32.BIP32.fromSeed(seed);
    var child = root.derivePath(path);

    List<int> privateKey = child.privateKey as List<int>;
    var publicKey = HEX.encode(child.publicKey);
    // var address = publicKey.toAddress();
    var private = EthPrivateKey.fromHex(bytesToHex(privateKey));
    // 地址
    var address = private.address;

    return EthWallet(
        address: address.toString(),
        privateKey: HEX.encode(privateKey),
        mnemonic: mnemonic,
        publicKey: publicKey.toString());
  }

  /// 通过私钥创建钱包
  /// [privateKey] 私钥
  /// [path] 路径，默认为 m/44'/60'/0'/0/0
  static Future<EthWallet> fromPrivateKey(
    String privateKey, {
    String path = "m/44'/60'/0'/0/0",
  }) async {
    EthPrivateKey private = EthPrivateKey.fromHex(privateKey);
    EthereumAddress address = private.address;
    var publicKey = private.publicKey;
    return EthWallet(
        address: address.toString(),
        privateKey: privateKey,
        publicKey: publicKey.toString());
  }

  /// 判断是否为有效的助记词
  /// [mnemonic] 助记词
  static bool isValidMnemonic(String mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  }

  /// 创建助记词
  static String createMnemonic() {
    return bip39.generateMnemonic();
  }

  /// 通过字符串创建seed
  static List<int> generateSeed(String input) {
    var bytes = utf8.encode(sha256.convert(utf8.encode(input)).toString());

    return bytes;
  }

  /// 通过seed创建钱包
  static Future<EthWallet> createWalletFromSeed(List<int> seed) async {
    String path = "m/44'/60'/0'/0/0";
    var root = bip32.BIP32.fromSeed(Uint8List.fromList(seed));
    var child = root.derivePath(path);

    List<int> privateKey = child.privateKey as List<int>;
    var publicKey = HEX.encode(child.publicKey);
    // var address = publicKey.toAddress();
    var private = EthPrivateKey.fromHex(bytesToHex(privateKey));
    // 地址
    var address = private.address;

    return EthWallet(
        address: address.toString().toLowerCase(),
        privateKey: HEX.encode(privateKey),
        publicKey: publicKey.toString());
    // return bip39.generateMnemonic();
  }

  // 对代理交易请求进行处理
  static Future<UserOperation> fillAndSign(
      {required UserOperation op,
      required EthPrivateKey singer,
      required DeployedContract entryPoint,
      required int chainId}) async {
    // final userOpHash =
    //     keccak256(Uint8List.fromList(utf8.encode(json.encode(op))));
    final result = AbiCoder.encode([
      "address",
      "uint256",
      "bytes32",
      "bytes32",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "bytes32",
    ], [
      op.sender,
      op.nonce,
      keccak256(Uint8List.fromList(HEX.decode(op.initCode))),
      keccak256(Uint8List.fromList(HEX.decode(op.callData))),
      // keccak256(Uint8List.fromList(op.callData.codeUnits)),
      op.callGasLimit,
      op.verificationGasLimit,
      op.preVerificationGas,
      op.maxFeePerGas,
      op.maxPriorityFeePerGas,
      keccak256(Uint8List.fromList(HEX.decode(op.paymasterAndData))),
    ]);

    final userOpHash = keccak256(Uint8List.fromList(HEX.decode(result)));
    print('''UserOp test: $result ${op.sender} *****\r\n 
        hash ${HEX.encode(Uint8List.fromList(userOpHash))} 
        \r\n****''');

    final enc = AbiCoder.encode(["bytes32", "address", "uint256"],
        [userOpHash, entryPoint.address.hex, chainId]);
    print(enc);
    // 利用singer.signPersonalMessageToUint8List()生成签名
    final signText = singer.signPersonalMessageToUint8List(
        keccak256(Uint8List.fromList(HEX.decode(enc))));
    print('signText: 0x${HEX.encode(signText)}');

    op.signature = '${HEX.encode(signText)}';
    return op;
  }
}
