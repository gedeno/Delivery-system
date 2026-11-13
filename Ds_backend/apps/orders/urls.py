from django.urls import path , include
from rest_framework.routers import DefaultRouter
from .views import AdminOrderfetch, DeliveryOrderfetch, OrderViwSet , CartOrderset ,OwnerOrderfetch 

router = DefaultRouter()
router.register('order',OrderViwSet , basename='createorder')
router.register('cartorder',CartOrderset , basename='cartorder') 
router.register('cartorderfetch',OwnerOrderfetch ,basename= 'cartorderfetch') ,
router.register('deliveryorderfetch',DeliveryOrderfetch ,basename= 'deliveryorderfetch') ,
router.register('adminorder',AdminOrderfetch , basename='adminorder') 

urlpatterns =[
    path('',include(router.urls))
]