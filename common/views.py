# -*- coding: UTF8 -*-

from django.views.generic import View


class AdminAuthBaseView(View):

    def get_context_data(self, **kwargs):
        context = super(AdminAuthBaseView, self).get_context_data(**kwargs)
        if self.request.user.is_authenticated():
            if self.request.user.is_admin:
                context["is_admin"] = True
        return context


