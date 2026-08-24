from django.shortcuts import render
from .models import Orders,OrderItem,Payments,Reviews
from .serializers import OrderItemSerializer , Orderserializer , PaymentsSerializer , Reviews
from rest_framework.viewsets import ModelViewSet 
from apps.restaurants.models import Restaurants
from apps.accounts.models import User


# Create your views here.

class OrderViwSet(ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = Orderserializer
    def get_object(self):
        return Restaurants.objects.get(id = self.kwargs['restaurants_id'])
    #def user(self):
        #deliver = User.objects.get(id = self.query_params.get("delivery"))


    def perform_create(self, serializer):
        serializer.save(customer = self.request.user,restaurants = self.get_object)
        return super().perform_create(serializer)
    #..../?delivery=id&resturant=id

class OrdermenuViewSet(ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    def get_object(self):
            return Restaurants.objects.get(id = self.kwargs['restaurants_id'])
    
    def perform_create(self, serializer):
         serializer.save(restaurants = self.get_object)
         return super().perform_create(serializer)

class PymentViewSet(ModelViewSet):
     queryset = Payments.objects.all()
     serializer_class = PaymentsSerializer
     def get_object(self):
        return Restaurants.objects.get(id = self.kwargs['restaurants_id'])
        
     def perform_create(self, serializer):
        serializer.save(restaurants = self.get_object)
        return super().perform_create(serializer)
