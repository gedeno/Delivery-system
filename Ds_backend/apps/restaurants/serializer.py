from rest_framework import serializers

from .models import Menu_item, Restaurants


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