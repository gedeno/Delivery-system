from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('restaurant' , views.CreateRestaurant , basename='restaurant')
router.register('menu', views.CreateMenu, basename='menu')
router.register('cart',views.CartViewSet,basename='cart')
router.register("cart-item", views.CartItemViewSet, basename="cart-item")

urlpatterns = [
    path('', include(router.urls)),
   
]