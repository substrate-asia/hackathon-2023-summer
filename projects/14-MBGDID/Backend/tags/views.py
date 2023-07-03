from django.shortcuts import render
from rest_framework import viewsets, filters
from taggit.models import Tag
# Create your views here.
from tags.serializers import TagSerializer
from utils.permissions import IsAdminUserOrReadOnly


class TagViewSet(viewsets.ModelViewSet):
    # 不使用order_by： UnorderedObjectListWarning: Pagination may yield inconsistent results with an unordered object_list
    queryset = Tag.objects.all().order_by('-id')
    serializer_class = TagSerializer
    permission_classes = [IsAdminUserOrReadOnly]  # 配置相关的权限
    # pagination_class = None  # 使能这句话，表示不使用分页功能

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']

    def perform_create(self, serializer):  # 应该在调用的模型中添加
        instance = serializer.save()
        print(f'这里是判断外面：{self.request.data}')
        #  创建标签：<QueryDict: {'csrfmiddlewaretoken': ['vkFOpUMeQAhv29iGjDdLojPmc1ulawi2KbpRlcKTcXUQzsW7tuUq3rzqBqxbtzxR'], 'name': ['test3,test4'], 'slug': ['ttt']}>
        if 'tags' in self.request.data:
            print(f'这里是判断里面：{self.request.data}')
            instance.tags.set(*self.request.data['tags'].split(','))

    def perform_update(self, serializer):  # 应该在调用的模型中添加
        instance = serializer.save()
        print(f'这里是判断外面：{self.request.data}')
        #  更新标签：<QueryDict: {'csrfmiddlewaretoken': ['vkFOpUMeQAhv29iGjDdLojPmc1ulawi2KbpRlcKTcXUQzsW7tuUq3rzqBqxbtzxR'], 'name': ['test3,test4'], 'slug': ['ttt']}>
        if 'tags' in self.request.data:
            print(f'这里是判断里面：{self.request.data}')
            instance.tags.set(*self.request.data['tags'].split(','))
