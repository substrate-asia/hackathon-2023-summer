import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/app/data/services/eth_service.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/core/theme/color_schemes.g.dart';

import 'app/controllers/wallet_controller.dart';
import 'app/routes/app_pages.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';

import 'core/theme/custom_animation.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // 加载环境变量
  await dotenv.load(fileName: ".env");
  // 初始化服务
  await IsarService.init();
  await HiveService.init();

  // 初始化加载合约abi文件
  EthService.initAbiFile();

  // 初始化全局的Controller
  Get.put(WalletController());

  runApp(
    ScreenUtilInit(
        designSize: const Size(375, 812),
        minTextAdapt: true,
        splitScreenMode: true,
        builder: (context, child) {
          return GetMaterialApp(
            title: "Application",
            initialRoute: AppPages.INITIAL,
            getPages: AppPages.routes,
            builder: EasyLoading.init(),
            debugShowCheckedModeBanner: false,
            themeMode: ThemeMode
                .dark, // HiveService.isDarkMode ? ThemeMode.dark : ThemeMode.light
            theme: ThemeData(
                useMaterial3: true,
                colorScheme: lightColorScheme,
                textTheme:
                    Typography.englishLike2018.apply(fontSizeFactor: 1.sp)),
            darkTheme: ThemeData(
                useMaterial3: true,
                colorScheme: darkColorScheme,
                textTheme:
                    Typography.englishLike2018.apply(fontSizeFactor: 1.sp)),
          );
        }),
  );
  configLoading();
}

void configLoading() {
  EasyLoading.instance
    ..displayDuration = const Duration(milliseconds: 2000)
    ..indicatorType = EasyLoadingIndicatorType.fadingCircle
    ..loadingStyle = EasyLoadingStyle.dark
    ..indicatorSize = 35.0
    ..radius = 16.0
    ..progressColor = Colors.yellow
    ..backgroundColor = Colors.green
    ..indicatorColor = Colors.yellow
    ..textColor = Colors.yellow
    ..maskColor = Colors.blue.withOpacity(0.5)
    ..userInteractions = false
    ..dismissOnTap = false
    ..customAnimation = CustomAnimation();
}
