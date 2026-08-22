from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Restaurants ,Menu_item
from apps.restaurants.models import User
from .serializer import Restaurantserializer , Menu_itemserializer
from rest_framework.permissions import AllowAny , IsAuthenticated

# Create your views here.

class CreateRestaurant(ModelViewSet):
    queryset = Restaurants.objects.all()
    serializer_class = Restaurantserializer
    permission_classes = [AllowAny]
    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)
        return super().perform_create(serializer)
    
class CreateMenu(ModelViewSet):
    queryset = Menu_item.objects.all()
    serializer_class = Menu_itemserializer
    permission_classes = [AllowAny]
    def perform_create(self, serializer):
        serializer.save(restaurant = Restaurants.objects.get(id = self.kwargs['pk']))
        return super().perform_create(serializer)
    