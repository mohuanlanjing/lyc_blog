# -*- coding: UTF8 -*-

from django.conf.urls import url
from blog.views import *

urlpatterns = [
    url(r"^$", ArticleListView.as_view()),
    url(r"^article/(?P<id>\d+)", ArticleView.as_view()),
    url(r"^article/api/add-comment$", AddArticleCommentJsonApi.as_view()),
]
