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