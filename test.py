import akshare as ak

def get_hk_stock_current_price(symbol):
    """
    获取指定港股的当前价格（单位：HKD）
    参数:
        symbol (str): 港股代码，例如 '0700'
    返回:
        float: 最新价格，如果找不到则返回 None
    """
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
