from django.urls import path
from .views import get_stock_info, register_user
from django.contrib import admin

urlpatterns = [
    path('stock/', get_stock_info, name='get_stock_info'),
    path('api/register/',register_user, name='register'),
]

