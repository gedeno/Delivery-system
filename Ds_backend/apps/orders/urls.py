from django.urls import path , include
from rest_framework.routers import DefaultRouter
from .views import OrderViwSet , CartOrderset

router = DefaultRouter()
router.register('order',OrderViwSet , basename='createorder')
router.register('cartorder',CartOrderset , basename='cartorder')
urlpatterns =[
    path('',include(router.urls))
]