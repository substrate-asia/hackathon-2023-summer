class UserOperation {
  String sender;
  int nonce;
  String initCode;
  String callData;
  int callGasLimit;
  int verificationGasLimit;
  int preVerificationGas;
  int maxFeePerGas;
  int maxPriorityFeePerGas;
  String paymasterAndData;
  String signature;

  // 设置默认值
  UserOperation({
    this.sender = '0x00000000000000000000000000000000',
    this.nonce = 0,
    this.initCode = '',
    this.callData = '',
    this.callGasLimit = 0,
    this.verificationGasLimit = 150000,
    this.preVerificationGas = 21000,
    this.maxFeePerGas = 0,
    this.maxPriorityFeePerGas = 1000000000,
    this.paymasterAndData = '',
    this.signature = '',
  });

  // 从json中读取
  UserOperation.fromJson(Map<String, dynamic> json)
      : sender = json['sender'],
        nonce = json['nonce'],
        initCode = json['initCode'],
        callData = json['callData'],
        callGasLimit = json['callGasLimit'],
        verificationGasLimit = json['verificationGasLimit'],
        preVerificationGas = json['preVerificationGas'],
        maxFeePerGas = json['maxFeePerGas'],
        maxPriorityFeePerGas = json['maxPriorityFeePerGas'],
        paymasterAndData = json['paymasterAndData'],
        signature = json['signature'];

  // 转换为json
  Map<String, dynamic> toJson() => {
        'sender': sender,
        'nonce': nonce,
        'initCode': initCode,
        'callData': callData,
        'callGasLimit': callGasLimit,
        'verificationGasLimit': verificationGasLimit,
        'preVerificationGas': preVerificationGas,
        'maxFeePerGas': maxFeePerGas,
        'maxPriorityFeePerGas': maxPriorityFeePerGas,
        'paymasterAndData': paymasterAndData,
        'signature': signature,
      };
  // 给接口用的json
  Map<String, dynamic> toWeb3Json() => {
        'sender': sender,
        'nonce': nonce,
        'initCode': "0x$initCode",
        'callData': "0x$callData",
        'callGasLimit': callGasLimit,
        'verificationGasLimit': verificationGasLimit,
        'preVerificationGas': preVerificationGas,
        'maxFeePerGas': maxFeePerGas,
        'maxPriorityFeePerGas': maxPriorityFeePerGas,
        'paymasterAndData': "0x$paymasterAndData",
        'signature': "0x$signature",
      };

  List<UserOperationTuple> toTuple() {
    return [
      UserOperationTuple('address', sender, 20),
      UserOperationTuple('uint256', nonce.toString(), 20),
    ];
  }
}

class UserOperationTuple {
  final String opType;
  final String callData;
  final int value;

  UserOperationTuple(this.opType, this.callData, this.value);

  List<dynamic> toTuple() {
    return [opType, callData, value];
  }
}
