from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('restaurant' , views.CreateRestaurant , basename='restaurant')
router.register('menu', views.CreateMenu, basename='menu')

urlpatterns = [
    path('', include(router.urls)),
    path("menu/<int:pk>",views.CreateMenu.as_view({"post": "create"}),name="create-menu")
]