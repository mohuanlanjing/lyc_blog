# -*- coding: UTF8 -*-
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

# Create your models here.


class UserManager(BaseUserManager):

    def create_user(self, name, password=None):

        user = self.model(
          username=name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None):

        user = self.create_user(username, password)
        user.is_admin = True
        user.save(using=self._db)
        return user


class Address(models.Model):
    zip_code = models.CharField(max_length=10, null=True)
    country = models.CharField(max_length=20, default=u"中国")
    province = models.CharField(max_length=20)
    city = models.CharField(max_length=20)
    area = models.CharField(max_length=20)
    detail_address = models.CharField(max_length=100)
    receiver_name = models.CharField(max_length=20)
    receiver_mobile = models.CharField(max_length=11)

    def __unicode__(self):
        return u"%s %s %s %s %s" % (self.country, self.province, self.city, self.area, self.detail_address)


class MyUser(AbstractBaseUser):
    """
    有赞的user_id也是weixin_user_id和fans_id
    """
    username = models.CharField(max_length=200, unique=True, null=True)
    nick = models.CharField(max_length=100, null=True)
    is_admin = models.BooleanField(default=False)
    head_img_url = models.CharField(max_length=1024, null=True, blank=True)
    objects = UserManager()
    USERNAME_FIELD = "username"

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, per, obj=None):
        return True

    def has_module_perms(self, applabel):
        return True

    def __unicode__(self):
        if self.nick:
            return self.nick
        else:
            return u"匿名"
