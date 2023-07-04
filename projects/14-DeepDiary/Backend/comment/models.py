from ckeditor_uploader.fields import RichTextUploadingField
from django.contrib.auth.models import User
from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

from article.models import Article
from user_info.models import Profile


class Comment(MPTTModel):
    # class Comment(models.Model):
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    # 新增，记录二级评论回复给谁, str
    reply_to = models.ForeignKey(
        Profile,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replyers'
    )
    # body = RichTextField(config_name='default', verbose_name='评论内容')
    body = RichTextUploadingField(config_name='default', verbose_name='可以上传文件的评论内容')

    created = models.DateTimeField(auto_now_add=True)

    # 新增，mptt树形结构
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )

    class MPTTMeta:  # 替换 Meta 为 MPTTMeta
        order_insertion_by = ['created']

    def __str__(self):
        return f'{self.id}_{self.user.username}_{self.body[:20]}'


