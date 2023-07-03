from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework_jwt.utils import jwt_decode_handler
from django.contrib.auth import get_user_model


def get_user_info(request):  # 基于请求参数中的token 参数，获取用户信息
    User = get_user_model()

    # 从请求头中获取token信息
    token = request.query_params.get('token', None)  # 从参数中获取token信息
    print(f'INFO token in request.query_params is: {token}---------------------')  # 头部参数信息
    if not token:
        # return None

        # 从请求body中获取token信息
        token = request.data.get('token', None)  # 从参数中获取token信息
        print(f'INFO token in request.data is: {token}---------------------')  # 头部参数信息
        if not token:
            return None

    toke_user = jwt_decode_handler(token)  # 通过token解析出用户信息
    print(f'INFO toke_user: {toke_user}---------------------')  # 头部参数信息

    # 获得user_id
    user_id = toke_user["user_id"]  # 得到用户id
    user_obj = User.objects.filter(pk=user_id).first()
    return user_obj


class IsAdminUserOrReadOnly(BasePermission):  # 确保非安全方法只能由管理员操作
    """
    仅管理员用户可进行修改
    其他用户仅可查看
    """

    def has_permission(self, request, view):
        # 对所有人允许 GET, HEAD, OPTIONS 请求
        if request.method in permissions.SAFE_METHODS:
            return True
        # 仅管理员可进行其他操作
        return request.user.is_superuser


class IsOwnerOrReadOnly(BasePermission):  # 确保非安全方法只能由本人操作
    message = 'You must be the owner to update.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.author == request.user


class IsSelfOrReadOnly(BasePermission):  # 确保非安全方法只能由本人操作

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        user_info = get_user_info(request)
        if user_info is not None:
            print(f'obj is {obj}, username is {user_info.username}')
            return obj == user_info.username
        return False


class IsRegister(BasePermission):  # 确保非安全方法只能由本人操作
    def has_object_permission(self, request, view, obj):
        if request.method == 'POST':
            return True
        else:
            user_info = get_user_info(request)
            if user_info is not None:
                print(f'obj is {obj}, username is {user_info.username}')
                return obj == user_info.username
            return IsSelfOrReadOnly

