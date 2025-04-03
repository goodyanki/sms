from django.shortcuts import render
from .models import Alert, OrderHistory, UserAccount, Watchlist, Watchliststock, Portfolio, PriceAlert

# Create your views here.
import yfinance as yf
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
import uuid
import time
from django.core.mail import send_mail
import requests
from bs4 import BeautifulSoup

#finviz ref: https://xang1234.github.io/scrapingfinviz/
#finviz ref2: https://stackoverflow.com/questions/65144816/beautifulsoup-finviz

#documentation: https://yfinance-python.org/index.html

def generate_order_id():
    return str(uuid.uuid4())


def check_if_symbol_legal(symnol):
    pass

def get_stock_current_price(symbol):
    stock = yf.Ticker(symbol)
    data = stock.history(period='1d')
    return data['Close'].iloc[-1]



@api_view(['GET'])
def get_top3_gainers(request):
    url = "https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved"
    params = {
        'scrIds': 'day_gainers',
        'count': 25
    }
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }

    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    result = []

    if 'quotes' in data['finance']['result'][0]:
        quotes = data['finance']['result'][0]['quotes']
        sorted_quotes = sorted(quotes, key=lambda x: x.get('regularMarketChangePercent', 0.0), reverse=True)
        top5 = sorted_quotes[:3]

        for stock in top5:
            result.append({
                'symbol': stock.get('symbol', 'N/A'),
                'short_name': stock.get('shortName', 'N/A'),
                'change_percent': round(stock.get('regularMarketChangePercent', 0.0), 2)
            })


    return JsonResponse({'stock': result})

    
@api_view(['GET'])
def get_weekly_trend(request):
    
    url = "https://finviz.com/screener.ashx?v=111&s=ta_topgainers&f=sh_avgvol_o100,sh_price_o5,ta_gain_week_up"
    headers = {"User-Agent": "Mozilla/5.0"}

    soup = BeautifulSoup(requests.get(url, headers=headers).text, 'html.parser')
    rows = soup.select("tr[valign=top]") 
    result = []
    for row in rows:
        cols = row.find_all("td")
        if cols and len(cols) > 10:
            ticker = cols[1].text.strip()
            name = cols[2].text.strip()
            country = cols[5].text.strip()

        
            gain_week_str = cols[-2].text.strip()
            if country == "USA":
                gain_week = float(gain_week_str.strip('%'))
                result.append({
                    "symbol": ticker,
                    "short_name": name,
                    "change_percent": gain_week 
                })

    return JsonResponse({'stock': result})

        


def get_stock_info(symbol):
    stock = yf.Ticker(symbol)
    data = stock.history(period='5d')

    close = data['Close'].iloc[-1]  #last day close
    d1_prev_close = data['Close'].iloc[-2]  #previous day close
    daily_change = round((close - d1_prev_close) / d1_prev_close * 100, 2)

    return {
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
                {'message': 'Login successful', 'username': user.username, 'email': user.email, 'isLogin': "11",
                 'user_id': user.id},
            )
        else:
            return JsonResponse({'error': 'Invalid credentials'})


@api_view(['POST'])
def add_to_watchlist(request):
    symbol = request.data.get('symbol')
    user_id = request.data.get('user_id')

    watchlist, watchlist_created = Watchlist.objects.get_or_create(user_id=user_id)
    stock, symbol_created = Watchliststock.objects.get_or_create(watchlist=watchlist, symbol=symbol)

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
    stop_loss = request.data.get('stop_loss')
    take_profit = request.data.get('take_profit')

    if stop_loss is not None:
        stop_loss = float(stop_loss)
    if take_profit is not None:
        take_profit = float(take_profit)

    order_id = generate_order_id()
    current_price = get_stock_current_price(symbol)

    if order_type == "Market":
        final_price = current_price
        is_triggered = True
    else:
        final_price = price
        is_triggered = False

    total_price = final_price * quantity

    OrderHistory.objects.create(
        user_id=user_id,
        symbol=symbol,
        quantity=quantity,
        price=final_price,
        order_type=order_type,
        order_id=order_id,
        order_side=order_side,
        stop_loss=stop_loss,
        take_profit=take_profit,
        is_triggered=is_triggered
    )

    if is_triggered:
        user = UserAccount.objects.get(user_id=user_id)
        user.balance -= total_price

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

    result = round(buy_total - total_value, 2)

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


@api_view(['POST'])
def get_alert_price(request):
    user_id = request.data.get('user_id')
    symbol = request.data.get('symbol')
    price = request.data.get('price')
    user = User.objects.get(id=user_id)
    is_long = request.data.get('alert_type')
    print(is_long)
    if is_long == 'long':
        is_long = True
    else:
        is_long = False
    print(is_long)

    PriceAlert.objects.create(
        user=user,
        symbol=symbol,
        price=price,
        direction = is_long

    )
    return JsonResponse({"message": "Alert created successfully."})


@api_view(['POST'])
def handle_limit_and_alert(request):
    orders = OrderHistory.objects.filter(order_type="LIMIT", is_triggered=False)
    for order in orders:
        try:
            current_price = get_stock_current_price(order.symbol)
        except:
            continue

        if (
                (order.order_side == "BUY" and current_price <= order.price) or
                (order.order_side == "SELL" and current_price >= order.price) or
                (order.stop_loss and order.order_side == "BUY" and current_price <= order.stop_loss) or
                (order.take_profit and order.order_side == "BUY" and current_price >= order.take_profit)
        ):
            execute_order(order, current_price)

    #handle price alert
    alerts = PriceAlert.objects.filter(is_triggered=False)
    for alert in alerts:
        try:
            alert_current_price = get_stock_current_price(alert.symbol)
        except:
            continue
        if(
            alert.direction == True and alert_current_price >= alert.price or

            alert.direction == False and alert_current_price <= alert.price
        ):
            do_alert(alert);
        
        




def execute_order(order, price):
    order.is_triggered = True
    order.save()

    portfolio, created = Portfolio.objects.get_or_create(
        user=order.user,
        symbol=order.symbol,
        defaults={'quantity': 0}
    )

    if order.order_side == 'BUY':
        portfolio.quantity += order.quantity
    elif order.order_side == 'SELL':
        portfolio.quantity -= order.quantity
    

    portfolio.save()


def do_alert(alert):
    current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
    current_price = get_stock_current_price(alert.symbol)
    Alert.objects.create(
        user=alert.user,
        symbol=alert.symbol,
        price=current_price,
        time=current_time
    )


    send_mail(
        subject=f'Alert Triggered for {alert.symbol}',
        message=f'Hi, your alert for {alert.symbol} was triggered at {current_price}',
        from_email=None,
        recipient_list=[alert.user.email],  
)   



    



@api_view(['GET'])
def getAlertTable(request):
    user_id = request.GET.get('user_id')
    print(user_id)
    alerts = Alert.objects.filter(user_id=user_id)


    alert_data = []
    for alert in alerts:
        stock = yf.Ticker(alert.symbol)

        alert_data.append({
            'name': stock.info.get('longName', 'N/A'),
            'symbol': alert.symbol,
            'time':alert.time,
            'price':get_stock_current_price(alert.symbol)
        })
    print(alert_data)
    return JsonResponse({'alerts': alert_data})
