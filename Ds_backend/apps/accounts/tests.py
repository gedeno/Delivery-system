from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


class UserModelTest(TestCase):

    def test_create_user(self):
        user = User.objects.create_user(
            username="gedeno",
            email="gedeno@gmail.com",
            password="password123"
        )

        self.assertEqual(user.username, "gedeno")
        self.assertEqual(user.email, "gedeno@gmail.com")
        self.assertTrue(user.check_password("password123"))
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_create_superuser(self):
        user = User.objects.create_superuser(
            username="admin",
            email="admin@gmail.com",
            password="admin123"
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_active)
        self.assertTrue(user.check_password("admin123"))


class UserAPITest(APITestCase):

    def test_create_user(self):
        data = {
            "first_name": "Gedeno",
            "last_name": "Geremew",
            "username": "gedeno",
            "email": "gedeno@gmail.com",
            "password": "password123",
        }

        response = self.client.post(
            "/users/user/",
            data,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

    def test_get_users(self):
        response = self.client.get("/users/user/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )