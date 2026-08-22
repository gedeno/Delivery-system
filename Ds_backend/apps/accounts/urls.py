from django.urls import path, URLPattern , include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register( "user",views.Createuser, basename='user')
urlpatterns =[
    path('',include(router.urls))
]