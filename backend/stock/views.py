from django.shortcuts import render

# Create your views here.
import yfinance as yf
from django.http import JsonResponse


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
