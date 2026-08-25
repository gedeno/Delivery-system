from django.urls import path , include
from rest_framework.routers import DefaultRouter
from .views import OrderViwSet,OrdermenuViewSet,PymentViewSet

router = DefaultRouter()
router.register('orders',OrderViwSet , basename='createorder')
router.register('ordermenu',OrdermenuViewSet, basename='ordermenu')
router.register('payment',PymentViewSet, basename='pyment')
urlpatterns =[
    path('',include(router.urls))
]