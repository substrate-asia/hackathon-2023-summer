import os
from datetime import datetime

from PIL import Image
from django.contrib.auth.models import User
from django.db import models
# Create your models here.
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill, ResizeToFit
from taggit.managers import TaggableManager

from project.models import Issue

# Create your models here.
from user_info.models import Profile


class Ad(models.Model):
    title = models.CharField(max_length=200, default='deep-diary, which is based on deep learning and web3 technical, will become your memory horsekeeper', null=True, blank=True, verbose_name="广告内容", help_text='如需投放广告，请联系深记：15055305685')
    url = models.URLField(
        default='https://www.deep-diary.com', null=True,
        blank=True, verbose_name="广告链接", help_text='广告链接')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('-id',)