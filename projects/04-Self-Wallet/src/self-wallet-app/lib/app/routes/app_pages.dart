import 'package:get/get.dart';
import 'package:sunrise/app/modules/home/views/tab_chat_view.dart';

import '../modules/account/bindings/account_binding.dart';
import '../modules/account/views/account_view.dart';
import '../modules/base/bindings/base_binding.dart';
import '../modules/base/views/base_view.dart';
import '../modules/guide/bindings/guide_binding.dart';
import '../modules/guide/views/guide_view.dart';
import '../modules/home/bindings/home_binding.dart';
import '../modules/home/views/home_view.dart';
import '../modules/notice/bindings/notice_binding.dart';
import '../modules/notice/views/notice_view.dart';
import '../modules/refresh/bindings/refresh_binding.dart';
import '../modules/refresh/views/refresh_view.dart';
import '../modules/splash/bindings/splash_binding.dart';
import '../modules/splash/views/splash_view.dart';
import '../modules/transfer/bindings/transfer_binding.dart';
import '../modules/transfer/views/transfer_view.dart';
import '../modules/website/bindings/website_binding.dart';
import '../modules/website/views/website_view.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static const INITIAL = Routes.SPLASH;

  static final routes = [
    GetPage(
      name: _Paths.HOME,
      page: () => const HomeView(),
      binding: HomeBinding(),
      transition: Transition.cupertino,
    ),
    GetPage(
      name: _Paths.REFRESH,
      page: () => const RefreshView(),
      binding: RefreshBinding(),
      transition: Transition.cupertino,
    ),
    GetPage(
        name: _Paths.ACCOUNT,
        page: () => const AccountView(),
        binding: AccountBinding(),
        transition: Transition.fade),
    GetPage(
      name: _Paths.SPLASH,
      page: () => const SplashView(),
      binding: SplashBinding(),
      transition: Transition.cupertino,
    ),
    GetPage(
      name: _Paths.WEBSITE,
      page: () => const WebsiteView(),
      binding: WebsiteBinding(),
      transition: Transition.cupertino,
    ),
    GetPage(
      name: _Paths.BASE,
      page: () => const BaseView(),
      binding: BaseBinding(),
      transition: Transition.cupertino,
    ),
    GetPage(
      name: _Paths.NOTICE,
      page: () => const TabChatView(),
      binding: NoticeBinding(),
      // ios切入动画
      transition: Transition.cupertino,
    ),
    GetPage(
        name: _Paths.GUIDE,
        page: () => const GuideView(),
        binding: GuideBinding(),
        transition: Transition.fade),
    GetPage(
      name: _Paths.TRANSFER,
      page: () => const TransferView(),
      binding: TransferBinding(),
      transition: Transition.cupertino,
    ),
  ];
}
