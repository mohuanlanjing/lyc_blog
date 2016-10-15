# -*- coding: UTF8 -*-

from django.db import models

# Create your models here.


class ImageCategory(models.Model):
    name = models.CharField(max_length=102)


class MyImage(models.Model):
    img = models.ImageField(null=True)
    url = models.URLField(null=True)  # 外链
    name = models.CharField(max_length=102, null=True, blank=True)
    category = models.ForeignKey(ImageCategory, null=True, blank=True)
    upload_time = models.DateTimeField(auto_now_add=True)

    def get_url(self):
        if self.img:
            return self.img.url
        else:
            return self.url
