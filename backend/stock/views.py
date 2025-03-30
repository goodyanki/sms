from django.shortcuts import render
from .models import OrderHistory, UserAccount, Watchlist, Watchliststock, Portfolio

# Create your views here.
import yfinance as yf
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
import uuid
import akshare as ak


#documentation: https://yfinance-python.org/index.html

def generate_order_id():
    return str(uuid.uuid4())
 
def get_stock_current_price(symbol):
    stock = yf.Ticker(symbol)
    data = stock.history(period='1d')
    return data['Close'].iloc[-1]

#def get_hk_curreent_price(symbol):
    


def get_stock_info(symbol):
    stock =  yf.Ticker(symbol)
    data = stock.history(period='5d')


    close = data['Close'].iloc[-1]  #last day close
    d1_prev_close = data['Close'].iloc[-2]  #previous day close
    daily_change = round((close - d1_prev_close) / d1_prev_close * 100, 2)

    return  {
        'name': stock.info.get('longName', 'N/A'),
        'symbol': symbol.upper(),
        'exchange': stock.info.get('exchange', 'N/A'),
        'current_price': round(close, 2),
        'daily_change': f"{daily_change}%",
    }



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


@api_view(['GET'])
def get_watchlist(request):
    user_id = request.GET.get('user_id')
    watchlist = Watchlist.objects.get(user_id=user_id)
    stocks = watchlist.stock.all()

    watchlist_stocks = []
    for stock in stocks:
        stock_info = get_stock_info(stock.symbol)
        watchlist_stocks.append(stock_info)
    return JsonResponse({'watchlist': watchlist_stocks})


@api_view(['GET'])
def get_index_trend(request):
    symbol = request.GET.get('symbol')
    index = yf.Ticker(symbol)
    data = index.history(period='1mo')
    close_price = data['Close'].tolist()
    userid = request.GET.get('user_id')
    #get current assets by user id

    #current_assets = UserAccount.objects.get(user_id=userid)
    #print(current_assets)

    return JsonResponse(
        {'close_price': close_price}
            )

    
@api_view(['POST'])
def handle_order(request):
    symbol = request.data.get('symbol')
    user_id = request.data.get('user_id') 
    order_type = request.data.get('order_type')
    quantity = request.data.get('quantity')
    price = request.data.get('price')
    order_side = request.data.get('order_side')


    order_id = generate_order_id()
    current_price = get_stock_current_price(symbol)

    if order_type == "Market":
        final_price = current_price
    else:
        final_price = price

    total_price = final_price * quantity
    
        
    OrderHistory.objects.create(
        user_id=user_id,
        symbol=symbol,
        quantity=quantity,
        price=final_price,
        order_type=order_type,
        order_id=order_id,
        order_side=order_side
    )

    user = UserAccount.objects.get(user_id=user_id)
    user.balance -= total_price
    print(f"After: {user.balance}")

    user.save()
    portfolio = Portfolio.objects.filter(user_id=user_id, symbol=symbol).first()

    if portfolio is None:
        if order_side == "BUY":
            Portfolio.objects.create(
                user_id=user_id,
                symbol=symbol,
                quantity=quantity,
                buy_price=final_price,
                avg_price=final_price,
            )
            print("111")
    else:
        if order_side == "BUY":
            total_quantity = portfolio.quantity + quantity
            
            total_cost = portfolio.quantity * portfolio.avg_price + quantity * final_price
            portfolio.avg_price = total_cost / total_quantity
            portfolio.quantity = total_quantity
            portfolio.save()
        elif order_side == "SELL":
            portfolio.quantity -= quantity
            if portfolio.quantity <= 0:
                portfolio.delete()  
            else:
                portfolio.save()

    



    return JsonResponse({ 
        'message': 'Order placed successfully'
    })

    #need to solve the issue of database id increment by checking the existing data number


'''
@api_view(['POST'])
def get_balance(request):
    user_id = request.data.get('user_id')
    user = UserAccount.objects.get(user_id=user_id)
    return JsonResponse({'balance': user.balance})
'''

@api_view(['POST'])
def get_balance(request):
    user_id = request.data.get('user_id')
    user = UserAccount.objects.get(user_id=user_id)
    return JsonResponse({'balance': user.balance})


@api_view(['POST'])
def get_marketValue(request):
    user_id = request.data.get('user_id')
    
    positions = Portfolio.objects.filter(user_id=user_id)
    total_value = 0
    for position in positions:

        current_price = get_stock_current_price(position.symbol)
        total_value += position.quantity * current_price

    marketValue = round(total_value, 2)

    return JsonResponse({'marketValue': marketValue})


@api_view(['POST'])
def get_unrealizedPL(request):
    user_id = request.data.get('user_id')
    positions = Portfolio.objects.filter(user_id=user_id)
    total_value = 0
    result = 0
    buy_total = 0
    for position in positions:

        current_price = get_stock_current_price(position.symbol)
        
        total_value += position.quantity * current_price
        buy_total += position.quantity * position.avg_price

    result = round(buy_total - total_value,2)

    print("buy_total:", buy_total)
    print("total_value:", total_value)
    return JsonResponse({'unrealizedPL': result})


@api_view(['POST'])
def get_NLV(request):
    user_id = request.data.get('user_id')
    positions = OrderHistory.objects.filter(user_id=user_id)
    user_account = UserAccount.objects.get(user_id=user_id)
    balance = user_account.balance

    nlv = 0
    marketValue = 0
    for position in positions:
        current_price = get_stock_current_price(position.symbol)
        marketValue += position.quantity * current_price

    nlv = round(balance + marketValue, 2)
    print(nlv)

    return JsonResponse({'nlv': nlv})



@api_view(['GET'])
def get_portfolio_info(request):
    user_id = request.GET.get('user_id')
    positions = Portfolio.objects.filter(user_id=user_id)

    portfolio_info = []
    for position in positions:
        info = get_stock_info(position.symbol)
        portfolio_info.append(info)

    return JsonResponse({'portfolio': portfolio_info})

