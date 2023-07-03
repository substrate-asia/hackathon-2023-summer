from rest_framework.pagination import PageNumberPagination

from rest_framework.response import Response


class FacePageNumberPagination(PageNumberPagination):
    page_size = 10  # default page size
    page_size_query_param = 'size'  # ?page=xx&size=??
    max_page_size = 50  # max page size

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'totalCnt': self.page.paginator.count,
            'msg': 'success',
            'code': 200,
            'data': data
        })

