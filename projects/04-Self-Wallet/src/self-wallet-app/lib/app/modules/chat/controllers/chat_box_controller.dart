import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sunrise/app/controllers/wallet_controller.dart';
import 'package:sunrise/app/data/services/chat_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/app/modules/home/controllers/chat_controller.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/data/models/chat_collection.dart';

class ChatBoxController extends GetxController {
  // RxList<DecodedMessage> messageList = Get.find<RxList<DecodedMessage>>();
  TextEditingController textController = TextEditingController();
  WalletController walletController = Get.find<WalletController>();

  String peerAddress = '';
  ChatConversation? currentConvo;
  // List<ChatMessage> messages = [];
  List<String> messageIds = [];

  final messages = RxList<ChatMessage>([]);

  // 同步中
  bool syncing = false;
  // 发送中
  bool sending = false;

  Worker? subscription;

  int count = 0;
  @override
  void onInit() {
    super.onInit();
    loadConvo();
    Rx<Operation> rxOperation = Get.find<Rx<Operation>>();
    subscription = ever(rxOperation, (op) {
      // 处理rxdata对象的变化
      print("=========rxdata change ${op.type} ========== \n $op");
      handleOperation(op);
      // _handleNewMessage(list);
    });
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    subscription?.dispose();
    super.onClose();
  }

  void handleOperation(Operation op) {
    print("handleOperation change ${op.type} ${op.data == peerAddress}");
    // 处理type为7和2的数据
    if (op.type == 7) {
      // 获取最新的消息
      // 发送成功
      _handleNewMessage(7);
    }

    if (op.type == 2) {
      // 处理新增的信息
      print(op.data);
      print("message length: ${messages.length}");
      // 给messages添加一条数据
      // messages.add(op.data);
      // messages.value = [...messages, op.data];
      // update();
      print("message new length ~: ${messages.length}");
      _handleNewMessage(2);
    }
  }

  void increment() {
    count++;
    update();
  }

  // 从get.arguments中获取参数赋值给currentConvo
  void loadConvo() async {
    peerAddress = Get.arguments[0];

    ChatConversation? recipe = await IsarService.isar?.chatConversations
        .filter()
        .peerEqualTo(peerAddress)
        .findFirst();
    print("peer ${recipe?.content}");
    currentConvo = recipe;
    loadRecentMessages();
    update();
  }

  // 处理新增的信息
  void _handleNewMessage(int type) {
    // 发送成功
    if (type == 2) {
      loadRecentMessages();
      textController.clear();
      sending = false;
    }
    // 接收到新的消息
    if (type == 7) {
      loadRecentMessages();
    }
    // print(message);
    // if (message.isEmpty) {
    //   return;
    // }
    // for (var element in message) {
    //   print(
    //       "handle new message ${element.id} ${element.content} ${element.topic}");
    //   if (messageIds.contains(element.id) ||
    //       (element.sender != currentConvo?.peer)) {
    //     continue;
    //   }
    //   messages.insert(0, element);
    //   messageIds.add(element.messageId);
    // }
    // // if (messageIds.contains(message.last.id)) {
    // //   return;
    // // }
    // // messages.insert(0, message.last);
    // // print(messages.length);
    update();
  }

  // 获取最近的消息
  // 从数据库中获取peer为当前账号的所有topic
  // 从数据库中获取所有topic的消息
  Future<void> loadRecentMessages() async {
    // 开始同步信息
    print("开始同步信息");

    List<ChatConversation>? convoList = await IsarService
        .isar?.chatConversations
        .filter()
        .peerEqualTo(peerAddress)
        .findAll();
    if (convoList == null || convoList.isEmpty) {
      return;
    }
    // 获取所有的topic
    List<String> topics = [];
    for (var element in convoList) {
      topics.add(element.topic);
    }

    print("topics $topics");

    // topics正则
    var topicRegex = RegExp(topics.join("|"));

    // 获取所有的消息
    List<ChatMessage>? _messages = await IsarService.isar?.chatMessages
        .filter()
        .topicMatches(topicRegex.pattern)
        .sortBySentAtDesc()
        .findAll();

    print("messages ${topicRegex.pattern} ${_messages?.length}");
    if (_messages == null || _messages.isEmpty) {
      return;
    }
    messages.value = _messages;
    update();
  }

  // 发送消息
  void sendMessage() async {
    sending = true;
    update();
    var message = textController.text;
    print(message);
    print("walletController.sendPort ${walletController.sendPort}.");
    if (message.isEmpty) {
      return;
    }
    walletController.sendPort?.send(Operation(
            type: 0,
            data: MessageContent(content: message, peer: peerAddress).toMap())
        .toMap());
  }
}
