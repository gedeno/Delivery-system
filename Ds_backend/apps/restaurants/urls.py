from rest_framework.routers import DefaultRouter
from . import views
from django.urls import path , include
router = DefaultRouter()
router.register('restaurant' , views.CreateRestaurant , basename='restaurant')

urlpatterns = [
    path('', include(router.urls)),
    path("menu/<int:pk>",views.CreateMenu.as_view({"post": "create"}),name="create-menu")
]