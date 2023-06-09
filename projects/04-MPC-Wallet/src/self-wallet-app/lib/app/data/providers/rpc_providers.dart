import 'dart:convert';
import 'package:http/http.dart' as http;

/// 封装调用rpc的方法
///

/// 获取以太坊余额
///
/// [address] 钱包地址
/// [rpcUrl] rpc地址
/// return 以太坊余额
Future<BigInt?> getEtherBalance(String address, String rpcUrl) async {
  var headers = {'Content-Type': 'application/json'};
  var body = jsonEncode({
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": [address, "latest"],
    "id": 1
  });
  try {
    var response =
        await http.post(Uri.parse(rpcUrl), headers: headers, body: body);
    var result = jsonDecode(response.body)['result'];

    if (result == null || result == '0x') {
      return BigInt.from(0);
    }
    // hex转BigInt
    final balance = BigInt.parse(result.substring(2), radix: 16);
    print("balance: $balance");
    return balance;
  } catch (e) {
    return null;
  }
}

/// 获取代币余额
///
/// [tokenAddress] 代币合约地址
/// [walletAddress] 钱包地址
/// [rpcUrl] rpc地址
/// return 以太坊余额
Future<BigInt?> getTokenBalance(
    {required String tokenAddress,
    required String walletAddress,
    required String rpcUrl}) async {
  // 如果是0x开头就截取后面的
  if (walletAddress.startsWith("0x")) {
    walletAddress = walletAddress.substring(2);
  }

  var headers = {'Content-Type': 'application/json'};
  var body = jsonEncode({
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
      {
        "to": tokenAddress,
        "data": "0x70a08231000000000000000000000000$walletAddress"
      },
      "latest"
    ],
    "id": 1
  });
  // print("===================");
  // print(body);
  try {
    var response =
        await http.post(Uri.parse(rpcUrl), headers: headers, body: body);
    var result = jsonDecode(response.body)['result'];

    if (result == null || result == '0x') {
      return BigInt.from(0);
    }
    // hex转BigInt
    final balance = BigInt.parse(result.substring(2), radix: 16);
    return balance;
  } catch (e) {
    return null;
  }
}
