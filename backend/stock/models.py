from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlist")


class Watchliststock(models.Model):
    watchlist = models.ForeignKey(Watchlist, on_delete=models.CASCADE, related_name="stock")
    symbol = models.CharField(max_length=32, unique=True)
    
    class Meta:
        unique_together = [["watchlist", "symbol"]]


class Portfolio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="portfolio")
    symbol = models.CharField(max_length=32)
    quantity = models.IntegerField()
    buy_price = models.FloatField()
    avg_price = models.FloatField()
    

    class Meta:
        unique_together = [["user", "symbol"]]

class OrderHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="order_history")
    symbol = models.CharField(max_length=32)
    quantity = models.IntegerField()
    price = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)
    order_type = models.CharField(max_length=3, default="MARKET")
    order_id = models.CharField(max_length=32, unique=True)
    order_side  = models.CharField(max_length=32, default="BUY")
    stop_loss = models.FloatField(null=True, blank=True)
    take_profit = models.FloatField(null=True, blank=True)

    is_triggered = models.BooleanField(default=False)

    class Meta:
        unique_together = [["user", "order_id"]]

class UserAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='account')
    balance = models.FloatField(default=100000)


class PriceAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="price_alerts")
    symbol = models.CharField(max_length=16)
    price= models.FloatField()
    is_triggered = models.BooleanField(default=False)
    direction = models.BooleanField(default=True)


class Alert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="alert")
    symbol = models.CharField(max_length=16)
    price= models.FloatField()
    time = models.CharField(max_length=32)


