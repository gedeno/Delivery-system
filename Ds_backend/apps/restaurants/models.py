from django.db import models
from apps.accounts.models import User
# Create your models here.
class Restaurants(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE )
    Res_name = models.CharField(max_length=200, unique=True)
    is_appruved = models.BooleanField(default=False)
    def __str__(self):
        return self.R_name
    
class Menu_item(models.Model):
    restaurant = models.ForeignKey(Restaurants , on_delete=models.CASCADE)
    Item_name = models.CharField(max_length=200)
    price = models.DecimalField()
    def __str__(self):
        return self.Item_name