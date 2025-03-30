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

    class Meta:
        unique_together = [["user", "order_id"]]

class UserAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='account')
    balance = models.FloatField(default=100000)
