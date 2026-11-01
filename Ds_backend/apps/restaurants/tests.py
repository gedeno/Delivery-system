from io import BytesIO
import tempfile

from django.test import TestCase, override_settings
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from PIL import Image

from apps.accounts.models import User

from .models import Menu_item, Restaurants
from .serializer import Menu_itemserializer, Restaurantserializer


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
        self.media_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.media_dir.cleanup)
        media_settings = override_settings(MEDIA_ROOT=self.media_dir.name)
        media_settings.enable()
        self.addCleanup(media_settings.disable)
        self.user = User.objects.create_user( username="gedeno", email="gedeno@gmail.com", password="password123")
        self.client.force_authenticate(user=self.user)
        self.restaurant = self.create_restaurant("Gedeno Restaurant", self.user)

    def create_restaurant(self, name, owner):
        return Restaurants.objects.create(
            owner=owner,
            Res_name=name,
            image="",
            address="Address",
            description="Description",
            phone="1234567890",
            email="restaurant@example.com",
            opening_time="09:00",
            closing_time="21:00",
            cuisine_type="Local",
            map_logitude=0,
            map_latiude=0,
        )

    def create_menu_item(self, restaurant):
        return Menu_item.objects.create(
            restaurant=restaurant,
            Item_name="Pizza",
            price="200.00",
            image="",
            description="Cheese pizza",
            Category="Dinner",
        )

    def test_create_menu(self):
        image_buffer = BytesIO()
        Image.new("RGB", (1, 1)).save(image_buffer, format="PNG")
        data = {
            "Item_name": "Pizza",
            "price": "200.00",
            "image": SimpleUploadedFile(
                "pizza.png",
                image_buffer.getvalue(),
                content_type="image/png",
            ),
            "description": "Cheese pizza",
            "Category": "Dinner",
        }
        url = f"{reverse('menu-list')}?restaurant_id={self.restaurant.id}"
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

        self.assertEqual(Menu_item.objects.count(), 1)

    def test_delete_menu_item(self):
        menu_item = self.create_menu_item(self.restaurant)
        url = f"{reverse('menu-detail', kwargs={'pk': menu_item.id})}?restaurant_id={self.restaurant.id}"

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Menu item deleted successfully"})
        self.assertFalse(Menu_item.objects.filter(id=menu_item.id).exists())

    def test_delete_menu_item_from_another_restaurant_returns_not_found(self):
        other_user = User.objects.create_user(
            username="other-owner",
            email="other@example.com",
            password="password123",
        )
        other_restaurant = self.create_restaurant("Other Restaurant", other_user)
        menu_item = self.create_menu_item(other_restaurant)
        url = f"{reverse('menu-detail', kwargs={'pk': menu_item.id})}?restaurant_id={self.restaurant.id}"

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Menu_item.objects.filter(id=menu_item.id).exists())