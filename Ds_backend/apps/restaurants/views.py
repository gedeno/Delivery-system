from typing import ClassVar

from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import Menu_item, Restaurants ,Cart
from .serializer import Menu_itemserializer, Restaurantserializer , Cartserialiser

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
class CreateCart(ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = Cartserialiser
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        menu_id = self.request.query_params.get("menu_id")
        menu = Menu_item.objects.get(id = menu_id)
        serializer.save(item=menu , user=self.request.user)
    def get_queryset(self):
        cart_items = Cart.objects.filter( user=self.request.user) 
        return cart_items