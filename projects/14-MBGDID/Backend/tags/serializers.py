# article/serializers.py

from rest_framework import serializers
from taggit.models import Tag


# 自定义TagSerializerField，将多个tag用英文逗号隔开。
class TagSerializerField(serializers.Field):

    def __init__(self, **kwargs):
        # 默认只读
        kwargs['read_only'] = True  # 屏蔽后就无法更新标签
        super().__init__(**kwargs)

    def to_representation(self, data):
        # print('to_representation')
        return ','.join(data.values_list('name', flat=True))

    def to_internal_value(self, data):
        print('to_internal_value')
        print(data)
        # return super().to_internal_value(data)
        return None


# 新增的序列化器
class TagSerializer(serializers.ModelSerializer):
    """标签序列化器"""
    # print('TagSerializer')
    tags = TagSerializerField()

    class Meta:
        model = Tag
        fields = '__all__'
