import 'dart:async';
import 'dart:isolate';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:isar/isar.dart';
import 'package:sunrise/app/data/models/chat_collection.dart';
import 'package:web3dart/web3dart.dart';
import 'package:xmtp/xmtp.dart';

import 'hive_service.dart';
import 'isar_service.dart';

@pragma('vm:entry-point')
class ChatService {
  /// 客户端
  static Client? client;

  static String? address;

  /// 客户端key
  static String clientKey = "xmtp-client-key";

  /// 监听MAP Map<topic dynamic>
  static Map<String, dynamic> listenMap = {};

  /// topic列表
  /// 用于判断是否已经监听过
  static List<String> topicList = [];

  static SendPort? sendPort;

  // 监听
  static StreamSubscription<dynamic>? subscription;
  static StreamSubscription<Conversation>? conveSubscription;

  static Future<void> _initXmtp(String? privateKey) async {
    // await HiveService.deleteData(clientKey);
    // 从hive中获取key
    var stored = HiveService.getData(clientKey);
    debugPrint("stored: ${stored.toString()}");
    var chatAddress = HiveService.getData("chat-address");
    debugPrint("stored: $chatAddress");

    final api = Api.create(
      host: "production.xmtp.network",
      isSecure: true,
      debugLogRequests: true,
      // host: "dev.xmtp.network"
    );
    // 如果没有key
    if (stored != null) {
      // 从stored中获取key
      var keys = PrivateKeyBundle.fromBuffer(stored);
      print(keys);
      // var api = Api.create();
      client = await Client.createFromKeys(api, keys);
      address = chatAddress;
    } else {
      final credentials = EthPrivateKey.fromHex(privateKey!);
      address = credentials.address.hex;
      // 对client进行初始化 dev
      client = await Client.createFromWallet(api, credentials.asSigner());
      HiveService.saveData(clientKey, client?.keys.writeToBuffer());
      HiveService.saveData("chat-address", credentials.address.hex);

      debugPrint("saveData: ${client?.keys.writeToBuffer().toString()}");
      debugPrint("client: $client");
    }
  }

  static init(List<dynamic> args) async {
    // 判断args类型是否正确
    if (args.length != 2) {
      throw Exception("args length must be 2");
    }
    if (args[0] is! String) {
      throw Exception("args[0] must be String");
    }
    if (args[1] is! SendPort) {
      throw Exception("args[1] must be SendPort");
    }
    String privateKey = args[0] as String;
    sendPort = args[1] as SendPort;

    // 加载环境变量
    await dotenv.load(fileName: ".env");
    // 初始化服务
    await IsarService.init();
    await HiveService.init();

    await _createNewPort();
    // _watchNewMessage(receivePort);
    // sendPort?.send(receivePort.sendPort);
    // 等待client初始化完成
    await _initXmtp(privateKey);
    listenNewConversation();
    getContacts();
  }

  /// 创建新的Port
  static Future<ReceivePort> _createNewPort() async {
    var receivePort = ReceivePort();
    _watchNewMessage(receivePort);
    sendPort?.send(receivePort.sendPort);
    return receivePort;
  }

  /// 监听要发送的信息
  /// 通过topic来区分
  static _watchNewMessage(ReceivePort receivePort) async {
    if (subscription != null) {
      subscription?.cancel();
    }
    subscription = receivePort.listen((message) {
      print(
          'Received hhh message: $message ${message is Map<String, dynamic>}');
      if (message is Map<String, dynamic>) {
        print('Received hhh message: $message ${message['type']}');
        switch (message['type']) {
          case 0:
            debugPrint("message['data']: ${message['data']}");
            // 发送消息
            if (message['data'] is Map<String, dynamic>) {
              Map<String, dynamic> msg = message['data'];
              // print("content ${msg.content} peer ${msg.peer}");
              sendMessage(msg['content'], msg['peer']);
            }
            break;
          case 2:
            // 创建会话

            if (message['data'] is String) {
              createConversation(message['data']);
            }
            break;
          case 3:
            // 取消监听消息
            // cancelListen(message.data);
            break;
          case 4:
            // 获取联系人列表
            getContacts();
            break;
          case 5:
            // 获取联系人列表
            getContacts();
            break;
          default:
        }
      }
    }, onDone: () {
      print('port closed');
      _createNewPort();
    });
  }

  // 关闭监听
  static void closeListen() {
    subscription?.cancel();
  }

  // 监听new conversation
  static Future<void> listenNewConversation() async {
    // RxList<Conversation> convoList = Get.find<RxList<Conversation>>();
    if (conveSubscription != null) {
      conveSubscription?.cancel();
    }
    conveSubscription = client?.streamConversations().listen(
      (convo) {
        debugPrint('Got a new conversation with ${convo.peer}');
        IsarService.isar?.writeTxn(() async {
          // 查询数据库中是否有这个联系人
          List<ChatConversation>? checkList = await IsarService
              .isar?.chatConversations
              .filter()
              .peerEqualTo(convo.peer.hex)
              .findAll();

          // 将联系人存入数据库
          if (checkList == null || checkList.isEmpty) {
            await IsarService.isar?.chatConversations
                .put(ChatConversation.fromXmtp(convo));
          }

          // 通知页面读取最新的联系人列表
          sendPort?.send({"type": 6});
        });
        // 监听消息
        _listenMessage(convo);
      },
      onDone: () {
        debugPrint('Done listening to new conversations');
        _createNewPort();
        listenNewConversation();
      },
    );

    // topicList.add(listening.);
  }

  // 监听用户信息
  static Future<void> _listenMessage(Conversation convo) async {
    if (listenMap[convo.topic] != null) {
      await listenMap[convo.topic]?.cancel();
    }
    var listening = client?.streamMessages(convo).listen((message) {
      debugPrint('Got a new message from ${message.sender} ${message.content}');
      debugPrint("Some check IsarService.isar: ${IsarService.isar}");
      print(
          "streamMessages $address ${message.sender} ${address?.toLowerCase() == message.sender.toString()}");
      if (address?.toLowerCase() == message.sender.toString()) {
        print("接收到我发送的消息");
        return;
      }
      // 将信息存入数据库
      IsarService.isar?.writeTxn(() async {
        // 查询数据库中是否有这条信息
        List<ChatMessage>? checkList = await IsarService.isar?.chatMessages
            .filter()
            .messageIdEqualTo(message.id)
            .findAll();
        print("checkList $checkList");
        // 如果数据库中没有这条信息
        if (checkList == null || checkList.isEmpty) {
          ChatMessage chatMessage = ChatMessage.fromDecodedMessage(message);
          // 将信息存入数据库
          await IsarService.isar?.chatMessages.put(chatMessage);

          // 更新联系人的content和messageAt
          final recipe = await IsarService.isar?.chatConversations
              .filter()
              .topicEqualTo(message.topic)
              .findFirst();
          if (recipe != null) {
            recipe.content = chatMessage.content;
            recipe.messageAt = chatMessage.sentAt;
            await IsarService.isar?.chatConversations.put(recipe);
          }

          // 通知页面读取最新的信息
          // sendPort?.send(Operation(type: 7, data: chatMessage));
          sendPort?.send({"type": 7});
        }
      });
    }, onDone: () {
      print('${convo.topic} Stream is done');
      // 如果stream断开后且应用没有关闭 重连
      if (listenMap[convo.topic] != null) {
        _listenMessage(convo);
      }
    });
    listenMap[convo.topic] = listening;
  }

  // 获取联系人列表
  static Future<void> getContacts() async {
    List<Conversation> conversations = await client?.listConversations() ?? [];
    print("conversations ${conversations.length} $conversations");
    // 循环监听
    for (var i = 0; i < conversations.length; i++) {
      // 监听消息
      _listenMessage(conversations[i]);
    }

    await getLatestMessage(conversations);

    // 跟数据库的联系人对比
    List<ChatConversation>? contractList =
        await IsarService.isar?.chatConversations.where().findAll();

    // 如果数据库中没有联系人
    if (contractList == null || contractList.isEmpty) {
      await IsarService.isar?.writeTxn(() async {
        // 将联系人存入数据库
        for (var i = 0; i < conversations.length; i++) {
          await IsarService.isar?.chatConversations
              .put(ChatConversation.fromXmtp(conversations[i]));
        }
      });

      sendPort?.send({"type": 5, "data": null});
      return;
    }

    // 如果数据库中有联系人跟新的联系人对比
    await IsarService.isar?.writeTxn(() async {
      for (var i = 0; i < conversations.length; i++) {
        // 如果数据库中没有这个联系人
        if (contractList
            .where((element) => element.topic == conversations[i].topic)
            .isEmpty) {
          // 将联系人存入数据库
          await IsarService.isar?.chatConversations
              .put(ChatConversation.fromXmtp(conversations[i]));
        }
      }
      // 如果数据库中有这个联系人 但是 新的联系人列表中没有这个联系人
      for (var i = 0; i < contractList.length; i++) {
        if (conversations
            .where((element) => element.topic == contractList[i].topic)
            .isEmpty) {
          // 将联系人从数据库中删除
          await IsarService.isar?.chatConversations.delete(contractList[i].id!);
        }
      }
    });

    sendPort?.send({"type": 5, "data": null});
  }

  /// 获取联系人的最新消息
  /// 把获取到的最新消息跟数据库对比
  /// 如果不一样就更新数据库且替换chatConversations对应账号的content和messageAt
  static Future<void> getLatestMessage(List<Conversation> conversations) async {
    try {
      List<ChatMessage> messageList = [];
      for (var convo in conversations) {
        var messages = await client?.listMessages(convo, limit: 1);
        print(
            "account_topic ${convo.peer.hex} ${convo.topic} loadRecentMessages ${messages?.length} $messages");
        if (messages == null || messages.isEmpty) {
          continue;
        }

        ChatMessage lastMessage = ChatMessage.fromDecodedMessage(messages[0]);
        List<ChatMessage>? checkList = await IsarService.isar?.chatMessages
            .filter()
            .messageIdEqualTo(lastMessage.messageId)
            .findAll();
        if (checkList != null && checkList.isNotEmpty) {
          continue;
        }

        print("${lastMessage.content} ${lastMessage.sentAt}");
        // 添加到messageList
        messageList.add(lastMessage);
      }

      await IsarService.isar?.writeTxn(() async {
        for (var element in messageList) {
          // 更新数据库
          await IsarService.isar?.chatMessages.put(element);
          // 查询联系人并替换content和messageAt
          final recipe = await IsarService.isar?.chatConversations
              .filter()
              .topicEqualTo(element.topic)
              .findFirst();
          if (recipe != null) {
            recipe.content = element.content;
            recipe.messageAt = element.sentAt;
            await IsarService.isar?.chatConversations.put(recipe);
          }
        }
      });
    } catch (e) {
      print("getLatestMessage error $e");
    }
  }

  /// 同步最近的20条信息
  ///
  /// 1. 获取最近的20条信息
  /// 2. 比对数据库中的信息查看是否有更新
  /// 3. 如果有更新就更新数据库
  static Future<void> loadNewMessage() async {
    // 获取数据库中的联系人列表
    List<ChatConversation>? contractList =
        await IsarService.isar?.chatConversations.where().findAll();
    if (contractList == null || contractList.isEmpty) {
      return;
    }

    // 遍历联系人列表
    for (var element in contractList) {
      // 创建新的联系人
      Conversation? convo = await client?.newConversation(element.peer);
      if (convo == null) {
        continue;
      }
      var messages = await client?.listMessages(convo, limit: 20);
      if (messages == null || messages.isEmpty) {
        continue;
      }

      await IsarService.isar?.writeTxn(() async {
        // 遍历新的联系人的最近20条信息
        for (var message in messages) {
          // 将信息转换成ChatMessage
          ChatMessage chatMessage = ChatMessage.fromDecodedMessage(message);
          // 查询数据库中是否有这条信息
          List<ChatMessage>? checkList = await IsarService.isar?.chatMessages
              .filter()
              .messageIdEqualTo(chatMessage.messageId)
              .findAll();
          // 如果数据库中没有这条信息
          if (checkList == null || checkList.isEmpty) {
            // 将信息存入数据库
            await IsarService.isar?.chatMessages.put(chatMessage);
          }
        }
      });
    }
  }

  // 发送消息
  static Future<void> sendMessage(String content, String peer) async {
    if (client == null) {
      throw Exception("client is null");
    }
    // 创建新的联系人
    var convo = await client?.newConversation(peer);
    // 发送消息
    DecodedMessage? temp = await client?.sendMessage(convo!, content);
    if (temp == null) {
      return;
    }
    IsarService.isar?.writeTxn(() async {
      // 如果数据库中没有这条信息
      ChatMessage chatMessage = ChatMessage.fromDecodedMessage(temp);
      // 将信息存入数据库
      await IsarService.isar?.chatMessages.put(chatMessage);

      // 更新联系人的content和messageAt
      final recipe = await IsarService.isar?.chatConversations
          .filter()
          .topicEqualTo(temp.topic)
          .findFirst();
      if (recipe != null) {
        recipe.content = chatMessage.content;
        recipe.messageAt = chatMessage.sentAt;
        await IsarService.isar?.chatConversations.put(recipe);
      }

      // sendPort?.send(
      //     Operation(type: 2, data: ChatMessage.fromDecodedMessage(temp)));
      sendPort?.send({"type": 2});
    });
  }

  // 创建新的联系人 并发送信息
  static Future<void> createConversation(String peer) async {
    try {
      if (client == null) {
        throw Exception("client is null");
      }
      // 判断数据库有没有这个地址
      List<ChatConversation>? contractList = await IsarService
          .isar?.chatConversations
          .filter()
          .peerEqualTo(peer.toLowerCase())
          .findAll();
      debugPrint("contractList: $contractList");

      // 创建新的联系人
      var convo = await client?.newConversation(peer);
      // 如果数据库中有这个地址
      if (contractList != null && contractList.isNotEmpty) {
        sendPort?.send({"type": 6});
        return;
      }

      // // 将联系人存入数据库
      await IsarService.isar?.writeTxn(() async {
        await IsarService.isar?.chatConversations
            .put(ChatConversation.fromXmtp(convo!));
      });
      sendPort?.send({"type": 6});
    } catch (e) {
      sendPort?.send({"type": -1, "data": e.toString()});
    }
  }
}

// 操作
// [type] 0: 发送消息 1: 接收消息 2: 发送消息成功 3: 发送消息失败 4: SendPort类型 5: 初始化完成 6: 有新的联系人 7: 有新的消息 -1: 错误
class Operation {
  final int type;
  final dynamic data;

  Operation({required this.type, this.data});

  // fromMap
  factory Operation.fromMap(Map<String, dynamic> map) {
    return Operation(
      type: map['type'],
      data: map['data'],
    );
  }

  // toMap
  Map<String, dynamic> toMap() {
    return {
      'type': type,
      'data': data,
    };
  }
}

// 消息
class MessageContent {
  // final String topic;
  final String content;
  final String peer;

  MessageContent({required this.content, required this.peer});

  // fromMap
  factory MessageContent.fromMap(Map<String, dynamic> map) {
    return MessageContent(
      content: map['content'],
      peer: map['peer'],
    );
  }

  // toMap
  Map<String, dynamic> toMap() {
    return {
      'content': content,
      'peer': peer,
    };
  }
}
