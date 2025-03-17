from django.urls import path
from .views import get_stock_info, register_user, login,add_to_watchlist
from django.contrib import admin

urlpatterns = [
    path('stock/', get_stock_info, name='get_stock_info'),
    path('register/',register_user, name='register'),
    path('login/',login, name='login'),
    path('add/', add_to_watchlist, name='add')
]

