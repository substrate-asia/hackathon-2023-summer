import 'dart:convert';

class RootAccount {
  String address; // 钱包地址
  String email; // 邮箱
  String? biometric; // 生物识别
  String? freePay; // 免密支付
  List<String> proxyAddressList; // 代理地址列表

  RootAccount({
    required this.address,
    required this.email,
    this.biometric,
    this.freePay,
    this.proxyAddressList = const [],
  });

  // 从json中构造出RootAccount对象
  factory RootAccount.fromJson(Map<String, dynamic> json) {
    return RootAccount(
      address: json['address'],
      email: json['email'],
      biometric: json['biometric'],
      freePay: json['freePay'],
      proxyAddressList: json['proxyAddressList'] != null
          ? List<String>.from(json['proxyAddressList'])
          : [],
    );
  }

  // 转换为json
  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'email': email,
      'biometric': biometric,
      'freePay': freePay,
      'proxyAddressList': proxyAddressList,
    };
  }
}
