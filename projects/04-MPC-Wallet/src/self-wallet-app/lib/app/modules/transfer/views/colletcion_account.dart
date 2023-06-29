import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:get/get.dart';
import 'package:qr_flutter/qr_flutter.dart';

class CollectionAccount extends StatefulWidget {
  const CollectionAccount({super.key});

  @override
  State<CollectionAccount> createState() => _CollectionAccountState();
}

class _CollectionAccountState extends State<CollectionAccount> {
  @override
  Widget build(BuildContext context) {
    String walletAddress = Get.arguments['address'] ?? '';
    print("walletAddress $walletAddress");
    return Scaffold(
      body: Center(
        child: QrImageView(
          data: walletAddress,
          version: QrVersions.auto,
          size: 200.0,
          backgroundColor: Colors.white,
        ),
      ),
    );
  }
}
