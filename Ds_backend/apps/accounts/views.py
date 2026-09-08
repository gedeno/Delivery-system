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
        serializer.save()

    def list(self, request):
        return Response({
            "role": request.user.role
        })