from django.db import models

# Create your models here.

class user(models.Model):
    name = models.CharField(max_length=32)
    password = models.CharField(max_length=32)
    email = models.CharField(max_length=255, unique=True, default="default@example.com")

