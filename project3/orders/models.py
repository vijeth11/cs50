from django.db import models

# Create your models here.

PizzaTypes=[("R","Regular"),
            ("S","Sicilian")
            ]
class Toppings(models.Model):
    name = models.CharField(max_length=100)
class Pizza(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits= 10,decimal_places=2)
    image = models.ImageField(upload_to="pizza")
    typeOfPizza = models.CharField(max_length=1,choices= PizzaTypes)
    selectedTopings = models.ManyToManyField(Toppings)

    def __str__(self):
        return self.name



