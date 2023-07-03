from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# Register your models here.
# 定义一个行内 admin
from user_info.models import Profile, Company, SupplyDemand, Demand, Supply

# # 第一种方式：行内admin，就是 将 Profile 关联到 User 中
# class ProfileInline(admin.StackedInline):
#     model = Profile
#     can_delete = False
#     verbose_name_plural = 'UserProfile'
#
#
# # 将 Profile 关联到 User 中
# class UserAdmin(BaseUserAdmin):
#     inlines = (ProfileInline,)
#
#
# # 重新注册 User
# admin.site.unregister(User)
# admin.site.register(User, UserAdmin)
# admin.site.register([Company])


# 第二种方式，直接注册
admin.site.register([Company, Profile, SupplyDemand, Supply, Demand])
# admin.site.register()
