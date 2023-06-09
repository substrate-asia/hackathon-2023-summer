import 'dart:math';

import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hex/hex.dart';
import 'package:http/http.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:web3dart/web3dart.dart';

class EthService {
  static DeployedContract? entryPointContract; // 入口合约
  static DeployedContract? proxyAccountContract; // 代理账号合约
  static DeployedContract? tokenContract; // 代币合约

  static String? entryPointAddress; // 入口合约地址
  static String? tokenPaymasterAbi; // 代币支付合约abi
  static String? entryPointAbi; // 入口合约abi
  static String? proxyAccountAbi; // 代理账号合约abi

  static Future<void> initAbiFile() async {
    // 计算初始化花费的时间
    // final watch = Stopwatch()..start();
    // 读取合约abi
    tokenPaymasterAbi =
        await rootBundle.loadString('assets/json/TokenPaymaster.json');
    entryPointAbi = await rootBundle.loadString('assets/json/EntryPoint.json');
    proxyAccountAbi =
        await rootBundle.loadString('assets/json/SimpleAccount.json');

    entryPointAddress = dotenv.env["ENTRY_POINT_ADDRESS"];
    initEntryPointContract(entryPointAddress ?? '');
    // watch.stop();
    // // 打印初始化花费的时间
    // print('initAbiFile: ${watch.elapsedMilliseconds}ms');
  }

  // dotenv.env["ENTRY_POINT_ADDRESS"]
  // 初始化入口合约
  static Future<void> initEntryPointContract(String entryPointAddress) async {
    entryPointContract = DeployedContract(
        ContractAbi.fromJson(entryPointAbi!, 'EntryPoint'),
        EthereumAddress.fromHex(entryPointAddress));
  }

  // 初始化代理账号合约
  static Future<DeployedContract> initProxyAccountContract(
      String proxyAccountAddress) async {
    proxyAccountContract = DeployedContract(
        ContractAbi.fromJson(proxyAccountAbi!, 'ProxyAccount'),
        EthereumAddress.fromHex(proxyAccountAddress));
    return proxyAccountContract!;
  }

  // 初始化代币合约
  static Future<DeployedContract> initTokenContract(String tokenAddress) async {
    tokenContract = DeployedContract(
        ContractAbi.fromJson(tokenPaymasterAbi!, 'Token'),
        EthereumAddress.fromHex(tokenAddress));
    return tokenContract!;
  }

  // 根据rpc创建web3client
  static Future<Web3Client> createWeb3Client(String rpc) async {
    final client = Web3Client(rpc, Client());
    return client;
  }

  // 发送交易
  static Future<dynamic> signTransaction(
    String privateKey, {
    required String toAddress,
    required BigInt amount,
    Uint8List? data,
    int chainId = 1281,
    int gasLimit = 12500000,
  }) async {
    Web3Client client =
        await createWeb3Client(HiveService.getNetworkRpc(chainId) ?? '');
    EthPrivateKey credentials = EthPrivateKey.fromHex(privateKey);
    var nonce = await client.getTransactionCount(credentials.address);
    // var gasLimit = 10000000;
    EtherAmount gasPrice = await client.getGasPrice();

    // gasPrice = EtherAmount.inWei(gasPrice.getInWei * BigInt.from(100));

    // Uint8List? tempData;
    // if (data != null) {
    //   // Remove the 0x prefix
    //   final hexWithoutPrefix = data.substring(2);
    //   // Convert to bytes
    //   final bytes = const HexDecoder().convert(hexWithoutPrefix);
    //   tempData = Uint8List.fromList(bytes);
    // }
    var transaction = Transaction(
      to: EthereumAddress.fromHex(toAddress),
      nonce: nonce,
      gasPrice: gasPrice,
      maxGas: gasLimit,
      data: data,
      value: EtherAmount.inWei(amount),
    );

    print("transaction ${transaction.maxFeePerGas}");
    var signed = await client.sendTransaction(credentials, transaction,
        chainId: chainId);

    return signed;
  }

  // 评估交易费用
  static Future<BigInt> estimateGas({
    required EthereumAddress ownerAddress,
    required EthereumAddress toAddress,
    required int chainId,
    Uint8List? data,
    String value = '0',
  }) async {
    Web3Client client =
        await createWeb3Client(HiveService.getNetworkRpc(chainId) ?? '');
    // EtherAmount gasPrice = await client.getGasPrice();
    // print("gasPrice 0 $gasPrice");

    // gasPrice = EtherAmount.inWei(gasPrice.getInWei * BigInt.from(10));

    // print("gasPrice $gasPrice");

    // Uint8List? tempData;
    // if (data != null) {
    //   // Remove the 0x prefix
    //   final hexWithoutPrefix = data.substring(2);
    //   // Convert to bytes
    //   final bytes = const HexDecoder().convert(hexWithoutPrefix);
    //   tempData = Uint8List.fromList(bytes);
    // }
    print(value);

    final gasLimit = await client.estimateGas(
      sender: ownerAddress,
      to: toAddress,
      data: data,
      value: EtherAmount.inWei(BigInt.parse(value)),
    );
    // print(
    //     "gasFee $gasLimit ${gasLimit * gasPrice.getInWei / BigInt.from(pow(10, 18))}");
    return gasLimit;
    // return gasFee * gasPrice.getInWei / BigInt.from(pow(10, 18));
  }
}
