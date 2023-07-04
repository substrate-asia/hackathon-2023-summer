# 主程序
import os
from celery import Celery
# import deep_diary


# 把celery和django进行组合，识别和加载django的配置文件
from deep_diary import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'deep_diary.settings')

# broker
broker = 'redis://127.0.0.1:6379/0'
# backend
backend = 'redis://127.0.0.1:6379/1'

# include =['celery_task.tasks']
# worker
# app = Celery(broker=broker, backend=backend, include=include)

# 创建celery实例对象
# app = Celery("deep_diary", broker=broker, backend=backend)
app = Celery("deep_diary")

# 通过app对象加载配置
app.config_from_object("mycelery.config")

# 加载任务
# 参数必须必须是一个列表，里面的每一个任务都是任务的路径名称
# app.autodiscover_tasks(["任务1","任务2"])
# app.autodiscover_tasks(["mycelery.library", ])
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# 时区
app.conf.timezone = 'Asia/Shanghai'
# 是否使用UTC
app.conf.enable_utc = True

# 任务的定时配置
from datetime import timedelta
from celery.schedules import crontab

app.conf.beat_schedule = {
    'demo': {
        'task': 'mycelery.library.tasks.send_sms',
        'schedule': timedelta(seconds=10),
        'args': ('15055308888',),
    }
}



# 启动Celery的命令
# 强烈建议切换目录到mycelery根目录下启动
# celery -A mycelery.main beat
# celery -A mycelery.main worker --loglevel=info
