# project/models.py
import os
from datetime import date

from django.db import models
# Create your models here.
from django.utils import timezone
from imagekit.models import ImageSpecField
from pilkit.processors import ResizeToFill
from taggit.managers import TaggableManager

from user_info.models import Profile, Company

PRODUCT_DIFFICULT_OPTION = (
    (2, "溢水灌"),
    (4, "溢水灌盖子新开"),
    (4, "洗涤壶"),
    (4, "膨胀箱"),
    (10, "歧管"),
)
LINE_DIFFICULT_OPTION = (
    (2, "沿用产线"),
    (5, "新开发产线50万内"),
    (10, "新开发产线超50万"),
)
FIXTURE_OPTION = (
    (2, "1套"),
    (4, "2套"),
    (6, "3套"),
    (8, "4套"),
    (10, "5套及以上"),
)
GAUGE_OPTION = (
    (2, "1套"),
    (4, "2套"),
    (6, "3套"),
    (8, "4套"),
    (10, "5套及以上"),
)
TOOLING_OPTION = (
    (2, "1套"),
    (4, "2套"),
    (6, "3套"),
    (8, "4套"),
    (10, "5套及以上"),
)
PURCHASE_OPTION = (
    (2, "1套"),
    (4, "2套"),
    (6, "3套"),
    (8, "4套"),
    (10, "5套及以上"),
)

TOOLING_TYPE_OPTION = (
    (0, "工装"),
    (1, "检具"),
    (2, "模具"),
)

STAGE_OPTION = (
    (0, "T0"),
    (1, "T1"),
    (2, "T2"),
    (3, "T3"),
    (4, "T4"),
    (5, "T5"),
    (6, "T6"),
    (7, "T7"),
    (8, "T8"),
    (9, "T9"),
    (10, "T10"),
    (11, "T11"),
    (12, "T12"),
    (13, "T13"),
    (14, "T14"),
    (15, "T15"),
)
ISSUE_TYPE_OPTION = (
    (0, "未标识"),
    (1, "工装"),
    (2, "检具"),
    (3, "模具"),
    (4, "采购"),
    (5, "交样"),
    (6, "试验"),
    (7, "产线"),
    (8, "产品"),
    (9, "开发"),
    (10, "供应商设计"),
    (11, "客户设计"),
)


def user_directory_path(instance,
                        filename):  # dir struct MEDIA/user/subfolder/(project/product/tooling/outsourcing)/file
    sub_folder = "project"
    # print('INFO: instance.user.username！' + instance.user.username)
    # if not instance.user.username:
    #     instance.user.username = 'unauthorized'

    user_img_path = os.path.join(sub_folder, instance.__class__.__name__, filename)  # 生成照片保存的路径
    print('照片存放路径为：' + user_img_path)  # dir struct MEDIA/user/subfolder/(project/product/tooling/outsourcing)/file

    return user_img_path


# 项目 model
class Project(models.Model):
    company = models.ForeignKey(
        Company,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='project',
        verbose_name="客户",
        help_text="客户名称"
    )
    profile = models.ForeignKey(Profile, null=True, blank=True, on_delete=models.CASCADE, related_name='project',
                                verbose_name="项目经理", help_text="项目负责人")
    prg_code = models.CharField(max_length=20, blank=True, verbose_name="项目代号", help_text="客户项目代码")
    name = models.CharField(max_length=20, blank=True, verbose_name="项目名称", help_text="项目名称")
    team = models.ManyToManyField(to=Profile, related_name='project_team', blank=True, verbose_name="项目团队",
                                  help_text="项目团队", )
    pls_sn = models.CharField(max_length=20, blank=True, verbose_name="PLM项目号", help_text="PLM创建的唯一项目号")
    volume = models.IntegerField(default=0, blank=True, verbose_name="年产量", help_text="项目预测年产量")
    percent = models.FloatField(default=0.0, blank=True, verbose_name="当前进度", help_text="项目当前的时间进度，仅仅从时间角度考虑")

    # 客户关键节点
    kick_off = models.DateField(default=timezone.now, verbose_name="项目启动时间", help_text="项目启动时间")
    t0_tm = models.DateField(default=timezone.now, verbose_name="首件交样时间", help_text="首件交样时间")
    ots_tm = models.DateField(default=timezone.now, verbose_name="工装样件", help_text="正常产线生产出来零件的时间")
    ppap = models.DateField(default=timezone.now, verbose_name="PPAP时间", help_text="客户批准生产的时间")
    sop = models.DateField(default=timezone.now, verbose_name="量产时间", help_text="客户开始量产时间，这个时候项目必须得移交")
    # 内部项目节点
    plm_tm = models.DateField(default=timezone.now, verbose_name="PLM 立项时间", help_text="PLM 立项时间")
    stage1_tm = models.DateField(default=timezone.now, verbose_name="PLM 第一阶段完成时间", help_text="PLM 第一阶段完成时间")
    stage2_tm = models.DateField(default=timezone.now, verbose_name="PLM 第二阶段完成时间", help_text="PLM 第二阶段完成时间")
    stage3_tm = models.DateField(default=timezone.now, verbose_name="PLM 第三阶段完成时间", help_text="PLM 第三阶段完成时间")
    stage4_tm = models.DateField(default=timezone.now, verbose_name="PLM 第四阶段完成时间", help_text="PLM 第四阶段完成时间")
    stage5_tm = models.DateField(default=timezone.now, verbose_name="PLM 第五阶段完成时间", help_text="PLM 第五阶段完成时间")
    # 项目难度
    Product_difficult = models.SmallIntegerField(choices=PRODUCT_DIFFICULT_OPTION, null=True, blank=True,
                                                 default=0, verbose_name="产品难度",
                                                 help_text="产品难度")
    line_difficult = models.SmallIntegerField(choices=LINE_DIFFICULT_OPTION, null=True, blank=True, default=0,
                                              verbose_name="产线难度",
                                              help_text="产线难度")
    Purchase_num = models.SmallIntegerField(choices=PURCHASE_OPTION, null=True, blank=True, default=0,
                                            verbose_name="外购件数量",
                                            help_text="新开发外购件数量，模具另算")
    Fixture_num = models.SmallIntegerField(choices=FIXTURE_OPTION, null=True, blank=True, default=0,
                                           verbose_name="工装数量",
                                           help_text="工装数量")
    Gauge_num = models.SmallIntegerField(choices=GAUGE_OPTION, null=True, blank=True, default=0, verbose_name="检具数量",
                                         help_text="检具数量")
    Tooling_num = models.SmallIntegerField(choices=TOOLING_OPTION, null=True, blank=True, default=0,
                                           verbose_name="模具数量",
                                           help_text="模具数量")
    Busy_factor = models.FloatField(null=True, blank=True, default=0, verbose_name="忙碌系数", help_text="工作强度评价指标")

    avatar = models.ImageField(upload_to=user_directory_path,
                               verbose_name="项目图片",
                               help_text='请上传项目图片',
                               null=True, blank=True,
                               default='sys_img/logo_lg.png',
                               )

    avatar_thumb = ImageSpecField(source='avatar',
                                  processors=[ResizeToFill(400, 400)],
                                  # processors=[ResizeToFit(width=400, height=400)],
                                  # processors=[Thumbnail(width=400, height=400, anchor=None, crop=None, upscale=None)],
                                  format='JPEG',
                                  options={'quality': 60},
                                  )

    # 数据库更新日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text="首次创建的时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text="最后更新的时间")

    def __str__(self):
        return self.name

    def info(self):
        queryset = self.product.all()  # 获取所有子对象
        ret = [{"name": item.name, "PN": item.PN} for item in queryset]
        return ret

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'id'


# 产品 model
class Product(models.Model):
    project = models.ForeignKey(
        Project,
        null=True,
        on_delete=models.CASCADE,
        related_name='product'
    )
    PN = models.CharField(max_length=20, blank=True, verbose_name="零件号", help_text="发货零件号")
    name = models.CharField(max_length=20, blank=True, verbose_name="产品名称", help_text="产品名称")
    avatar = models.ImageField(upload_to=user_directory_path,
                               verbose_name="产品图片",
                               help_text='请上传产品图片',
                               null=True, blank=True,
                               default='sys_img/logo_lg.png',
                               )

    avatar_thumb = ImageSpecField(source='avatar',
                                  processors=[ResizeToFill(400, 400)],
                                  # processors=[ResizeToFit(width=400, height=400)],
                                  # processors=[Thumbnail(width=400, height=400, anchor=None, crop=None, upscale=None)],
                                  format='JPEG',
                                  options={'quality': 60},
                                  )

    # 数据库更新日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text="首次创建的时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text="最后更新的时间")

    def __str__(self):
        return f'{self.project.prg_code}_{self.PN}_{self.name}'

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'id'


# 工检模 model
class Tooling(models.Model):
    product = models.ForeignKey(
        Product,
        null=True,
        on_delete=models.CASCADE,
        related_name='tooling'
    )
    sn = models.CharField(max_length=20, blank=True, verbose_name="编号", help_text="工检模编号")
    type = models.SmallIntegerField(choices=TOOLING_TYPE_OPTION, null=True, blank=True, default='模具',
                            verbose_name="类型",
                            help_text="工装检具模具类型选择")
    name = models.CharField(max_length=20, blank=True, verbose_name="产品名称", help_text="产品名称")
    release = models.DateField(default=timezone.now, verbose_name="下单时间", help_text="下发制造任务书的时间")
    t0 = models.DateField(default=timezone.now, verbose_name="首次测试时间", help_text="首次测试时间")
    approve = models.DateField(default=timezone.now, verbose_name="认可时间", help_text="认可的时间，需要有移交单")
    avatar = models.ImageField(upload_to=user_directory_path,
                               verbose_name="工检模图片",
                               help_text='请上传工检模图片',
                               null=True, blank=True,
                               default='sys_img/logo_lg.png',
                               )

    avatar_thumb = ImageSpecField(source='avatar',
                                  processors=[ResizeToFill(400, 400)],
                                  # processors=[ResizeToFit(width=400, height=400)],
                                  # processors=[Thumbnail(width=400, height=400, anchor=None, crop=None, upscale=None)],
                                  format='JPEG',
                                  options={'quality': 60},
                                  )
    equip_type = models.CharField(max_length=20, blank=True, verbose_name="设备类型", help_text="设备类型，比如470T")
    cavity = models.CharField(max_length=10, blank=True, verbose_name="模腔数", help_text="注塑 1+1; 吹塑 1*1")
    is_outsource = models.BooleanField(blank=True, default=False, verbose_name="是否委外", help_text="工检模是否委外")
    # 数据库更新日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text="首次创建的时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text="最后更新的时间")

    def __str__(self):
        return f'{self.product.PN}_{self.sn}_{self.name}'

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'id'


# 外购件 model
class Outsourcing(models.Model):
    product = models.ForeignKey(
        Product,
        null=True,
        on_delete=models.CASCADE,
        related_name='outsourcing'
    )
    sn = models.CharField(max_length=20, blank=True, verbose_name="编号", help_text="工检模编号")
    type = models.SmallIntegerField(choices=TOOLING_TYPE_OPTION, null=True, blank=True, default='模具',
                            verbose_name="类型",
                            help_text="工装检具模具类型选择")
    name = models.CharField(max_length=20, blank=True, verbose_name="产品名称", help_text="产品名称")
    release = models.DateField(default=timezone.now, verbose_name="下单时间", help_text="下发制造任务书的时间")
    t0 = models.DateField(default=timezone.now, verbose_name="首次测试时间", help_text="首次测试时间")
    approve = models.DateField(default=timezone.now, verbose_name="认可时间", help_text="认可的时间，需要有移交单")
    avatar = models.ImageField(upload_to=user_directory_path,
                               verbose_name="外购件图片",
                               help_text='请上传外购件图片',
                               null=True, blank=True,
                               default='sys_img/logo_lg.png',
                               )

    avatar_thumb = ImageSpecField(source='avatar',
                                  processors=[ResizeToFill(400, 400)],
                                  # processors=[ResizeToFit(width=400, height=400)],
                                  # processors=[Thumbnail(width=400, height=400, anchor=None, crop=None, upscale=None)],
                                  format='JPEG',
                                  options={'quality': 60},
                                  )

    # 数据库更新日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text="首次创建的时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text="最后更新的时间")

    def __str__(self):
        return f'{self.product.PN}_{self.sn}_{self.name}'

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'id'


# 采购 model
class Purchase(models.Model):
    outsourcing = models.ForeignKey(
        Outsourcing,
        null=True,
        on_delete=models.CASCADE,
        related_name='purchase'
    )
    nums = models.IntegerField(default=0, blank=True, verbose_name="采购数量", help_text="采购数量")
    required = models.DateField(default=timezone.now, verbose_name="到位时间", help_text="要求采购到位时间")

    # 数据库更新日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text="首次创建的时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text="最后更新的时间")

    def __str__(self):
        return f'{self.outsourcing.sn}_{self.outsourcing.name}'

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'id'


# 发货 model
class Delivery(models.Model):
    product = models.ForeignKey(
        Product,
        null=True,
        on_delete=models.CASCADE,
        related_name='delivery'
    )
    po = models.CharField(max_length=20, blank=True, verbose_name="订单编号", help_text="订单编号")
    nums = models.IntegerField(default=0, blank=True, verbose_name="采购数量", help_text="采购数量")
    required = models.DateField(default=timezone.now, verbose_name="到位时间", help_text="要求采购到位时间")

    # 数据库更新日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text="首次创建的时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text="最后更新的时间")

    def __str__(self):
        return f'{self.product.PN}_{self.nums}pcs'

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'id'


# 工检模履历 model
class Resume(models.Model):
    tooling = models.ForeignKey(
        Tooling,
        null=True,
        on_delete=models.CASCADE,
        related_name='resume'
    )
    stage = models.SmallIntegerField(choices=STAGE_OPTION, blank=True, verbose_name="试模阶段",
                             help_text="试模阶段，比如T0， T1")
    tryout = models.DateField(default=timezone.now, verbose_name="试模时间", help_text="试模时间")
    operation_card = models.FileField(upload_to=user_directory_path, null=True, blank=True, verbose_name="注塑工艺卡",
                                      help_text="注塑工艺卡")
    dimension_rpt = models.FileField(upload_to=user_directory_path, null=True, blank=True, verbose_name="尺寸报告",
                                     help_text="尺寸报告")
    minutes = models.FileField(upload_to=user_directory_path, null=True, blank=True, verbose_name="会议纪要",
                               help_text="会议纪要")
    mdf_rpt = models.FileField(upload_to=user_directory_path, null=True, blank=True, verbose_name="修模报告",
                               help_text="修模报告")
    next = models.DateField(verbose_name="下次试模时间", help_text="下次试模时间")

    # 数据库更新日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text="首次创建的时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text="最后更新的时间")

    def __str__(self):
        return f'{self.tooling.sn}_{self.tooling.name}_{self.get_stage_display()}'

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'id'


# 问题清单 model
class Issue(models.Model):
    project = models.ForeignKey(
        Project,
        null=True,
        on_delete=models.CASCADE,
        related_name='issue',
        help_text="问题对应的项目"
    )
    resume = models.ForeignKey(
        Resume,
        null=True,
        on_delete=models.CASCADE,
        related_name='issue',
        help_text="问题对应的履历"
    )
    type = models.SmallIntegerField(choices=ISSUE_TYPE_OPTION, blank=True, verbose_name="类别", help_text="问题类别")
    tags = TaggableManager(blank=True, verbose_name="问题标签", help_text="可以在这里给问题打上关键字，用','隔开")
    severity = models.SmallIntegerField(default=0, blank=True, verbose_name="严重度", help_text="问题严重度")

    desc = models.CharField(max_length=50, blank=True, verbose_name="问题描述", help_text="问题描述")
    principal = models.ForeignKey(
        Profile,
        null=True,
        on_delete=models.CASCADE,
        related_name='issue',
        blank=True, verbose_name="负责人", help_text="问题负责人"
    )
    reason = models.CharField(max_length=200, blank=True, verbose_name="问题原因", help_text="问题原因,最长200个字符")
    action = models.CharField(max_length=200, blank=True, verbose_name="改善措施", help_text="改善措施,最长200个字符")
    target = models.DateField(default=timezone.now, verbose_name="完成时间", help_text="目标完成时间")

    # 数据库更新日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="首次创建的时间", help_text="首次创建的时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最后更新的时间", help_text="最后更新的时间")

    def __str__(self):
        return f'{self.project.prg_code}_{self.resume.__str__()}_{self.desc}'

    class Meta:
        ordering = ('-created_at',)
        get_latest_by = 'id'
