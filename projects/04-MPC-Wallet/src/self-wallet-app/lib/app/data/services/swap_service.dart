import 'dart:convert';
import 'dart:typed_data';

import 'package:hex/hex.dart';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';

import 'eth_service.dart';

/// 封装swap中常用的方法
///
///

/// UniswapV2Pair的abi
const _swapV2PairAbi = [
  {
    "inputs": [],
    "name": "getReserves",
    "outputs": [
      {"internalType": "uint112", "name": "_reserve0", "type": "uint112"},
      {"internalType": "uint112", "name": "_reserve1", "type": "uint112"},
      {
        "internalType": "uint32",
        "name": "_blockTimestampLast",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

/// UniswapV2Router02的abi
const _swapV2RouterAbi = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
      {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"},
      {"internalType": "address[]", "name": "path", "type": "address[]"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [
      {"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

/// UniswapV2Factory的abi
const _swapV2FactoryAbi = [
  {
    "inputs": [
      {"internalType": "address", "name": "tokenA", "type": "address"},
      {"internalType": "address", "name": "tokenB", "type": "address"}
    ],
    "name": "getPair",
    "outputs": [
      {"internalType": "address", "name": "pair", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

/// erc20授权的abi
const _tokenAbi = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
];

class SwapService {
  static String factoryAddress = '0xe1b383Ae5aD239AE250BcBDBd68e3bBd9e1A58F1';
  static String routerAddress = '0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4';
  static Web3Client? ethClient;
  static DeployedContract? factoryContract;
  static DeployedContract? routerContract;

  static Future<void> initContract() async {
    final httpClient = Client();
    ethClient =
        Web3Client('https://rpc.api.moonbase.moonbeam.network', httpClient);
    factoryContract = DeployedContract(
        ContractAbi.fromJson(jsonEncode(_swapV2FactoryAbi), 'UniswapV2Factory'),
        EthereumAddress.fromHex(factoryAddress));
    routerContract = DeployedContract(
        ContractAbi.fromJson(jsonEncode(_swapV2RouterAbi), 'UniswapV2Router02'),
        EthereumAddress.fromHex(routerAddress));
  }

  static Future<String> getPairAddress(
      EthereumAddress tokenA, EthereumAddress tokenB) async {
    if (factoryContract == null) {
      await initContract();
    }
    ContractFunction getPairFun = factoryContract!.function('getPair');
    final pairAddress = await ethClient!.call(
        contract: factoryContract!,
        function: getPairFun,
        params: [tokenA, tokenB]);
    // print(pairAddress);
    return pairAddress.first.toString();
  }

  /// 获取储备量
  ///
  /// [pairAddress] 交易对合约地址
  /// return [reserve0, reserve1]
  static Future<List<BigInt>> getReserves(String pairAddress) async {
    if (ethClient == null) {
      await initContract();
    }
    final pairContract = DeployedContract(
        ContractAbi.fromJson(jsonEncode(_swapV2PairAbi), 'UniswapV2Pair'),
        EthereumAddress.fromHex(pairAddress));
    ContractFunction getReservesFun = pairContract.function('getReserves');
    final reserves = await ethClient!
        .call(contract: pairContract, function: getReservesFun, params: []);
    // print(reserves);
    return [
      BigInt.parse(reserves[0].toString()),
      BigInt.parse(reserves[1].toString())
    ];
  }

  /// 使用router的swapExactTokensForTokens进行兑换
  ///
  /// [privateKey] 账号私钥
  /// [amountIn] 输入金额
  /// [amountOutMin] 最小输出金额
  /// [path] List<EthereumAddress>兑换的合约地址
  /// [to] 接收地址
  /// [deadline] 截止时间
  static Future<String?> swapExactTokensForTokens(
      {required String privateKey,
      required BigInt amountIn,
      required BigInt amountOutMin,
      required List<EthereumAddress> path,
      required EthereumAddress to,
      required BigInt deadline}) async {
    if (ethClient == null) {
      await initContract();
    }

    final credentials = EthPrivateKey.fromHex(privateKey);
    // 创建一个token合约
    final tokenContract = DeployedContract(
        ContractAbi.fromJson(jsonEncode(_tokenAbi), 'TOKEN'), path[0]);

    ContractFunction approveFun = tokenContract.function('approve');

    Transaction approveTx = Transaction.callContract(
        contract: tokenContract,
        function: approveFun,
        parameters: [
          EthereumAddress.fromHex(routerAddress),
          amountIn * BigInt.from(10)
        ]);
    print(HEX.encode(approveTx.data!));
    await EthService.signTransaction(privateKey,
        toAddress: path[0].hex,
        amount: BigInt.zero,
        data: approveTx.data,
        gasLimit: 29255,
        chainId: 1287);

    ContractFunction swapExactTokensForTokensFun =
        routerContract!.function('swapExactTokensForTokens');
    Transaction swapTx = Transaction.callContract(
        contract: routerContract!,
        function: swapExactTokensForTokensFun,
        parameters: [amountIn, amountOutMin, path, to, deadline]);

    BigInt gasLimit = await EthService.estimateGas(
        ownerAddress: to,
        toAddress: EthereumAddress.fromHex(routerAddress),
        data: swapTx.data,
        chainId: 1287);
    print("gasLimit $gasLimit");

    String? result = await EthService.signTransaction(privateKey,
        toAddress: routerAddress,
        amount: BigInt.zero,
        data: swapTx.data,
        gasLimit: gasLimit.toInt(),
        chainId: 1287);

    print("tx hash: $result");
    return result;
  }

  static Future<List<Uint8List>?> swapExactTokensForTokensData(
      {required BigInt amountIn,
      required BigInt amountOutMin,
      required List<EthereumAddress> path,
      required EthereumAddress to,
      required BigInt deadline}) async {
    if (ethClient == null) {
      await initContract();
    }

    // 创建一个token合约
    final tokenContract = DeployedContract(
        ContractAbi.fromJson(jsonEncode(_tokenAbi), 'TOKEN'), path[0]);

    ContractFunction approveFun = tokenContract.function('approve');

    Transaction approveTx = Transaction.callContract(
        contract: tokenContract,
        function: approveFun,
        parameters: [
          EthereumAddress.fromHex(routerAddress),
          amountIn * BigInt.from(10)
        ]);
    print(HEX.encode(approveTx.data!));

    ContractFunction swapExactTokensForTokensFun =
        routerContract!.function('swapExactTokensForTokens');
    Transaction swapTx = Transaction.callContract(
        contract: routerContract!,
        function: swapExactTokensForTokensFun,
        parameters: [amountIn, amountOutMin, path, to, deadline]);

    BigInt gasLimit = await EthService.estimateGas(
        ownerAddress: to,
        toAddress: EthereumAddress.fromHex(routerAddress),
        data: swapTx.data,
        chainId: 1287);
    print("gasLimit $gasLimit");
    return [approveTx.data!, swapTx.data!];
  }
}
