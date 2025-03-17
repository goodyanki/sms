from django.shortcuts import render
from .models import Watchlist, Watchliststock

# Create your views here.
import yfinance as yf
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view


#documentation: https://yfinance-python.org/index.html


def get_stock_info(request):
    symbol = request.GET.get('symbol', 'NVDA')
    stock = yf.Ticker(symbol)
    data = stock.history(period='5d')

    close = data['Close'].iloc[-1]  #last day close
    d1_prev_close = data['Close'].iloc[-2]  #previous day close

    daily_change = round((close - d1_prev_close) / d1_prev_close * 100, 2)

    stockInfo = {
        'name': stock.info.get('longName', 'N/A'),
        'symbol': symbol.upper(),
        'exchange': stock.info.get('exchange', 'N/A'),
        'price': round(close, 2),
        'daily_change': f"{daily_change}%",
    }

    return JsonResponse(stockInfo)


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'User already exits'})
    elif User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Username already exits'})
    else:
        User.objects.create_user(username=username, password=password, email=email)
        return JsonResponse({'message': 'User created successfully'})


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        if user.check_password(password):
            return JsonResponse(
                {'message': 'Login successful','username': user.username, 'email': user.email, 'isLogin': "11", 'user_id':user.id},
            )
        else:
            return JsonResponse({'error': 'Invalid credentials'})


@api_view(['POST'])
def add_to_watchlist(request):
    symbol = request.data.get('symbol')
    user_id = request.data.get('user_id')

    watchlist, watchlist_created = Watchlist.objects.get_or_create(user_id=user_id)
    stock, symbol_created  = Watchliststock.objects.get_or_create(watchlist = watchlist, symbol = symbol)

    if not symbol_created:
        return JsonResponse({"result": "Stock already exist"})
    
    return JsonResponse({
        "result": "Stock added successfully",
    })    

    

