from django.shortcuts import redirect, render,HttpResponse
from django.http import JsonResponse
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
            cartItems.append({"item":serializers.serialize('json', items.objects.filter(name = request.POST["itemname"]).all()),"quantity":request.POST["quantity"]})
        if request.POST["action"] == "Remove":
            cartItems.remove({"item":serializers.serialize('json', items.objects.filter(name = request.POST["itemname"]).all()),"quantity":request.POST["quantity"]})
        if request.POST["action"] == "Update":
            for i, item in enumerate(cartItems):
                if item["item"] == serializers.serialize('json', items.objects.filter(name = request.POST["itemname"]).all()):
                    cartItems[i]["quantity"] = request.POST["quantity"]
                    break
        request.session['cartItems'] = cartItems
        return HttpResponse("success",status=200)
    else:
        data = []
        subtotal= 0
        delivery = 10
        discount = 0
        if cartItems is not None:
            for item in cartItems:
                for obj in serializers.deserialize('json',item["item"]):
                    totalPrice = int(item["quantity"]) * obj.object.price
                    subtotal += totalPrice
                    data.append({"item":obj.object,"quantity":item["quantity"],"totalcost":totalPrice})     
        return render(request,'orderitems/cart.html',{'cartitems':data,'subtotal':subtotal,'delivery':delivery,'discount':discount})

def checkout(request):
    if request.method == 'POST':
        newOrder = orderPlaced(firstName = request.POST["firstname"],lastName = request.POST["lastname"],houseAddress = request.POST["housenumber"],appartmentNumber = request.POST["appartmentnumber"]
        ,town = request.POST["Town"], zipcode = request.POST["Zip"], phone = request.POST["phone"],email = request.POST["email"],paymentType = request.POST["paymenttype"])
        newOrder.save()
        if request.POST["accountcreate"] == True:
            #need to create account
            i=1
        return HttpResponse("success",200)
    else:
        cartItems = request.session.get('cartItems')
        subtotal= 0
        delivery = 10
        discount = 0
        if cartItems is not None:
            for item in cartItems:
                for obj in serializers.deserialize('json',item["item"]):
                    subtotal += int(item["quantity"]) * obj.object.price
        if subtotal == 0:
            return redirect('shop')
        if request.session.get('discountamount') is not None and request.session.get('discountamount') > 0:
            discount = request.session.get('discountamount')
        elif request.session.get('discountpercent') is not None and request.session.get('discountpercent') > 0:
            discount = subtotal - (subtotal * (request.session.get('discountpercent') / 100))
        return render(request,'orderitems/checkout.html',{"subtotal":subtotal,'delivery':delivery,'discount':discount})

def applycouponcode(request,code):
    couponExists = coupon.objects.filter(createdDate__lte = timezone.datetime.now(), endDate__gte = timezone.datetime.now(), code = code).all()
    if len(couponExists) > 0:
        request.session['discountamount'] = couponExists[0].discountamount
        request.session['discountpercent'] = couponExists[0].discountpercent
        return JsonResponse({"discountpercent":couponExists[0].discountpercent,"discountamount":couponExists[0].discountamount},safe=False)
    else:
        request.session['discountamount'] = 0
        request.session['discountpercent'] = 0
        return JsonResponse({"discountpercent":0,"discountamount":0},safe=False)