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
        restaurant_id = self.request.query_params.get('restaurant_id')
        restaurant = Restaurants.objects.get(id = restaurant_id )
        serializer.save(restaurant=restaurant)
        return super().perform_create(serializer)
    def get_queryset(self):
        restaurant_id = self.request.query_params.get('restaurant_id')
        if restaurant_id:
            return Menu_item.objects.filter(restaurant_id = restaurant_id)
        return Menu_item.objects.all()
    