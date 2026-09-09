from rest_framework import serializers

from .models import Menu_item, Restaurants , Cart
from apps.accounts.serializer import Userserializer

class Restaurantserializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurants
        fields = [ "id", "owner" , "Res_name","image","address"  ]
        extra_kwargs = {'owner':{'read_only':True} ,'id':{'read_only':True} }

class Menu_itemserializer(serializers.ModelSerializer):
    class Meta:
        model= Menu_item
        fields = [ "id" , "restaurant","Item_name" , "price","image","description","Category"]
        extra_kwargs ={'restaurant':{'read_only':True} ,'id':{'read_only':True}}

class Cartserialiser(serializers.ModelSerializer):
   
    items= serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ["id" ,"user" ,"item" , "items" ]
        extra_kwargs ={'user':{'read_only':True},'item':{'read_only':True},'items':{'read_only':True}}
    
    def get_items(self,obj):
        item = obj.item
        return Menu_itemserializer(item).data