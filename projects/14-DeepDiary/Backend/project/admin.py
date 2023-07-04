# project/admin.py
from django.contrib import admin

# Register your models here.
from project.models import Project, Product, Purchase, Tooling, Outsourcing, Delivery, \
    Resume, Issue

admin.site.register([Project, Product, Tooling, Outsourcing, Purchase, Delivery, Resume, Issue])  # 把这个模型注册到管理后台中

