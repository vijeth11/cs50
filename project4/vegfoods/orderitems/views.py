from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request,'orderitems/index.html')

def shop(request):
    return render(request,'orderitems/shop.html')

def wishlist(request):
    return render(request,'orderitems/wishlist.html')

def cart(request):
    return render(request,'orderitems/cart.html')

def checkout(request):
    return render(request,'orderitems/checkout.html')