from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('restaurant' , views.CreateRestaurant , basename='restaurant')
router.register('menu', views.CreateMenu, basename='menu')
router.register('cart',views.CreateCart,basename='cart')

urlpatterns = [
    path('', include(router.urls)),
   
]