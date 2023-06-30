import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/home_controller.dart';
import '../widgets/wallet_bottom_bar.dart';
import 'tab_chat_view.dart';
import 'tab_home_view.dart';
import 'tab_profile_view.dart';
import 'tab_swap_view.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetBuilder<HomeController>(
      init: HomeController(),
      builder: (controller) => Scaffold(
        // body: tabPages[controller.currentIndex],
        body: IndexedStack(
          index: controller.currentIndex,
          children: [
            TabHomeView(),
            TabSwapView(),
            TabProfileView(),
          ],
        ),
        bottomNavigationBar: WalletBottomNavigationBar(
            currentIndex: controller.currentIndex, onTap: controller.selectTab),
      ),
    );
  }
}
