from django.contrib import admin

# Register your models here.
from utils.models import Ad

admin.site.register([Ad])  # 把这个图像表注册到管理后台中
