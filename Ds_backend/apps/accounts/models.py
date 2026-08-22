from django.contrib.auth.models import (
    AbstractUser,
    BaseUserManager,
)
from django.db import models


# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, username,email, password=None, **extra_fields):
        if not username:
            raise ValueError("username is required")
        if not email:
            raise ValueError("Email field is required")
        user = self.model(username=username,email=email , **extra_fields)
        user.set_password(password)
        user.save(using = self._db)
        return user
    def create_superuser(self, username,email,password=None, **extra_fields):
        extra_fields.setdefault("is_staff" , True)
        extra_fields.setdefault("is_superuser",True)
        extra_fields.setdefault("is_active",True)
        return self.create_user(username,email,password,**extra_fields)
class User(AbstractUser):
    first_name = models.CharField(max_length=300)
    last_name = models.CharField(max_length=300)
    username = models.CharField(max_length=200 , unique=True)
    email = models.CharField(max_length=200,unique=True)

    is_verified = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username