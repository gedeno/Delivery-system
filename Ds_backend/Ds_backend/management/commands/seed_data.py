from decimal import Decimal
from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.core.files.storage import default_storage
from django.contrib.auth.hashers import make_password
from PIL import Image, ImageDraw

from apps.accounts.models import User
from apps.orders.models import OrderItem, Orders, Payments, Reviews
from apps.restaurants.models import Cart, CartItem, Menu_item, Restaurants


class Command(BaseCommand):
    help = "Replace the database contents with sample delivery-system data."
    sample_count = 21

    def create_image(self, filename):
        image = Image.new("RGB", (160, 120), (226, 113, 76))
        draw = ImageDraw.Draw(image)
        draw.rectangle((12, 12, 148, 108), fill=(243, 190, 105))
        draw.ellipse((38, 29, 122, 101), fill=(82, 132, 91))
        draw.ellipse((62, 43, 112, 91), fill=(202, 76, 55))
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        return SimpleUploadedFile(
            name=f"{filename}.png",
            content=buffer.getvalue(),
            content_type="image/png",
        )

    def clear_generated_images(self):
        directories, filenames = default_storage.listdir("photo")
        for filename in filenames:
            if filename.startswith(("sample-dish-", "sample-restaurant-")):
                default_storage.delete(f"photo/{filename}")

    @transaction.atomic
    def handle(self, *args, **options):
        self.clear_generated_images()
        Reviews.objects.all().delete()
        Payments.objects.all().delete()
        OrderItem.objects.all().delete()
        Orders.objects.all().delete()
        CartItem.objects.all().delete()
        Cart.objects.all().delete()
        Menu_item.objects.all().delete()
        Restaurants.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        owners = []
        customers = []
        delivery_users = []
        for index in range(1, self.sample_count + 1):
            owners.append(
                User.objects.create_user(
                    username=f"sample_owner_{index:02}",
                    email=f"owner{index:02}@example.com",
                    password=None,
                    first_name=f"Owner{index}",
                    last_name="Sample",
                    phone=f"+254700{index:06}",
                    role="owner",
                    Delivery_status="available",
                    is_verified=True,
                )
            )
            customers.append(
                User.objects.create_user(
                    username=f"sample_customer_{index:02}",
                    email=f"customer{index:02}@example.com",
                    password=None,
                    first_name=f"Customer{index}",
                    last_name="Sample",
                    phone=f"+254710{index:06}",
                    role="customer",
                    Delivery_status="active",
                    is_verified=True,
                )
            )
            delivery_users.append(
                User.objects.create_user(
                    username=f"sample_delivery_{index:02}",
                    email=f"delivery{index:02}@example.com",
                    password=None,
                    first_name=f"Delivery{index}",
                    last_name="Sample",
                    phone=f"+254720{index:06}",
                    role="delivery",
                    Delivery_status="online",
                    is_verified=True,
                )
            )

        User.objects.filter(is_superuser=False).update(
            password=make_password("password123")
        )

        restaurants = [
            Restaurants.objects.create(
                owner=owners[index - 1],
                Res_name=f"Sample Restaurant {index:02}",
                is_appruved=True,
                image=self.create_image(f"sample-restaurant-{index:02}"),
                address=f"{index} Sample Street, Nairobi",
                description=f"Freshly prepared sample meals from restaurant {index}.",
                phone=f"+254700{index:06}",
                email=f"restaurant{index:02}@example.com",
                opening_time="09:00",
                closing_time="22:00",
                cuisine_type=("African", "Indian", "Healthy")[index % 3],
                map_logitude=36.8065 + index / 10000,
                map_latiude=-1.2864 - index / 10000,
                rating=4.0 + (index % 10) / 10,
            )
            for index in range(1, self.sample_count + 1)
        ]

        menu_items = [
            Menu_item.objects.create(
                restaurant=restaurants[index - 1],
                Item_name=f"Sample Dish {index:02}",
                price=Decimal("350.00") + Decimal(index * 25),
                image=self.create_image(f"sample-dish-{index:02}"),
                description=f"A freshly prepared sample menu item number {index}.",
                Category=("Main", "Healthy", "Wraps")[index % 3],
                is_available=True,
            )
            for index in range(1, self.sample_count + 1)
        ]

        for index in range(self.sample_count):
            cart = Cart.objects.create(user=customers[index])
            CartItem.objects.create(
                cart=cart,
                menu_item=menu_items[index],
                quantity=(index % 3) + 1,
            )

            amount = menu_items[index].price * (index % 3 + 1)
            order = Orders.objects.create(
                customer=customers[index],
                delivery=delivery_users[index],
                restaurants=restaurants[index],
                status=("paid", "delivered", "pending")[index % 3],
                total_amount=amount,
                delivery_address=f"{index + 1} Sample Road, Nairobi",
            )
            OrderItem.objects.create(
                order=order,
                menuitem=menu_items[index],
                quantity=(index % 3) + 1,
            )
            Payments.objects.create(
                order=order,
                amount=amount,
                status="paid",
            )
            Reviews.objects.create(
                order=order,
                rating=Decimal("4.0") + Decimal(index % 10) / Decimal("10"),
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Seed data created: 21 restaurants, 21 menu items, 21 carts, "
                "21 cart items, 21 orders, 21 order items, 21 payments, "
                "21 reviews, and 63 users."
            )
        )