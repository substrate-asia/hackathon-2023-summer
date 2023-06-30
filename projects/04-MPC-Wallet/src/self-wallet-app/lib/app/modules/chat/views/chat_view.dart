import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';

import 'package:get/get.dart';
import 'package:sunrise/app/data/models/chat_collection.dart';
import 'package:sunrise/app/modules/chat/controllers/chat_box_controller.dart';
import 'package:sunrise/core/utils/common.dart';

class ChatView extends GetView<ChatBoxController> {
  ChatView({Key? key}) : super(key: key);
  String chatTopic = Get.arguments[0] ?? 'chat-key';
  @override
  String? get tag => chatTopic;

  @override
  Widget build(BuildContext context) {
    return GetBuilder(
        init: ChatBoxController(),
        tag: chatTopic,
        builder: (c) => Scaffold(
              appBar: AppBar(
                title: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Text(addressFormat(c.currentConvo?.peer ?? ''),
                        style: const TextStyle(fontSize: 18)),
                    // Text("count ${c.count}")
                  ],
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
                actions: [
                  // 查看地址详情
                  IconButton(
                      onPressed: () {
                        // Get.to(() => TestView());
                        // controller.loadRecentMessages();
                        // 显示地址
                        Get.defaultDialog(
                            title: '账号详情',
                            titleStyle: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                            content: Padding(
                              padding: EdgeInsets.symmetric(horizontal: 15),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('地址：${c.currentConvo?.peer}'),
                                  SizedBox(height: 5.w),
                                  Text('标识：${c.currentConvo?.topic}'),
                                  SizedBox(height: 5.w),
                                  Text('信息：${c.currentConvo?.metadata}'),
                                ],
                              ),
                            ));
                      },
                      icon: const Icon(Icons.info_outline)),
                ],
              ),
              body: Column(
                children: <Widget>[
                  Expanded(
                    child: ListView.builder(
                      reverse: true,
                      itemCount: c.messages.length,
                      itemBuilder: (BuildContext context, int index) {
                        return _buildChatMessage(c.messages[index],
                            isMe: c.messages[index].sender ==
                                c.currentConvo?.peer);
                      },
                    ),
                  ),
                  // c.syncing
                  //     ? SizedBox(
                  //         height: 30,
                  //         child: Center(
                  //           child: Text(
                  //             "同步中",
                  //             style:
                  //                 TextStyle(fontSize: 12, color: Colors.grey),
                  //           ),
                  //         ),
                  //       )
                  //     : Container(),
                  _buildTextComposer(c),
                ],
              ),
            ));
  }

  Widget _buildChatMessage(ChatMessage message, {bool isMe = false}) {
    return Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment:
              isMe ? CrossAxisAlignment.start : CrossAxisAlignment.end,
          children: [
            isMe
                ? Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 40,
                        height: 40,
                        child: CircleAvatar(
                          backgroundColor: Colors.white12,
                          child: ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: SvgPicture.network(
                                  'https://api.dicebear.com/6.x/thumbs/svg?seed=${avatarName(message.sender)}')),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.only(left: 10),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 15, vertical: 20),
                        constraints: BoxConstraints(
                          maxWidth: Get.width * 0.7,
                        ),
                        decoration: const BoxDecoration(
                            color: Colors.white24,
                            borderRadius: BorderRadius.only(
                              topRight: Radius.circular(20),
                              bottomRight: Radius.circular(20),
                              bottomLeft: Radius.circular(20),
                            )),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${message.content}',
                              style: const TextStyle(fontSize: 16),
                            ),
                          ],
                        ),
                      ),
                    ],
                  )
                : Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Container(
                        margin: const EdgeInsets.only(right: 10),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 15, vertical: 20),
                        constraints: BoxConstraints(
                          maxWidth: Get.width * 0.7,
                        ),
                        decoration: const BoxDecoration(
                            color: Colors.greenAccent,
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(20),
                              topRight: Radius.circular(20),
                              bottomLeft: Radius.circular(20),
                            )),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${message.content}',
                              style: const TextStyle(
                                  fontSize: 16, color: Colors.black87),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(
                        width: 40,
                        height: 40,
                        child: CircleAvatar(
                          backgroundColor: Colors.white12,
                          child: ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: SvgPicture.network(
                                  'https://api.dicebear.com/6.x/thumbs/svg?seed=${avatarName(message.sender)}')),
                        ),
                      ),
                    ],
                  ),
            const SizedBox(height: 5),
            Padding(
                padding: const EdgeInsets.only(left: 60, right: 60),
                child: Text("",
                    style: const TextStyle(color: Colors.grey, fontSize: 12))),
          ],
        ));
  }

  Widget _buildTextComposer(ChatBoxController controller) {
    return Container(
      padding:
          const EdgeInsets.only(left: 15.0, right: 15.0, bottom: 30, top: 20),
      decoration: const BoxDecoration(
          color: Colors.white10,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
          )),
      child: Container(
        padding: const EdgeInsets.only(left: 15.0),
        decoration: BoxDecoration(
            color: Colors.white12, borderRadius: BorderRadius.circular(20)),
        child: Row(
          children: <Widget>[
            Flexible(
              child: TextField(
                // maxLength: 300,
                controller: controller.textController,

                onSubmitted: (value) =>
                    controller.sending ? null : controller.sendMessage(),
                decoration: InputDecoration.collapsed(
                  hintText: "发送消息",
                ),
              ),
            ),
            IconButton(
              icon: controller.sending
                  ? const SizedBox(
                      width: 8,
                      height: 8,
                      child: CircularProgressIndicator(),
                    )
                  : const Icon(
                      Icons.send_rounded,
                      color: Colors.white70,
                    ),
              onPressed:
                  controller.sending ? null : () => controller.sendMessage(),
            ),
          ],
        ),
      ),
    );
  }
}
