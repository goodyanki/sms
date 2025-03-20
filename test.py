import yfinance as yf

index = yf.ticker(NASDQ)
data = index.history(period='1mo')

print(data)