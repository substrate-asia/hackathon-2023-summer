import os

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
from markdown import Markdown
from mdeditor.fields import MDTextField
from taggit.managers import TaggableManager


# Create your models here.
from user_info.models import Profile


def user_directory_path(instance, filename):  # dir struct MEDIA/user/subfolder/%Y-%m-%d/file
    sub_folder = "article/avatar"
    user_fold = os.path.join(instance.author.username, sub_folder, filename)
    return user_fold


class Category(models.Model):
    """文章分类"""
    title = models.CharField(max_length=100)
    created = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.title


# 博客文章 model
class Article(models.Model):
    author = models.ForeignKey(
        Profile,
        null=True,
        on_delete=models.CASCADE,
        related_name='articles'
    )
    # 分类
    category = models.ForeignKey(
        Category,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='articles'
    )
    tags = TaggableManager(blank=True, verbose_name="标签", help_text='文章标签')
    # 标题
    title = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to=user_directory_path,
                               verbose_name="标题图",
                               help_text='文章标题图',
                               null=True, blank=True,
                               default='sys_img/logo_lg.png',
                               )

    avatar_thumb = ImageSpecField(source='avatar',
                                  processors=[ResizeToFill(400, 400)],
                                  # processors=[ResizeToFit(width=400, height=400)],
                                  # processors=[Thumbnail(width=400, height=400, anchor=None, crop=None, upscale=None)],
                                  format='JPEG',
                                  options={'quality': 80},
                                  )
    # 正文
    body = MDTextField(null=True, blank=True, default='', verbose_name='正文', help_text='请使用markdown语法书写文章')
    # 创建时间
    created = models.DateTimeField(default=timezone.now)
    # 更新时间
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.title

    # 新增方法，将 body 转换为带 html 标签的正文
    def get_md(self):
        md = Markdown(
            extensions=[
                'markdown.extensions.extra',
                'markdown.extensions.codehilite',
                'markdown.extensions.toc',
            ]
        )
        md_body = md.convert(self.body)
        # toc 是渲染后的目录
        return md_body, md.toc
