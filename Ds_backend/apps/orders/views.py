from django.shortcuts import render
from rest_framework.response import Response
from .models import Orders,OrderItem,Payments,Reviews
from .serializers import OrderItemSerializer , Orderserializer , PaymentsSerializer , Reviews
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet 
from apps.restaurants.models import Restaurants
from apps.accounts.models import User
from django.db import transaction
from rest_framework.permissions import AllowAny,IsAuthenticated

# Create your views here.

class OrderViwSet(ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = Orderserializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        restaurant = self.request.query_params.get('restaurant_id')
        menuitem = self.request.query_params.get('menu_id')
        quantity = self.request.data.get("quantity")
        deliver_person = User.objects.filter(role = "delivery").first()
        with transaction.atomic():
            Create_order = serializer.save(
                customer= self.request.user ,
                restaurants_id = restaurant ,
                delivery = deliver_person )
            OrderItem.objects.create(
                order = Create_order ,
                menuitem_id = menuitem,
                quantity = quantity
            )
            Payments.objects.create(
                order = Create_order,
                amount=Create_order.total_amount
            )

class OtherOrderset(ModelViewSet):
    queryset = Orders.objects.all()