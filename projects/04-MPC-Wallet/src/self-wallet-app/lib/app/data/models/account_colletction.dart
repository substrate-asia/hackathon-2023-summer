import 'package:isar/isar.dart';

part 'account_colletction.g.dart';

@collection
class Balance {
  Id id = Isar.autoIncrement; // 你也可以用 id = null 来表示 id 是自增的
  String balance;
  String address; // 地址
  bool isContract; // 是否是合约
  bool isProxy; // 是否为代理账号
  int chainId; // 链id
  String? contractAddress; // 合约地址
  ContractEnum? contract; // 合约信息
  IsarLink<Mainnet> network = IsarLink<Mainnet>();

  Balance({
    required this.address,
    required this.chainId,
    this.contractAddress,
    this.contract,
    this.balance = "0",
    this.isContract = false,
    this.isProxy = false,
  });

  // 返回Mainnet信息
  String get networkName => network.value?.chainName ?? 'ETH';
  String get iconUrl =>
      network.value?.iconUrl ?? 'https://www.subdev.studio/icon/weth.png';
  String get explorer => network.value?.explorer ?? '';
  String get nativeSymbol => network.value?.nativeCurrencySymbol ?? 'ETH';
  // 返回token信息
  String get tokenName => contract?.name ?? '';
  String get tokenSymbol => contract?.symbol ?? '';
  String get tokenIconUrl =>
      contract?.iconUrl ?? 'https://www.subdev.studio/icon/weth.png';
  int? get tokenDecimals => contract?.decimals;

  // toSelected
  Map<String, dynamic> toSelected() {
    return {
      "address": address,
      "chainId": chainId,
      "isProxy": isProxy,
      "isContract": isContract,
      "contractAddress": contractAddress ?? "",
    };
  }
}

/// evm网络配置
@collection
class Mainnet {
  Id id = Isar.autoIncrement; // 你也可以用 id = null 来表示 id 是自增的
  String rpc; // rpc地址
  String? ws; // ws地址
  String explorer; // 网络浏览器地址
  String chainName; // 链的名称
  String iconUrl; // 链的图标
  String chainColor;
  String shortName; // 链的名称
  String nativeCurrencyName;
  String nativeCurrencySymbol;

  int nativeCurrencyDecimals;

  @Index(unique: true)
  int chainId; // 链id

  bool enabled; // 是否启用

  bool isTestnet; // 是否为测试网

  Mainnet({
    required this.rpc,
    required this.explorer,
    required this.chainName,
    required this.shortName,
    required this.iconUrl,
    required this.chainColor,
    required this.nativeCurrencyName,
    required this.nativeCurrencySymbol,
    required this.nativeCurrencyDecimals,
    required this.chainId,
    this.ws,
    this.enabled = true,
    this.isTestnet = false,
  });

  factory Mainnet.fromJson(Map<String, dynamic> json) {
    return Mainnet(
      rpc: json['rpc'],
      ws: json['ws'],
      explorer: json['explorer'],
      chainName: json['chainName'],
      shortName: json['shortName'],
      iconUrl: json['iconUrl'],
      chainColor: json['chainColor'],
      nativeCurrencyName: json['nativeCurrencyName'],
      nativeCurrencySymbol: json['nativeCurrencySymbol'],
      nativeCurrencyDecimals: json['nativeCurrencyDecimals'],
      chainId: json['chainId'],
      enabled: json['enabled'] ?? true,
      isTestnet: json['isTestnet'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'rpc': rpc,
      'ws': ws,
      'explorer': explorer,
      'chainName': chainName,
      'shortName': shortName,
      'iconUrl': iconUrl,
      'chainColor': chainColor,
      'nativeCurrencyName': nativeCurrencyName,
      'nativeCurrencySymbol': nativeCurrencySymbol,
      'nativeCurrencyDecimals': nativeCurrencyDecimals,
      'chainId': chainId,
      'enabled': enabled,
      'isTestnet': isTestnet,
    };
  }
}

/// evm合约配置
@collection
class Contract {
  Id id = Isar.autoIncrement; // 你也可以用 id = null 来表示 id 是自增的
  String contractAddress; // 合约地址
  String name; // 合约名称
  String symbol; // 合约符号
  int decimals; // 合约精度

  @Index(composite: [CompositeIndex('contractAddress')])
  int chainId; // 合约所属链id
  String iconUrl; // 合约图标
  bool enabled; // 是否启用

  Contract({
    required this.contractAddress,
    required this.name,
    required this.symbol,
    required this.decimals,
    required this.chainId,
    required this.iconUrl,
    this.enabled = true,
  });

  factory Contract.fromJson(Map<String, dynamic> json) {
    return Contract(
      contractAddress: json['contractAddress'],
      name: json['name'],
      symbol: json['symbol'],
      decimals: json['decimals'],
      chainId: json['chainId'],
      iconUrl: json['iconUrl'],
      enabled: json['enabled'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'contractAddress': contractAddress,
      'name': name,
      'symbol': symbol,
      'decimals': decimals,
      'chainId': chainId,
      'iconUrl': iconUrl,
      'enabled': enabled,
    };
  }
}

@embedded
class ContractEnum {
  late String contractAddress; // 合约地址
  late String name; // 合约名称
  late String symbol; // 合约符号
  late int decimals; // 合约精度
  late int chainId; // 合约所属链id
  late String iconUrl; // 合约图标
}

/// 抽象账户
@collection
class ProxyAccount {
  Id id = Isar.autoIncrement; // 你也可以用 id = null 来表示 id 是自增的
  String address; // 地址
  String rootAddress; // 根地址
  String entryPointAddress; // 入口合约地址
  bool enabled; // 是否启用

  ProxyAccount({
    required this.address,
    required this.rootAddress,
    required this.entryPointAddress,
    this.enabled = true,
  });
}
