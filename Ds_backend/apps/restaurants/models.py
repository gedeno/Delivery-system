from django.db import models

from apps.accounts.models import User


# Create your models here.
class Restaurants(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE )
    Res_name = models.CharField(max_length=200, unique=True)
    is_appruved = models.BooleanField(default=False)
    image = models.ImageField(upload_to='photo')
    address = models.CharField(max_length=200)
    description = models.CharField(max_length=300)
    phonen= models.CharField(max_length=300)
    email = models.CharField(max_length=300)
    opening_time = models.CharField(max_length=10)
    closing_time = models.CharField(max_length=100)
    cuisine_type = models.CharField(max_length=200)

    def __str__(self):
        return self.Res_name
    
class Menu_item(models.Model):
    restaurant = models.ForeignKey(Restaurants , on_delete=models.CASCADE)
    Item_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to='photo')
    description = models.CharField(max_length=200)
    Category = models.CharField(max_length=200)
    def __str__(self):
        return self.Item_name
    
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    menu_item  = models.ForeignKey(Menu_item, on_delete=models.CASCADE, unique=True)
    quantity = models.IntegerField(default=1)