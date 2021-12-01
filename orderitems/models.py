from django.db.models.deletion import CASCADE
from django.template.defaultfilters import length
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
    offer = models.IntegerField(default = 0)
    image = models.ImageField(upload_to = "items",blank=True)
    dealOfTheDay = models.BooleanField()
    description  = models.CharField(max_length=1000,default="")
    dealenddate = models.DateTimeField(default=timezone.datetime.now())
    
    def __str__(self):
        return self.name

    def saleprice(self):
        if self.offer > 0:
            return self.price - (self.price * (self.offer / 100))
        else:
            return self.price

    def ItemTypeName(self):
        for item in ItemTypes:
            if item[0] == self.typeOf:
                return item[1].replace(" ","")


class coupon(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=100)
    discountpercent = models.IntegerField(default=0)
    discountamount = models.FloatField(default=0.0)
    createdDate = models.DateField(default=timezone.datetime.now())
    endDate = models.DateField()

class orderPlaced(models.Model):
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    houseAddress = models.CharField(max_length=100)
    appartmentNumber = models.CharField(max_length=100)
    town = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    paymentType = models.CharField(max_length=100)
    subTotal = models.FloatField(default=0.0)
    discount = models.FloatField(default=0.0)
    totalPrice = models.FloatField(default=0.0)

class orderItems(models.Model):
    itemId = models.IntegerField()
    quantity = models.IntegerField()
    totalPrice = models.FloatField()
    order = models.ForeignKey(orderPlaced,on_delete=models.CASCADE,related_name='items')

class userwishlist(models.Model):
    itemId = models.IntegerField()
    user = models.ForeignKey(User, on_delete = models.CASCADE)

class usercomments(models.Model):
    comment = models.CharField(max_length = 1000)
    user = models.ForeignKey(User, on_delete = CASCADE)

class userMessage(models.Model):
    name = models.CharField(max_length = 100)
    email = models.CharField(max_length = 100)
    subject = models.CharField(max_length = 100)
    message = models.CharField(max_length = 1000)
    