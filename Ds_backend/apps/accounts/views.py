from django.shortcuts import render
from .models import CustomUserManager ,User
from . serializer import Userserializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from django.views.generic import CreateView ,ListView 
# Create your views here.

class Createuser(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = Userserializer
    permission_class = [AllowAny]
 