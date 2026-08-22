from rest_framework import serializers

from .models import Menu_item, Restaurants


class Restaurantserializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurants
        fields = ["owner" , "Res_name" ]
        extra_kwargs = {'owner':{'read_only':True}}

class Menu_itemserializer(serializers.ModelSerializer):
    class Meta:
        model= Menu_item
        fields = ["restaurant","Item_name" , "price"]
        extra_kwargs ={'restaurant':{'read_only':True}}