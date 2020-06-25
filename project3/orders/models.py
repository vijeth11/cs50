from django.db import models

# Create your models here.

class Toppings(models.Model):
    name = models.CharField(max_length=100)
class Pizza(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits= 10,decimal_places=2)
    image = models.ImageField(upload_to="pizza")
    typeOfPizza = models.BinaryField()
    selectedTopings = models.ManyToManyField(Toppings)

    def __str__(self):
        return self.name



