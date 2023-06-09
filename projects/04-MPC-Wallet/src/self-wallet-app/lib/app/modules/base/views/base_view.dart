import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/base_controller.dart';

class BaseView extends GetView<BaseController> {
  const BaseView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('BaseView'),
        centerTitle: true,
      ),
      body: const Center(
        child: Text(
          'BaseView is working',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
