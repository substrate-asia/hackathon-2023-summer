import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:hex/hex.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/user_operation.dart';
import 'package:sunrise/app/data/providers/server_providers.dart';
import 'package:sunrise/app/data/services/eth_service.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/modules/account/views/verify_account.dart';
import 'package:sunrise/core/utils/eth_wallet.dart';
import 'package:sunrise/core/values/hive_boxs.dart';
import 'package:web3dart/web3dart.dart';

import 'image_widget.dart';

class PaymentWidget extends StatefulWidget {
  final int type; // 0: 交易 1: 签名
  final int networkId;
  Balance? owner;
  String? to;
  double amount;
  String? content; // 签名数据
  Uint8List? data;
  String title;
  String? toAddress;
  PaymentWidget(
      {super.key,
      required this.networkId,
      this.data,
      this.owner,
      this.to,
      this.content,
      this.toAddress,
      this.title = "交易详情",
      this.amount = 0,
      this.type = 0});

  @override
  State<PaymentWidget> createState() => _PaymentWidgetState();
}

class _PaymentWidgetState extends State<PaymentWidget> {
  WalletController walletController = Get.find();
  Balance? get owner => widget.owner;
  int get networkId => widget.networkId;

  BigInt gasLimit = BigInt.from(0);
  BigInt gasUsed = BigInt.from(0);

  Web3Client? client;

  // 交易数据
  Uint8List? transactionBytes;

  Mainnet? mainnet;
  Future<void> confirmPayment() async {
    String? privateKey;
    // 判断是否开启免密支付
    bool isEnableNoPassword =
        HiveService.getData(LocalKeyList.isNoPassword) ?? false;
    // 如果开启了免密支付，直接支付
    if (isEnableNoPassword) {
      privateKey = await walletController.getFreeAuthenticate();
      print("直接支付 $privateKey");

      if (privateKey != null) {
        _handleData(privateKey);
      }
      return;
    }

    // 判断是否开启生物支付
    bool isEnableBiometrics =
        HiveService.getData(LocalKeyList.isBiometrics) ?? false;
    // 如果开启了生物支付，弹出生物支付
    if (isEnableBiometrics) {
      privateKey = await walletController.getAuthenticate();
      print("生物支付 $privateKey");
      if (privateKey == null) {
        EasyLoading.showError("生物支付失败", dismissOnTap: true);
      } else {
        _handleData(privateKey);
        return;
      }
    }

    // 弹出密码支付
    privateKey = await Get.bottomSheet(
      VerifyAccountView(),
      isScrollControlled: true,
      useRootNavigator: true,
      backgroundColor: const Color(0xFF0a0a0a),
      barrierColor: Colors.black.withOpacity(0.5),
    );
    print("密码支付 $privateKey");
    if (privateKey != null) {
      _handleData(privateKey);
    }
  }

  // 处理交易或者签名
  void _handleData(String privateKey) async {
    EthPrivateKey credentials = EthPrivateKey.fromHex(privateKey);
    // Get.back();
    if (widget.type == 0 && owner != null && owner?.isProxy == false) {
      _sendAccountTx(privateKey);
    }

    if (widget.type == 0 && owner != null && owner?.isProxy == true) {
      sendPrxoyTx(credentials);
    }
  }

  // 处理交易数据
  // 生成transactionBytes和gasLimit
  void _handleTx() async {
    try {
      Balance account = owner!;
      EasyLoading.show(
        maskType: EasyLoadingMaskType.black,
      );

      // 根据rpc创建web3client
      client = await EthService.createWeb3Client(
          HiveService.getNetworkRpc(account.chainId) ?? '');
      // 交易数据编码
      String? transactionData;
      // 由调用传入data
      if (widget.data != null) {
        transactionBytes = widget.data;
      }
      // 交易数据
      // Uint8List? transactionBytes;
      // 如果是合约
      if (account.isContract &&
          account.contractAddress != null &&
          widget.data == null) {
        // token合约实例
        DeployedContract tokenContract =
            await EthService.initTokenContract(account.contractAddress!);

        // erc20的transfer方法
        final transferFunction = tokenContract.function('transfer');
        transactionBytes = transferFunction.encodeCall([
          EthereumAddress.fromHex(widget.to ?? ''),
          BigInt.from(widget.amount * 1000000000000000000)
        ]);
        print(HEX.encode(transactionBytes!));
      }

      String toAddress =
          (transactionData == null ? widget.to : account.contractAddress) ?? '';
      if (widget.data != null && widget.toAddress != null) {
        toAddress = widget.toAddress!;
      }
      if (!account.isProxy) {
        print("to address ${EthereumAddress.fromHex(toAddress)}");
        BigInt gas = await EthService.estimateGas(
            ownerAddress: EthereumAddress.fromHex(account.address),
            toAddress: EthereumAddress.fromHex(toAddress),
            data: transactionBytes,
            value: account.isContract
                ? BigInt.from(0).toString()
                : BigInt.from(widget.amount * 1000000000000000000).toString(),
            chainId: account.chainId);

        // 当前gasPrice
        EtherAmount gasPrice =
            await client?.getGasPrice() ?? EtherAmount.zero();
        // gasLimit 转成 Gwei
        setState(() {
          gasLimit = gas;
          gasUsed = (gas * gasPrice.getInWei) ~/ BigInt.from(1000000000);
        });

        EasyLoading.dismiss();
      }
    } catch (e) {
      _handleError(e.toString());
    }
  }

  // 发送EOA交易
  void _sendAccountTx(String privateKey) async {
    Balance account = owner!;
    String toAddress =
        (transactionBytes == null ? widget.to : account.contractAddress) ?? '';

    if (widget.data != null && widget.toAddress != null) {
      toAddress = widget.toAddress!;
    }
    try {
      EasyLoading.show(status: '交易中');
      String? hash = await EthService.signTransaction(privateKey,
          toAddress: toAddress,
          amount: account.isContract
              ? BigInt.from(0)
              : BigInt.from(widget.amount * 1000000000000000000),
          chainId: account.chainId,
          gasLimit: gasLimit.toInt(),
          data: transactionBytes);
      print("hash $hash");
      if (hash != null) {
        // 交易成功
        EasyLoading.showSuccess('交易已发送');
        Get.back(result: hash);
      } else {
        EasyLoading.showToast('交易失败');
      }
    } catch (e) {
      print("_sendAccountTx $e");
      _handleError(e.toString());
    }
  }

  // 发送代理交易
  void sendPrxoyTx(EthPrivateKey credentials) async {
    Balance account = owner!;
    try {
      // 代理合约实例
      DeployedContract proxyAccountContract =
          await EthService.initProxyAccountContract(account.address);

      // 调用代理账号合约的execute方法
      final executeFunction = proxyAccountContract.function('execute');
      final getNonceFunction = proxyAccountContract.function('getNonce');

      // 调用getNonce
      final nonceResult = await client!.call(
        contract: proxyAccountContract,
        function: getNonceFunction,
        params: [],
      );

      // 获取当前nonce
      BigInt nonce = nonceResult.first;

      String toAddress =
          (transactionBytes == null ? widget.to : account.contractAddress) ??
              '';

      // execute编码
      final executeData = executeFunction.encodeCall([
        EthereumAddress.fromHex(toAddress),
        BigInt.from(0),
        transactionBytes,
      ]);

      // 计算execute所需的gasLimit
      BigInt maxGasLimit = await EthService.estimateGas(
          ownerAddress: credentials.address,
          toAddress: EthereumAddress.fromHex(account.address),
          data: executeData,
          chainId: account.chainId);

      print("gas limit $maxGasLimit");

      // 转账的UserOperation及签名
      final userOp = await EthWallet.fillAndSign(
          op: UserOperation(
              sender: account.address,
              callData: HEX.encode(executeData),
              callGasLimit: maxGasLimit.toInt(),
              verificationGasLimit: 150000,
              preVerificationGas: 21000,
              maxFeePerGas: 1125000000,
              maxPriorityFeePerGas: 1000000000,
              paymasterAndData: toAddress.substring(2),
              nonce: nonce.toInt()),
          singer: credentials,
          chainId: account.chainId,
          entryPoint: EthService.entryPointContract!);

      print("userOp ${userOp.toWeb3Json()}");
      String? result = await Server.fundsTransfer(userOp);

      if (result != null && result != "") {
        EasyLoading.dismiss();
      } else {
        // 交易失败 抛出错误让catch捕获
        throw Exception("交易失败");
      }
    } catch (e) {
      print("sendPrxoyTx $e");
      _handleError(e.toString());
    }
  }

  // 处理错误提示
  void _handleError(String e) {
    EasyLoading.dismiss();
    final regex = RegExp(r'"([^"]+)"');
    final match = regex.firstMatch(e.toString());
    if (match != null) {
      print('Match found: ${match.group(1)}');
      EasyLoading.showError(match.group(1) ?? '');
    } else {
      EasyLoading.showError('未知错误, 请稍后重试', dismissOnTap: true);
    }
  }

  // 根据networkId获取网络名称和图标
  void _initNetwork() {
    try {
      Mainnet m = walletController.nodeConfigList
          .firstWhere((element) => element.chainId == networkId);

      setState(() {
        mainnet = m;
      });
    } catch (e) {
      print(e);
    }
  }

  @override
  void initState() {
    super.initState();
    _initNetwork();
    if (widget.type == 0 && owner != null) {
      _handleTx();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 500.w,
      padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 10.w),
      child: widget.type == 0
          ? Column(
              children: [
                Row(
                  children: [
                    SizedBox(
                      width: 100.w,
                      child: mainnet != null
                          ? Row(
                              children: [
                                SizedBox(
                                  width: 20.w,
                                  height: 20.w,
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(20.w),
                                    child: ImageWidget(
                                      imageUrl: mainnet!.iconUrl,
                                      width: 32.w,
                                      height: 32.w,
                                    ),
                                  ),
                                ),
                                SizedBox(width: 5.w),
                                // Text(
                                //   "${mainnet?.chainName}",
                                //   style: TextStyle(fontSize: 16.sp),
                                // )
                              ],
                            )
                          : Container(),
                    ),
                    Expanded(
                        child: Center(
                            child: Text(
                      widget.title,
                      style: TextStyle(
                          fontSize: 16.sp, fontWeight: FontWeight.bold),
                    ))),
                    SizedBox(
                      width: 100.w,
                      child: Align(
                          alignment: Alignment.centerRight,
                          child: IconButton(
                            onPressed: () {
                              Get.back();
                            },
                            icon: Icon(
                              Icons.close_rounded,
                              size: 24.sp,
                            ),
                          )),
                    )
                  ],
                ),
                SizedBox(
                  height: 15.w,
                ),
                Text(
                    "${widget.amount} ${(owner?.isContract == true ? owner?.tokenSymbol : owner?.nativeSymbol)?.toUpperCase()}",
                    style: TextStyle(
                        fontSize: 24.sp,
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary)),
                SizedBox(
                  height: 25.w,
                ),
                _rowCell("发送地址", "${owner?.address}"),
                _rowCell("接收地址", "${widget.to}"),
                Padding(
                    padding: EdgeInsets.symmetric(vertical: 5.w),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                            width: 100.w,
                            child: Text(
                              "当前网络",
                              style: TextStyle(
                                  fontSize: 14.sp, color: Colors.white54),
                            )),
                        const Expanded(child: SizedBox()),
                        mainnet != null
                            ? Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  SizedBox(
                                    width: 20.w,
                                    height: 20.w,
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(20.w),
                                      child: ImageWidget(
                                        imageUrl: mainnet!.iconUrl,
                                        width: 32.w,
                                        height: 32.w,
                                      ),
                                    ),
                                  ),
                                  SizedBox(width: 5.w),
                                  Text(
                                    "${mainnet?.chainName}",
                                    style: TextStyle(fontSize: 16.sp),
                                  )
                                ],
                              )
                            : Container()
                      ],
                    )),
                // _rowCell("交易费用", "0.000000000000000001 ${owner?.nativeSymbol}"),
                _rowCell("GAS费用", "$gasUsed GWEI"),
                SizedBox(
                  height: 30.w,
                  child: Center(
                    child: Divider(
                      height: 1.w,
                      color: Colors.white24,
                    ),
                  ),
                ),

                _rowCell("合计费用",
                    "${widget.amount} ${(owner?.isContract == true ? owner?.tokenSymbol : owner?.nativeSymbol)?.toUpperCase()} + $gasUsed GWEI",
                    isLast: true),
                const Expanded(child: SizedBox()),
                // 确认按钮
                SizedBox(
                  width: double.infinity,
                  height: 50.w,
                  child: ElevatedButton(
                    onPressed: () {
                      confirmPayment();
                    },
                    style: ButtonStyle(
                        shape: MaterialStateProperty.all(RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25.w))),
                        foregroundColor:
                            MaterialStateProperty.all(Colors.white),
                        overlayColor: MaterialStateProperty.all(Colors.white30),
                        backgroundColor: MaterialStateProperty.all(
                            Theme.of(context).colorScheme.primary)),
                    child: Text(
                      "确认",
                      style: TextStyle(fontSize: 16.sp),
                    ),
                  ),
                ),

                SizedBox(
                  height: 30.w,
                ),
              ],
            )
          : Column(
              children: [
                Row(
                  children: [
                    SizedBox(
                      width: 100.w,
                      child: Row(
                        children: [
                          SizedBox(
                            width: 20.w,
                            height: 20.w,
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(20.w),
                              child: ImageWidget(
                                imageUrl:
                                    "https://www.subdev.studio/icon/eth.svg",
                                width: 32.w,
                                height: 32.w,
                              ),
                            ),
                          ),
                          SizedBox(width: 5.w),
                          Text(
                            "MATIC",
                            style: TextStyle(fontSize: 16.sp),
                          )
                        ],
                      ),
                    ),
                    Expanded(
                        child: Center(
                            child: Text(
                      '签名详情',
                      style: TextStyle(
                          fontSize: 16.sp, fontWeight: FontWeight.bold),
                    ))),
                    SizedBox(
                      width: 100.w,
                      child: Align(
                          alignment: Alignment.centerRight,
                          child: IconButton(
                            onPressed: () {
                              Get.back();
                            },
                            icon: Icon(
                              Icons.close_rounded,
                              size: 24.sp,
                            ),
                          )),
                    )
                  ],
                ),
                SizedBox(
                  height: 25.w,
                ),
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(15.w),
                  constraints: BoxConstraints(minHeight: 150.w),
                  decoration: BoxDecoration(
                      border: Border.all(
                          color: Theme.of(context).colorScheme.primary,
                          width: 1.w),
                      borderRadius: BorderRadius.circular(10.w)),
                  child: Text(
                    "widget.data",
                    style: TextStyle(
                        fontSize: 14.sp,
                        fontWeight: FontWeight.bold,
                        color: Colors.white),
                  ),
                ),

                const Expanded(child: SizedBox()),
                // 确认按钮
                SizedBox(
                  width: double.infinity,
                  height: 50.w,
                  child: ElevatedButton(
                    onPressed: () {
                      confirmPayment();
                    },
                    style: ButtonStyle(
                        shape: MaterialStateProperty.all(RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25.w))),
                        foregroundColor:
                            MaterialStateProperty.all(Colors.white),
                        overlayColor: MaterialStateProperty.all(Colors.white30),
                        backgroundColor: MaterialStateProperty.all(
                            Theme.of(context).colorScheme.primary)),
                    child: Text(
                      "确认",
                      style: TextStyle(fontSize: 16.sp),
                    ),
                  ),
                ),

                SizedBox(
                  height: 30.w,
                ),
              ],
            ),
    );
  }

  Widget _rowCell(String key, String value, {bool isLast = false}) {
    return Padding(
        padding: EdgeInsets.symmetric(vertical: 5.w),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
                width: 100.w,
                child: Text(
                  key,
                  style: TextStyle(fontSize: 14.sp, color: Colors.white54),
                )),
            Expanded(
                child: Text(
              value,
              style: TextStyle(
                  fontSize: 14.sp, color: isLast ? Colors.red : Colors.white),
              textAlign: TextAlign.right,
            ))
          ],
        ));
  }
}
