from django.db import models
from apps.accounts.models import User
from apps.restaurants.models import Restaurants , Menu_item
# Create your models here.

class Orders(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    delivery = models.ForeignKey(User,on_delete=models.CASCADE ,default=1)
    restaurants = models.ForeignKey(User, on_delete=models.CASCADE )
    status = models.CharField(max_length=200)
    totoal_amount =  models.DecimalField(max_digits=5)
    def __str__(self):
        return self.status

class OrderItem(models.Model):
    order = models.ForeignKey(Orders,on_delete=models.CASCADE)
    menuitem = models.ForeignKey(Menu_item, on_delete=models.CASCADE)
    quantity = models.IntegerField()

class Payments(models.Model):
    order = models.ForeignKey(Orders,on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=5)
    status = models.CharField(max_length=3000)

class Reviews(models.Model):
     order = models.ForeignKey(Orders,on_delete=models.CASCADE)
     rating = models.DecimalField()
