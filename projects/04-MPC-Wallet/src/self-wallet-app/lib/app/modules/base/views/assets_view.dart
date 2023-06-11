import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/app/modules/base/controllers/token_assets_controller.dart';
import 'package:sunrise/app/widgets/image_widget.dart';
import 'package:sunrise/core/utils/common.dart';

class AssetsView extends GetView {
  const AssetsView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '资产管理',
          style: TextStyle(fontSize: 18.sp),
        ),
        centerTitle: false,
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
      body: GetBuilder(
        init: TokenAssetsController(),
        builder: (controller) => Column(
          children: [
            // 搜索框
            Container(
              margin: EdgeInsets.fromLTRB(15.w, 15.w, 15.w, 0),
              padding: EdgeInsets.fromLTRB(15.w, 0, 15.w, 0),
              decoration: BoxDecoration(
                color: const Color(0xFF262626),
                borderRadius: BorderRadius.circular(30.w),
              ),
              height: 45.w,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Icon(
                    Icons.search_rounded,
                    size: 20.sp,
                    color: Colors.white70,
                  ),
                  SizedBox(
                    width: 10.w,
                  ),
                  Expanded(
                    child: Center(
                      child: TextField(
                        controller: controller.tokenController,
                        scrollPadding: EdgeInsets.zero,
                        decoration: InputDecoration(
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 0.w, vertical: 0),
                          hintText: "搜索币种、合约地址",
                          hintStyle: TextStyle(fontSize: 14.sp),
                          border: InputBorder.none,
                        ),
                        onEditingComplete: () {
                          print("complete");
                          // controller.searchToken();
                        },
                        onChanged: (value) {
                          // print("submit $value");
                          controller.searchToken();
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            ListTile(
              trailing: Icon(
                Icons.arrow_forward_ios_rounded,
                size: 16.sp,
              ),
              minLeadingWidth: 5.w,
              title: Text(
                "自定义币种",
                style: TextStyle(fontSize: 14.sp),
              ),
              onTap: () {},
            ),
            // Padding(
            //     padding: EdgeInsets.symmetric(horizontal: 15.w),
            //     child: Divider(
            //       height: 20.w,
            //       thickness: 1.w,
            //       color: Colors.white12,
            //     )),
            Expanded(
                child: ListView.builder(
              padding: EdgeInsets.only(bottom: 50.sp),
              itemCount: controller.showTokenConfigList.length,
              itemBuilder: (BuildContext context, int index) {
                return ListTile(
                  leading: Container(
                    width: 32.w,
                    height: 32.w,
                    decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(16.w)),
                    child: Center(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20.w),
                        child: ImageWidget(
                          imageUrl:
                              controller.showTokenConfigList[index].iconUrl,
                          width: 32.w,
                          height: 32.w,
                        ),
                      ),
                    ),
                  ),
                  minLeadingWidth: 5.w,
                  trailing: IconButton(
                    icon: index < 5
                        ? Icon(Icons.remove_circle_outline_rounded,
                            color: Colors.red[500])
                        : Icon(
                            Icons.add_circle_outline,
                            color: Colors.green[500],
                          ),
                    onPressed: () {},
                  ),
                  title: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(controller.showTokenConfigList[index].name,
                          style: TextStyle(
                              fontSize: 16.sp, fontWeight: FontWeight.w600)),
                      SizedBox(height: 2.w),
                      Text(
                          addressFormat(controller
                              .showTokenConfigList[index].contractAddress),
                          style: TextStyle(
                              fontSize: 12.sp,
                              color: Colors.white.withOpacity(0.6)))
                    ],
                  ),
                );
              },
            ))
          ],
        ),
      ),
    );
  }
}
