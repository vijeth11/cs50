from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
# Create your models here.

PizzaTypes=[("R","Regular"),
            ("S","Sicilian")
            ]
OrderStatuses =[("N","New"),
                ("P","Preparing"),
                ("F","Completed"),
                ("C","Canceled")]
class Toppings(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
class Pizza(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits= 10,decimal_places=2)
    image = models.ImageField(upload_to="pizza",blank=True)
    typeOfPizza = models.CharField(max_length=1,choices= PizzaTypes)
    selectedTopings = models.ManyToManyField(Toppings)

    def __str__(self):
        return self.name

    def toppings(self):
        names = [topping.name for topping in self.selectedTopings.all()]
        return " , ".join(names)

class Subs(models.Model):
    name = models.CharField(max_length=100)
    smallprice = models.DecimalField(max_digits=10,decimal_places=2)
    largeprice = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to = "subs",blank=True)

    def __str__(self):
        return self.name

class Pasta(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to = "pasta",blank=True)

    def __str__(self):
        return self.name

class Salads(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to = "salada",blank=True)

    def __str__(self):
        return self.name

class DinnerPlatters(models.Model):
    name = models.CharField(max_length=100)
    smallprice = models.DecimalField(max_digits=10,decimal_places=2)
    largeprice = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to = "DinnerPlatters",blank=True)

    def __str__(self):
        return self.name

class Orders(models.Model):
    totalprice = models.DecimalField(max_digits=10,decimal_places=2)
    status = models.CharField(max_length=1,choices=OrderStatuses)
    date = models.DateField()
    paymentType = models.CharField(max_length = 6,blank = True)
    deliveryType = models.CharField(max_length = 10,blank = True)
    deliveryTimeType = models.CharField(max_length = 10,blank = True)
    deliveryDate = models.DateField(default = timezone.datetime.now())
    deliveryTime = models.TimeField(default = timezone.datetime.now())
    street = models.CharField(max_length=100,blank = True)
    streetNumber = models.CharField(max_length = 100,blank = True)
    city = models.CharField(max_length = 100,blank = True)
    apartmentNumber = models.CharField(max_length=100,blank = True)
    floorNumber = models.IntegerField(default = 0)
    firstName = models.CharField(max_length = 100,blank = True)
    lastName = models.CharField(max_length = 100,blank = True)
    phone = models.CharField(max_length = 14,blank = True)
    checkoutEmail = models.CharField(max_length = 100,blank = True)
    companyName = models.CharField(max_length = 100,blank = True)
    comment = models.CharField(max_length = 1000,blank = True)
    person = models.ForeignKey(User, on_delete = models.CASCADE)

    def __str__(self):
        return "order: "+str(self.id)+self.person.username

class OrderItems(models.Model):
    price = models.DecimalField(max_digits = 10,decimal_places=2)
    name = models.CharField(max_length=1000)
    plates = models.IntegerField()
    orderitemtype = models.CharField(max_length=100,default="food")
    order = models.ForeignKey(Orders,on_delete = models.CASCADE,related_name = 'items')
    selectedtoppings = models.ManyToManyField(Toppings)

    def toppings(self):
        names = [topping.name for topping in self.selectedtoppings.all()]
        return " , ".join(names)

class BookingTable(models.Model):
    dateOfBooking = models.DateField()
    timeOfBooking = models.CharField(max_length=10)
    numberOfPeople = models.CharField(max_length=20)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=14)

    def __str__(self):
        return self.firstName + "booking"

class MessageTable(models.Model):
    contact = models.CharField(max_length = 100)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=12)
    subject = models.CharField(max_length=100)
    message = models.CharField(max_length = 5000)

    def __str__(self):
        return self.contact+":"+self.subject