from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import serializers

from face.serializers import FaceAlbumSerializer, FaceAlbumDetailSerializer
from project.serializers import ProjectSerializer
from tags.serializers import TagSerializerField
from user_info.models import Profile, Company, POSITION_OPTION, ROLES_OPTION, SupplyDemand
from utils.serializers import DisplayChoiceField


class SupplyDemandSerializer(serializers.ModelSerializer):
    tags = TagSerializerField(read_only=True)

    class Meta:
        model = SupplyDemand
        # fields = '__all__'
        exclude = ['created_at', 'updated_at', 'profile']


class UserRegisterSerializer(serializers.ModelSerializer):
    # url = serializers.HyperlinkedIdentityField(view_name='profile-detail', lookup_field='username')
    url = serializers.HyperlinkedIdentityField(view_name='profile-detail')

    class Meta:
        model = Profile
        fields = [
            'url',
            'id',
            'username',
            'password',
            'is_superuser'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_superuser': {'read_only': True}
        }


class UserSerializer(serializers.ModelSerializer):
    """于文章列表中引用的嵌套序列化器"""

    class Meta:
        model = Profile
        fields = [
            'id',
            'username',
            # 'last_login',
            # 'date_joined'
        ]


class UserDetailSerializer(serializers.ModelSerializer):
    """于文章列表中引用的嵌套序列化器"""
    # 本级属性
    # profile_url = serializers.HyperlinkedIdentityField(view_name='profile-detail', lookup_field='username')
    profile_url = serializers.HyperlinkedIdentityField(view_name='profile-detail')
    # position = DisplayChoiceField(choices=POSITION_OPTION)  # 获取choice 属性值方式一：指定复写后的choice类
    # read_only=True, 允许表单roles为空
    roles = DisplayChoiceField(choices=ROLES_OPTION, read_only=True)  # 获取choice 属性值方式一：指定复写后的choice类,
    # supplydemand = SupplyDemandSerializer(many=True, read_only=True)
    supplys = SupplyDemandSerializer(many=True, read_only=True)
    demands = SupplyDemandSerializer(many=True, read_only=True)
    # facealbum = FaceAlbumSerializer(read_only=True)
    relation = TagSerializerField(read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'password', 'relation', 'tel', 'avatar', 'introduction', 'roles', 'profile_url',
                  'facealbum', 'supplys', 'demands']  # , 'supplydemand', 'facealbum'
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # user = Profile.objects.create_user(**validated_data)
        new_psw = make_password(validated_data["password"])
        print(f'validated_data is {validated_data}, password is {new_psw}')
        user = super(UserDetailSerializer, self).create(validated_data=validated_data)
        user.set_password(validated_data["password"])  # 用哈希算法对密码进行加密
        print(user.password)
        user.save()
        return user

    def update(self, instance, validated_data):
        print('this is UserRegisterSerializer_update')
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)

    def to_representation(self, value):
        rst = {}
        # 调用父类获取当前序列化数据，value代表每个对象实例ob
        data = super().to_representation(value)
        # 对序列化数据做修改，添加新的数据
        rst['data'] = data
        rst['code'] = 200
        rst['msg'] = 'user profile'
        return rst


class ProfileSerializer(serializers.ModelSerializer):
    """于文章列表中引用的嵌套序列化器"""
    # 本级属性
    profile_url = serializers.HyperlinkedIdentityField(view_name='profile-detail')
    # position = DisplayChoiceField(choices=POSITION_OPTION)  # 获取choice 属性值方式一：指定复写后的choice类
    roles = DisplayChoiceField(choices=ROLES_OPTION)  # 获取choice 属性值方式一：指定复写后的choice类
    facealbum = FaceAlbumSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'avatar', 'introduction', 'roles', 'profile_url', 'facealbum']
        # fields = '__all__'


class ProfileDetailSerializer(ProfileSerializer):  # 直接继承ImgSerializer也是可以的

    # 父级属性
    # company_url = serializers.HyperlinkedIdentityField(view_name='company-detail')  # 详情链接不用用于父级，因为这里的序号还是本级的序号
    # company = serializers.CharField(source="company.name", read_only=True)
    # 子级属性：一对多
    # project = ProjectSerializer(many=True, read_only=True)  # 这里的名字，必须和外键'related_name' 名字一样
    supplydemand = SupplyDemandSerializer(many=True, read_only=True)


    class Meta:
        model = Profile
        fields = '__all__'
        # exclude = ['created_at', 'updated_at']


class CompanySerializer(serializers.ModelSerializer):
    """于文章列表中引用的嵌套序列化器"""
    # 本级属性
    company_url = serializers.HyperlinkedIdentityField(view_name='company-detail')

    # 子级属性：一对多
    profile = ProfileSerializer(many=True, read_only=True)  # 这里的名字，必须和外键'related_name' 名字一样

    class Meta:
        model = Company
        # fields = ['name', 'addr', 'desc', 'company_url']
        # fields = '__all__'
        exclude = ['created_at', 'updated_at']


