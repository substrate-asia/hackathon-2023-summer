import json
import logging
import sys
import time
import uuid
from flask import current_app
from kafka import KafkaProducer
from enum import Enum
from werkzeug.exceptions import BadRequest
from libs.helper import to_serializable


class AIBotKafkaTopic(Enum):
    AIBotActivity = 'AI_BOT_ACTIVITY'
    AIBotConversationStart = 'AI_BOT_CONVERSATION_START'


class AIBotEventType(Enum):
    AIBotActivity = 'AIBotActivity'
    AIBotConversationStart = 'AIBotConversationStart'


class AIBotActivityType(Enum):
    chat = 'chat'
    completion = 'completion'  # chat,completion 属于相同一类
    likeAnswer = 'likeAnswer'
    dislikeAnswer = 'dislikeAnswer'
    userFeedback = 'userFeedback'
    share = 'share'


class AIBotConversationInfo:
    userId: str = None 	# user identifier, may be same with walletAddress
    # appId is the unique id for a single AI bot, each AI bot is regarded as an app.
    appId: str = None
    conversationId: str = None  # a chat conversation
    messageId: str = None   # a message in the conversation


class AIBotActivity:
    time: float
    walletAddress: str
    activityType: str  # AIBotActivityType
    extInfo: AIBotConversationInfo | None  # optional


class AIBotConversationStart:
    time: float
    walletAddress: str
    activityType: str = 'AIBotConversationStart'  # AIBotActivityType
    extInfo: AIBotConversationInfo | None  # optional


class KafkaPayload:
    # AIBotActivity,AIBotConversationStart
    body: AIBotActivity | AIBotConversationStart
    messageId: str
    messageType: str  # AIBotEventType
    createdTime: float


# EXTERNAL_KAFKA_ENABLE=false
# EXTERNAL_KAFKA_BROKERS=
# EXTERNAL_KAFKA_CLIENT_ID=


def init_app(app):

    check_enable = (app.config.get(
        'EXTERNAL_KAFKA_ENABLE', False))
    if check_enable == False:
        logging.warning('EXTERNAL_KAFKA_ENABLE %s',
                        check_enable)
        return

    logging.info('EXTERNAL_KAFKA_ENABLE %s', check_enable)

    servers = app.config.get('EXTERNAL_KAFKA_BROKERS', 'localhost:9092')
    client_id = app.config.get('EXTERNAL_KAFKA_CLIENT_ID', 'ai_bot_ext_kafka')
    producer = KafkaProducer(bootstrap_servers=servers,
                             client_id=client_id)

    app.extensions['ext_kafka_producer'] = producer
    logging.info(
        'kafka connection ready for EXTERNAL_KAFKA_BROKERS %s, %s', servers, client_id)


def publish_message_to_kafka(topic: str, msg_json: str, partition: int = 0):
    check_enable = (current_app.config.get(
        'EXTERNAL_KAFKA_ENABLE', False))
    if check_enable == False:
        return
    
    logging.debug('publish_message_to_kafka:%s,%d,%s',
                  topic, partition, msg_json)
    value = msg_json.encode(encoding='utf-8')
    ext_kafka_producer: KafkaProducer = current_app.extensions['ext_kafka_producer']
    try:
        future = ext_kafka_producer.send(
            topic=topic,  value=value, partition=partition)
        result = future.get(timeout=10)
        logging.info('publish_message_to_kafka result: %s', result)
    except:
        logging.error("Unexpected error when publish_message_to_kafka: %s",
                      sys.exc_info()[0])
        raise


def publish_chat_app_start_message(external_user_id: str, app_id: str, conversation_id: str = None, message_id: str = None):
    check_enable = (current_app.config.get(
        'EXTERNAL_KAFKA_ENABLE', False))
    if check_enable == False:
        return
    
    try:
        d = AIBotConversationStart()
        d.time = time.time()*1000
        d.walletAddress = external_user_id
        d.activityType = AIBotEventType.AIBotConversationStart.value
        ext = AIBotConversationInfo()
        ext.appId = app_id
        ext.conversationId = conversation_id
        ext.messageId = message_id
        d.extInfo = ext
        kafkaPayload = KafkaPayload()
        kafkaPayload.body = d
        kafkaPayload.messageId = str((uuid.uuid4()))
        kafkaPayload.messageType = AIBotEventType.AIBotConversationStart.value
        kafkaPayload.createdTime = time.time()*1000

        msg_json = json.dumps(kafkaPayload, default=to_serializable)
        publish_message_to_kafka(
            AIBotKafkaTopic.AIBotConversationStart.value, msg_json)
    except:
        logging.error("Unexpected error when publish_chat_app_start_message: %s",
                      sys.exc_info()[0])
        raise BadRequest(str.format(
            "Unexpected error when publish_chat_app_start_message:{0}", sys.exc_info()[0]))


def publish_chat_activity_message(activity_type: AIBotActivityType, external_user_id: str, app_id: str, conversation_id: str = None, message_id: str = None):
    check_enable = (current_app.config.get(
        'EXTERNAL_KAFKA_ENABLE', False))
    if check_enable == False:
        return
    try:
        d = AIBotActivity()
        d.time = time.time()*1000
        d.walletAddress = external_user_id
        d.activityType = activity_type.value
        ext = AIBotConversationInfo()
        ext.userId = external_user_id
        ext.appId = app_id
        ext.conversationId = conversation_id
        ext.messageId = message_id
        d.extInfo = ext
        kafkaPayload = KafkaPayload()
        kafkaPayload.body = d
        kafkaPayload.messageId = str((uuid.uuid4()))
        kafkaPayload.messageType = AIBotEventType.AIBotActivity.value
        kafkaPayload.createdTime = time.time()*1000

        msg_json = json.dumps(kafkaPayload, default=to_serializable)
        publish_message_to_kafka(
            AIBotKafkaTopic.AIBotActivity.value, msg_json)
    except:
        logging.error("Unexpected error when publish_chat_activity_message: %s",
                      sys.exc_info()[0])
        raise BadRequest(str.format(
            "Unexpected error when publish_chat_activity_message:{0}", sys.exc_info()[0]))
