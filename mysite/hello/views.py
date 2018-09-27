from django.shortcuts import render
from .models import Flight
from django.http import HttpResponse
# Create your views here.
def index(request):
    context={
        "flights":Flight.objects.all()
    }
    #return HttpResponse("hello world")
    return render(request,"flights/index.html",context)
def flight(request,flightid):
    try:
        flight=Flight.objects.get(pk=flightid)
    except Flight.DoesNotExist:
        raise Http404("Flight does not exist.")
    context={
        "flight":flight
    }
    return render(request,"flights/flight.html",context)