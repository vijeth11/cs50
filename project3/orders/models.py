from django.db import models

# Create your models here.

PizzaTypes=[("R","Regular"),
            ("S","Sicilian")
            ]
class Toppings(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
class Pizza(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits= 10,decimal_places=2)
    image = models.ImageField(upload_to="pizza")
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
    image = models.ImageField(upload_to = "subs")

class Pasta(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to = "pasta")

class Salads(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to = "salada")

class DinnerPlatters(models.Model):
    name = models.CharField(max_length=100)
    smallprice = models.DecimalField(max_digits=10,decimal_places=2)
    largeprice = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to = "DinnerPlatters")
