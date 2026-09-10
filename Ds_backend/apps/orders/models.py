from django.db import models
from apps.accounts.models import User
from apps.restaurants.models import Restaurants , Menu_item
# Create your models here.

class Orders(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE , related_name='customers')
    delivery = models.ForeignKey(User,on_delete=models.CASCADE ,default=1 , related_name='delivery')
    restaurants = models.ForeignKey(Restaurants, on_delete=models.CASCADE )
    status = models.CharField(max_length=200 , default="ordering")
    totoal_amount =  models.DecimalField(max_digits=5 , decimal_places=2)
    def __str__(self):
        return self.status

class OrderItem(models.Model):
    order = models.ForeignKey(Orders,on_delete=models.CASCADE)
    menuitem = models.ForeignKey(Menu_item, on_delete=models.CASCADE)
    quantity = models.IntegerField()

class Payments(models.Model):
    order = models.ForeignKey(Orders,on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=5 , decimal_places=2)
    status = models.CharField(max_length=3000 , default="ordering")

class Reviews(models.Model):
     order = models.ForeignKey(Orders,on_delete=models.CASCADE)
     rating = models.DecimalField(max_digits=2,decimal_places=1)
