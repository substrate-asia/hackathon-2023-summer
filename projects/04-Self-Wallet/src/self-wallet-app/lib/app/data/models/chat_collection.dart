import 'dart:convert';

import 'package:isar/isar.dart';
import 'package:xmtp/xmtp.dart';

part 'chat_collection.g.dart';

@collection
class ChatConversation {
  Id? id;

  ///这是此对话的基本唯一主题名称。
  ///注意：对于本地缓存而言，这是一个很好的标识符。
  @Index(composite: [CompositeIndex('me')])
  String topic;

  ///这可以清楚地识别两个地址。
  ///注意：对于较早的v1对话，此项将为空。
  String? conversationId;

  ///这包含任何其他会话上下文。
  ///注意：对于较早的v1对话，此项将为空。
  String? metadata;

  /// 这是我的地址，我是配置的客户端用户。
  String me;

  /// 这是与我交谈的同行的地址。
  String peer;

  /// 消息内容
  String? content;

  /// conversation 创建时间
  DateTime createdAt;

  /// 最新消息时间
  DateTime? messageAt;

  ChatConversation({
    required this.topic,
    required this.me,
    required this.peer,
    required this.createdAt,
    this.conversationId,
    this.metadata,
    this.messageAt,
    this.content,
  });

  factory ChatConversation.fromJson(Map<String, dynamic> json) {
    return ChatConversation(
      topic: json['topic'],
      conversationId: json['conversationId'],
      me: json['me'],
      peer: json['peer'],
      createdAt: DateTime.parse(json['createdAt']),
      messageAt: DateTime.parse(json['messageAt']),
      metadata: json['metadata'],
      content: json['content'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'topic': topic,
      'conversationId': conversationId,
      'me': me,
      'peer': peer,
      'createdAt': createdAt.toIso8601String(),
      'metadata': metadata,
      'messageAt': messageAt?.toIso8601String(),
      'content': content,
    };
  }

  factory ChatConversation.fromXmtp(Conversation conve) {
    return ChatConversation(
        me: conve.me.hex,
        topic: conve.topic,
        peer: conve.peer.hex,
        metadata: json.encode(conve.metadata),
        createdAt: conve.createdAt,
        conversationId: conve.conversationId);
  }
}

@collection
class ChatMessage {
  Id? id;

  ///此消息的唯一标识符。
  ///提示：对于本地缓存来说，这是一个很好的标识符。
  final String messageId;

  /// 父会话的主题标识符。
  final String topic;

  /// 消息发送时间
  final DateTime sentAt;

  /// 发送人
  final String sender;

  /// 消息内容
  /// 例如：对于contentTypeText，content将是一个String
  /// 例如：对于contentTypeJson，content将是一个Map<String, dynamic>
  /// 例如：对于contentTypeBinary，content将是一个Uint8List
  /// 转成json字符串存入
  final String content;

  ChatMessage({
    required this.messageId,
    required this.topic,
    required this.sentAt,
    required this.sender,
    required this.content,
  });

  // fromDecodedMessage
  factory ChatMessage.fromDecodedMessage(DecodedMessage message) {
    // 如果content不是String就转成json字符串
    String tempContent;
    if (message.content is! String) {
      tempContent = json.encode(message.content);
    } else {
      tempContent = message.content as String;
    }

    return ChatMessage(
      messageId: message.id,
      topic: message.topic,
      sentAt: message.sentAt,
      sender: message.sender.hex,
      content: tempContent,
    );
  }
}
