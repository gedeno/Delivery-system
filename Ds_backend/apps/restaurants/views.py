from typing import ClassVar

from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import Menu_item, Restaurants
from .serializer import Menu_itemserializer, Restaurantserializer

# Create your views here.

class CreateRestaurant(ModelViewSet):
    queryset = Restaurants.objects.all()
    serializer_class = Restaurantserializer
    permission_classes: ClassVar = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)
        print(serializer.data)
    
class CreateMenu(ModelViewSet):
    queryset = Menu_item.objects.all()
    serializer_class = Menu_itemserializer
    permission_classes: ClassVar = [AllowAny]
    def perform_create(self, serializer):
        serializer.save(restaurant = Restaurants.objects.get(id = int(self.request.query_params.get('restaurant_id'))))
        return super().perform_create(serializer)
    