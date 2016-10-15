# -*- coding: UTF8 -*-

from django.conf.urls import url
from backend.views import *

urlpatterns = [
    url(r"^new-article$", NewArticleView.as_view()),
    url(r"^edit-article/(?P<article_id>\d+)", EditArticleView.as_view()),
    url(r"^api/edit-article$", EditArticleJsonApiView.as_view()),
    url(r"^$", MainView.as_view()),
    url(r"^login$", BackendLoginView.as_view()),
]
