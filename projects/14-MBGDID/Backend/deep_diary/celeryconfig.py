# 配置文件 celeryconfig.py

broker_url = 'redis://127.0.0.1:6379/2'
result_backend = 'redis://127.0.0.1:6379/1'


# using serializer name
accept_content = ['json', 'pickle']
task_serializer = 'pickle'
result_serializer = 'pickle'

# CELERY_TASK_RESULT_EXPIRES = 60 * 60 * 24  # 任务过期时间
# CELERY_ACCEPT_CONTENT = ["json"]  # 指定任务接受的内容类型.

# # !/usr/bin/env python
# import random
# from kombu import serialization
# from kombu import Exchange, Queue
# import ansibleService
#
# serialization.registry._decoders.pop("application/x-python-serialize")
#
# # broker_url = ansibleService.getConfig('/etc/ansible/rabbitmq.cfg', 'rabbit', 'broker_url')
# # celeryMq = ansibleService.getConfig('/etc/ansible/rabbitmq.cfg', 'celerymq', 'celerymq')
#
# SECRET_KEY = 'top-secrity'
# CELERY_BROKER_URL = broker_url
# CELERY_RESULT_BACKEND = broker_url
# CELERY_TASK_RESULT_EXPIRES = 1200
# CELERYD_PREFETCH_MULTIPLIER = 4
# CELERYD_CONCURRENCY = 1
# CELERYD_MAX_TASKS_PER_CHILD = 1
# CELERY_TIMEZONE = 'CST'
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_ACCEPT_CONTENT = ['json']
# CELERY_RESULT_SERIALIZER = 'json'
# CELERY_QUEUES = (
#     Queue(celeryMq, Exchange(celeryMq), routing_key=celeryMq),
# )
# CELERY_IGNORE_RESULT = True
# CELERY_SEND_EVENTS = False
# CELERY_EVENT_QUEUE_EXPIRES = 60
