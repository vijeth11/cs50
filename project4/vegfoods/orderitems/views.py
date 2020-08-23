from django.shortcuts import render
from .models import *
# Create your views here.
def index(request):
    featured  =  items.objects.filter(offer__gt = 0).all()
    return render(request,'orderitems/index.html')

def shop(request):
    return render(request,'orderitems/shop.html')

def wishlist(request):
    return render(request,'orderitems/wishlist.html')

def cart(request):
    return render(request,'orderitems/cart.html')

def checkout(request):
    return render(request,'orderitems/checkout.html')