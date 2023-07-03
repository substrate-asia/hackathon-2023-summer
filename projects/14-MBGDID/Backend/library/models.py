import os
from datetime import datetime

from PIL import Image
from django.contrib.auth.models import User
from django.db import models
# Create your models here.
from django.utils import timezone
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill, ResizeToFit
from taggit.managers import TaggableManager

from project.models import Issue

# Create your models here.
from user_info.models import Profile


def user_directory_path(instance, filename):  # dir struct MEDIA/user/subfolder/file
    sub_folder = "img"
    instance.name = filename
    instance.type = filename.split('.')[-1]
    if not instance.user.username:
        instance.user.username = 'unauthorized'
    # os.path.join will be wrong: blue\img\1970\1\1\avatar.jpg
    # user_img_path = os.path.join(instance.user.username, sub_folder, date_path, filename)
    user_img_path = '{0}/{1}/{2}'.format(instance.user.username, sub_folder, filename)
    print('照片存放路径为：' + user_img_path)  # dir struct MEDIA/user/subfolder/file

    return user_img_path


def category_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'category/{0}/{1}'.format(instance.name, filename)


class Img(models.Model):
    ## 图片基本属性：basic
    STATE_OPTION = (
        (0, "正常"),
        (1, "禁用"),
        (9, "已经删除"),
    )
    # 所属用户
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, verbose_name="所属用户", default=1)
    src = models.ImageField(upload_to=user_directory_path,
                            verbose_name="照片路径",
                            help_text='请选择需要上传的图片',
                            null=True, blank=True,
                            default='sys_img/logo_lg.png',
                            )
    # image = ProcessedImageField(upload_to=user_directory_path,    # 使用这个字段，会导致图像元数据丢失
    #                             processors=[ResizeToFit(width=1500, height=1500)],
    #                             format='JPEG',
    #                             options={'quality': 90},
    #                             verbose_name='图片',
    #                             help_text='请选择需要上传的图片',
    #                             null=True, blank=True,
    #                             default='sys_img/logo_lg.png'
    #                             )
    thumb = ImageSpecField(source='src',
                           # processors=[ResizeToFill(400, 400)],
                           processors=[ResizeToFit(width=500, height=500)],
                           # processors=[Thumbnail(width=400, height=400, anchor=None, crop=None, upscale=None)],
                           format='JPEG',
                           options={'quality': 80},
                           )
    issue = models.ForeignKey(
        Issue,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='img',
        help_text='这张照片隶属于哪个问题清单'
    )

    name = models.CharField(default='unnamed', max_length=40, null=True, blank=True, unique=False,
                            verbose_name="图片名", help_text='')  # unique=False, 方便调试
    type = models.CharField(max_length=10, null=True, blank=True, verbose_name="图片格式", help_text='图片格式')
    wid = models.IntegerField(default=0, blank=True, verbose_name="图片宽度", help_text='图片宽度')
    height = models.IntegerField(default=0, blank=True, verbose_name="图片高度", help_text='图片高度')
    aspect_ratio = models.DecimalField(default=0.0, max_digits=3, decimal_places=2, null=True, blank=True,
                                       verbose_name="长宽比")
    is_exist = models.BooleanField(default=True, null=True, blank=True,
                                   verbose_name="路径是否存在", help_text='路径是否存在')

    ## 标签属性: label
    title = models.CharField(max_length=20, null=True, blank=True, verbose_name="图片标题", help_text='图片标题')
    caption = models.CharField(max_length=20, null=True, blank=True, verbose_name="图片描述", help_text='图片描述')
    label = models.CharField(max_length=20, null=True, blank=True, verbose_name="图片说明", help_text='图片说明')
    tags = TaggableManager(blank=True, verbose_name="照片标签", help_text='照片标签', related_name='imgs')

    camera_brand = models.CharField(max_length=20, null=True, blank=True, verbose_name="相机品牌", help_text='相机品牌')
    camera_model = models.CharField(max_length=20, null=True, blank=True, verbose_name="相机型号", help_text='相机型号')

    ## 其它属性: others
    is_publish = models.BooleanField(null=True, blank=True, default=True, verbose_name="是否公开", help_text='是否公开')
    state = models.SmallIntegerField(choices=STATE_OPTION, null=True, blank=True, default=0,
                                     verbose_name="图片状态",
                                     help_text="0:正常，1：禁用, 9: 已经删除")
    # 数据库更新日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text='首次创建的时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text='最后更新的时间')

    def __str__(self):
        return self.id.__str__()

    def to_dict(self):
        return {'id': self.id,
                'src': self.src,
                }

    @property  # 表示这个函数不能有参数
    def custom_face(self):
        queryset = self.face.all()  # 获取所有子对象
        #  "name": "face/unknown/blue_1v6aCXIc.jpg"
        # ret = [{"id": item.id, "name": item.name, "face": f'{item.face.path}'} for item in queryset]   # 不报错
        ret = [{"id": item.id, "name": item.name, "face": item.face.path} for item in queryset]  # 可能报错
        return ret

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'id'


class Category(models.Model):
    """图片分类"""
    img = models.ManyToManyField(to=Img,
                                 through='ImgCategory',
                                 through_fields=('category', 'img'),  # category need comes first
                                 blank=True,
                                 help_text='对图片按应用进行分类',
                                 default=None,
                                 related_name='categories')
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="图片类别", help_text='图片按应用进行划分')
    type = models.CharField(max_length=20, default='category', blank=True, verbose_name="分类类型", help_text='分类类型')
    value = models.CharField(max_length=50, null=True, blank=True, verbose_name="类型值", help_text='类型值')
    numeric_value = models.IntegerField(null=True, blank=True, verbose_name="数值类型值", help_text='数值类型值')
    avatar = models.ImageField(upload_to=user_directory_path,
                               verbose_name="分类相册封面",
                               help_text='分类相册封面',
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

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.name


class ImgCategory(models.Model):
    img = models.ForeignKey(Img, on_delete=models.CASCADE, related_name='imgcategories')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='imgcategories')
    confidence = models.FloatField(default=0, null=True, blank=True, verbose_name="categories_percentage",
                                   help_text='categories_percentage')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text='首次创建的时间')


class Mcs(models.Model):
    id = models.OneToOneField(
        Img,
        related_name='mcs',
        on_delete=models.CASCADE,
        primary_key=True,
    )
    file_upload_id = models.IntegerField(default=0, null=True, blank=True, verbose_name="up load file id",
                                         help_text='up load file id')
    file_name = models.CharField(max_length=40, null=True, blank=True, verbose_name="file name", help_text='file name')
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


class Address(models.Model):
    img = models.OneToOneField(
        Img,
        related_name='address',
        on_delete=models.CASCADE,
        primary_key=True,
    )
    ## 地点属性:location
    is_located = models.BooleanField(default=False, blank=True, verbose_name="是否有GPS 信息", help_text='是否有GPS 信息')
    longitude_ref = models.CharField(default='E', max_length=5, null=True, blank=True, verbose_name="东西经",
                                     help_text='东西经')
    longitude = models.FloatField(default=0.0, max_length=20, null=True, blank=True, verbose_name="经度", help_text='经度')
    latitude_ref = models.CharField(default='N', max_length=5, null=True, blank=True, verbose_name="南北纬",
                                    help_text='南北纬')
    latitude = models.FloatField(default=0.0, max_length=20, null=True, blank=True, verbose_name="纬度", help_text='纬度')
    altitude_ref = models.FloatField(default=0.0, max_length=5, null=True, blank=True, verbose_name="参考高度",
                                     help_text='参考高度')
    altitude = models.FloatField(default=0.0, max_length=20, null=True, blank=True, verbose_name="高度", help_text='高度')
    location = models.CharField(default='No GPS', max_length=50, null=True, blank=True, verbose_name="拍摄地",
                                help_text='拍摄地')
    district = models.CharField(default='No GPS', max_length=20, null=True, blank=True, verbose_name="拍摄区县",
                                help_text='拍摄区县')
    city = models.CharField(default='No GPS', max_length=20, null=True, blank=True, verbose_name="拍摄城市",
                            help_text='拍摄城市')
    province = models.CharField(default='No GPS', max_length=20, null=True, blank=True, verbose_name="拍摄省份",
                                help_text='拍摄省份')
    country = models.CharField(default='No GPS', max_length=20, null=True, blank=True, verbose_name="拍摄国家",
                               help_text='拍摄国家')

    def __str__(self):
        return self.img.name


class Date(models.Model):
    EARTHLY_BRANCHES_OPTION = (
        (0, "凌晨"),
        (1, "早上"),
        (2, "上班"),
        (3, "晚上"),
        (4, "深夜"),
    )

    HOLIDAY_OPTION = (
        (0, "元旦"),
        (1, "春节"),
        (2, "元宵节"),
        (3, "情人节"),
        (4, "妇女节"),
        (5, "清明节"),
        (6, "劳动节"),
        (7, "端午节"),
        (8, "儿童节"),
        (9, "七夕节"),
        (10, "中秋节"),
        (11, "国庆节"),
        (12, "生日"),
        (13, "结婚纪念日"),
    )
    img = models.OneToOneField(
        Img,
        related_name='dates',
        on_delete=models.CASCADE,
        primary_key=True,
    )

    year = models.IntegerField(default=1970, blank=True, verbose_name="拍摄年", help_text='拍摄年')
    month = models.IntegerField(default=1, blank=True, verbose_name="拍摄月", help_text='拍摄月')
    day = models.IntegerField(default=1, blank=True, verbose_name="拍摄日", help_text='拍摄日')
    capture_date = models.DateField(null=True, blank=True, verbose_name="拍摄日期", help_text='拍摄日期')
    capture_time = models.TimeField(null=True, blank=True, verbose_name="拍摄时间", help_text='拍摄时间')
    earthly_branches = models.SmallIntegerField(choices=EARTHLY_BRANCHES_OPTION, null=True, blank=True, default=0,
                                                verbose_name="时间段",
                                                help_text="0: 凌晨，0~5;1: 早上，5~8;  2: 上班，8~17; 3. 晚上，17~21; 4: 深夜,21~24")
    is_weekend = models.BooleanField(null=True, blank=True, verbose_name="是否为周末", help_text='是否为周末')
    # 法定节假日类型(法定节假日往往会有一些不一样的记忆)
    holiday_type = models.SmallIntegerField(choices=HOLIDAY_OPTION, null=True, blank=True, default=0,
                                            verbose_name="节假日",
                                            help_text="法定节假日，纪念日，生日")
    digitized_date = models.DateTimeField(null=True, blank=True, verbose_name="照片修改日期", help_text='照片修改日期')

    def __str__(self):
        return self.img.name


class Evaluate(models.Model):
    FLAG_OPTION = (
        (0, "无旗标"),
        (1, "选中旗标"),
        (2, "排除旗标"),
    )
    img = models.OneToOneField(
        Img,
        related_name='evaluates',
        on_delete=models.CASCADE,
        primary_key=True,
    )
    flag = models.SmallIntegerField(default=0, choices=FLAG_OPTION, null=True, blank=True, verbose_name="旗标",
                                    help_text="0：无旗标，1：选中旗标，2，排除旗标")
    rating = models.IntegerField(default=0, null=True, blank=True, verbose_name="星标等级", help_text='星标等级')
    total_views = models.PositiveIntegerField(null=True, blank=True, default=0, verbose_name="照片浏览量", help_text='照片浏览量')
    likes = models.PositiveIntegerField(null=True, blank=True, default=0, verbose_name="点赞个数", help_text='点赞个数')

    def __str__(self):
        return self.img.name


class Color(models.Model):
    img = models.OneToOneField(
        Img,
        related_name='colors',
        on_delete=models.CASCADE,
        primary_key=True,
    )
    color_variance = models.IntegerField(default=0, null=True, blank=True, verbose_name="color_variance",
                                         help_text='a number that shows how varied the colors in the image are')
    object_percentage = models.FloatField(default=0, null=True, blank=True, verbose_name="object_percentage",
                                          help_text='a floating point number that shows what part of the image '
                                                    'is taken by the main object (as a percent from 0 to 100)')
    color_percent_threshold = models.FloatField(default=0, null=True, blank=True, verbose_name="object_percentage",
                                                help_text='colors with `percentage` value lower than this number won’t be included in the response')

    def __str__(self):
        return self.img.name


class ColorItem(models.Model):
    r = models.IntegerField(default=0, null=True, blank=True, verbose_name="red color",
                            help_text='numbers between 0 and 255 that represent the red, components of the color')
    g = models.IntegerField(default=0, null=True, blank=True, verbose_name="green color",
                            help_text='numbers between 0 and 255 that represent the green components of the color')
    b = models.IntegerField(default=0, null=True, blank=True, verbose_name="blue color",
                            help_text='numbers between 0 and 255 that represent the  blue components of the color')

    closest_palette_color_html_code = models.CharField(max_length=8, null=True, blank=True,
                                                       verbose_name="palette_color_html_code",
                                                       help_text='palette_color_html_code')

    closest_palette_color = models.CharField(max_length=30, null=True, blank=True, verbose_name="palette_color",
                                             help_text='palette_color')

    closest_palette_color_parent = models.CharField(max_length=30, null=True, blank=True,
                                                    verbose_name="palette_color_parent",
                                                    help_text='palette_color_parent')

    closest_palette_distance = models.FloatField(default=0, null=True, blank=True,
                                                 verbose_name='closest_palette_color_parent',
                                                 help_text='how close this color is to the one under the `closest_palette_color` key')

    percent = models.FloatField(default=0, null=True, blank=True, verbose_name="object_percentage",
                                help_text='a floating point number that shows what part of the image '
                                          'is taken by the main object (as a percent from 0 to 100)')

    html_code = models.CharField(max_length=8, null=True, blank=True, verbose_name="palette_color_html_code",
                                 help_text='palette_color_html_code')

    def __str__(self):
        return self.closest_palette_color_parent


class ColorBackground(ColorItem):
    color = models.ForeignKey(Color, on_delete=models.CASCADE, related_name='background',
                              verbose_name="BackgroundColor")


class ColorForeground(ColorItem):
    color = models.ForeignKey(Color, on_delete=models.CASCADE, related_name='foreground',
                              verbose_name="ColorForeground")


class ColorImg(ColorItem):
    color = models.ForeignKey(Color, on_delete=models.CASCADE, related_name='image',
                              verbose_name="ColorImg")

# def get_date_info(date_str):  # '%Y:%m:%d %H:%M:%S'
#
#     if not date_str:
#         date_str = '1970:01:01 00:00:00'
#
#     tt = datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')
#     t_date = tt.strftime("%Y-%m-%d")
#     t_time = tt.strftime("%H:%M:%S")
#     year = str(tt.year).rjust(2, '0')
#     month = str(tt.month).rjust(2, '0')
#     day = str(tt.day).rjust(2, '0')
#
#     if tt.weekday() < 5:
#         is_weekend = False
#     else:
#         is_weekend = True
#     if 0 < tt.hour < 5:
#         earthly_branches = 0  # 这个判断需要后续完善，可以直接把字符串格式化后，再判读时间是否属于朝九晚五
#     elif 5 < tt.hour < 8:
#         earthly_branches = 1
#     elif 8 < tt.hour < 17:
#         earthly_branches = 2
#     elif 17 < tt.hour < 21:
#         earthly_branches = 3
#     else:
#         earthly_branches = 4
#
#     return t_date, t_time, tt.year, tt.month, tt.day, is_weekend, earthly_branches
