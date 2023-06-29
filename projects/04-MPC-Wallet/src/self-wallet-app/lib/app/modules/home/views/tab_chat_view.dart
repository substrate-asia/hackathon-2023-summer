import 'package:easy_refresh/easy_refresh.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:get/get.dart';
import 'package:sunrise/core/utils/common.dart';

import '../controllers/chat_controller.dart';

class TabChatView extends StatelessWidget {
  const TabChatView({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder(
      init: ChatController(),
      builder: (controller) {
        return Scaffold(
          appBar: AppBar(
            title: Text('私信',
                style: TextStyle(fontSize: 18.sp, color: Colors.white)),
            centerTitle: false,
            actions: [
              IconButton(
                  onPressed: () {
                    controller.createNewConvo();
                  },
                  icon: const Icon(Icons.add_circle_outline_rounded))
            ],
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
          body: EasyRefresh(
            child: SingleChildScrollView(
              child: Container(
                constraints: BoxConstraints(
                  minHeight: Get.height - 56.h - 56.h - 56.h - 56.h,
                ),
                child: Column(
                  children: <Widget>[
                    ...List.generate(
                        controller.contacts.length,
                        (index) => ListTile(
                            onTap: () {
                              controller.toChat(controller.contacts[index]);
                            },
                            title: Text(
                                addressFormat(controller.contacts[index].peer)),
                            subtitle: Text(
                              controller.contacts[index].content ?? '暂无消息',
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                  fontSize: 12.w, color: Colors.white60),
                            ),
                            trailing: SizedBox(
                              width: 80,
                              child: Text(
                                "",
                                textAlign: TextAlign.end,
                              ),
                            ),
                            leading: SizedBox(
                              width: 40,
                              height: 40,
                              child: ClipRRect(
                                  borderRadius: BorderRadius.circular(10),
                                  child: SvgPicture.network(
                                      'https://api.dicebear.com/6.x/thumbs/svg?seed=${avatarName(controller.contacts[index].peer)}')),
                            )))
                  ],
                ),
              ),
            ),
            onRefresh: () async {
              // 下拉刷新逻辑
            },
            onLoad: () async {
              // 上拉加载逻辑
            },
          ),
        );
      },
    );
  }
}
