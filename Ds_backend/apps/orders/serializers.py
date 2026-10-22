from rest_framework.serializers import ModelSerializer 
from rest_framework import serializers

from apps.restaurants.serializer import Menu_itemserializer, Restaurantserializer
from .models import Orders,OrderItem,Payments,Reviews

class Orderserializer(ModelSerializer):
    restaurant = serializers.SerializerMethodField()
    orderItems = serializers.SerializerMethodField()

    class Meta:
        model = Orders
        fields = ["id","customer","restaurants","status","total_amount","restaurant", "orderItems"]
        read_only_fields = ["id", "customer","restaurants","status" ,"restaurant","orderItems"]
    def get_restaurant(self,obj):
        restaurants = obj.restaurants
        return Restaurantserializer(restaurants).data
    def get_orderItems(self,obj):
        orderItems = OrderItem.objects.filter(order = obj)
        return OrderItemSerializer(orderItems,many=True).data
class OrderItemSerializer(ModelSerializer):
    menuitem = serializers.SerializerMethodField()
    class Meta:
        model = OrderItem
        fields = ["id","order","menuitem","quantity"]
        read_only_fields = [ "id", "order","menuitem"]
    def get_menuitem(self, obj):
        return Menu_itemserializer(obj.menuitem).data
class PaymentsSerializer(ModelSerializer):
    class Meta:
        model = Payments
        fields = ["id","order","amount","status"]
        read_only_fields = ["id","order","status"]

class ReviewsSerializer(ModelSerializer):
    class Meta:
        model = Reviews
        fields = ["id","order","rating"]
        read_only_fields = ["id","order"]

    