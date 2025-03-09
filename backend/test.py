import yfinance as yf
import json

symbol = "AAPL"
stock = yf.Ticker(symbol)
data = stock.history(period="5d")

# 获取相关信息
if not data.empty:
    close = data['Close'].iloc[-1]
    prev_close = data['Close'].iloc[-2] if len(data) > 1 else close
    daily_change = round((close - prev_close) / prev_close * 100, 2) if prev_close else 0

    stock_info = {
        "name": stock.info.get("longName", "N/A"),
        "symbol": symbol.upper(),
        "exchange": stock.info.get("exchange", "N/A"),
        "price": round(close, 2),
        "prev_close":round(prev_close, 2),
        "daily_change": f"{daily_change}%"
    }

    print(json.dumps(stock_info, indent=4))
else:
    print("Stock data not available.")
