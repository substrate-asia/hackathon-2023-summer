import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/app/widgets/animation_logo.dart';

import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import '../controllers/website_controller.dart';

class WebsiteView extends GetView<WebsiteController> {
  const WebsiteView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    debugPrint("current url: ${Get.parameters}");
    return GetBuilder(
        init: WebsiteController(),
        builder: (controller) => Scaffold(
              appBar: AppBar(
                title: Text(
                  controller.title,
                  style: TextStyle(
                      fontSize: 16.sp,
                      color: Theme.of(context).colorScheme.onBackground),
                ),
                centerTitle: true,
                leading: IconButton(
                  onPressed: () {
                    Get.back();
                  },
                  icon: Icon(
                    Icons.arrow_back_ios_rounded,
                    size: 18.sp,
                  ),
                ),
              ),
              body: controller.loading
                  ? Center(
                      child: Padding(
                        padding: EdgeInsets.only(
                            bottom: MediaQuery.of(context).padding.top),
                        child: AnimationLogo(),
                      ),
                    )
                  : Column(
                      children: [
                        controller.progress != 100 && controller.progress != 0
                            ? LinearProgressIndicator(
                                value: controller.progress / 100,
                                backgroundColor: Colors.white.withOpacity(0.2),
                                minHeight: 2,
                                valueColor: AlwaysStoppedAnimation(
                                    Theme.of(context).colorScheme.primary),
                              )
                            : const SizedBox(),
                        Expanded(
                            child: InAppWebView(
                          initialUrlRequest:
                              URLRequest(url: Uri.parse(controller.url)),
                          onWebViewCreated: controller.onWebViewCreated,
                          onProgressChanged: controller.onProgressChanged,
                        ))
                      ],
                    ),
            ));
  }
}
