from typing import ClassVar
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from .models import CartItem, Menu_item, Restaurants ,Cart
from .serializer import CartItemSerializer, Menu_itemserializer, Restaurantserializer , Cartserialiser

# Create your views here.

class CreateRestaurant(ModelViewSet):
    queryset = Restaurants.objects.all()
    serializer_class = Restaurantserializer
    permission_classes: ClassVar = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)
        print(serializer.data)

class FetchRestaurant(ModelViewSet):
    queryset = Restaurants.objects.all()
    serializer_class = Restaurantserializer
    permission_classes: ClassVar = [AllowAny]

   

class Restaurants_ower_fetch(ModelViewSet):
    queryset = Restaurants.objects.all()
    serializer_class = Restaurantserializer
    permission_classes: ClassVar = [IsAuthenticated]
    def get_queryset(self):
        return Restaurants.objects.filter(owner=self.request.user)
    
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
class FetchMenu(ModelViewSet):
    queryset = Menu_item.objects.all()
    serializer_class = Menu_itemserializer
    permission_classes: ClassVar = [AllowAny]
    
class CartViewSet(ModelViewSet):
    serializer_class = Cartserialiser
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "list":
            return CartItemSerializer
        return Cartserialiser

    
    def get_queryset(self):
        cart = Cart.objects.get(user=self.request.user)
        return CartItem.objects.filter(cart=cart)
    
    def perform_create(self, serializer):
        menu_id = self.request.query_params.get("menu_id")
        menu = Menu_item.objects.get(id = menu_id)
        serializer.save(item=menu , user=self.request.user)


    def get_object(self):
        return Cart.objects.get(user=self.request.user)
    
    def delete(self, request ,*args,**kwargs):
        menu_id = self.request.query_params.get("menu_id")
        menu = Cart.objects.get(item = menu_id)
        menu.delete()
        return Response({
        "message": "Item removed from cart"
         })

class CartItemViewSet(ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    queryset = CartItem.objects.all()

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        menu_item = Menu_item.objects.get(id=self.request.query_params.get("menu_id"))
        serializer.save(cart=cart, menu_item=menu_item)

    def destroy(self, request, *args, **kwargs):
        cart_item = CartItem.objects.get(menu_item__id=int(self.request.query_params.get("menu_id")))
        cart_item.delete()
        return Response(
            "deleted"
        )

    @action(methods=["POST"], permission_classes=[IsAuthenticated], detail=False)
    def toggle_cart(self, request, pk=None):
        cart = Cart.objects.get(user=self.request.user)
        menu_item = Menu_item.objects.filter(id=int(self.request.query_params.get("menu_id"))).first()
        if cart.cartitem_set.filter(menu_item__id=int(self.request.query_params.get("menu_id"))).exists():
            cart.cartitem_set.get(menu_item__id=int(self.request.query_params.get("menu_id"))).delete()
            return Response("removed")
        else:
            CartItem.objects.create(menu_item=menu_item, cart=cart, quantity=request.data['quantity'])
            return Response("added")