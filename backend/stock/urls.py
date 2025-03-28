from django.urls import path
from .views import get_stock_info, register_user, login,add_to_watchlist,get_watchlist,get_index_trend, handle_order

urlpatterns = [
    path('stock/', get_stock_info, name='get_stock_info'),
    path('register/',register_user, name='register'),
    path('login/',login, name='login'),
    path('add/', add_to_watchlist, name='add'),
    path('watchlist/', get_watchlist, name='watchlist'),
    path('indexInfo/', get_index_trend, name='indexInfo'),
    path('handleOrder/', handle_order, name='handleOrder')
]

