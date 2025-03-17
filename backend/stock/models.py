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




