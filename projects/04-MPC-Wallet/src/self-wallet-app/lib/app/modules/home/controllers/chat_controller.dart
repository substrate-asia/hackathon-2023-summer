import 'dart:async';
import 'dart:isolate';

import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_isolate/flutter_isolate.dart';
import 'package:get/get.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/data/models/chat_collection.dart';
import 'package:sunrise/app/data/services/chat_service.dart';
import 'package:sunrise/app/data/services/hive_service.dart';
import 'package:sunrise/app/data/services/isar_service.dart';
import 'package:sunrise/app/modules/chat/views/chat_view.dart';
import 'package:sunrise/app/modules/notice/views/create_convo.dart';

@pragma('vm:entry-point')
Future<void> isolateHelloEntry(SendPort sendPort) async {
  // int count = 0;

  var receivePort = ReceivePort();
  sendPort.send(receivePort.sendPort);
  await for (final message in receivePort) {
    print('isolateHelloEntry Received message: $message');
  }
  // Timer.periodic(Duration(seconds: 10), (timer) {
  //   final now = DateTime.now();
  //   sendPort.send(now.toString());
  //   print('Sent message: $now');
  //   count++;
  //   if (count >= 10) {
  //     timer.cancel();
  //     sendPort.send('done');
  //   }
  // });
}

class Message {
  final String text;

  Message(this.text);
}

/// isolate与root isolate通信
/// 1. root isolate创建ReceivePort 发送给isolateEntry
/// 2. isolateEntry创建SendPort 发送给root isolate
/// 4. isolateEntry通过SendPort发送消息给root isolate

@pragma('vm:entry-point')
void isolateEntry(SendPort sendPort) async {
  final receivePort = ReceivePort();
  sendPort.send(receivePort.sendPort);
  await for (final message in receivePort) {
    if (message is Message) {
      print('Received message: ${message.text}');
      sendPort.send(Message('Hello from isolate!'));
    } else if (message == 'done') {
      receivePort.close();
      break;
    }
  }
}

class ChatController extends GetxController {
  // 从hive中获取key
  // var stored = HiveService.getData("xmtp-chat");
  // 联系人列表
  // Rx<Operation> rxOperation = Rx<Operation>(Operation(type: -1));

  Rx<Operation> rxOperation = Get.find<Rx<Operation>>();
  RxList<ChatConversation> rxContacts = Get.find();
  // 联系人列表
  List<ChatConversation> get contacts => rxContacts.toList();

  Worker? subscription;

  @override
  void onInit() {
    super.onInit();
    loadContacts();

    subscription = ever(rxOperation, (op) {
      // 处理rxdata对象的变化
      print("=========rxdata change ${op.type} ========== \n $op");
      // handleOperation(op);
      // _handleNewMessage(list);
      handleChatOperation(op);
    });
  }

  @override
  void onClose() {
    subscription?.dispose();
    super.onClose();
  }
  // 私钥 2d1d1a239ba384c5b87550fbce5bdaa28cb41f8bccaf8258c88be66179682d32

  // FlutterIsolate? _isolate;
  // ReceivePort? _receivePort;
  List<String> _messages = [];

  SendPort? sendPort;

  // 添加好友
  void createNewConvo() {
    Get.to(() => const CreateConvo());
  }

  // 测试
  void test() async {
    print("test");
    // XmtpService.initXmtp(
    //     "2d1d1a239ba384c5b87550fbce5bdaa28cb41f8bccaf8258c88be66179682d32");

    // TODO: 创建一个线程，监听new message

    try {
      // FlutterIsolate.killAll();
      // return;
      ReceivePort receivePort = ReceivePort();
      // Isolate isolate = await Isolate.spawn(isolateEntry, receivePort.sendPort);

      // SendPort sendPort = await receivePort.first;
      // sendPort.send(Message('Hello from main thread!'));
      // var subscription = receivePort.listen((message) {
      //   print('Received hhh message: $message');
      // });

      // void startListening() {
      //   subscription = receivePort.listen((message) {
      //     print('Received message: $message');
      //   });
      // }

      // void stopListening() {
      //   subscription?.cancel();
      // }
      // ChatService.client.
      await FlutterIsolate.spawn(ChatService.init, [
        "2d1d1a239ba384c5b87550fbce5bdaa28cb41f8bccaf8258c88be66179682d32",
        receivePort.sendPort
      ]);
      // ChatService.init([
      //   "2d1d1a239ba384c5b87550fbce5bdaa28cb41f8bccaf8258c88be66179682d32",
      //   receivePort.sendPort
      // ]);
      receivePort.listen((message) {
        print("some message $message");
        // 判断message是否为SendPort
        if (message is SendPort) {
          sendPort = message;
          sendPort?.send('Hello from main thread!');
        } else if (message is Map<String, dynamic>) {
          Operation op = Operation.fromMap(message);
          print('Received message: ${op.type}');
          // 更新rxOperation
          rxOperation.value = op;
          handleChatOperation(op);
        }
      });
      // await for (final message in receivePort) {
      //   print("some message $message");
      //   // 判断message是否为SendPort
      //   if (message is SendPort) {
      //     sendPort = message;
      //     sendPort?.send(Message('Hello from main thread!'));
      //   } else if (message is Map<String, dynamic>) {
      //     Operation op = Operation.fromMap(message);
      //     print('Received message: ${op.type}');

      //     // 更新rxOperation
      //     rxOperation.value = op;
      //     handleChatOperation(op);
      //     // sendPort?.send('done');
      //     // break;
      //     // if (message.type == 4) {
      //     //   sendPort = message.data as SendPort;
      //     //   sendPort?.send(Message('Hello from main thread!'));

      //     //   if (message.data is SendPort) {
      //     //     print("this is right");
      //     //   }
      //     // }
      //   }
      // }

      // subscription.cancel();
      // final receivePort = ReceivePort();
      // FlutterIsolate.killAll();
      // final isolate = await FlutterIsolate.spawn(
      //     MyIsolate.isolateEntry, receivePort.sendPort);
      // dynamic sendPort = await receivePort.first;
      // sendPort.send('Hello from main thread!');
      // receivePort.listen((message) {
      //   print('Received message: $message');
      //   // if (message is String) {
      //   //   _messages.add(message);
      //   // }
      //   if (message == 'done') {
      //     print('done!');
      //     isolate.kill(priority: Isolate.immediate);
      //     FlutterIsolate.killAll();
      //   }
      // });

      // final isolate =
      //     await FlutterIsolate.spawn(XmtpService.xmtpInfoisolateEntry, [
      //   "2d1d1a239ba384c5b87550fbce5bdaa28cb41f8bccaf8258c88be66179682d32",
      //   receivePort.sendPort
      // ]);
      // receivePort.listen((message) {
      //   print('Received message: $message');
      // });

      // FlutterIsolate.killAll();
      // MyIsolate.spawnIsolate();
      // var result = await XmtpService.getContacts();

      // if (result == null) {
      //   EasyLoading.showError("获取联系人失败");
      //   return;
      // }
      // print(result);
    } catch (e) {
      print("error $e");
    }
  }

  void handleChatOperation(Operation op) async {
    // 当op.type 等于 5，6，2，7其中之一时都查询联系人
    if ([5, 6, 2, 7].contains(op.type)) {
      // 查询联系人
      loadContacts();
    }

    // if (op.type == 7) {
    //   // 查询联系人
    //   List<ChatConversation>? messageList = await IsarService
    //       .isar?.chatConversations
    //       .where()
    //       .sortByMessageAtDesc()
    //       .thenByCreatedAtDesc()
    //       .findAll();
    //   print(messageList);
    //   // rxContacts.addAll(contractList ?? []);
    // }
  }

  // 加载联系人列表
  void loadContacts() async {
    // 查询联系人
    List<ChatConversation>? contactList = await IsarService
        .isar?.chatConversations
        .where()
        .sortByMessageAtDesc()
        .thenByCreatedAtDesc()
        .findAll();
    print("contactList $contactList");
    // rxContacts.addAll(contactList ?? []);
    rxContacts = contactList?.obs ?? rxContacts;
    update();
  }

  void toChat(ChatConversation convo) {
    Get.to(() => ChatView(),
        routeName: '/chat/${convo.peer}', arguments: [convo.peer]);
  }

  void test2() async {
    // FlutterIsolate.killAll();
    sendPort?.send('done');

    // 清空IsarService.isar?.chatMessages

    // await IsarService.isar?.writeTxn(() async {
    //   await IsarService.isar?.chatMessages.clear();
    // });

    // var stored = HiveService.getData("xmtp-client-key");
    // print("stored $stored");

    // ChatService.createConversation(
    //     "0xa1eD666D1125b8D606C44cf573B75127E257EB31");
    ChatService.loadNewMessage();
    // List<ChatConversation>? contractList = await IsarService
    //     .isar?.chatConversations
    //     .where()
    //     .sortByMessageAtDesc()
    //     .thenByCreatedAtDesc()
    //     .findAll();
    // print(contractList?.length);
    // if (contractList == null) {
    //   return;
    // }
    // for (var element in contractList) {
    //   print(element.toJson());
    // }
  }
}
