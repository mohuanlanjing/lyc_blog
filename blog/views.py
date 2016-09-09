# -*- coding: UTF8 -*-
from django.shortcuts import render
from django.utils import timezone
from django.views.generic import ListView, DetailView, View
from blog.models import Article, Comment
from account.views import JsonApiViewBase
from common import codedesc
from django.http import JsonResponse, Http404
from common.views import AdminAuthBaseView
# Create your views here.


class ArticleListView(AdminAuthBaseView, ListView):
    template_name = "blog/article-list.html"
    queryset = Article.objects.all().order_by("-create_time")
    context_object_name = "articles"


class ArticleView(AdminAuthBaseView, DetailView):
    template_name = "blog/article.html"
    context_object_name = "article"

    def get_object(self, queryset=None):
        article_id = self.kwargs.get("id")
        # article = Article.objects.get(id=article_id)
        article = Article.objects.filter(id=article_id).first()
        if article:
            article.views_num += 1
            article.save()
        else:
            raise Http404()
        return article

    def get_context_data(self, **kwargs):
        context = super(ArticleView, self).get_context_data(**kwargs)
        context["view_user_name"] = self.request.session.get("name")
        context["view_user_email"] = self.request.session.get("email")
        return context


class CommentsJsonApi(JsonApiViewBase):

    def post(self, request, *args, **kwargs):
        check_result = self.check_value(("article_id", u"文章id有误"))
        if check_result:
            res = codedesc.JSON_ERR
            res["msg"] = check_result
            return JsonResponse(res)

        article_id = self.json_data.get("article_id")
        article = Article.objects.filter(id=article_id).first()
        if not article:
            res = codedesc.JSON_ERR
            res["msg"] = u"article_id error"
            return JsonResponse(res)


class AddArticleCommentJsonApi(JsonApiViewBase):

    def post(self, request, *args, **kwargs):
        check_result = self.check_value(("article_id", u"文章id有误"), ("name", u"昵称不能为空"), ("content", u"评论内容不能为空"))
        if check_result:
            res = codedesc.JSON_ERR
            res["msg"] = check_result
            return JsonResponse(res)
        article_id = self.json_data.get("article_id")
        parent_comment_id = self.json_data.get("parent_comment_id")
        email = self.json_data.get("email")
        name = self.json_data.get("name")
        if len(name) > 20:
            res = codedesc.JSON_ERR
            res["msg"] = u"昵称太长, 不能超过20个字符"
            return JsonResponse(res)
        content = self.json_data.get("content")
        if len(content) > 1024:
            res = codedesc.JSON_ERR
            res["msg"] = u"评论内容太长, 不能超过1024个字符"
            return JsonResponse(res)
        article = Article.objects.filter(id=article_id).first()
        if not article:
            res = codedesc.JSON_ERR
            res["msg"] = u"article_id error"
            return JsonResponse(res)

        new_comment = Comment(name=name, content=content, email=email)
        new_comment.save()
        article.comments.add(new_comment)
        if parent_comment_id:
            parent_comment = Comment.objects.filter(id=parent_comment_id).first()
            if not parent_comment:
                res = codedesc.JSON_ERR
                res["msg"] = u"parent_comment_id error"
                return JsonResponse(res)
            new_comment.parent_comment = new_comment
            new_comment.save()
            parent_comment.replys.add(new_comment)

        request.session["name"] = name
        request.session["email"] = email
        res = codedesc.OK
        res["article_id"] = article_id
        res["comment_id"] = new_comment.id
        res["comment_time"] = timezone.make_naive(new_comment.create_time).strftime("%Y-%m-%d %H:%M:%S")
        if parent_comment_id:
            res["comment_first"] = u"@%s: " % parent_comment.name
        else:
            res["comment_first"] = ""
        return JsonResponse(res)
