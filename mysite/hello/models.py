from django.db import models

# Create your models here.
class Airport(models.Model):
    code=models.CharField(max_length=3)
    city=models.CharField(max_length=64)

    def __str__(self):
        return self.code+" ( "+self.city+" )"
class Flight(models.Model):
    origin = models.ForeignKey(Airport,on_delete=models.CASCADE,related_name="departures")
    destination= models.ForeignKey(Airport,on_delete=models.CASCADE,related_name="arrival")
    duration = models.IntegerField()

    def __str__(self):
        return str(self.id) +" - "+str(self.origin)+" to "+str(self.destination)

class Passenger(models.Model):
    first=models.CharField(max_length=64)
    last= models.CharField(max_length=64)
    flights=models.ManyToManyField(Flight, blank=True, related_name="passengers")

    def __str__(self):
        return self.first+" "+self.last