from django.db.models import Count
from django_filters import rest_framework
from django_filters.rest_framework import FilterSet, DjangoFilterBackend
from rest_framework import filters
from taggit.managers import TaggableManager

from library.models import Img, Category, Address
from django.db import models
import django_filters


class TagsFilter(django_filters.CharFilter):

    def filter(self, qs, value):
        if value:
            tags = [tag.strip() for tag in value.split(',')]  # strip()去除首尾空格， string to list
            print(tags)
            # qs = qs.filter(tags__name__in=tags).distinct()  # through or logical
            for tag in tags:  # through and logical, filter for several times
                qs = qs.filter(tags__name=tag)

        return qs.distinct()


class FacesFilter(django_filters.NumberFilter):

    def filter(self, qs, value):
        # print(f'the value in FacesFilter is {qs}')
        if value is None:
            qs = qs
        elif value <= 6:
            qs = qs.annotate(fc_nums=Count('faces')).filter(fc_nums=value)
        else:
            qs = qs.annotate(fc_nums=Count('faces')).filter(fc_nums__gte=value)
        return qs


class CategoryFilter(FilterSet):
    # tags = TagsFilter(field_name="tags", method='filter_tags')  # method 1
    # # tags = django_filters.CharFilter('tags', method='filter_tags')  # method 2
    #
    # # color
    # c_img = django_filters.CharFilter('colors', method='filter_img_colors')
    # c_fore = django_filters.CharFilter('colors', method='filter_fore_colors')
    # c_back = django_filters.CharFilter('colors', method='filter_back_colors')
    #
    #
    # # faces
    # # faces = FacesFilter()
    c_img = django_filters.CharFilter('img', method='filter_img_colors')
    c_fore = django_filters.CharFilter('img', method='filter_fore_colors')
    c_back = django_filters.CharFilter('img', method='filter_back_colors')
    c_name = django_filters.CharFilter('name', method='filter_c_name')
    imgs = django_filters.CharFilter('img', method='filter_imgs')

    # fc_name = django_filters.CharFilter('faces', method='filter_fc_name')

    class Meta:
        model = Category  # 模型名

        fields = {
            # color
            'name': ['exact', 'icontains'],
            'type': ['exact', 'icontains'],
            'value': ['exact', 'icontains'],
            'img': ['exact', 'icontains'],
        }

    # 自定义方法
    def filter_imgs(self, qs, name, value):
        # print(f'INFO: start filter the imgs: {value}')
        # if value:
        #     imgs = [img for img in value.split(',')]  # strip()去除首尾空格
        #     # print(imgs)
        #     qs = qs.filter(img__in=imgs).distinct()  # through or logical
        return qs

    def filter_img_colors(self, qs, name, value):
        #
        # print(name)
        # print(value)
        if value:
            names = [name.strip() for name in value.split(',')]  # strip()去除首尾空格
            print(names)
            # qs = qs.filter(tags__name__in=tags).distinct()  # through or logical
            for item in names:  # through and logical
                # qs = qs.filter(img__colors__image__closest_palette_color_parent=item).distinct()
                qs = qs.filter(img__categories__name=item).distinct()
        # print(f'filter_fore_colors--> the original qs count is  {qs.count()}')
        return qs

    def filter_fore_colors(self, qs, name, value):

        if value:
            names = [name.strip() for name in value.split(',')]  # strip()去除首尾空格
            print(names)
            # qs = qs.filter(tags__name__in=tags).distinct()  # through or logical
            for item in names:  # through and logical
                qs = qs.filter(img__categories__name=item).distinct()
        # print(f'filter_fore_colors--> the original qs count is  {qs.count()}')
        return qs

    def filter_back_colors(self, qs, name, value):

        # print(name)
        # print(value)
        if value:
            names = [name.strip() for name in value.split(',')]  # strip()去除首尾空格

            # qs = qs.filter(tags__name__in=tags).distinct()  # through or logical
            for item in names:  # through and logical
                qs = qs.filter(img__categories__name=item).distinct()
        # print(f'filter_back_colors--> the original qs count is {qs.count()}')
        return qs


class ImgFilter(FilterSet):
    tags = TagsFilter(field_name="tags", method='filter_tags')  # method 1
    # tags = django_filters.CharFilter('tags', method='filter_tags')  # method 2

    # color
    c_img = django_filters.CharFilter('colors', method='filter_img_colors')
    c_fore = django_filters.CharFilter('colors', method='filter_fore_colors')
    c_back = django_filters.CharFilter('colors', method='filter_back_colors')

    # faces
    # faces = FacesFilter()
    fc_nums = django_filters.NumberFilter('faces', method='filter_fc_nums')
    fc_name = django_filters.CharFilter('faces', method='filter_fc_name')

    layout = django_filters.CharFilter('aspect_ratio', method='filter_layout')

    class Meta:
        model = Img  # 模型名

        fields = {
            # 'id': ['exact', 'gte', 'lte'],
            # color
            'colors__image__closest_palette_color_parent': ['exact'],
            'colors__foreground__closest_palette_color_parent': ['exact'],
            'colors__background__closest_palette_color_parent': ['exact'],
            # category
            'categories__name': ['exact'],  #
            'categories__type': ['exact'],  #
            'categories__value': ['exact'],  #
            # address
            'address__is_located': ['exact'],
            'address__country': ['exact', 'contains'],
            'address__province': ['exact', 'contains'],
            'address__city': ['exact', 'contains'],
            'address__district': ['exact', 'contains'],
            'address__location': ['icontains'],
            'address__longitude': ['gte', 'lte', 'range'],
            'address__latitude': ['gte', 'lte', 'range'],
            # face

            # 'faces': ['exact', 'gte', 'lte'],  #
            'faces__name': ['exact', 'icontains'],  #
            'faces__id': ['gte', 'lte', 'contains'],  #
            # date
            'dates__year': ['exact', 'gte', 'lte', 'contains'],  #
            'dates__month': ['exact', 'gte', 'lte', 'contains'],  #
            'dates__day': ['exact', 'gte', 'lte', 'contains', 'isnull'],  #
            'dates__capture_date': ['exact', 'gte', 'lte', 'contains', 'isnull', 'range'],
            # http://127.0.0.1:8000/api/img/?dates__capture_date__isnull=true
            # evaluates
            'evaluates__rating': ['exact'],  #
            'evaluates__flag': ['exact'],  #
            'evaluates__total_views': ['exact', 'gte', 'lte'],  #
            'evaluates__likes': ['exact', 'gte', 'lte'],  #
            # tags
            'tags': ['exact', 'icontains'],  #
            'tags__name': ['exact', 'icontains'],  #
            # img
            'name': ['exact', 'icontains'],  #
            'title': ['exact', 'icontains'],  #
            'caption': ['exact', 'icontains'],  #
            "type": ['exact'],
            "wid": ['exact', 'gte', 'lte'],
            "height": ['exact', 'gte', 'lte'],
            "aspect_ratio": ['exact', 'gte', 'lte'],  # need to change to float type
            "is_publish": ['exact'],
        }

        filter_overrides = {
            TaggableManager: {  # unrecognized field type TaggableManager, so must be overrides
                'filter_class': django_filters.CharFilter,
                'extra': lambda f: {
                    'lookup_expr': 'name__icontains',  # here we're saying to look through the icontains prop on name
                },
            },

        }

    def filter_tags(self, queryset, name, value):
        if value:
            tags = [tag.strip() for tag in value.split(',')]  # strip()去除首尾空格
            print(tags)
            # qs = qs.filter(tags__name__in=tags).distinct()  # through or logical
            for tag in tags:  # through and logical
                queryset = queryset.filter(tags__name=tag).distinct()
        else:
            print(f'value is null: {value}')
            queryset = queryset.filter(tags__name__isnull=True).distinct()
        return queryset

    def filter_fc_nums(self, qs, name, value):
        # print(f'filter_fc_nums--> the original qs count is : {qs.count()}')
        # print(qs.values_list('id', flat=True))
        # annotate will be wrong if without this code, the reason is the qs already using the distinct
        qs=Img.objects.filter(id__in=qs.values_list('id', flat=True))
        # print(value)
        if value is None:
            qs = qs
        elif value < 0:
            qs = qs
        # elif value <= 6:
        #     qs = qs.annotate(fc_nums=Count('faces')).filter(fc_nums=value).distinct()
            # print(qs.annotate(fc_nums=Count('faces')).filter(fc_nums=value).values('id','fc_nums'))
        else:
            qs = qs.annotate(fc_nums=Count('faces')).filter(fc_nums=value).distinct().order_by('id')
            # qs = qs.annotate(fc_nums=Count('faces')).filter(fc_nums__gte=value).distinct()
        return qs

    def filter_fc_name(self, qs, name, value):

        print(name)
        print(value)
        if value:
            names = [name.strip() for name in value.split(',')]  # strip()去除首尾空格
            print(names)
            # qs = qs.filter(tags__name__in=tags).distinct()  # through or logical
            for item in names:  # through and logical
                qs = qs.filter(faces__name=item).distinct()
        return qs

    def filter_img_colors(self, qs, name, value):
        #
        # print(name)
        # print(value)
        if value:
            names = [name.strip() for name in value.split(',')]  # strip()去除首尾空格
            print(names)
            # qs = qs.filter(tags__name__in=tags).distinct()  # through or logical
            for item in names:  # through and logical
                qs = qs.filter(colors__image__closest_palette_color_parent=item).distinct()
        # print(f'filter_fore_colors--> the original qs count is  {qs.count()}')
        return qs

    def filter_fore_colors(self, qs, name, value):

        if value:
            names = [name.strip() for name in value.split(',')]  # strip()去除首尾空格
            print(names)
            # qs = qs.filter(tags__name__in=tags).distinct()  # through or logical
            for item in names:  # through and logical
                qs = qs.filter(colors__foreground__closest_palette_color_parent=item).distinct()
        # print(f'filter_fore_colors--> the original qs count is  {qs.count()}')
        return qs

    def filter_back_colors(self, qs, name, value):

        # print(name)
        # print(value)
        if value:
            names = [name.strip() for name in value.split(',')]  # strip()去除首尾空格

            # qs = qs.filter(tags__name__in=tags).distinct()  # through or logical
            for item in names:  # through and logical
                qs = qs.filter(colors__background__closest_palette_color_parent=item).distinct()
        # print(f'filter_back_colors--> the original qs count is {qs.count()}')
        return qs

    def filter_layout(self, qs, name, value):
        if value == 'Square':
            qs = qs.filter(aspect_ratio=1)
        elif value == 'Wide':
            qs = qs.filter(aspect_ratio__lt=1)
        elif value == 'Tall':
            qs = qs.filter(aspect_ratio__gt=1)
        else:
            pass
        return qs


class ImgSearchFilter(filters.SearchFilter):
    class Meta:
        model = Img  # 模型名

        fields = {
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

    def get_search_fields(self, view, request):
        if request.query_params.get('title_only'):
            return ['title']
        return super(ImgSearchFilter, self).get_search_fields(view, request)


class AddressFilter(FilterSet):

    class Meta:
        model = Address  # 模型名

        fields = {
            # if searching with contains or icontains, should do like this: address__is_located__contains = **
            'is_located': ['exact'],
            'country': ['exact', 'contains'],
            'province': ['exact', 'contains'],
            'city': ['exact', 'contains', 'isnull'],
            'district': ['exact', 'contains'],
            'location': ['icontains'],
            'longitude': ['gte', 'lte', 'range'],
            'latitude': ['gte', 'lte', 'range'],
        }



