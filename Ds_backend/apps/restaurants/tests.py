from django.test import TestCase

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from apps.accounts.models import User
from .models import Restaurants, Menu_item
from .serializer import Restaurantserializer, Menu_itemserializer


class RestaurantSerializerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user( username="gedeno", email="gedeno@gmail.com",password="password123")
    def test_restaurant_serializer(self):
        data = {   "Res_name": "Gedeno Restaurant"}
        serializer = Restaurantserializer(data=data)
        self.assertTrue(serializer.is_valid())


class MenuSerializerTest(TestCase):

    def test_menu_serializer(self):
        data = {"Item_name": "Pizza","price": "200.00"}
        serializer = Menu_itemserializer(data=data)
        self.assertTrue(serializer.is_valid())


class RestaurantMenuAPITest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user( username="gedeno", email="gedeno@gmail.com", password="password123")
        self.client.force_authenticate(user=self.user)
        self.restaurant = Restaurants.objects.create(owner=self.user,Res_name="Gedeno Restaurant")
    def test_create_menu(self):
        data = {"Item_name": "Pizza","price": "200.00"}
        url = reverse("create-menu",kwargs={"pk": self.restaurant.id})
        response = self.client.post(url,data,format="json")
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(Menu_item.objects.count(), 1)