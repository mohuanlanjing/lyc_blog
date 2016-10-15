# -*- coding:utf8 -*-
import os
from django.shortcuts import render
from django.http import JsonResponse
from backend.views import BackendAuthJsonApiView as BackendJsonApiAuthView
from images.models import MyImage, ImageCategory
from common import codedesc
from uuid import uuid4
# Create your views here.


class ImageDeleteJsonApiView(BackendJsonApiAuthView):

    def post(self, request, *args, **kwargs):
        image_id = request.POST.get("id")
        my_image = MyImage.objects.filter(id=image_id).first()
        if my_image:
            os.remove(my_image.img.path)
            my_image.delete()
            res = codedesc.OK.copy()
            return JsonResponse(res)
        res = codedesc.JSON_ERR.copy()
        res["msg"] = u"id有误"
        return JsonResponse(res)


class UploadImageJsonApiView(BackendJsonApiAuthView):

    def post(self, request, *args, **kwargs):
        url = request.POST.get("url")
        name = request.POST.get("name")
        if not name:
            res = codedesc.JSON_ERR
            res["msg"] = u"图片名字不能为空"
            return JsonResponse(res)

        # category_id = self.json_data.get("category_id")
        # category = ImageCategory.objects.filter(id=category_id).first()
        image_file = request.FILES.get("file")
        if image_file:
            image_file.name = str(uuid4())
            new_img = MyImage(name=name.encode("u8"), img=image_file)
            new_img.save()
            res = codedesc.OK
            res["id"] = new_img.id
            res['url'] = new_img.get_url()
            return JsonResponse(res)

        elif url:
            new_img = self.upload_out(name, None)
            res = codedesc.OK
            res["id"] = new_img.id
            res['url'] = new_img.url
            return JsonResponse(res)
        else:
            res = codedesc.JSON_ERR.copy()
            res["msg"] = u"网络图片URL和本地图片必须存在一个"
            return JsonResponse(res)

    def upload_out(self, out_url, name, category):

        exist_img = MyImage.objects.filter(url=out_url).first()
        if exist_img:
            return exist_img

        new_image = MyImage(url=out_url, name=name, category=category)
        new_image.save()
        return new_image


class ImageListJsonApiView(BackendJsonApiAuthView):

    def get(self, request, *args, **kwargs):

        queryset = MyImage.objects.all().order_by("upload_time")

        queryset_json = []
        for i in queryset:
            url = None
            if i.img:
                url = i.img.url
            else:
                url = i.url
            queryset_json.append({"id": i.id, "url": url, "name": i.name})

        res = codedesc.OK
        res["data"] = queryset_json
        return JsonResponse(res)
