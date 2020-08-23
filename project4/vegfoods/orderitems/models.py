from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

ItemTypes=[("V","Vegetables"),
            ("F","Fruits"),
            ("J","Juice"),
            ("D","Dried Fruits")
            ]

class items(models.Model):
    name = models.CharField(max_length=100)
    typeOf = models.CharField(max_length=1,choices=ItemTypes)
    price = models.IntegerField()
    offer = models.IntegerField()
    image = models.ImageField(upload_to = "items",blank=True)
    dealOfTheDay = models.BooleanField()

