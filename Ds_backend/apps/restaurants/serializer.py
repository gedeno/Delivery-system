from rest_framework import serializers

from .models import CartItem, Menu_item, Restaurants , Cart
from apps.accounts.serializer import Userserializer

class Restaurantserializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurants
        fields = [ "id", "owner" , "Res_name","image","address"  ]
        extra_kwargs = {'owner':{'read_only':True} ,'id':{'read_only':True} }

class Menu_itemserializer(serializers.ModelSerializer):
    restaurants = serializers.SerializerMethodField()
    incart = serializers.SerializerMethodField()
    class Meta:
        model= Menu_item
        fields = [ "id" , "restaurant","Item_name" , "price","image","description","Category","restaurants", "incart"]
        extra_kwargs ={'restaurant':{'read_only':True} ,'id':{'read_only':True},'restaurants':{'read_only':True}}
    def get_restaurants(self,obj):
        restaurant = obj.restaurant
        return Restaurantserializer(restaurant).data

    def get_incart(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False

        cart, created = Cart.objects.get_or_create(user=request.user)
        return cart.cartitem_set.filter(menu_item=obj).exists()
    
class Cartserialiser(serializers.ModelSerializer):
   
    items= serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ["id" ,"user", "items" ]
        extra_kwargs ={'user':{'read_only':True}, 'items':{'read_only':True}}
    
    def get_items(self,obj):
        items = CartItem.objects.filter(cart=obj)
        return CartItemSerializer(items, many=True).data

class CartItemSerializer(serializers.ModelSerializer):
    menu_item = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "menu_item", "quantity"]
        read_only_fields = ["menu_item"]
        
    def get_menu_item(self, obj):
        menu_item = obj.menu_item
        return Menu_itemserializer(
            menu_item
        ).data