# -*- coding: UTF8 -*-
from django.conf.urls import url, include
from images.backend_views import *

urlpatterns = [
    url(r"^upload$", UploadImageJsonApiView.as_view()),
    url(r"^list$", ImageListJsonApiView.as_view()),
    url(r"^delete$", ImageDeleteJsonApiView.as_view()),
]
