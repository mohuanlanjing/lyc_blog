# -*- coding: UTF8 -*-
import re
from django.utils import timezone
from django.db import models
from lycblog.settings import AUTH_USER_MODEL

# Create your models here.


class ArticleCategory(models.Model):
    name = models.CharField(max_length=1024)
    parent = models.ForeignKey("ArticleCategory", null=True, blank=True)


class Article(models.Model):
    author = models.ForeignKey(AUTH_USER_MODEL)
    comments = models.ManyToManyField("Comment", blank=True)
    title = models.CharField(max_length=1024)
    content = models.TextField()
    category = models.ForeignKey(ArticleCategory, null=True, blank=True)
    views_num = models.IntegerField(default=0)  # 点击浏览次数
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u"%s %s" % (self.title, timezone.make_naive(self.create_time))

    def preview(self):
        content = re.sub("<[^>]*?>", "", self.content)
        max_length = 200
        if len(content) > max_length:
            content = content[:max_length]
            content += "......"
        return content

    def get_comments(self):
        return self.comments.all().order_by("-create_time")


class Comment(models.Model):
    # what_article = models.ForeignKey(Article)
    parent_comment = models.ForeignKey("Comment", null=True, blank=True, related_name="parent")  # 上级回复
    replys = models.ManyToManyField("Comment", blank=True)  # 下级回复
    name = models.CharField(max_length=20)
    email = models.EmailField(null=True, blank=True)
    content = models.CharField(max_length=1024)
    create_time = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return u"%s: %s" % (self.name, self.content)
