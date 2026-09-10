from django.shortcuts import render
from rest_framework.response import Response
from .models import Orders,OrderItem,Payments,Reviews
from .serializers import OrderItemSerializer , Orderserializer , PaymentsSerializer , Reviews
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet 
from apps.restaurants.models import Restaurants
from apps.accounts.models import User
from django.db import transaction

# Create your views here.

class OrderViwSet(ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = Orderserializer

    def perform_create(self, serializer):
        restaurant_id = self.request.query_params.get('restaurant_id')
        menuitem_id = self.request.query_params.get('menu_id')
        deliver_person = User.objects.filter(role = "Delivery Person").first()
        with transaction.atomic():
            Create_order = serializer.save(
                customer= self.request.user ,
                restaurants = restaurant_id ,
                delivery = deliver_person )
            OrderItem.objects.create(
                order = Create_order ,
                menuitem = menuitem_id,
            )
            Payments.objects.create(
                order = Create_order
            )