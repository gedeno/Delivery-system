from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('restaurant' , views.CreateRestaurant , basename='restaurant')
router.register('restaurant_owners' , views.Restaurants_ower_fetch , basename='restaurant_owners')
router.register('restaurant_fetch',views.FetchRestaurant , basename='restaurant_fetch')
router.register('menu', views.CreateMenu, basename='menu')
router.register('fetchmenu',views.FetchMenu , basename="fetchmenu")
router.register('cart',views.CartViewSet,basename='cart')
router.register("cart-item", views.CartItemViewSet, basename="cart-item")

urlpatterns = [
    path('', include(router.urls)),
    path("cart-items/", views.CartViewSet.as_view({"get":"list"}))
]