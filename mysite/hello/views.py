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