from django.contrib import admin

# Register your models here.
from library.models import Img, Mcs, Color, ColorBackground, ColorForeground, ColorImg, ColorItem, Category, \
    ImgCategory, Evaluate, Date, Address

admin.site.register([
    Mcs,
    Img,
    Color,
    ColorBackground,
    ColorForeground,
    ColorImg,
    ColorItem,
    Category,
    ImgCategory,
    Address,
    Date,
    Evaluate])  # 把这个图像表注册到管理后台中

# @admin.register(Img)
# class ImgAdmin(admin.ModelAdmin):
#     list_display = ('tags',)
#     list_filter = ('tags',)
#     ordering = ('-tags',)
#
#     def get_queryset(self, request):
#         return super().get_queryset(request).prefetch_related('tags')
#
#     def tags(self, obj):
#         return u",".join(o.name for o in obj.tags.all())

