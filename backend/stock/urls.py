from django.urls import path
from .views import get_stock_info, register_user, login,add_to_watchlist,get_watchlist,get_index_trend, handle_order,get_balance,get_marketValue,get_unrealizedPL,get_NLV,get_portfolio_info,get_alert_price

urlpatterns = [
    path('stock/', get_stock_info, name='get_stock_info'),
    path('register/',register_user, name='register'),
    path('login/',login, name='login'),
    path('add/', add_to_watchlist, name='add'),
    path('watchlist/', get_watchlist, name='watchlist'),
    path('indexInfo/', get_index_trend, name='indexInfo'),
    path('handleOrder/', handle_order, name='handleOrder'),
    path('getBalance/', get_balance, name='getBalance'),
    path('getmarketValue/', get_marketValue, name='getmarketValue'),
    path('geturpl/', get_unrealizedPL, name='getunrealizedPL'),
    path('getnlv/', get_NLV, name='getnlv'),
    path('getportfolio/',get_portfolio_info,name='get_portfolio_info'),
    path('addPriceAlert', get_alert_price, name='get_alert_price')
]


