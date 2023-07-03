import os
import random
import string
import cv2 as cv
from django.db import models, transaction
import numpy as np

# Create your models here.
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from imagekit.models import ImageSpecField
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel
from pilkit.processors import ResizeToFill

from deep_diary.settings import MEDIA_ROOT
from library.models import Img
from PIL import Image as Image_PIL
from pyexiv2 import Image as Image_pyexiv2

from user_info.models import Profile

STATE_OPTION = (
    (0, "正常"),
    (1, "禁用"),
    (9, "已经删除"),
)
SEX_OPTION = (
    (0, "男"),
    (1, "女"),
    (2, "保密"),
)

DET_METHOD_OPTION = (
    (0, "Lightroom"),
    (1, "InsightFace"),
    (2, "Others"),
)


def face_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'face/{0}/{1}'.format(instance.name, filename)


def face_info_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'face_info/{0}/{1}'.format(instance.name, filename)


class FaceAlbum(MPTTModel):
    img = models.ManyToManyField(to=Img,
                                 through='Face',
                                 through_fields=('face_album', 'img'),  # facealbum need comes first
                                 blank=True,
                                 help_text='对图片按人脸进行分类',
                                 default=None,
                                 related_name='persons')
    profile = models.OneToOneField(
        Profile,
        related_name='facealbum',
        on_delete=models.CASCADE,
        primary_key=False,
        null=True,
        blank=True,
    )
    # 新增，mptt树形结构
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    name = models.CharField(max_length=20, null=True, blank=True, default='unknown', verbose_name="人脸名",
                            help_text='请对该人脸相册进行命名')
    face_feat = models.FileField(upload_to=face_info_directory_path, null=True, blank=True, verbose_name='人脸特征',
                                 help_text='已识别的人脸特征路径')
    is_has_feat = models.BooleanField(blank=True, default=False, verbose_name="是否有人脸特征", help_text='是否有人脸特征')
    avatar = models.ImageField(upload_to=face_directory_path,
                               verbose_name="人脸相册封面",
                               help_text='人脸相册封面',
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
    relationship = models.CharField(max_length=20, null=True, blank=True, default='unknown',
                                    verbose_name="relation to me",
                                    help_text='relation to me')
    created = models.DateTimeField(auto_now_add=True)

    class MPTTMeta:  # 替换 Meta 为 MPTTMeta
        order_insertion_by = ['created']

    def __str__(self):
        str = ''
        parent = self.parent
        while parent:
            str = str + parent.name + '_'
            parent = parent.parent
            print(parent)
        return f'{str}{self.name}'
        # return f'{self.name}'


class Face(models.Model):
    img = models.ForeignKey(Img, null=True, on_delete=models.CASCADE, related_name='faces', verbose_name="所属照片")
    face_album = models.ForeignKey(FaceAlbum, null=True, on_delete=models.CASCADE, related_name='faces',
                                   verbose_name="所属人脸相册")
    name = models.CharField(max_length=20, null=True, blank=True, default='unknown', verbose_name="人脸名",
                            help_text='请对该人脸进行命名')
    is_confirmed = models.BooleanField(blank=True, default=False, verbose_name="人脸是否已确认", help_text='请对人脸名字进行确认')
    det_score = models.FloatField(null=True, blank=True, verbose_name="是人脸的概率", help_text='是人脸的概率')
    face_score = models.FloatField(null=True, blank=True, verbose_name="是这个人的概率", help_text='是这个人的概率')
    age = models.IntegerField(null=True, blank=True, verbose_name="人脸的年龄，用于训练", help_text='人脸的年龄，用于训练')
    gender = models.SmallIntegerField(choices=SEX_OPTION, default=2, verbose_name="性别", help_text="0:男，1：女, 2： 保密")

    face_info = models.FileField(upload_to=face_info_directory_path, null=True, blank=True, verbose_name='人脸属性',
                                 help_text='已识别的人脸路径')
    src = models.ImageField(upload_to=face_directory_path,
                            verbose_name="人脸路径",
                            help_text='请选择需要上传的人脸',
                            null=True, blank=True,
                            default='sys_img/unknown.jpg',
                            )
    thumb = ImageSpecField(source='src',
                           processors=[ResizeToFill(400, 400)],
                           format='JPEG',
                           options={'quality': 80})
    x = models.IntegerField(null=True, blank=True, verbose_name="左上角x坐标", help_text='人脸左上角x坐标')
    y = models.IntegerField(null=True, blank=True, verbose_name="左上角y坐标", help_text='人脸左上角y坐标')
    wid = models.IntegerField(null=True, blank=True, verbose_name="宽度", help_text='人脸宽度')
    height = models.IntegerField(null=True, blank=True, verbose_name="高度", help_text='人脸高度')

    det_method = models.SmallIntegerField(choices=DET_METHOD_OPTION, null=True, blank=True, default=0,
                                          verbose_name="检测方法",
                                          help_text="人脸检测方法")
    state = models.SmallIntegerField(choices=STATE_OPTION, null=True, blank=True, default=0,
                                     verbose_name="人脸状态",
                                     help_text="0:正常，1：禁用, 9: 已经删除")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text='指定其在创建数据时将默认写入当前的时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text='指定每次数据更新时自动写入当前时间')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'created_at'


class Mcs(models.Model):
    id = models.OneToOneField(
        Face,
        related_name='mcs',
        on_delete=models.CASCADE,
        primary_key=True,
    )
    file_upload_id = models.IntegerField(default=0, null=True, blank=True, verbose_name="up load file id",
                                         help_text='up load file id')
    file_name = models.CharField(max_length=40, null=True, blank=True, verbose_name="file_name", help_text='file_name')
    file_size = models.IntegerField(default=0, null=True, blank=True, verbose_name="file_size", help_text='file_size')
    updated_at = models.DateTimeField(default=timezone.now, verbose_name="updated_at", help_text='updated_at')

    nft_url = models.URLField(
        default='https://calibration-ipfs.filswan.com/ipfs/QmQzPDUheTnFYA7HanxwCLw3QrR7choBvh8pswF4LgxguV', null=True,
        blank=True, verbose_name="NFT 站点", help_text='相当于一个图片源，可以展示图片')
    pin_status = models.CharField(max_length=8, null=True, blank=True, verbose_name="pin_status",
                                  help_text='pin_status')
    payload_cid = models.CharField(max_length=80, null=True, blank=True, verbose_name="payload_cid",
                                   help_text='payload_cid')
    w_cid = models.CharField(max_length=100, null=True, blank=True, verbose_name="w_cid", help_text='w_cid')
    status = models.CharField(max_length=8, null=True, blank=True, verbose_name="status", help_text='status')

    deal_success = models.BooleanField(default=False, blank=True, verbose_name="deal_success", help_text='deal_success')
    is_minted = models.BooleanField(default=False, blank=True, verbose_name="is_minted", help_text='is_minted')
    token_id = models.CharField(max_length=8, null=True, blank=True, verbose_name="token_id", help_text='token_id')
    mint_address = models.CharField(max_length=80, null=True, blank=True, verbose_name="mint_address",
                                    help_text='mint_address')
    nft_tx_hash = models.CharField(max_length=80, null=True, blank=True, verbose_name="nft_tx_hash",
                                   help_text='nft_tx_hash')

    def __str__(self):
        return self.id.name
