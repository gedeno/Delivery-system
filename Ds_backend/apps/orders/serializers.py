from rest_framework.serializers import ModelSerializer
from .models import Orders,OrderItem,Payments,Reviews

class Orderserializer(ModelSerializer):
    class Meta:
        model = Orders
        fields = ["id","customer","restaurants","status","totoal_amount"]
        read_only_fields = ["id", "customer","restaurants","status"]

class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id","order","menuitem","quantity"]
        read_only_fields = [ "id", "order","menuitem"]

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

    