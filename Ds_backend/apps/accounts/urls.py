from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register( "user",views.Createuser, basename='user')
router.register( "userfetch",views.AllUserFetch, basename='userfetch')
urlpatterns =[
    path('',include(router.urls))
]