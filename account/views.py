# -*- coding:UTF8 -*-
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.generic import View
from common.codedesc import *
# Create your views here.


class JsonApiViewBase(View):

    def check_value(self, *args):
        errs = []
        for k, err in args:
            if not self.json_data.get(k):
                errs.append(err)

        return ",".join(errs)

    def dispatch(self, request, *args, **kwargs):
        try:
            self.json_data = json.loads(self.request.body)

        except:
            return JsonResponse(NOT_JSON)

        return super(JsonApiViewBase, self).dispatch(request, *args, **kwargs)

