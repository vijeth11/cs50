from django.shortcuts import render
from .models import Flight, Passenger
from django.http import HttpResponse,Http404,HttpResponseRedirect
from django.urls import reverse
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
        "flight":flight,
        "passengers":flight.passengers.all(),
        "nonpassengers":Passenger.objects.exclude(flights=flight).all()
    }
    return render(request,"flights/flight.html",context)
def book(request,flightid):
    try:
        passenger_id=int(request.POST["passenger"])
        passenger = Passenger.objects.get(pk=passenger_id)
        flight= Flight.objects.get(pk=flightid)
    except Passenger.DoesNotExist:
        return render(request,"flights/error.html",{"message":"No Passenger."})
    except Flight.DoesNotExist:
        return render(request,"flights/error.html",{"message":"No flight."})
    except KeyError:
        return render(request,"flights/error.html",{"message":"No Selection"})
    passenger.flights.add(flight)
    return HttpResponseRedirect(reverse("flight",args=(flightid,)))