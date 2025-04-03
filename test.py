import akshare as ak

def get_hk_stock_current_price(symbol):
    
    df = ak.stock_hk_spot()

    stock_row = df[df["symbol"] == symbol]

    if stock_row.empty:
        return None

    return float(stock_row.iloc[0]["lasttrade"])


price = get_hk_stock_current_price("0700.HK")  # 腾讯控股
if price:
    print(f"当前价格: {price} HKD")
else:
    print("找不到该股票")
