# celery的任务必须写在tasks.py的文件中，别的文件名称不识别!!!
from mycelery.main import app
import time

import logging

log = logging.getLogger("django")


@app.task  # name表示设置任务的名称，如果不填写，则默认使用函数名做为任务名
def send_sms(mobile):
    """发送短信"""
    print("向手机号%s发送短信成功!" % mobile)
    time.sleep(5)

    return "send_sms OK"


@app.task  # name表示设置任务的名称，如果不填写，则默认使用函数名做为任务名
def send_sms2(mobile):
    print("向手机号%s发送短信成功!" % mobile)
    time.sleep(5)

    return "send_sms2 OK"
