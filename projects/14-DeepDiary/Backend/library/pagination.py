from django.db.models import Count
from rest_framework.pagination import PageNumberPagination

from rest_framework.response import Response

from library.models import Category, Img


class GalleryPageNumberPagination(PageNumberPagination):
    page_size = 20  # default page size
    page_size_query_param = 'size'  # ?page=xx&size=??
    max_page_size = 20  # max page size

    def get_paginated_response(self, data):

        # category_id = []
        # img_id = []
        # for item in data:
        #     category_id.extend(item['categories'])
        #     img_id.append(item['id'])
        #
        # fc_nums = Img.objects.filter(id__in=img_id).annotate(fc_nums=Count('faces')).values_list('fc_nums', flat=True)
        #
        # category_id = list(set(category_id))
        # cate_list = Category.objects.filter(id__in=category_id)
        # img_color = cate_list.filter(type='img_color').values('name', 'value')
        # fore_color = cate_list.filter(type='fore_color').values('name', 'value')
        # back_color = cate_list.filter(type='back_color').values('name', 'value')
        #
        # category = {'img_color': img_color, 'fore_color': fore_color, 'back_color': back_color, 'fc_nums': fc_nums}

        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'totalCnt': self.page.paginator.count,
            'totalPage': self.page.number,
            'msg': 'success',
            'code': 200,
            'data': data,
            # 'category': category
        })


class AddressNumberPagination(PageNumberPagination):
    page_size = 10000  # default page size
    page_size_query_param = 'size'  # ?page=xx&size=??
    max_page_size = 10  # max page size

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'totalCnt': self.page.paginator.count,
            'msg': 'success: get all the gps info',
            'code': 200,
            'data': data
        })