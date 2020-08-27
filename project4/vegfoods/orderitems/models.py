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
    description  = models.CharField(max_length=1000,default="")

    def saleprice(self):
        if self.offer > 0:
            return self.price - (self.price * (self.offer / 100))

    def ItemTypeName(self):
        for item in ItemTypes:
            if item[0] == self.typeOf:
                return item[1].replace(" ","")