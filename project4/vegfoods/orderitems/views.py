from django.shortcuts import render,HttpResponse
from django.core import serializers
from .models import *
# Create your views here.

def index(request):
    featured  =  items.objects.filter(offer__gt = 0).all()
    return render(request,'orderitems/index.html',{'featured':featured})

def shop(request):
    if not request.session.get('cartItems'):
        request.session['cartItems'] = []
        request.session.set_expiry(0)
    fooditems = items.objects.all()
    return render(request,'orderitems/shop.html',{'fooditems':fooditems})

def wishlist(request):
    return render(request,'orderitems/wishlist.html')

def cart(request):
    cartItems = request.session.get('cartItems')  
    if request.method == 'POST': 
        if request.POST["action"] == "Add":          
            cartItems.append(serializers.serialize('json', items.objects.filter(name = request.POST["itemname"]).all()))
        if request.POST["action"] == "Remove":
            cartItems.remove(serializers.serialize('json', items.objects.filter(name = request.POST["itemname"]).all()))
        request.session['cartItems'] = cartItems
        return HttpResponse("success",status=200)
    else:
        data = []
        if cartItems is not None:
            for item in cartItems:
                for obj in serializers.deserialize('json',item):
                    data.append(obj.object)     
        return render(request,'orderitems/cart.html',{'cartitems':data})

def checkout(request):
    return render(request,'orderitems/checkout.html')