from typing import ClassVar
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from .models import User
from .serializer import Userserializer

# Create your views here.

class Createuser(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = Userserializer
    permission_classes= [AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        print(user)

    def list(self, request):
        return Response({
            "role": request.user.role
        })

class AllUserFetch(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = Userserializer
    permission_classes = [AllowAny]

class EditUsers(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = Userserializer
    permission_classes = [AllowAny]
    def destroy(self, request, *args, **kwargs):
        user = User.objects.filter(id = self.request.query_params.get("user_id"))
        return super().destroy(request, *args, **kwargs)