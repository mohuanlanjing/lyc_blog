# -*- coding: UTF-8 -*-
from django.shortcuts import render
from django.views.generic import View, TemplateView
from django.http import JsonResponse, HttpResponseRedirect, HttpResponseNotAllowed
from django.contrib.auth import login, authenticate
from account.views import JsonApiViewBase
from account.models import MyUser
from blog.models import Article
from common import codedesc
# Create your views here.


class BackendAuthBaseView(View):
    
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated() or not request.user.is_admin:
            return HttpResponseRedirect("/backend/login?redirect=" + request.get_full_path())
        return super(BackendAuthBaseView, self).dispatch(request, *args, **kwargs)


class BackendAuthJsonApiView(View):

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated() or not request.user.is_admin:
            # res = codedesc.NOT_LOGIN.copy()
            return HttpResponseNotAllowed(u"无权限")
        return super(BackendAuthJsonApiView, self).dispatch(request, *args, **kwargs)


class BackendLoginView(TemplateView):

    template_name = "backend/login.html"

    def post(self, request, *args, **kwargs):
        username = request.POST.get("username")
        password = request.POST.get("password")
        redirect_url = request.GET.get("redirect")
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            if redirect_url:
                return HttpResponseRedirect(redirect_url)
            else:
                return HttpResponseRedirect("/articles")
        else:
            context = {"error": u"账号密码错误"}

            return render(request, self.template_name, context)


class MainView(TemplateView, BackendAuthBaseView):
    template_name = "backend/main.html"


class NewArticleView(TemplateView):

    template_name = "backend/article-editor.html"

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {"new": True})


class EditArticleView(TemplateView):
    template_name = "backend/article-editor.html"

    def get(self, request, *args, **kwargs):
        article_id = self.kwargs.get("article_id")
        article = Article.objects.get(id=article_id)
        context = {"new": False, "article": article}
        return render(request, self.template_name, context)


class EditArticleJsonApiView(BackendAuthJsonApiView, JsonApiViewBase):

    def post(self, request, *args, **kwargs):
        article_id = self.json_data.get("article_id")
        title = self.json_data.get("title")
        if not title:
            res = codedesc.JSON_ERR
            res["msg"] = u"标题不能为空"
            return JsonResponse(res)
        content = self.json_data.get("content")
        if not content:
            res = codedesc.JSON_ERR
            res["msg"] = u"内容不能为空"
            return JsonResponse(res)

        res = codedesc.OK
        if not article_id:
            article = Article(title=title, content=content, author=request.user)
        else:
            article = Article.objects.filter(id=article_id).first()
            if not article:
                res = codedesc.JSON_ERR
                res["msg"] = u"article_id有误"
                return JsonResponse(res)
            article.title = title
            article.content = content
        article.save()
        res["article_id"] = article.id

        return JsonResponse(res)

