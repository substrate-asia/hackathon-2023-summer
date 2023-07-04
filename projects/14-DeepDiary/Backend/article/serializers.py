# article/serializers.py

from rest_framework import serializers

from article.models import Article, Category
# 父类变成了 ModelSerializer
from comment.serializers import CommentSerializer
from library.models import Img
from library.serializers import ImgSerializer
from tags.serializers import TagSerializerField
from user_info.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """分类的序列化器"""
    url = serializers.HyperlinkedIdentityField(view_name='category-detail', lookup_field='title', lookup_url_kwarg='pk')

    class Meta:
        model = Category
        fields = '__all__'
        # fields = ['url', 'title']
        # exclude = ['id']   # Cannot set both 'fields' and 'exclude' options on serializer CategorySerializer
        read_only_fields = ['created']


class ArticleSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='article-detail')
    author = serializers.CharField(source="author.username", read_only=True)
    category = serializers.CharField(source="category.title", read_only=True)
    # category = CategorySerializer(read_only=True)  ## read_only=True
    category_url = serializers.HyperlinkedIdentityField(view_name='category-detail', lookup_field='category_id',
                                                        lookup_url_kwarg='pk')
    tags = TagSerializerField()
    avatar_thumb = serializers.ImageField(read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'url', 'title', 'author', 'category', 'category_url', 'tags', 'avatar_thumb', 'created']

        extra_kwargs = {'body': {'write_only': True}}


class CategoryDetailSerializer(serializers.ModelSerializer):
    """分类详情"""
    articles = ArticleSerializer(many=True, read_only=True)

    # articles = ArticleCategoryDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = [
            # 'id',
            'title',
            # 'created',
            'articles',
        ]


class ArticleBaseSerializer(serializers.ModelSerializer):
    """博文序列化器"""
    id = serializers.IntegerField(read_only=True)
    author = UserSerializer(read_only=True)
    title = serializers.CharField()
    # category 的嵌套序列化字段
    category = CategorySerializer(read_only=True)  ## read_only=True
    # category 的 id 字段，用于创建/更新 category 外键
    category_id = serializers.IntegerField(write_only=True, allow_null=True, required=False)
    # print('ArticleBaseSerializer')
    tags = TagSerializerField()

    # 图片字段
    avatar = ImgSerializer(read_only=True)
    avatar_id = serializers.IntegerField(
        write_only=True,
        allow_null=True,
        required=False
    )

    # 自定义错误信息
    default_error_messages = {
        'incorrect_avatar_id': 'Avatar with id {value} not exists.',
        'incorrect_category_id': 'Category with id {value} not exists.',
        'default': 'No more message here..'
    }

    def check_obj_exists_or_fail(self, model, value, message='default'):
        if not self.default_error_messages.get(message, None):
            message = 'default'

        if not model.objects.filter(id=value).exists() and value is not None:
            self.fail(message, value=value)

    def validate_avatar_id(self, value):
        self.check_obj_exists_or_fail(
            model=Img,
            value=value,
            message='incorrect_avatar_id'
        )
        return value

    # category_id 字段的验证器
    def validate_category_id(self, value):
        # 数据存在且传入值不等于None
        self.check_obj_exists_or_fail(
            model=Category,
            value=value,
            message='incorrect_category_id'
        )
        return value


class ArticleDetailSerializer(ArticleSerializer):
    id = serializers.IntegerField(read_only=True)
    # 渲染后的正文
    body_html = serializers.SerializerMethodField()
    # 渲染后的目录
    toc_html = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    # print(serializers.models.Model.pk)
    # print(f'INFO serializers ID is : {serializ}')

    def get_body_html(self, obj):
        print(f'INFO get_body_html： self format is : {type(self)}, obj format is : {type(obj)}')
        print(f'INFO get_body_html： obj ID is : {obj.id}')
        return obj.get_md()[0]

    def get_toc_html(self, obj):
        return obj.get_md()[1]

    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ['created']
