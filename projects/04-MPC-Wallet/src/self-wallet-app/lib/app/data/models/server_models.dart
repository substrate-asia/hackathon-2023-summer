import 'dart:convert';

class ServerProxyAddress {
  int id;
  String accountOwnerAddress;
  String accountChildAddress;
  DateTime createdAt;
  DateTime updatedAt;
  dynamic deleteAt;

  ServerProxyAddress({
    required this.id,
    required this.accountOwnerAddress,
    required this.accountChildAddress,
    required this.createdAt,
    required this.updatedAt,
    this.deleteAt,
  });

  factory ServerProxyAddress.fromJson(String str) =>
      ServerProxyAddress.fromMap(json.decode(str));

  String toJson() => json.encode(toMap());

  factory ServerProxyAddress.fromMap(Map<String, dynamic> json) =>
      ServerProxyAddress(
        id: json["id"],
        accountOwnerAddress: json["AccountOwnerAddress"],
        accountChildAddress: json["AccountChildAddress"],
        createdAt: DateTime.parse(json["CreatedAt"]),
        updatedAt: DateTime.parse(json["UpdatedAt"]),
        deleteAt: json["DeleteAt"],
      );

  Map<String, dynamic> toMap() => {
        "id": id,
        "AccountOwnerAddress": accountOwnerAddress,
        "AccountChildAddress": accountChildAddress,
        "CreatedAt": createdAt.toIso8601String(),
        "UpdatedAt": updatedAt.toIso8601String(),
        "DeleteAt": deleteAt,
      };
}
