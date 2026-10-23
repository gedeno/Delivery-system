from django.core.management import call_command
from django.test import TestCase
from PIL import Image

from apps.accounts.models import User
from apps.orders.models import OrderItem, Orders, Payments, Reviews
from apps.restaurants.models import Cart, CartItem, Menu_item, Restaurants


class SeedDataCommandTests(TestCase):
	def test_seed_data_creates_more_than_twenty_records_per_model_with_valid_images(self):
		call_command("seed_data", verbosity=0)

		for model in (
			User,
			Restaurants,
			Menu_item,
			Cart,
			CartItem,
			Orders,
			OrderItem,
			Payments,
			Reviews,
		):
			with self.subTest(model=model.__name__):
				self.assertGreater(model.objects.count(), 20)

		for model in (Restaurants, Menu_item):
			for instance in model.objects.all():
				with self.subTest(model=model.__name__, image=instance.image.name):
					instance.image.open("rb")
					with Image.open(instance.image) as image:
						self.assertEqual(image.format, "PNG")
