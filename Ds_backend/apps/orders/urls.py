from django.urls import path , include
from rest_framework.routers import DefaultRouter
from .views import OrderViwSet , CartOrderset ,OwnerOrderfetch ,AdminOrderfetch

router = DefaultRouter()
router.register('order',OrderViwSet , basename='createorder')
router.register('cartorder',CartOrderset , basename='cartorder')
router.register('cartorderfetch',OwnerOrderfetch ,basename= 'cartorderfetch')
router.register('Adminorderfetch',AdminOrderfetch ,basename= 'Adminorderfetch')
urlpatterns =[
    path('',include(router.urls))
]