from decimal import Decimal

from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.orders.models import Orders, OrderItem, Payments, Reviews
from apps.restaurants.models import Cart, CartItem, Menu_item, Restaurants


class Command(BaseCommand):
    help = "Seed the database with sample delivery-system data."

    def create_image(self, filename):
        return SimpleUploadedFile(
            name=f"{filename}.png",
            content=b"fake-image-content-for-seeding",
            content_type="image/png",
        )

    def handle(self, *args, **options):
        Reviews.objects.all().delete()
        Payments.objects.all().delete()
        OrderItem.objects.all().delete()
        Orders.objects.all().delete()
        CartItem.objects.all().delete()
        Cart.objects.all().delete()
        Menu_item.objects.all().delete()
        Restaurants.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        owner_1 = User.objects.create_user(
            username="owner_saffron",
            email="owner_saffron@example.com",
            password="password123",
            first_name="Amelia",
            last_name="Kariuki",
            phone="+254712345678",
            role="owner",
            Delivery_status="available",
            is_verified=True,
        )

        owner_2 = User.objects.create_user(
            username="owner_bamboo",
            email="owner_bamboo@example.com",
            password="password123",
            first_name="Daniel",
            last_name="Njoroge",
            phone="+254733456789",
            role="owner",
            Delivery_status="available",
            is_verified=True,
        )

        customer_1 = User.objects.create_user(
            username="customer_maya",
            email="maya@example.com",
            password="password123",
            first_name="Maya",
            last_name="Wanjiru",
            phone="+254754321987",
            role="customer",
            Delivery_status="active",
            is_verified=True,
        )

        customer_2 = User.objects.create_user(
            username="customer_james",
            email="james@example.com",
            password="password123",
            first_name="James",
            last_name="Otieno",
            phone="+254766123456",
            role="customer",
            Delivery_status="active",
            is_verified=True,
        )

        delivery_1 = User.objects.create_user(
            username="delivery_brian",
            email="brian@example.com",
            password="password123",
            first_name="Brian",
            last_name="Muli",
            phone="+254700111222",
            role="delivery",
            Delivery_status="online",
            is_verified=True,
        )

        delivery_2 = User.objects.create_user(
            username="delivery_nancy",
            email="nancy@example.com",
            password="password123",
            first_name="Nancy",
            last_name="Achieng",
            phone="+254720333444",
            role="delivery",
            Delivery_status="online",
            is_verified=True,
        )

        restaurant_1 = Restaurants.objects.create(
            owner=owner_1,
            Res_name="Saffron Bowl",
            is_appruved=True,
            image=self.create_image("saffron-bowl"),
            address="Westlands, Nairobi",
            description="Fresh Indian and African fusion meals with generous portions.",
            phone="+254712345678",
            email="hello@saffronbowl.com",
            opening_time="09:00",
            closing_time="22:00",
            cuisine_type="Indian",
            map_logitude=36.8065,
            map_latiude=-1.2864,
            rating=4.7,
        )

        restaurant_2 = Restaurants.objects.create(
            owner=owner_2,
            Res_name="Bamboo Garden",
            is_appruved=True,
            image=self.create_image("bamboo-garden"),
            address="Kilimani, Nairobi",
            description="Healthy bowls, grilled chicken, and vegan-friendly options.",
            phone="+254733456789",
            email="hello@bamboogarden.com",
            opening_time="10:00",
            closing_time="21:30",
            cuisine_type="Healthy",
            map_logitude=36.7790,
            map_latiude=-1.2905,
            rating=4.5,
        )

        item_1 = Menu_item.objects.create(
            restaurant=restaurant_1,
            Item_name="Chicken Biryani",
            price=Decimal("650.00"),
            image=self.create_image("chicken-biryani"),
            description="Spiced basmati rice with marinated chicken and vegetables.",
            Category="Main",
            is_available=True,
        )

        item_2 = Menu_item.objects.create(
            restaurant=restaurant_1,
            Item_name="Beef Pilau",
            price=Decimal("590.00"),
            image=self.create_image("beef-pilau"),
            description="Well-seasoned beef pilau with crispy onions and carrots.",
            Category="Main",
            is_available=True,
        )

        item_3 = Menu_item.objects.create(
            restaurant=restaurant_2,
            Item_name="Salmon Power Bowl",
            price=Decimal("880.00"),
            image=self.create_image("salmon-power-bowl"),
            description="Grilled salmon, greens, quinoa, and avocado.",
            Category="Healthy",
            is_available=True,
        )

        item_4 = Menu_item.objects.create(
            restaurant=restaurant_2,
            Item_name="Avocado Chicken Wrap",
            price=Decimal("520.00"),
            image=self.create_image("avocado-chicken-wrap"),
            description="Crispy chicken with avocado, greens, and chili sauce.",
            Category="Wraps",
            is_available=True,
        )

        cart_1 = Cart.objects.create(user=customer_1)
        CartItem.objects.create(cart=cart_1, menu_item=item_1, quantity=2)
        CartItem.objects.create(cart=cart_1, menu_item=item_3, quantity=1)

        cart_2 = Cart.objects.create(user=customer_2)
        CartItem.objects.create(cart=cart_2, menu_item=item_4, quantity=1)

        order_1 = Orders.objects.create(
            customer=customer_1,
            delivery=delivery_1,
            restaurants=restaurant_1,
            status="paid",
            total_amount=Decimal("1290.00"),
        )
        OrderItem.objects.create(order=order_1, menuitem=item_1, quantity=2)
        OrderItem.objects.create(order=order_1, menuitem=item_2, quantity=1)
        Payments.objects.create(order=order_1, amount=Decimal("1290.00"), status="paid")
        Reviews.objects.create(order=order_1, rating=Decimal("4.8"))

        order_2 = Orders.objects.create(
            customer=customer_2,
            delivery=delivery_2,
            restaurants=restaurant_2,
            status="delivered",
            total_amount=Decimal("880.00"),
        )
        OrderItem.objects.create(order=order_2, menuitem=item_3, quantity=1)
        Payments.objects.create(order=order_2, amount=Decimal("880.00"), status="paid")
        Reviews.objects.create(order=order_2, rating=Decimal("4.5"))

        self.stdout.write(
            self.style.SUCCESS(
                "Seed data created successfully: 2 owners, 2 customers, 2 deliveries, "
                "2 restaurants, 4 menu items, 2 carts, 2 orders."
            )
        )
