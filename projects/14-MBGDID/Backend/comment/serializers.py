from rest_framework import serializers

from comment.models import Comment



class CommentChildrenSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='comment-detail')
    # user = UserSerializer(read_only=True)

    user = serializers.CharField(source="profile.username", write_only=True, allow_null=False, required=True)
    # reply_to = serializers.CharField(source="parent.user.username", write_only=True, allow_null=True, required=False)

    # children = RecursiveField(many=True, required=False)

    class Meta:
        model = Comment
        fields = ['url', 'user', 'body', 'created', 'children']


class CommentSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='comment-detail')
    # user = UserSerializer(read_only=True)
    user = serializers.CharField(source="profile.username", write_only=True, allow_null=False, required=True)

    article = serializers.HyperlinkedRelatedField(view_name='article-detail', read_only=True)
    article_id = serializers.IntegerField(write_only=True, allow_null=False, required=True)

    # children = CommentChildrenSerializer(many=True, required=False)

    parent = CommentChildrenSerializer(read_only=True)
    parent_id = serializers.IntegerField(write_only=True, allow_null=True, required=False)

    def update(self, instance, validated_data):
        validated_data.pop('parent_id', None)
        return super().update(instance, validated_data)

    class Meta:
        model = Comment
        # fields = ['url', 'article', 'article_id', 'user', 'body', 'created', 'children']  # , 'parent', 'parent_id'
        fields = ['url', 'article', 'article_id', 'user', 'body', 'created', 'parent', 'parent_id']  # , 'parent', 'parent_id'

        extra_kwargs = {'created': {'read_only': True}}
