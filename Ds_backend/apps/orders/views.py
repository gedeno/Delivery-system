from django.shortcuts import render
from rest_framework.response import Response
from .models import Orders,OrderItem,Payments,Reviews
from .serializers import OrderItemSerializer , Orderserializer , PaymentsSerializer , Reviews
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet 
from apps.restaurants.models import CartItem, Restaurants
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

class CartOrderset(ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = Orderserializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        restaurant = self.request.query_params.get('restaurant_id')
        deliver_person = User.objects.filter(role = "delivery").first()
        items = CartItem.objects.filter(cart__user=self.request.user).filter(menu_item__restaurant__id=restaurant)
        with transaction.atomic():
            Create_order = serializer.save(
                customer= self.request.user ,
                restaurants_id = restaurant ,
                delivery = deliver_person ,
                total_amount = self.calculate_total_amount(items=items))
            for item in items:
                OrderItem.objects.create(
                    order = Create_order ,
                    menuitem_id = item.menu_item.restaurant.id,
                    quantity = item.quantity
                )
            Payments.objects.create(
                order = Create_order,
                amount=Create_order.total_amount
            )
    def calculate_total_amount(self,items):
        total = 0 
        for item in items:
            total+=item.menu_item.price*item.quantity
        return total
