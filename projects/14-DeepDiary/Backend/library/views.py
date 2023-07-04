from datetime import datetime, timedelta

from celery.result import AsyncResult
from django.db.models import Count, Max
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters

from rest_framework.decorators import action
from rest_framework.response import Response
from taggit.models import Tag

from deep_diary.config import wallet_info
from face.models import FaceAlbum
from face.task import get_all_fts
from library.filters import ImgFilter, ImgSearchFilter, CategoryFilter, AddressFilter
from library.models import Img, Category, Mcs, Address
from library.pagination import GalleryPageNumberPagination, AddressNumberPagination
from library.serializers import ImgSerializer, ImgDetailSerializer, ImgCategorySerializer, McsSerializer, \
    CategorySerializer, AddressSerializer, CategoryDetailSerializer
from library.task import set_img_info, set_img_mcs, set_all_img_mcs, set_img_tags, set_all_img_tags, \
    set_img_colors, set_img_categories, set_all_img_categories, set_all_img_info, add_all_img_face_to_category, \
    add_all_img_colors_to_category, add_all_img_addr_to_category, add_img_addr_to_category, add_img_colors_to_category, \
    add_img_face_to_category, img_process
from library.task import send_email

from mycelery.library.tasks import send_sms
from mycelery.main import app
from utils.mcs_storage import upload_file_pay, approve_usdc

#
# class CategoryViewSet(viewsets.ModelViewSet):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer
#     pagination_class = GalleryPageNumberPagination  # could disp the filter button in the web
#     # 第一种方法
#     filter_class = CategoryFilter  # 过滤类
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter,
#                        filters.OrderingFilter]  # 模糊过滤，注意的是，这里的url参数名变成了?search=搜索内容
from utils.pagination import GeneralPageNumberPagination


class ImgCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = ImgCategorySerializer


class ImgViewSet(viewsets.ModelViewSet):
    queryset = Img.objects.all().order_by('-id')

    serializer_class = ImgSerializer
    # permission_classes = (AllowAny,)
    pagination_class = GalleryPageNumberPagination  # could disp the filter button in the web
    # 第一种方法
    filter_class = ImgFilter  # 过滤类

    # search_class = ImgSearchFilter
    # 第二种方法
    # DjangoFilterBackend  # 精准过滤，字段用filterset_fields定义
    # filters.SearchFilter  # 模糊搜索，字段用search_fields
    # filters.OrderingFilter  # 排序规则字段定义
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]  # 模糊过滤，注意的是，这里的url参数名变成了?search=搜索内容

    # The SearchFilter class will only be applied if the view has a search_fields attribute set.
    # The search_fields attribute should be a list of names of text type fields on the model,
    # such as CharField or TextField.
    # The search parameter may contain multiple search terms, which should be whitespace and/or comma separated
    # search_fields = ['user__username', 'address__location', 'tags__name', 'dates__year', 'dates__month', 'dates__day']
    # search_fields = ['$tags__name']  # 如何使用正则进行匹配

    search_fields = {
        # color
        'colors__image__closest_palette_color_parent': ['exact'],

        # category
        'categories__name': ['exact'],  #
        'categories__type': ['exact'],  #
        'categories__value': ['exact'],  #
        # address
        'address__country': ['exact', 'contains'],
        'address__province': ['exact', 'contains'],
        'address__city': ['exact', 'contains'],
        'address__district': ['exact', 'contains'],
        'address__location': ['icontains'],
        # face
        'faces__name': ['exact', 'icontains'],  #
        # date
        'dates__year': ['exact', 'contains'],  #
        'dates__month': ['exact', 'contains'],  #
        'dates__day': ['exact', 'contains'],  #
        'dates__capture_date': ['exact', 'contains'],  #

        '$tags__name': ['exact', 'icontains'],  #
        # img
        'name': ['exact', 'icontains'],  #
        'title': ['exact', 'icontains'],  #
        'caption': ['exact', 'icontains'],  #
        "type": ['exact'],
    }

    ordering_fields = ['id', 'dates__capture_date']  # 这里的字段，需要总上面定义字段中选择

    def perform_create(self, serializer):
        print(f"INFO:Img start perform_create, {self.request.user}")
        instance = serializer.save(user=self.request.user)
        # print(f'INFO: Img start perform_create........{instance.src}')
        # # img_process.delay(instance)
        # set_img_info(instance)

    def perform_update(self, serializer):  # 应该在调用的模型中添加
        print(f'图片更新：{self.request.data}')
        instance = self.get_object()  # 获取详情的实例对象
        # instance = serializer.save()  # ProcessedImageField, 也就是ImageField的实例对象
        # print(f'INFO: start perform_update........data is: {serializer.validated_data}')

        # print(f"INFO: instance.src: {instance.src}")
        # print(f"INFO: instance.src.name: {instance.src.name}")
        # print(f"INFO: instance.src__name: {os.path.basename(instance.src.name)}")
        # print(f"INFO: instance.src__filetype: {os.path.splitext(instance.src.name)[-1]}")  # 获取带点文件后缀
        # print(f"INFO: instance.src__filetype: {instance.src.name.split('.')[-1]}")  # 获取不带点文件后缀

        # print(f"INFO: instance.src.path: {instance.src.path}")
        # print(f"INFO: instance.src.url: {instance.src.url}")
        # print(f"INFO: instance.src.size: {instance.src.size}")
        # print(f"INFO: instance.src.width: {instance.src.width}")
        # print(f"INFO: instance.src.height: {instance.src.height}")
        # print(f"INFO: instance.src.storage: {instance.src.storage}")
        # print(f"INFO: instance.src.tell: {instance.src.tell}")
        # print(f"INFO: instance.src.field: {instance.src.field}")
        # print(f"INFO: instance.src.file: {instance.src.file}")
        # print(f"INFO: instance.src.file.name: {instance.src.file.name}")
        # print(f"INFO: instance.src.fileno: {instance.src.fileno}")
        # print(f"INFO: instance.src.flush: {instance.src.flush}")
        # print(f"INFO: instance.src.isatty: {instance.src.isatty}")

        # print(type(instance))
        # print(type(instance.tags))  # 获取这个实例的类型
        # print('----image attr----')
        # print(dir(instance.src))  # 获取这个实例的属性
        # print('----image.path attr----')
        # print(dir(instance.src.path))
        # print('----image.storage attr----')
        # print(dir(instance.src.storage))

        if 'tags' in self.request.data:
            # print(*self.request.data['tags'].split(','))
            instance.tags.set(self.request.data['tags'].split(','))

    def get_serializer_class(self):
        if self.action == 'list':
            return ImgSerializer
        else:
            return ImgDetailSerializer

    # def get_queryset(self):
    #     # faces_num couldn't filter in the django-filter since this is based on the annotate
    #     faces_num = self.request.query_params.get('faces_num')
    #     if faces_num:
    #         return self.queryset \
    #             .annotate(faces_num=Count('faces')).filter(faces_num=faces_num)  # annotate the faces_num here
    #
    #     return self.queryset

    @action(detail=False, methods=['get'])  # 在详情中才能使用这个自定义动作
    def get_batch_image_info(self, request, pk=None):
        set_all_img_info()
        return Response({"msg": "success"})

    @action(detail=True, methods=['get'])  # 在详情中才能使用这个自定义动作
    def add_img_to_category(self, request, pk=None):
        instance = self.get_object()  # 获取详情的实例对象
        add_img_face_to_category.delay(instance)
        add_img_addr_to_category.delay(instance)
        add_img_colors_to_category.delay(instance)
        return Response({"msg": "success"})

    @action(detail=True, methods=['get'])  # 在详情中才能使用这个自定义动作
    def test(self, request, pk=None):  # 当detail=True 的时候，需要指定第三个参数，如果未指定look_up, 默认值为pk，如果指定，该值为loop_up的值
        instance = self.get_object()  # 获取详情的实例对象
        # set_img_info(instance)

        # serializer = ImgDetailSerializer(img, many=False, context={'request': request})  # 不报错
        # serializer = ImgSerializer(img, many=False)  # 报错
        # serializer = self.get_serializer(img)
        # return Response(serializer.data)

        # filter_class = self.filter_class
        # print(filter_class)
        # data = {
        #     'categories': {
        #         'person': '人物',
        #         'organization': '机构',
        #         'location': '地点',
        #     },
        #     "data": {
        #         "nodes": [
        #             {"id": "1", "label": "bluejoe", "image": "https://bluejoe2008.github.io/bluejoe3.png",
        #              "categories": ["person"]},
        #             {"id": "2", "label": "CNIC", "image": "https://bluejoe2008.github.io/cas.jpg",
        #              "categories": ["organization"]},
        #             {"id": "3", "label": "beijing", "image": "https://bluejoe2008.github.io/beijing.jpg",
        #              "categories": ["location"]}
        #         ],
        #         "edges": [
        #             {"from": "1", "to": "2", "label": "work for"},
        #             {"from": "1", "to": "3", "label": "live in"},

        #             {"from": "2", "to": "3", "label": "test"}
        #         ]
        #     }
        # }
        # return Response(data)
        return Response({"msg": "success"})

    @action(detail=False, methods=['get'])  # will be used in the list view since the detail = false
    def upload_finished(self, request, pk=None):
        # TODO do something after uploading the image
        data = {
            "data": '',
            'code': 200,
            'msg': 'All the images have been uploaded successfully'
        }
        return Response(data)


class McsViewSet(viewsets.ModelViewSet):
    queryset = Mcs.objects.all().order_by('-id')
    serializer_class = McsSerializer
    # permission_classes = (AllowAny,)
    pagination_class = GalleryPageNumberPagination  # could disp the filter button in the web


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().annotate(img_nums=Count('img')).order_by('-img_nums')  # ordered by the image num
    serializer_class = CategorySerializer
    # permission_classes = (AllowAny,)
    pagination_class = GeneralPageNumberPagination  # could disp the filter button in the web
    # 第一种方法
    filter_class = CategoryFilter  # 过滤类
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]  # 模糊过滤，注意的是，这里的url参数名变成了?search=搜索内容

    @action(detail=False, methods=['get'])  # 在详情中才能使用这个自定义动作
    def get_filter_list(self, request, pk=None):  # 当detail=True 的时候，需要指定第三个参数，如果未指定look_up, 默认值为pk，如果指定，该值为loop_up的值
        data = {
            'fc_nums': Img.objects.annotate(fc_nums=Count('faces')).values_list('fc_nums',
                                                                                flat=True).distinct().order_by(
                'fc_nums'),
            'fc_name': FaceAlbum.objects.annotate(value=Count('img')).filter(value__gte=1).values('name',
                                                                                                  'value').distinct().order_by(
                '-value'),

            # 'tags': Img.objects.values_list('tags__name', flat=True).distinct().order_by('tags__name'),
            'tags': Tag.objects.annotate(value=Count('imgs')).filter(value__gt=0).order_by('-value').values('name',
                                                                                                            'value'),

            # 'c_img': Img.objects.filter(categories__type='img_color').values('categories__name', 'categories__value').distinct().order_by('categories__name'),
            'c_img': Category.objects.filter(type='img_color').values('name', 'value').distinct().order_by('name'),
            'c_back': Category.objects.filter(type='back_color').values('name', 'value').distinct().order_by('name'),
            'c_fore': Category.objects.filter(type='fore_color').values('name', 'value').distinct().order_by('name'),
            'category': Category.objects.filter(type='category').annotate(img_nums=Count('img')).values('name',
                                                                                                        'img_nums').distinct().order_by(
                '-img_nums'),
            'group': Category.objects.filter(type='group').annotate(img_nums=Count('img')).values('name',
                                                                                                  'img_nums').distinct().order_by(
                '-img_nums'),
            'city': Category.objects.filter(type='address').annotate(img_nums=Count('img')).values('name',
                                                                                                   'img_nums').distinct().order_by(
                '-img_nums'),

            'layout': ['Square', 'Wide', 'Tall'],
            'size': ['Small', 'Medium', 'Large', 'Extra large', 'At least'],
            'license': ['Public domain', 'Free to share and use', 'Free to share and use commercially'],
            'ordering': ['id', '-id', 'dates__capture_date', '-dates__capture_date']

        }
        # data['tags'] = list(data['tags'])
        # data['tags'].insert(0, 'All')
        # # 循环判断是否有all字段，如果没有，则转换成列表并插入
        return Response({
            'msg': 'success',
            'code': 200,
            'data': data,
        })

    def get_serializer_class(self):
        if self.action == 'list':
            return CategorySerializer
        else:
            return CategoryDetailSerializer


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all().order_by('img')
    serializer_class = AddressSerializer
    # permission_classes = (AllowAny,)
    pagination_class = AddressNumberPagination  # could disp the filter button in the web

    filter_class = AddressFilter  # 过滤类
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]  # 模糊过滤，注意的是，这里的url参数名变成了?search=搜索内容