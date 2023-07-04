# face/serializers.py
from rest_framework import serializers

from face.models import Face, FaceAlbum, Mcs
from utils.serializers import RecursiveField


class McsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mcs
        fields = ['nft_url']

    # def to_representation(self, value):
    #     rst={}
    #     # 调用父类获取当前序列化数据，value代表每个对象实例ob
    #     data = super().to_representation(value)
    #     # 对序列化数据做修改，添加新的数据
    #     rst['data'] = data
    #     rst['code'] = 200
    #     rst['msg'] = 'mcs detail info'
    #     return rst


class McsDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mcs
        fields = '__all__'


# 用户装备序列化 一对多数据输出
class facesField(serializers.RelatedField):
    def to_representation(self, value):
        return '%s' % value.name


class FaceSimpleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Face
        fields = ['id', 'face_album', 'name', 'src']


class FaceSerializer(serializers.ModelSerializer):
    # src_thumb = serializers.ImageField(read_only=True)  # 人脸缩略图，放弃使用人脸缩略图，直接用人脸原始图像
    face_url = serializers.HyperlinkedIdentityField(view_name='face-detail')  # 人脸详情
    # 父级属性
    src = serializers.ImageField(source="img.src", read_only=True)  # 获取人脸对应的照片，注意：这里需要是ImageField
    # img_url = serializers.HyperlinkedIdentityField(view_name='img-detail')
    thumb = serializers.ImageField(source="img.thumb", read_only=True)  # 父节点中的照片缩略图
    thumb_face = serializers.ImageField(source="src", read_only=True)  # 本级节点中的照片缩略图
    mcs = McsSerializer(serializers.ModelSerializer, read_only=True)

    class Meta:
        model = Face
        fields = ['face_album', 'img', 'src', 'thumb', 'thumb_face', 'id', 'name', 'face_info', 'face_url', 'mcs']


class FaceDetailSerializer(FaceSerializer):
    img_url = serializers.HyperlinkedRelatedField(view_name='img-detail', read_only='True')
    img = serializers.ImageField(source="img.image", read_only=True)  # 2. 使用source选项 直接指定外键模型下面的具体字段
    mcs = McsDetailSerializer(serializers.ModelSerializer, read_only=True)

    class Meta:
        model = Face
        fields = '__all__'
        extra_kwargs = {
            'src': {'read_only': True},  # 这个属性是后台计算生成，对前台输入失效
            'face_info': {'read_only': True}  # 这个属性是后台计算生成，对前台输入失效
        }

    def to_representation(self, value):
        rst={}
        # 调用父类获取当前序列化数据，value代表每个对象实例ob
        data = super().to_representation(value)
        # 对序列化数据做修改，添加新的数据
        rst['data'] = data
        rst['code'] = 200
        rst['msg'] = 'face detail info'
        return rst


class FaceAlbumChildrenSerializer(serializers.ModelSerializer):
    album_url = serializers.HyperlinkedIdentityField(view_name='facealbum-detail')
    children = RecursiveField(many=True, required=False)

    # faces = FaceSerializer(many=True, read_only=True)  # needn't disp the detail faces info in the list. could show them in detail

    class Meta:
        model = FaceAlbum
        fields = ['album_url', 'name', 'children']


class FaceAlbumSerializer(serializers.ModelSerializer):
    album_url = serializers.HyperlinkedIdentityField(view_name='facealbum-detail')  # 人脸详情
    src = serializers.ImageField(source="avatar", read_only=True)  # 本级节点中的照片缩略图
    desc = serializers.CharField(source="profile.introduction", read_only=True)

    # value = serializers.IntegerField()  # method 1: annotate in the viewset
    value = serializers.SerializerMethodField()  # method 2: through method

    def get_value(self, ins):
        return ins.faces.count()  # some thing you do

    class Meta:
        model = FaceAlbum
        fields = ['id', 'album_url', 'name', 'src', 'relationship', 'desc', 'value', 'profile']  # 'faces' 人脸id 暂时用不到

    def to_representation(self, instance):
        # rst = {}
        # 调用父类获取当前序列化数据，value代表每个对象实例ob
        data = super().to_representation(instance)
        # data['value1'] = instance.faces.count()  # method 3: through to presentation
        # if hasattr(instance, 'faces'):
        #     print(instance.faces.count())
        #     data['value'] = instance.faces.count()
        # else:
        #     print('there is no face in the face album')
        #     data['value'] = 0
        # 对序列化数据做修改，添加新的数据
        # rst['data'] = data
        # rst['code'] = 200
        # rst['msg'] = 'face gallery'
        return data


class FaceAlbumDetailSerializer(serializers.ModelSerializer):
    album_url = serializers.HyperlinkedIdentityField(view_name='facealbum-detail')  # 人脸详情
    children = FaceAlbumChildrenSerializer(many=True, read_only=True)  # 正常
    faces = FaceSerializer(many=True,
                           read_only=True)  # needn't disp the detail faces info in the list. could show them in detail

    class Meta:
        model = FaceAlbum
        fields = ['id', 'album_url', 'name', 'face_feat', 'avatar', 'level', 'children', 'faces', 'parent', 'profile']
        # fields = '__all__'
        extra_kwargs = {
            'profile': {'read_only': True},  # 这个属性是后台计算生成，对前台输入失效
        }

    def to_representation(self, value):
        rst = {}

        # 调用父类获取当前序列化数据，value代表每个对象实例ob
        data = super().to_representation(value)
        # 对序列化数据做修改，添加新的数据
        rst['data'] = data
        rst['code'] = 200
        rst['msg'] = 'face gallery'
        return rst


class FaceAlbumGraphSerializer(serializers.ModelSerializer):
    album_url = serializers.HyperlinkedIdentityField(view_name='facealbum-detail')  # 人脸详情
    image = serializers.ImageField(source="avatar", read_only=True)  # 本级节点中的照片缩略图
    value = serializers.IntegerField()  # calculate this based on the annotate in the viewset
    desc = serializers.CharField(source="profile.introduction", read_only=True)
    label = serializers.CharField(source="name", read_only=True)

    class Meta:
        model = FaceAlbum
        fields = ['id', 'album_url', 'label', 'image', 'value', 'relationship', 'desc']  # 'faces' 人脸id 暂时用不到

    def to_representation(self, value):
        rst = {}
        # 调用父类获取当前序列化数据，value代表每个对象实例ob
        data = super().to_representation(value)
        # 对序列化数据做修改，添加新的数据
        # rst['data'] = data
        # rst['code'] = 200
        # rst['msg'] = 'list info'
        # return rst
        # print(data['categories'])

        data['categories'] = ['person']
        return data


