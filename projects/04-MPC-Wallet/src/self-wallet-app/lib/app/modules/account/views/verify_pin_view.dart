import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:hex/hex.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';
import 'package:sunrise/app/data/models/user_operation.dart';
import 'package:sunrise/app/data/models/wallet_account.dart';
import 'package:sunrise/app/data/providers/server_providers.dart';
import 'package:sunrise/app/data/services/eth_service.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/core/utils/encryption.dart';
import 'package:sunrise/core/utils/eth_wallet.dart';
import 'package:sunrise/core/values/hive_boxs.dart';
import 'package:web3dart/web3dart.dart';

class VerifyPinView extends StatefulWidget {
  Balance owner;
  String to;
  double amount;

  VerifyPinView(
      {super.key, required this.owner, required this.to, required this.amount});

  @override
  _VerifyPinViewState createState() => _VerifyPinViewState();
}

class _VerifyPinViewState extends State<VerifyPinView> {
  // await HiveService.saveData("test", list);
  String _pin = '';
  String errorText = '';
  Balance get owner => widget.owner;

  void _onNumberPressed(String number) {
    setState(() {
      if (_pin.length < 6) {
        _pin += number;
        errorText = '';
      }
    });

    if (_pin.length == 6) {
      // Submit the verification code
      print('Verification code submitted: $_pin');
      _verifyPin();
    }
  }

  void _onDeletePressed() {
    // _saveWalletAccount();
    setState(() {
      if (_pin.isNotEmpty) {
        _pin = _pin.substring(0, _pin.length - 1);
      }
    });
  }

  // 校验是否被锁定，如果十次返回false，如果十次且时间大于24小时返回true
  bool _checkLockStatus() {
    var _lockStatus = HiveService.getWalletData(LocalKeyList.passwordLock);
    if (_lockStatus != null) {
      var lockStatus = Map.from(_lockStatus);
      var _lockCount = lockStatus["lockCount"];
      var _lockTime = lockStatus["lockTime"];
      if (_lockCount >= 5 &&
          DateTime.now().millisecondsSinceEpoch - _lockTime < 60000) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  // 密码错误锁定次数增加
  void addPasswordErrorLock() {
    var _lockStatus = HiveService.getWalletData(LocalKeyList.passwordLock);
    print(_lockStatus);
    if (_lockStatus != null) {
      var lockStatus = Map.from(_lockStatus);
      var _lockCount = lockStatus["lockCount"];
      var _lockTime = lockStatus["lockTime"];
      if (_lockCount < 5) {
        HiveService.saveWalletData(LocalKeyList.passwordLock, {
          "lockCount": _lockCount + 1,
          "lockTime": DateTime.now().millisecondsSinceEpoch
        });
      } else {
        if (DateTime.now().millisecondsSinceEpoch - _lockTime > 60000) {
          HiveService.saveWalletData(LocalKeyList.passwordLock, {
            "lockCount": 1,
            "lockTime": DateTime.now().millisecondsSinceEpoch
          });
        } else {
          EasyLoading.showToast("密码错误次数过多，请稍后再试");
        }
      }
    } else {
      HiveService.saveWalletData(LocalKeyList.passwordLock,
          {"lockCount": 1, "lockTime": DateTime.now().millisecondsSinceEpoch});
    }
  }

  // 校验密码
  void _verifyPin() async {
    try {
      if (_checkLockStatus() == false) {
        setState(() {
          errorText = '当前密码错误次数过多，请次日再试';
          _pin = '';
        });
        return;
      }

      var accountMap = HiveService.getWalletData(LocalKeyList.rootAddress);
      RootAccount account =
          RootAccount.fromJson(Map<String, dynamic>.from(accountMap));

      // 获取加密后的私钥
      String? encryptedPrivateKey =
          HiveService.getEncryptedPrivateKey(account.address);
      print(encryptedPrivateKey);
      if (encryptedPrivateKey != null) {
        String privateKey = decryptAES(encryptedPrivateKey, _pin);

        EasyLoading.show(status: '交易中');
        print("decryptedKey $privateKey");

        // 重置错误次数
        HiveService.saveWalletData(LocalKeyList.passwordLock, {
          "lockCount": 0,
          "lockTime": DateTime.now().millisecondsSinceEpoch
        });

        // 交易数据编码
        String? transactionData;

        Web3Client client = await EthService.createWeb3Client(
            HiveService.getNetworkRpc(owner.chainId) ?? '');
        Uint8List? withdrawTokens;
        // 判断是否为合约
        if (owner.isContract && owner.contractAddress != null) {
          // 获取合约地址
          DeployedContract tokenContract =
              await EthService.initTokenContract(owner.contractAddress!);
          // erc20的transfer方法
          final transferFunction = tokenContract.function('transfer');
          final balanceFunction = tokenContract.function('balanceOf');

          // 转账编码
          withdrawTokens = transferFunction.encodeCall([
            EthereumAddress.fromHex(widget.to),
            BigInt.from(widget.amount * 1000000000000000000)
          ]);
          print(withdrawTokens);

          print(HEX.encode(withdrawTokens));
          transactionData = "0x${HEX.encode(withdrawTokens)}";

          // final balance = await client.call(
          //     contract: tokenContract,
          //     function: balanceFunction,
          //     params: [
          //       EthereumAddress.fromHex(
          //           "0x707a26C705f95Abcbf3ff5A08E6F048E81700Ec6")
          //     ]);
          // print("balance $balance");
        }
        String toAddress =
            transactionData == null ? widget.to : owner.contractAddress!;
        // if (toAddress.contains('0x')) {
        //   toAddress = toAddress.substring(2);
        // }
        if (owner.isProxy) {
          final credentials = EthPrivateKey.fromHex(privateKey);
          // initProxyAccountContract
          print(owner.address);

          DeployedContract proxyAccountContract =
              await EthService.initProxyAccountContract(owner.address);

          // 调用代理账号合约的execute方法
          final executeFunction = proxyAccountContract.function('execute');
          final getNonceFunction = proxyAccountContract.function('getNonce');
          // 入口合约的handleOps方法
          // final handleOpsFunction =
          //     EthService.entryPointContract?.function('handleOps');

          final nonceResult = await client.call(
            contract: proxyAccountContract,
            function: getNonceFunction,
            params: [],
          );

          // 获取其编码
          final executeData = executeFunction.encodeCall([
            EthereumAddress.fromHex(toAddress),
            BigInt.from(0),
            withdrawTokens,
          ]);

          // 获取当前nonce
          BigInt nonce = nonceResult.first;
          EtherAmount gasPrice = await client.getGasPrice();

          // 计算execute所需的gasLimit
          BigInt maxGasLimit = await EthService.estimateGas(
              ownerAddress: credentials.address,
              toAddress: EthereumAddress.fromHex(owner.address),
              data: executeData,
              chainId: owner.chainId);

          print("gas limit $maxGasLimit ${gasPrice.getInWei.toInt()}");

          // 转账的UserOperation及签名
          final userOp = await EthWallet.fillAndSign(
              op: UserOperation(
                  sender: owner.address,
                  callData: HEX.encode(executeData),
                  callGasLimit: 10000000,
                  verificationGasLimit: 150000,
                  preVerificationGas: 21000,
                  maxFeePerGas: 1125000000,
                  maxPriorityFeePerGas: 1000000000,
                  paymasterAndData: toAddress.substring(2),
                  nonce: nonce.toInt()),
              singer: credentials,
              chainId: owner.chainId,
              entryPoint: EthService.entryPointContract!);

          print("userOp ${userOp.toWeb3Json()}");
          String? result = await Server.fundsTransfer(userOp);

          if (result != null && result != "") {
            EasyLoading.dismiss();
            Get.back(result: result);
          } else {
            // 交易失败 抛出错误让catch捕获
            throw Exception("交易失败");
          }
          // 0xa1eD666D1125b8D606C44cf573B75127E257EB31
          // return;
          // final tupleData2 = [
          //   EthereumAddress.fromHex(userOp1.sender),
          //   BigInt.from(userOp1.nonce),
          //   Uint8List.fromList(HEX.decode('')),
          //   Uint8List.fromList(HEX.decode(userOp1.callData)),
          //   BigInt.from(userOp1.callGasLimit),
          //   BigInt.from(userOp1.verificationGasLimit),
          //   BigInt.from(userOp1.preVerificationGas),
          //   BigInt.from(userOp1.maxFeePerGas),
          //   BigInt.from(userOp1.maxPriorityFeePerGas),
          //   Uint8List.fromList(HEX.decode(userOp1.paymasterAndData)),
          //   Uint8List.fromList(HEX.decode(userOp1.signature)),
          // ];

          // // // 转账编码
          // final opsData = handleOpsFunction!.encodeCall([
          //   [tupleData2],
          //   EthereumAddress.fromHex(dotenv.env["BENEFICIARY_ADDRESS"] ?? '')
          // ]);

          // BigInt gasLimit = await EthService.estimateGas(
          //     ownerAddress: credentials.address,
          //     toAddress: EthereumAddress.fromHex(EthService.entryPointAddress!),
          //     data: opsData,
          //     chainId: owner.chainId);
          // print("gas limit2 $gasLimit");
          // // return;
          // String? hash = await EthService.signTransaction(privateKey,
          //     toAddress: EthService.entryPointAddress!,
          //     amount: BigInt.from(0),
          //     chainId: owner.chainId,
          //     gasLimit: gasLimit.toInt(),
          //     data: opsData);

          // print("txhash $hash");
          // final opsResult = await client.sendTransaction(
          //   credentials,
          //   Transaction.callContract(
          //     contract: EthService.entryPointContract!,
          //     function: handleOpsFunction,
          //     parameters: [
          //       [tupleData2],
          //       EthereumAddress.fromHex(
          //           "0x4759e94177AD2DcCa42AC05f83054CCF655b0785")
          //     ],
          //   ),
          //   chainId: owner.chainId,
          // );
          // print(opsResult);

          // EasyLoading.dismiss();
        } else {
          print("to address ${EthereumAddress.fromHex(toAddress)}");

          BigInt gasLimit = await EthService.estimateGas(
              ownerAddress: EthereumAddress.fromHex(owner.address),
              toAddress: EthereumAddress.fromHex(toAddress),
              data: withdrawTokens,
              value: owner.isContract
                  ? BigInt.from(0).toString()
                  : BigInt.from(widget.amount * 1000000000000000000).toString(),
              chainId: owner.chainId);
          print("gas limit $gasLimit");
          // return;
          String? hash = await EthService.signTransaction(privateKey,
              toAddress: toAddress,
              amount: owner.isContract
                  ? BigInt.from(0)
                  : BigInt.from(widget.amount * 1000000000000000000),
              chainId: owner.chainId,
              gasLimit: gasLimit.toInt(),
              data: withdrawTokens);
          print("hash $hash");

          if (hash != null) {
            // 交易成功
            EasyLoading.showSuccess('交易已发送');
            Get.back(result: hash);
          } else {
            EasyLoading.dismiss();
            EasyLoading.showToast('交易失败');
          }
        }
      }
    } catch (e) {
      print("catch error $e");
      if (e.toString().contains("Invalid or corrupted pad block")) {
        addPasswordErrorLock();
        setState(() {
          errorText = '密码错误';
          _pin = '';
        });
        return;
      } else {
        final regex = RegExp(r'"([^"]+)"');
        final match = regex.firstMatch(e.toString());
        if (match != null) {
          print('Match found: ${match.group(1)}');
          setState(() {
            errorText = match.group(1) ?? '';
            // _pin = '';
          });
          EasyLoading.showError(match.group(1) ?? '');
        } else {
          setState(() {
            errorText = '未知错误, 请稍后重试';
            _pin = '';
          });
          print('No match found.');
        }
      }
      EasyLoading.dismiss();
    }
  }

  @override
  void initState() {
    super.initState();
    // _saveWalletAccount();
    // // owner = widget.owner;
    // print(
    //     "owner ${widget.owner.toSelected()} to ${widget.to} amount ${widget.amount}");
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20.w), topRight: Radius.circular(20.w)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            height: 15.w,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SizedBox(width: 15.w),
              IconButton(
                  onPressed: () {
                    Get.back();
                  },
                  icon: Icon(Icons.close_rounded,
                      size: 28.w, color: Colors.grey[600])),
              Expanded(
                  child: Center(
                child: Text("验证交易密码",
                    style: TextStyle(
                        fontSize: 18.sp, fontWeight: FontWeight.w700)),
              )),
              IconButton(
                  onPressed: () {},
                  icon: Icon(Icons.close_rounded,
                      size: 28.w, color: Colors.transparent)),
              SizedBox(width: 15.w),
            ],
          ).animate().fadeIn().move(duration: 500.ms),
          // SizedBox(height: 30.w),
          const Expanded(child: SizedBox()),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ...List.generate(
                  6,
                  (index) => Container(
                        width: 15.w,
                        height: 15.w,
                        margin: EdgeInsets.symmetric(horizontal: 5.w),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(7.5.w),
                          color: _pin.length > index
                              ? Theme.of(context).colorScheme.primary
                              : Colors.transparent,
                          border: Border.all(
                              width: 2.w,
                              color: Colors.grey[300] ?? Colors.grey),
                        ),
                      ))
            ],
          ).animate().fadeIn().move(duration: 500.ms),
          SizedBox(
            height: 80.w,
            child: errorText != ''
                ? Center(
                    child: Text(
                    errorText,
                    style: TextStyle(fontSize: 14.sp, color: Colors.red[300]),
                  ).animate().shake(duration: 500.ms).fadeIn().callback(
                        callback: (_) {
                    setState(() {
                      _pin = '';
                    });
                  }))
                : null,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildNumberButton('1'),
              _buildNumberButton('2'),
              _buildNumberButton('3'),
            ],
          )
              .animate()
              .fadeIn(delay: 100.ms) // uses `Animate.defaultDuration`
              .move(duration: 500.ms),
          SizedBox(height: 20.w),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildNumberButton('4'),
              _buildNumberButton('5'),
              _buildNumberButton('6'),
            ],
          )
              .animate()
              .fadeIn(delay: 100.ms) // uses `Animate.defaultDuration`
              .move(duration: 500.ms),
          SizedBox(height: 20.w),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildNumberButton('7'),
              _buildNumberButton('8'),
              _buildNumberButton('9'),
            ],
          )
              .animate()
              .fadeIn(delay: 100.ms) // uses `Animate.defaultDuration`
              .move(duration: 500.ms),
          SizedBox(height: 20.w),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              SizedBox(
                width: 80.w,
              ),
              _buildNumberButton('0'),
              SizedBox(
                width: 80.w,
                height: 80.w,
                child: IconButton(
                  icon: Icon(
                    Icons.backspace_rounded,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  onPressed: _onDeletePressed,
                  iconSize: 35.sp,
                ),
              ),
            ],
          )
              .animate()
              .fadeIn(delay: 100.ms) // uses `Animate.defaultDuration`
              .move(duration: 500.ms),
          Expanded(child: SizedBox()),
          // SizedBox(height: 50.w)
        ],
      ),
    );
  }

  Widget _buildNumberButton(String number) {
    return Container(
      width: 70.w,
      height: 70.w,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: Theme.of(context).colorScheme.primary.withOpacity(0.8),
          onPrimary: Colors.black,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(50),
          ),
        ),
        child: Text(
          number,
          style: TextStyle(fontSize: 28.sp, color: Colors.white),
        ),
        onPressed: () => _onNumberPressed(number),
      ),
    );
  }
}
