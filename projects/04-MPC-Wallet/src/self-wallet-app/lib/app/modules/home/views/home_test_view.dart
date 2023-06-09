import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/app/data/services/hive_service.dart';

import '../controllers/home_controller.dart';

class HomeTestView extends GetView<HomeController> {
  const HomeTestView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HomeTestView'),
        centerTitle: true,
      ),
      body: GetBuilder<HomeController>(
          init: HomeController(),
          builder: (controller) => Container(
                width: MediaQuery.of(context).size.width,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: <Widget>[
                      TextField(),
                      Wrap(
                        runAlignment: WrapAlignment.center,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: <Widget>[
                          TextButton(
                            child: Text('open test page'),
                            onPressed: () {
                              controller.timer?.cancel();
                              // alert
                              print("finish");
                            },
                          ),
                          TextButton(
                            child: Text('dismiss'),
                            onPressed: () async {
                              controller.timer?.cancel();
                              await EasyLoading.dismiss();
                              print('EasyLoading dismiss');
                            },
                          ),
                          TextButton(
                            child: Text('show'),
                            onPressed: () async {
                              controller.timer?.cancel();
                              await EasyLoading.show(
                                maskType: EasyLoadingMaskType.black,
                                dismissOnTap: false,
                              );
                              // 3 seconds later, close the dialog
                              controller.timer =
                                  Timer(const Duration(seconds: 3), () async {
                                await EasyLoading.dismiss();
                              });
                              print('EasyLoading show');
                            },
                          ),
                          TextButton(
                            child: Text('showToast'),
                            onPressed: () {
                              controller.timer?.cancel();
                              EasyLoading.showToast(
                                'Toast',
                              );
                            },
                          ),
                          TextButton(
                            child: Text('showSuccess'),
                            onPressed: () async {
                              controller.timer?.cancel();
                              await EasyLoading.showSuccess('Great Success!');
                              print('EasyLoading showSuccess');
                            },
                          ),
                          TextButton(
                            child: Text('showError'),
                            onPressed: () {
                              controller.timer?.cancel();
                              EasyLoading.showError('Failed with Error');
                            },
                          ),
                          TextButton(
                            child: Text('showInfo'),
                            onPressed: () {
                              controller.timer?.cancel();
                              EasyLoading.showInfo('Useful Information.');
                            },
                          ),
                          TextButton(
                            child: Text('showProgress'),
                            onPressed: () {
                              controller.progress = 0;
                              controller.timer?.cancel();
                              controller.timer = Timer.periodic(
                                  const Duration(milliseconds: 100),
                                  (Timer timer) {
                                EasyLoading.showProgress(controller.progress,
                                    status:
                                        '${(controller.progress * 100).toStringAsFixed(0)}%');
                                controller.progress += 0.03;

                                if (controller.progress >= 1) {
                                  controller.timer?.cancel();
                                  EasyLoading.dismiss();
                                }
                              });
                            },
                          ),
                        ],
                      ),
                      Padding(
                        padding: EdgeInsets.only(top: 20.0),
                        child: Column(
                          children: <Widget>[
                            Text('Style'),
                            Padding(
                              padding: EdgeInsets.only(top: 10.0),
                              child:
                                  CupertinoSegmentedControl<EasyLoadingStyle>(
                                selectedColor: Colors.blue,
                                children: {
                                  EasyLoadingStyle.dark: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('dark'),
                                  ),
                                  EasyLoadingStyle.light: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('light'),
                                  ),
                                  EasyLoadingStyle.custom: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('custom'),
                                  ),
                                },
                                onValueChanged: (value) {
                                  EasyLoading.instance.loadingStyle = value;
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.only(top: 20.0),
                        child: Column(
                          children: <Widget>[
                            Text('MaskType'),
                            Container(
                              width: 343.w,
                              height: 170.w,
                              decoration: BoxDecoration(
                                  color: Colors.redAccent,
                                  borderRadius: BorderRadius.circular(8.w)),
                              child: ElevatedButton(
                                onPressed: () async {
                                  List<String> list = ['test', 'test2'];
                                  // await HiveService.saveData("test", list);
                                  debugPrint(
                                      "save ${HiveService.appBox?.get("test1")} ${HiveService.isDarkMode}");
                                  List<String> list2 =
                                      HiveService.getData("test");
                                  print(list2[0]);
                                },
                                child: Text("测试"),
                              ),
                            ),
                            MaterialButton(
                              onPressed: () {
                                // 前往refresh
                                Get.toNamed("/refresh");
                              },
                              child: Text("授权测试"),
                            ),
                            Padding(
                              padding: EdgeInsets.only(top: 10.0),
                              child: CupertinoSegmentedControl<
                                  EasyLoadingMaskType>(
                                selectedColor: Colors.blue,
                                children: {
                                  EasyLoadingMaskType.none: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('none'),
                                  ),
                                  EasyLoadingMaskType.clear: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('clear'),
                                  ),
                                  EasyLoadingMaskType.black: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('black'),
                                  ),
                                  EasyLoadingMaskType.custom: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('custom'),
                                  ),
                                },
                                onValueChanged: (value) {
                                  EasyLoading.instance.maskType = value;
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.only(top: 20.0),
                        child: Column(
                          children: <Widget>[
                            Text('Toast Positon'),
                            Padding(
                              padding: EdgeInsets.only(top: 10.0),
                              child: CupertinoSegmentedControl<
                                  EasyLoadingToastPosition>(
                                selectedColor: Colors.blue,
                                children: {
                                  EasyLoadingToastPosition.top: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('top'),
                                  ),
                                  EasyLoadingToastPosition.center: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('center'),
                                  ),
                                  EasyLoadingToastPosition.bottom: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('bottom'),
                                  ),
                                },
                                onValueChanged: (value) {
                                  EasyLoading.instance.toastPosition = value;
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.only(top: 20.0),
                        child: Column(
                          children: <Widget>[
                            Text(
                              'Animation Style',
                              style: TextStyle(color: Colors.black),
                            ),
                            Padding(
                              padding: EdgeInsets.only(top: 10.0),
                              child: CupertinoSegmentedControl<
                                  EasyLoadingAnimationStyle>(
                                selectedColor: Colors.blue,
                                children: {
                                  EasyLoadingAnimationStyle.opacity: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('opacity'),
                                  ),
                                  EasyLoadingAnimationStyle.offset: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('offset'),
                                  ),
                                  EasyLoadingAnimationStyle.scale: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('scale'),
                                  ),
                                  EasyLoadingAnimationStyle.custom: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('custom'),
                                  ),
                                },
                                onValueChanged: (value) {
                                  EasyLoading.instance.animationStyle = value;
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.only(
                          top: 20.0,
                          bottom: 50.0,
                        ),
                        child: Column(
                          children: <Widget>[
                            Text('IndicatorType(total: 23)'),
                            Padding(
                              padding: EdgeInsets.only(top: 10.0),
                              child: CupertinoSegmentedControl<
                                  EasyLoadingIndicatorType>(
                                selectedColor: Colors.blue,
                                children: {
                                  EasyLoadingIndicatorType.circle: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('circle'),
                                  ),
                                  EasyLoadingIndicatorType.wave: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('wave'),
                                  ),
                                  EasyLoadingIndicatorType.ring: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('ring'),
                                  ),
                                  EasyLoadingIndicatorType.pulse: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('pulse'),
                                  ),
                                  EasyLoadingIndicatorType.cubeGrid: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('cubeGrid'),
                                  ),
                                  EasyLoadingIndicatorType.threeBounce: Padding(
                                    padding: EdgeInsets.all(5.0),
                                    child: Text('threeBounce'),
                                  ),
                                },
                                onValueChanged: (value) {
                                  EasyLoading.instance.indicatorType = value;
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              )),
    );
  }
}
