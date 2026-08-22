from typing import ClassVar

from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from .models import Menu_item, Restaurants
from .serializer import Menu_itemserializer, Restaurantserializer

# Create your views here.

class CreateRestaurant(ModelViewSet):
    queryset = Restaurants.objects.all()
    serializer_class = Restaurantserializer
    permission_classes: ClassVar = [AllowAny]
    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)
        return super().perform_create(serializer)
    
class CreateMenu(ModelViewSet):
    queryset = Menu_item.objects.all()
    serializer_class = Menu_itemserializer
    permission_classes: ClassVar = [AllowAny]
    def perform_create(self, serializer):
        serializer.save(restaurant = Restaurants.objects.get(id = self.kwargs['pk']))
        return super().perform_create(serializer)
    