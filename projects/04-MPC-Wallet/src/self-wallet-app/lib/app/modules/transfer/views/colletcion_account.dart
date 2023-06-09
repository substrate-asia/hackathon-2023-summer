import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:qr_flutter/qr_flutter.dart';

class CollectionAccount extends StatefulWidget {
  const CollectionAccount({super.key});

  @override
  State<CollectionAccount> createState() => _CollectionAccountState();
}

class _CollectionAccountState extends State<CollectionAccount> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: QrImageView(
          data: '1234567890',
          version: QrVersions.auto,
          size: 200.0,
          backgroundColor: Colors.amber,
        ),
      ),
    );
  }
}
