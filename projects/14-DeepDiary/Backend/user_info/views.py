# user_info/views.py

from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_jwt.utils import jwt_decode_handler
from user_info.models import Profile, Company, SupplyDemand
from user_info.serializers import UserRegisterSerializer, ProfileDetailSerializer, ProfileSerializer, CompanySerializer, \
    UserSerializer, UserDetailSerializer, SupplyDemandSerializer

# class UserRegisterViewSet(viewsets.ModelViewSet):
#     queryset = Profile.objects.all()
#     serializer_class = UserRegisterSerializer
#     lookup_field = 'username'  # 要和序列化器中对应起来
from utils.pagination import GeneralPageNumberPagination
from utils.permissions import IsOwnerOrReadOnly, IsSelfOrReadOnly, IsRegister, get_user_info


class UserViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    # lookup_field = 'username'  # 要和序列化器中对应起来
    serializer_class = UserRegisterSerializer
    pagination_class = GeneralPageNumberPagination
    # permission_classes = [IsRegister]

    def get_serializer_class(self):
        if self.action == 'list':
            return UserRegisterSerializer
        else:
            return UserDetailSerializer   # UserDetailSerializer

    @action(detail=False, methods=['get', 'post'])  # detail=False, 接口外面调用，如果是True，在详情中调用
    def info(self, request, username=None):

        # print(f'INFO self: {dir(self.request)}')  # 在这个类中定义函数，都可以通过self获取相关数据，
        # print(f'INFO request: {dir(request)}')  # 跟上面结果一致
        print(f'INFO request.query_params: {request.query_params}')  # 头部参数信息
        print(f'INFO request.auth: {request.auth}')  # 如果是用token 验证方式，这里对应的就是token值
        print(f'INFO request.authenticators: {request.authenticators}')
        print(f'INFO request.data: {request.data}')  # 请求body信息
        print(f'INFO request.user: {request.user}')  # 如果是用token验证方式，通过这个就可以获取对应的用户名
        # user_obj = User.objects.filter(username=request.user).first()  # 通过Bearer Token 方式获取用户信息
        user_obj = get_user_info(request)

        if user_obj:
            print(f'INFO get username based on token: {user_obj.username}')
            serializer = UserDetailSerializer(user_obj, many=False, context={'request': request})  # 这里不加context 就会报错
            # serializer = UserRegisterSerializer(queryset, many=False, context={'request': request})  # 这里不加context 就会报错
            rst_data = serializer.data['data']
            # print(f'INFO rst_data: {rst_data}')
            role=[]
            # print(rst_data['roles'])
            role.append(rst_data['roles'])
            # print(role)
            rst_data['roles'] = role
            # print(rst_data['roles'])
            data = {

                "data": rst_data,
                "code": 200,
                "message": "请求成功"
            }
        else:
            data = {

                "code": 400,
                "message": "the user is not existed"
            }
        return Response(data)

    @action(detail=False)  # 在列表中才能使用这个自定义动作
    def sorted(self, request):
        users = User.objects.all().order_by('-username')

        page = self.paginate_queryset(users)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])  # detail=False, 接口外面调用，如果是True，在详情中调用
    def logout(self, request, username=None):
        data = {
            "code": 200,
            "msg": "success"
        }
        return Response(data)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return ProfileSerializer
        else:
            return ProfileDetailSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class SupplyDemandSet(viewsets.ModelViewSet):
    queryset = SupplyDemand.objects.all()
    # lookup_field = 'username'  # 要和序列化器中对应起来
    serializer_class = SupplyDemandSerializer
    pagination_class = GeneralPageNumberPagination
