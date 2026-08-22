from rest_framework.routers import DefaultRouter
from . import views
from django.urls import path , include
router = DefaultRouter()
router.register('restaurant' , views.CreateRestaurant , basename='restaurant')
router.register('menu', views.CreateMenu , basename='menu')

urlpatterns = [
    path('', include(router.urls))
]