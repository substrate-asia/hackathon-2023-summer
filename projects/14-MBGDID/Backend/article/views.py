# Create your views here.
from collections import OrderedDict

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.decorators import action

from article.models import Article, Category
from article.serializers import ArticleSerializer
from article.serializers import CategorySerializer, CategoryDetailSerializer, ArticleDetailSerializer
from utils.permissions import IsAdminUserOrReadOnly


class ArticleViewSet(viewsets.ModelViewSet):
    # def my_page(self):
    #
    #     page = self.request.query_params.get('page', None)
    #     limit = self.request.query_params.get('limit', None)
    #     sort = self.request.query_params.get('sort', None)
    #     print(f'INFO request page is : {page}, limit is {limit}, sort is {sort}')  # 头部参数信息
    #     pagination_class = PageNumberPagination
    #     pagination_class.page_size = limit
    #     return pagination_class

    # 必须定义一个默认排序否则会报错
    queryset = Article.objects.all().order_by('id')
    serializer_class = ArticleDetailSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    # pagination_class = my_page
    pagination_class = PageNumberPagination
    pagination_class.page_size = 2
    pagination_class.max_page_size = 20

    # 过滤
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]  # 模糊过滤，注意的是，这里的url参数名变成了?search=搜索内容
    # filterset_fields = ['author__username', 'title', 'tags__name']
    filterset_fields = {
        'author__username': ['icontains'],  # 包含
        'title': ['icontains'],  # 包含
        'tags__name': ['icontains'],  # 包含
        # 'created': ['icontains'],  # 模糊搜索
    }
    # search_fields = ['author', 'title', 'tags__name', 'created', 'body']    # 报错
    search_fields = ['author__username', 'title', 'tags__name', 'created']  # 不报错
    ordering_fields = ['created']

    def list(self, request, *args, **kwargs):
        page = request.query_params.get('page', None)
        page_size = request.query_params.get('page_size', None)
        sort = request.query_params.get('sort', 'id')
        print(f'INFO request page is : {page}, page_size is {page_size}, sort is {sort}')  # 头部参数信息

        self.pagination_class.page_size = page_size  # 通过复写，改变了page_size 参数, 如果地址栏参数为page_size, 默认可以不用配置
        queryset = self.filter_queryset(self.get_queryset()).order_by(sort)  # 通过复写，sort 参数

        # self.pagination_class = PageNumberPagination
        # self.pagination_class.page_size = limit

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        print(f'文章创建：{self.request.data}')
        if self.request.user.is_authenticated:  # 判断用户是否已经登入
            instance = serializer.save(author=self.request.user)  # author 是外键，需要进行复写
            instance.tags.set(self.request.data['tags'].split(','))  # 标签系统的保存逻辑，也需要复写, [A,B]拆分成2个标签进行保存

    def perform_update(self, serializer):  # 应该在调用的模型中添加
        instance = serializer.save()
        print(f'文章更新：{self.request.data}')
        if 'tags' in self.request.data:
            instance.tags.set(self.request.data['tags'].split(','))

    def get_serializer_class(self):
        if self.action in ['list', 'pageQuery']:
            return ArticleSerializer
        else:
            return ArticleDetailSerializer

    @action(detail=False)  # 在列表中才能使用这个自定义动作
    def pageQuery(self, request):
        print(f'INFO request.query_params: {request.query_params}, the action is {self.action}')  # 头部参数信息
        page = request.query_params.get('page', None)
        limit = request.query_params.get('limit', None)
        sort = request.query_params.get('sort', 'id')
        print(f'INFO request page is : {page}, limit is {limit}, sort is {sort}')  # 头部参数信息

        # articles = Article.objects.all().order_by(sort)
        articles = self.queryset.order_by(sort)
        self.pagination_class = PageNumberPagination
        self.pagination_class.page_size = limit
        page = self.paginate_queryset(articles)
        # print(f'INFO articles is {type(articles)}')
        # print(f'INFO page is {dir(page[0])}')

        # print(f'INFO page.count is {page.count}')
        # print(f'INFO page is {dir(page)}')

        if page is not None:
            # serializer = ArticleSerializer(page, many=True, context={'request': request})
            serializer = self.get_serializer(page, many=True)
            # print(f'serializer.data is {serializer.data}')
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(articles, many=True)

        data = {
            "list": serializer.data,
            "code": 20000,
            "message": "请求成功",
            "page": "1",
            "pageSize": "2",
        }
        return Response(data)


class CategoryViewSet(viewsets.ModelViewSet):
    """分类视图集"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return CategorySerializer
        else:
            return CategoryDetailSerializer

    pagination_class = None
