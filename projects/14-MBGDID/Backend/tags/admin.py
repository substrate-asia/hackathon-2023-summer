from django.contrib import admin

# Register your models here.
from taggit.models import Tag, TaggedItem

# admin.site.register(Tag)  # 把这个图像表注册到管理后台中
admin.site.register(TaggedItem)  # 把这个图像表注册到管理后台中