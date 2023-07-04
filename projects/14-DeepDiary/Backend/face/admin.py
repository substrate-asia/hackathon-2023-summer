# face/admin

from django.contrib import admin

# Register your models here.
from face.models import Face, FaceAlbum

admin.site.register([Face, FaceAlbum])  # 把这个Lightroom 识别出来的人脸注册到管理后台中

