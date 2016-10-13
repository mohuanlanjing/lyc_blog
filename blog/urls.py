# -*- coding: UTF8 -*-

from django.conf.urls import url
from django.views.generic import TemplateView
from blog.views import *

urlpatterns = [
    url(r"^$", TemplateView.as_view(template_name="common/index.html")),
    url(r"^articles$", ArticleListView.as_view()),
    url(r"^article/(?P<id>\d+)", ArticleView.as_view()),
    url(r"^article/api/add-comment$", AddArticleCommentJsonApi.as_view()),
]
