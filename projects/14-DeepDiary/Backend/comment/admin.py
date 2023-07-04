from django.contrib import admin

# Register your models here.
from comment.models import Comment

admin.site.register(Comment)