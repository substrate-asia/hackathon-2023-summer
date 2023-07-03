import os
from celery import Celery

# project_name = os.path.split(os.path.abspath('.'))[-1]
project_name = 'deep_diary'
project_settings = '%s.settings' % project_name

# 设置环境变量
os.environ.setdefault('DJANGO_SETTINGS_MODULE', project_settings)
# 实例化celery
# broker
broker = 'redis://127.0.0.1:6379/0'
# backend
backend = 'redis://127.0.0.1:6379/1'

# worker
# app = Celery(broker=broker, backend=backend, include=['celery_task.tasks'])
# app = Celery(project_name, broker=broker, backend=backend)
app = Celery(project_name)
# 使用django 的配置文件进行配置
# app.config_from_object('django.conf:settings')
app.config_from_object('deep_diary.celeryconfig')

# 时区
app.conf.timezone = 'Asia/Shanghai'
# 是否使用UTC
app.conf.enable_utc = False

# 任务的定时配置
from datetime import timedelta
from celery.schedules import crontab

app.conf.beat_schedule = {
    'demo': {
        'task': 'library.task.send_email',
        'schedule': timedelta(seconds=5),
        'args': ('blue',),
    },
    'demo1': {
        'task': 'mycelery.library.tasks.send_sms',
        'schedule': timedelta(seconds=10),
        'args': ('15055308888',),
    }
}




