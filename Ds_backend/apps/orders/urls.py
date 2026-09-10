from django.urls import path , include
from rest_framework.routers import DefaultRouter
from .views import OrderViwSet

router = DefaultRouter()
router.register('order',OrderViwSet , basename='createorder')

urlpatterns =[
    path('',include(router.urls))
]