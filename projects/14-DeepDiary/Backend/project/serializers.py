# library/serializers.py

from rest_framework import serializers

# 自定义TagSerializerField，将多个tag用英文逗号隔开。
from library.models import Img
from library.serializers import ImgSerializer
from project.models import Project, Product, Tooling, Outsourcing, Purchase, Delivery, Resume, Issue, \
    LINE_DIFFICULT_OPTION, TOOLING_TYPE_OPTION, STAGE_OPTION, ISSUE_TYPE_OPTION
from user_info.models import Profile
from utils.serializers import DisplayChoiceField


class IssueSerializer(serializers.ModelSerializer):
    # 本级属性
    url = serializers.HyperlinkedIdentityField(view_name='issue-detail')
    type = DisplayChoiceField(choices=ISSUE_TYPE_OPTION)  # 获取choice 属性值方式一：指定复写后的choice类

    class Meta:
        model = Issue
        fields = ['type', 'desc', 'url']


class IssueDetailSerializer(IssueSerializer):  # 直接继承ImgSerializer也是可以的

    # 继承本级属性
    # 父级属性
    resume = serializers.CharField(source="resume.__str__", read_only=True)
    project = serializers.CharField(source="project.__str__", read_only=True)
    principal = serializers.CharField(source="principal.__str__", read_only=True)
    # 子级属性：一对多
    img = ImgSerializer(many=True, read_only=True)  # 这里的名字，必须是Img 定义Issue 外键时候的'related_name'

    class Meta:
        model = Issue
        fields = '__all__'


class ResumeSerializer(serializers.ModelSerializer):
    # 父级属性
    tooling = serializers.CharField(source="tooling.__str__", read_only=True)
    stage = DisplayChoiceField(choices=STAGE_OPTION)  # 获取choice 属性值方式一：指定复写后的choice类
    url = serializers.HyperlinkedIdentityField(view_name='resume-detail')

    class Meta:
        model = Resume
        fields = ['tooling', 'stage', 'tryout', 'next', 'url']


class ResumeDetailSerializer(ResumeSerializer):
    # 子级属性：一对多
    issue = IssueSerializer(many=True, read_only=True)

    class Meta:
        model = Resume
        fields = '__all__'


class ToolingSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='tooling-detail')
    type = DisplayChoiceField(choices=TOOLING_TYPE_OPTION)  # 获取choice 属性值方式一：指定复写后的choice类

    class Meta:
        model = Tooling
        fields = ['sn', 'type', 'name', 'avatar', 'url']


class ToolingDetailSerializer(ToolingSerializer):
    # 父级属性：父级模型
    product = serializers.CharField(source="product.__str__", read_only=True)  # 使用__str__对上级模型格式化输出

    # PN = serializers.CharField(source="product.PN", read_only=True)  # 父级模型
    # prg_code = serializers.CharField(source="product.project.prg_code", read_only=True)  # 爷级模型
    # manager = serializers.CharField(source="product.project.profile.name", read_only=True)  # 祖父级模型
    # 子级属性：一对多
    resume = ResumeSerializer(many=True, read_only=True)

    url = serializers.HyperlinkedIdentityField(view_name='tooling-detail')

    class Meta:
        model = Tooling
        fields = '__all__'


class OutsourcingSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='outsourcing-detail')

    class Meta:
        model = Outsourcing
        fields = ['sn', 'name', 'avatar', 'url']


class OutsourcingDetailSerializer(OutsourcingSerializer):
    # 父级属性：父级模型
    product = serializers.CharField(source="product.__str__", read_only=True)  # 使用__str__对上级模型格式化输出

    # 子级属性：一对多

    class Meta:
        model = Outsourcing
        # fields = ['sn', 'type', 'name', 'avatar', 'url']
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    product_url = serializers.HyperlinkedIdentityField(view_name='product-detail')

    class Meta:
        model = Product
        fields = ['PN', 'name', 'avatar', 'product_url']
        # fields = '__all__'


class ProductDetailSerializer(ProductSerializer):
    # 父级属性
    project = serializers.CharField(source="project.__str__", read_only=True)
    # 子级属性：一对多
    tooling = ToolingSerializer(many=True, read_only=True)
    outsourcing = OutsourcingSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        # fields = ['user', 'image', 'image_thumb', 'tags', 'url']
        # fields = '__all__'
        exclude = ['created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    # 父级属性
    company = serializers.CharField(source="company.name", read_only=True)
    # 本级属性
    project_url = serializers.HyperlinkedIdentityField(view_name='project-detail')

    class Meta:
        model = Project
        fields = ['company', 'prg_code', 'name', 'project_url']


class TeamSerializer(serializers.ModelSerializer):
    # 本级属性
    profile_url = serializers.HyperlinkedIdentityField(view_name='profile-detail')

    class Meta:
        model = Profile
        fields = ['name', 'position', 'avatar', 'profile_url']


class ProjectDetailSerializer(ProjectSerializer):
    # 继承本级属性
    # 父级属性
    profile = serializers.CharField(source="profile.__str__", read_only=True)
    # 子级属性：一对多
    product = ProductSerializer(many=True, read_only=True)
    team = TeamSerializer(many=True, read_only=True)  # 多对多序列化器，实际上跟一对多一样，这里的team是Project 模型中多对多的外键

    line_difficult = DisplayChoiceField(choices=LINE_DIFFICULT_OPTION)  # 获取choice 属性值方式一：指定复写后的choice类

    # line_difficult = serializers.SerializerMethodField()  # 获取choice 属性值方式二

    # def get_line_difficult(self, obj):
        # print(dir(obj._meta.fields[20]))  # <class 'django.db.models.fields.SmallIntegerField'>
        # print(type(obj._meta.fields[20]))  # <class 'django.db.models.fields.SmallIntegerField'>
        # print(type(obj._meta.fields[20].choices))  # <class 'tuple'>
        # print(type(obj._meta.fields[20].flatchoices))  # <class 'list'>
        # print(type(obj._meta.fields[20].get_choices))  # <class 'method'>

        # print((obj._meta.fields[20]))  # project.Project.line_difficult
        # print((obj._meta.fields[20].choices))  # ((2, '沿用产线'), (5, '新开发产线50万内'), (10, '新开发产线超50万'))
        # print((obj._meta.fields[20].flatchoices))  # [(2, '沿用产线'), (5, '新开发产线50万内'), (10, '新开发产线超50万')]
        # print((obj._meta.fields[
        #            20].get_choices))  # <bound method Field.get_choices of <django.db.models.fields.SmallIntegerField: line_difficult>>

        # return obj.get_line_difficult_display()

    class Meta:
        model = Project
        fields = '__all__'
        # exclude = ['created_at', 'updated_at']


class PurchaseSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='purchase-detail')

    class Meta:
        model = Purchase
        fields = '__all__'


class DeliverySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='delivery-detail')

    class Meta:
        model = Delivery
        fields = '__all__'
