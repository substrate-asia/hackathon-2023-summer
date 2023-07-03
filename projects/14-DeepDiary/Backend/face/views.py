# face/view.py

# Create your views here.
from collections import OrderedDict

from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.decorators import action

from face.models import Face, FaceAlbum
from face.pagination import FacePageNumberPagination
from face.serializers import FaceSerializer, FaceDetailSerializer, FaceAlbumSerializer, FaceAlbumDetailSerializer, \
    FaceAlbumGraphSerializer
from face.task import change_album_name, change_face_name, change_confirm_state
from rest_framework.response import Response


class FaceViewSet(viewsets.ModelViewSet):
    queryset = Face.objects.all()
    # serializer_class = FaceSerializer
    # permission_classes = (AllowAny,)
    pagination_class = FacePageNumberPagination  # 增加了这句代码，就无法显示filter,不过效果还是有的

    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]  # 模糊过滤，注意的是，这里的url参数名变成了?search=搜索内容
    filterset_fields = ['face_album__id', 'img__id', 'name']  # 外键需要增加2个下划线
    # filterset_fields = ['img', 'name', 'is_confirmed', 'face_score']
    search_fields = ['face_album__id', 'img__id', 'name']
    ordering_fields = ['name']  # 这里的字段，需要总上面定义字段中选择

    # def perform_create(self, serializer):
    # print(f"INFO:{self.request.user}")
    # serializer.save(user=self.request.user)
    #     pass
    #
    def perform_update(self, serializer):  # 应该在调用的模型中添加
        # print(f'人脸更新：validated_data =  {serializer.validated_data}')
        # print(f'人脸更新：validated_data =  {self.request.data}')
        print(f'当前访问人脸的用户是 =  {self.request.user}')

        fc = self.get_object()
        change_face_name.delay(fc, serializer)  # 如果执行了改名，则返回真，人脸改名后，确认状态自动为True
        # if not change_face_name(fc, serializer):  # 如果执行了改名，则返回真，人脸改名后，确认状态自动为True
        #     change_confirm_state(fc, serializer)  # 人名已经是识别出来的名字，进行确认后，同样要计算人脸特征

    def get_serializer_class(self):
        if self.action == 'list':
            return FaceSerializer
        else:
            return FaceDetailSerializer


class FaceAlbumViewSet(viewsets.ModelViewSet):
    queryset = FaceAlbum.objects.annotate(value=Count('faces')).order_by('-value')

    # serializer_class = FaceAlbumSerializer
    # permission_classes = (AllowAny,)
    pagination_class = FacePageNumberPagination

    def perform_update(self, serializer):  # 应该在调用的模型中添加
        print(f'当前访问人脸相册的用户是 =  {self.request.user}')

        album = self.get_object()
        change_album_name(album, serializer)  # 相册改名后，对应的人脸都需要改名，或者后续直接用相册名字
        # old_name, new_name = change_album_name(album, serializer)  # 相册改名后，对应的人脸都需要改名，或者后续直接用相册名字

        print(serializer.validated_data)

    def get_serializer_class(self):
        if self.action == 'list':
            return FaceAlbumSerializer
        else:
            return FaceAlbumDetailSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]  # 模糊过滤，注意的是，这里的url参数名变成了?search=搜索内容
    filterset_fields = ['name', 'level']
    search_fields = ['name', 'level']
    ordering_fields = ['name']  # 这里的字段，需要总上面定义字段中选择

    @action(detail=False, methods=['get'])  # 在详情中才能使用这个自定义动作
    def clear_face_album(self, request, pk=None):  # 当detail=True 的时候，需要指定第三个参数，如果未指定look_up, 默认值为pk，如果指定，该值为loop_up的值
        # album_face_item = self.get_object()  # 获取详情的实例对象
        album_face_set = self.queryset.filter(item_cnt=0).delete()  # 获取查询集，过滤出没有子集的对象，删除
        # print(f'INFO album_face: {type(album_face_set)}')
        print(f'INFO delete result: {album_face_set}')
        data = {
            "data": "demo",
            "code": 200,
            "msg": "success to clear the Face Album "
        }
        return Response(data)

    @action(detail=False, methods=['get'])  # 在详情中才能使用这个自定义动作
    def test(self, request, pk=None):  # 当detail=True 的时候，需要指定第三个参数，如果未指定look_up, 默认值为pk，如果指定，该值为loop_up的值
        # objs = FaceAlbum.objects.annotate(value=Count('faces')).order_by('-value')
        serializer = FaceAlbumGraphSerializer(self.queryset.exclude(name__startswith='unknown'), many=True, context={'request': request})  # 不报错
        person_node = serializer.data

        # print(type(person_node))
        # person_node['image'] = person_node.pop('src')
        # data = {
        #     'categories': {
        #         'person': '人物',
        #         'organization': '机构',
        #         'location': '地点',
        #         'event': '事件',
        #         'company': '公司',
        #     },
        #     "data": {
        #         "nodes": person_node,
        #         "edges": [{"from": item['id'], "to": 32, "label": item['label']} for item in serializer.data]
        #     }
        # }

        # demo
        data = {
            "categories": {
                "date": "时间",
                "location": "地点",
                "person": "人物",
                "event": "事件",
                "image": "图片",
                "video": "视频",
                "voice": "语音",
                "company": "公司",
            },
            "data": {
                "nodes": [
                    {
                        "id": 1,
                        "label": "deep-diary",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/b1fc6cc28c297f6910f267da332d7fc8/7bb5bfc1d897419122805b02b8a0379e.jpeg",
                        "value": 30,
                        "desc": "make your own data values",
                        "categories": [
                            "company"
                        ]
                    },
                    {
                        "id": 2,
                        "label": "blue",
                        "image": "http://127.0.0.1:8000/media/face/face_aQVml.jpg",
                        "value": 30,
                        "desc": "deep-diary creator",
                        "categories": [
                            "person"
                        ]
                    },
                    {
                        "id": 3,
                        "label": "prepare for the live broadcast",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/1310f1459e8cabf0e02cea3fd5960e7d/c8212dc44d7c29de7843e74580f5cb8b.jpeg",
                        "value": 40,
                        "desc": "won the 6th in the Hackathon competition, after that, our team need to have a live "
                                "stream on Oct. 21th to present our project, that is important to us, so we prepare "
                                "for it every day",
                        "categories": [
                            "event"
                        ]
                    },
                    {
                        "id": 4,
                        "label": "2022-10",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/avatar_TqNd2Yf/b9f276c6f29f62239a4d23e8d0dc0bd5.jpg",
                        "value": 30,
                        "desc": "this event happened on this month",
                        "categories": [
                            "date"
                        ]
                    },
                    {
                        "id": 5,
                        "label": "Ningbo",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/5d14677a3fa465509513930caeacf2b2/018d88d7b9718578a44fa66738c3496c.jpeg",
                        "value": 30,
                        "desc": "location of this event",
                        "categories": [
                            "location"
                        ]
                    },
                    {
                        "id": 6,
                        "label": "img1",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/e8e4be52ba59a1a124665c82bb3f5ae2/02ef4bc0bd7a2f7c593296a416974cfc.jpeg",
                        "value": 30,
                        "desc": "image memories of this event",
                        "categories": [
                            "image"
                        ]
                    },
                    {
                        "id": 7,
                        "label": "img2",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/aaf757201bbf5a549ceab52008817eb7/94eb614e5cd71d70e9ceab22c3c4583f.jpeg",
                        "value": 30,
                        "desc": "image memories of this event",
                        "categories": [
                            "image"
                        ]
                    },
                    {
                        "id": 8,
                        "label": "video1",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/14521c818922da50f83c2bfa7189db0b/df4b5d9b47f2c8cf2d69590316f58c88.jpeg",
                        "value": 30,
                        "desc": "video memories of this event",
                        "categories": [
                            "video"
                        ]
                    },
                    {
                        "id": 9,
                        "label": "voice1",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/69a8364435cf80991f383a575afa77e5/dae181e5d1e22c0e2e91ccc6084270cb.jpeg",
                        "value": 30,
                        "desc": "voice memories of this event",
                        "categories": [
                            "voice"
                        ]
                    },

                    {
                        "id": 10,
                        "label": "Design the databased structure of deep-diary",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/1f823568d8eafa515b055fc9d0b0caf3/2b59b6af416b24dd3adad28319f67923.jpeg",
                        "value": 40,
                        "desc": "graph display is attractive for human, but the relationship between is complex, "
                                "so we need take some time to find out all the realtionships between each nodes",
                        "categories": [
                            "event"
                        ]
                    },
                    {
                        "id": 12,
                        "label": "2022-11",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/301112218b977280ffd5ce64eda157e2/2b5a057ee68c5f158749ad5eb408d800.jpeg",
                        "value": 30,
                        "desc": "this event happened on this month",
                        "categories": [
                            "date"
                        ]
                    },
                    {
                        "id": 11,
                        "label": "Taizhou",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/bdf36d3cca08de7c0331e08d84c9d18b/b0b08588af28e8f0c4549329c7e27387.jpeg",
                        "value": 30,
                        "desc": "location of this event",
                        "categories": [
                            "location"
                        ]
                    },
                    {
                        "id": 13,
                        "label": "video2",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/0b40b4ae6f872c2358abdc8401fcd8bb/7955fb802fd8d9237be98cc60e2d50fe.jpeg",
                        "value": 30,
                        "desc": "video memories of this event",
                        "categories": [
                            "video"
                        ]
                    },
                    {
                        "id": 14,
                        "label": "voice2",
                        "image": "http://127.0.0.1:8000/media/CACHE/images/blue/img/1970/01/01/b4dccead83555244d5d065aa12965006/4fc85f59caf86359360b2d10611bca8d.jpg",
                        "value": 30,
                        "desc": "voice memories of this event",
                        "categories": [
                            "voice"
                        ]
                    },

                ],
                "edges": [
                    {
                        "from": 2,
                        "to": 1,
                        "label": "work in"
                    },
                    {
                        "from": 2,
                        "to": 3,
                        "label": "join in"
                    },
                    {
                        "from": 2,
                        "to": 10,
                        "label": "join in"
                    },
                    # {
                    #     "from": 2,
                    #     "to": 5,
                    #     "label": "live in"
                    # },
                    # {
                    #     "from": 2,
                    #     "to": 11,
                    #     "label": "hometown"
                    # },
                    {
                        "from": 3,
                        "to": 4,
                        "label": "happened on"
                    },
                    {
                        "from": 3,
                        "to": 5,
                        "label": "located in"
                    },
                    {
                        "from": 3,
                        "to": 6,
                        "label": "recorded by"
                    },
                    {
                        "from": 3,
                        "to": 7,
                        "label": "recorded by"
                    },
                    {
                        "from": 3,
                        "to": 8,
                        "label": "recorded by"
                    },
                    {
                        "from": 3,
                        "to": 9,
                        "label": "recorded by"
                    },

                    {
                        "from": 10,
                        "to": 11,
                        "label": "happened on"
                    },
                    {
                        "from": 10,
                        "to": 12,
                        "label": "located in"
                    },
                    {
                        "from": 10,
                        "to": 13,
                        "label": "recorded by"
                    },
                    {
                        "from": 10,
                        "to": 14,
                        "label": "recorded by"
                    },

                ]
            }
        }

        # database demo
        # data = {
        #     "categories": {
        #         "date": "时间",
        #         "location": "地点",
        #         "person": "人物",
        #         "event": "事件",
        #         "image": "图片",
        #         "video": "视频",
        #         "voice": "语音",
        #         "company": "公司",
        #         "info": "信息",
        #     },
        #     "data": {
        #         "nodes": [
        #             {
        #                 "id": 1,
        #                 "label": "User",
        #                 "value": 20,
        #                 "desc": "Django build-in User model.",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 2,
        #                 "label": "Profile",
        #                 "value": 30,
        #                 "image": "http://127.0.0.1:8000/media/face/face_aQVml.jpg",
        #                 "desc": "inherit build-in AbstractUser model.",
        #                 "categories": [
        #                     "person"
        #                 ]
        #             },
        #             {
        #                 "id": 3,
        #                 "label": "Company",
        #                 "value": 20,
        #                 "desc": "one to one relationship to Experience model.",
        #                 "categories": [
        #                     "company"
        #                 ]
        #             },
        #             {
        #                 "id": 4,
        #                 "label": "Experience",
        #                 "value": 20,
        #                 "desc": "working experience of this user.",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 5,
        #                 "label": "Supply",
        #                 "value": 20,
        #                 "desc": "the resources that the user could provide",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 6,
        #                 "label": "Demand",
        #                 "value": 20,
        #                 "desc": "the resources that the user that needed",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 7,
        #                 "label": "Event",
        #                 "value": 20,
        #                 "desc": "could understand like diary which not based on the date, but based on the event",
        #                 "categories": [
        #                     "event"
        #                 ]
        #             },
        #             {
        #                 "id": 8,
        #                 "label": "Category",
        #                 "value": 20,
        #                 "desc": "auto category all the images based on the deep learning",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 9,
        #                 "label": "Img",
        #                 "value": 30,
        #                 "image": "http://127.0.0.1:8000/media/blue/img/1970/01/01/b1fc6cc28c297f6910f267da332d7fc8.jpeg",
        #                 "desc": "img is the most important memory element",
        #                 "categories": [
        #                     "image"
        #                 ]
        #             },
        #             {
        #                 "id": 10,
        #                 "label": "ImgCategory",
        #                 "value": 20,
        #                 "desc": "intermediate table of Img and Category",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 11,
        #                 "label": "FaceAlbum",
        #                 "value": 20,
        #                 "desc": "Person face interface",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 12,
        #                 "label": "Face",
        #                 "value": 30,
        #                 "image": "http://127.0.0.1:8000/media/face/face_42tyr.jpg",
        #                 "desc": "intermediate table of Img and FaceAlbum",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 13,
        #                 "label": "Video",
        #                 "value": 20,
        #                 "desc": "daily video",
        #                 "categories": [
        #                     "video"
        #                 ]
        #             },
        #             {
        #                 "id": 14,
        #                 "label": "Voice",
        #                 "value": 20,
        #                 "desc": "daily voice",
        #                 "categories": [
        #                     "voice"
        #                 ]
        #             },
        #             {
        #                 "id": 15,
        #                 "label": "Color",
        #                 "value": 20,
        #                 "desc": "the color in the img, which include image, foreground and background color",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 16,
        #                 "label": "Evaluate",
        #                 "value": 20,
        #                 "desc": "some values to evaluate the img, like total view, total likes, total click, etc.",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 17,
        #                 "label": "Date",
        #                 "value": 20,
        #                 "desc": "date based on month, you could filter all the memories in a certain month",
        #                 "categories": [
        #                     "date"
        #                 ]
        #             },
        #             {
        #                 "id": 18,
        #                 "label": "Address",
        #                 "value": 20,
        #                 "desc": "based on city, you could filter all the memories that happened in this city",
        #                 "categories": [
        #                     "location"
        #                 ]
        #             },
        #             {
        #                 "id": 19,
        #                 "label": "Mcs",
        #                 "value": 20,
        #                 "desc": "Multi-chain storage based on the web3 concept, keep your date more safe",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #             {
        #                 "id": 20,
        #                 "label": "Tag",
        #                 "value": 20,
        #                 "desc": "add some tags to some nodes like Img, Event, etc.",
        #                 "categories": [
        #                     "info"
        #                 ]
        #             },
        #         ],
        #         "edges": [
        #             {
        #                 "from": 1,
        #                 "to": 2,
        #                 "label": "inherit"
        #             },
        #             {
        #                 "from": 2,
        #                 "to": 3,
        #                 "label": "work in"
        #             },
        #
        #             {
        #                 "from": 2,
        #                 "to": 4,
        #                 "label": "own"
        #             },
        #             {
        #                 "from": 2,
        #                 "to": 5,
        #                 "label": "provide"
        #             },
        #             {
        #                 "from": 2,
        #                 "to": 6,
        #                 "label": "need"
        #             },
        #             {
        #                 "from": 2,
        #                 "to": 7,
        #                 "label": "join in"
        #             },
        #             {
        #                 "from": 2,
        #                 "to": 11,
        #                 "label": "face info"
        #             },
        #             {
        #                 "from": 2,
        #                 "to": 9,
        #                 "label": "own"
        #             },
        #             {
        #                 "from": 4,
        #                 "to": 3,
        #                 "label": "experience in"
        #             },
        #             {
        #                 "from": 4,
        #                 "to": 9,
        #                 "label": "include"
        #             },
        #
        #             {
        #                 "from": 5,
        #                 "to": 9,
        #                 "label": "include"
        #             },
        #             {
        #                 "from": 6,
        #                 "to": 9,
        #                 "label": "include"
        #             },
        #             {
        #                 "from": 7,
        #                 "to": 9,
        #                 "label": "memory"
        #             },
        #             {
        #                 "from": 7,
        #                 "to": 13,
        #                 "label": "memory"
        #             },
        #             {
        #                 "from": 7,
        #                 "to": 14,
        #                 "label": "memory"
        #             },
        #             {
        #                 "from": 7,
        #                 "to": 20,
        #                 "label": "include"
        #             },
        #             {
        #                 "from": 8,
        #                 "to": 10,
        #                 "label": "record in "
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 8,
        #                 "label": "belongs to "
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 10,
        #                 "label": "record in"
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 11,
        #                 "label": "belongs to "
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 12,
        #                 "label": "have faces"
        #             },
        #
        #             {
        #                 "from": 9,
        #                 "to": 15,
        #                 "label": "include"
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 16,
        #                 "label": "include "
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 17,
        #                 "label": "token on"
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 18,
        #                 "label": "located in"
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 19,
        #                 "label": "include"
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 20,
        #                 "label": "include"
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 12,
        #                 "label": "have faces"
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 8,
        #                 "label": "belongs to "
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 10,
        #                 "label": "record in"
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 11,
        #                 "label": "belongs to "
        #             },
        #             {
        #                 "from": 9,
        #                 "to": 12,
        #                 "label": "have faces"
        #             },
        #             {
        #                 "from": 11,
        #                 "to": 12,
        #                 "label": "have faces "
        #             },
        #             {
        #                 "from": 13,
        #                 "to": 20,
        #                 "label": "include"
        #             },
        #             {
        #                 "from": 14,
        #                 "to": 20,
        #                 "label": "include"
        #             },
        #
        #         ]
        #     }
        # }
        return Response(data)

#
# # 更新所有人脸中心特征
# # 1. 相册刚创建
# # 2. 中心人脸有更新
# def update_combined_feats(album):
#     combined_fts_pth = os.path.join(FACE_INFO_ROOT, 'combined_feats.txt')
#     center_ft = np.loadtxt(album.face_feat.path, delimiter=',', dtype=float, skiprows=0,
#                            comments='#').reshape(1, -1)
#
#     if os.path.exists(combined_fts_pth):
#         all_fts = np.loadtxt(combined_fts_pth, delimiter=',', dtype=float, skiprows=0, comments='#')  # 加载现有的所有人脸特征
#         if all_fts.ndim == 1:  # 如果是一维数据，则转换成行向量
#             all_fts = all_fts.reshape(1, -1)
#         all_fts = np.concatenate((all_fts, center_ft), axis=0)
#         print(f'INFO all_fts already existed, the shape is {all_fts.shape}')
#     else:
#         all_fts = center_ft
#         print(f'INFO combined_fts_pth do not existed, creating now...')
#
#     names_pth = os.path.join(FACE_INFO_ROOT, 'names.txt')
#     if os.path.exists(names_pth):
#         names = np.loadtxt(names_pth, delimiter=',', dtype=str, skiprows=0, comments='#')  # 加载现有的所有人脸特征
#     else:
#         names = []
#     names = np.append(names, album.name)
#     print(f'INFO names is {names}')
#
#     np.savetxt(combined_fts_pth, all_fts, delimiter=',', fmt='%.4f')  # 保存所有人脸特征
#     np.savetxt(names_pth, names, delimiter=',', fmt='%s')  # 保存所有人对应人名

#
# def save_calc_feats(face_info_path):
#     fc_info = np.load(face_info_path, allow_pickle=True)
#     ft = fc_info.item().normed_embedding.reshape(1, -1)
#
#     fold = os.path.dirname(face_info_path)  # 保存该人的所有人脸特征
#     all_fts_pth = os.path.join(fold, 'all_feats.txt')
#     center_fts_pth = os.path.join(fold, 'center_feats.txt')
#     if os.path.exists(all_fts_pth):
#         all_fts = np.loadtxt(all_fts_pth, delimiter=',', dtype=float, skiprows=0, comments='#')  # 加载现有的所有人脸特征
#         if all_fts.ndim == 1:  # 如果是一维数据，则转换成行向量
#             all_fts = all_fts.reshape(1, -1)
#         print(f'INFO all_fts shape is {all_fts.shape}, fc_info.normed_embedding shape is {ft.shape}')
#         new_all_fts = np.concatenate((all_fts, ft), axis=0)
#     else:
#         new_all_fts = ft
#     np.savetxt(all_fts_pth, new_all_fts, delimiter=',', fmt='%.4f')  # 保存该人的所有人脸特征
#
#     center_fts = new_all_fts.mean(axis=0).reshape(1, -1)  # 将数组a转化为行向量
#     np.savetxt(center_fts_pth, center_fts, delimiter=',', fmt='%.4f')  # 保存该人中心特征向量，后续改为网络模型计算中心特征
#
#     sim = np.matmul(ft, center_fts.T)
#     return center_fts_pth, sim
