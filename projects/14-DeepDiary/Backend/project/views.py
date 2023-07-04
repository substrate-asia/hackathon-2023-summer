from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters

from project.models import Project, Product, Tooling, Issue, Resume, Delivery, Purchase, Outsourcing
from project.serializers import ProjectSerializer, ProductSerializer, ToolingSerializer, OutsourcingSerializer, \
    PurchaseSerializer, ResumeSerializer, IssueSerializer, DeliverySerializer, IssueDetailSerializer, \
    ProjectDetailSerializer, ProductDetailSerializer, ToolingDetailSerializer, OutsourcingDetailSerializer, \
    ResumeDetailSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    # serializer_class = ProjectSerializer
    # permission_classes = (AllowAny,)

    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]  # 模糊过滤，注意的是，这里的url参数名变成了?search=搜索内容
    filterset_fields = ['name']
    search_fields = ['prg_code', 'name']
    ordering_fields = ['prg_code']  # 这里的字段，需要从上面定义字段中选择

    # def perform_create(self, serializer):
    #     # print(f"INFO:{self.request.user}")
    #     serializer.save(user=self.request.user)
    #
    # def perform_update(self, serializer):  # 应该在调用的模型中添加
    #     instance = serializer.save()  # ProcessedImageField, 也就是ImageField的实例对象
    #     if 'tags' in self.request.data:
    #         instance.tags.set(self.request.data['tags'].split(','))
    #
    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectSerializer
        else:
            return ProjectDetailSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()

    # serializer_class = ProductSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductSerializer
        else:
            return ProductDetailSerializer


class ToolingViewSet(viewsets.ModelViewSet):
    queryset = Tooling.objects.all()
    # serializer_class = ToolingSerializer
    # serializer_class = ToolingReportSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]  # 模糊过滤，注意的是，这里的url参数名变成了?search=搜索内容
    filterset_fields = ['type', 'sn', 'name', 'product__name', 'product__PN',
                        'product__project__name', 'product__project__prg_code',
                        'product__project__profile__name']
    search_fields = ['type', 'sn', 'name', 'product__name', 'product__PN',
                     'product__project__name', 'product__project__prg_code',
                     'product__project__profile__name']
    ordering_fields = ['type']  # 这里的字段，需要总上面定义字段中选择

    def get_serializer_class(self):
        if self.action == 'list':
            return ToolingSerializer
        else:
            return ToolingDetailSerializer


class OutsourcingViewSet(viewsets.ModelViewSet):
    queryset = Outsourcing.objects.all()
    # serializer_class = OutsourcingSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return OutsourcingSerializer
        else:
            return OutsourcingDetailSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer


class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer


class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    # serializer_class = ResumeSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return ResumeSerializer
        else:
            return ResumeDetailSerializer


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return IssueSerializer
        else:
            return IssueDetailSerializer
