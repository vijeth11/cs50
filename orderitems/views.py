from django.shortcuts import redirect, render,HttpResponse
from django.http import JsonResponse
from django.core import serializers
from .models import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import auth
# Create your views here.

def index(request):
    featured  =  items.objects.filter(offer__gt = 0).all()
    dealoftheday = items.objects.filter(dealOfTheDay = True).first()
    comments = usercomments.objects.all()[0:6]
    return render(request,'orderitems/index.html',{'featured':featured,'comments':comments,'dealoftheday':dealoftheday})

def loginandregister(request):
    if request.method == 'POST':
        if request.POST['action'] == 'login':
            user = auth.authenticate(username = request.POST['email'],password = request.POST['password'])
            if user is not None:
                auth.login(request,user)
                return redirect('wishlist')
            else:
                return HttpResponse('username or password is incorrect.',status = 400)
        else:
            if request.POST['password'] == request.POST['passwordConfirm']:
                try:
                    user = User.objects.get(username = request.POST['email'])
                    return HttpResponse('Username has already been taken',status = 400)
                except User.DoesNotExist:
                    user = User.objects.create_user(request.POST['email'],password = request.POST['password'])
                    auth.login(request,user)
                    return redirect('wishlist')
            else:
                return HttpResponse("error password does not match",status = 400)
    else:
        return render(request,'orderitems/login_signup.html')

@login_required()
def signout(request):
    if request.method == 'POST':
        auth.logout(request)
        return redirect('index')

def selecteditem(request,itemId):
    if not request.session.get('cartItems'):
        request.session['cartItems'] = []
        request.session.set_expiry(0)
    item = items.objects.filter(id = itemId).first()
    relatedItems = items.objects.filter(typeOf = item.typeOf).all()[0:4]
    return render(request,'orderitems/singleProduct.html',{'selecteditem':item,'fooditems':relatedItems})
    
def shop(request):
    if not request.session.get('cartItems'):
        request.session['cartItems'] = []
        request.session.set_expiry(0)
    fooditems = items.objects.all()
    return render(request,'orderitems/shop.html',{'fooditems':fooditems})

@login_required(login_url='/loginandregister/')
def wishlist(request):
    if request.method == 'POST':
        wishlistitem = userwishlist.objects.filter(itemId = request.POST['itemId']).first()
        if request.POST['action'] == 'add':
            if wishlistitem is None:
                wishlistitem = userwishlist(itemId = request.POST['itemId'],user = request.user)
                wishlistitem.save()
            return HttpResponse('Item successfully added to wishlist ...',200)
        elif request.POST['action'] == 'remove':
            if wishlistitem is not None:
                wishlistitem.delete()
                return HttpResponse('Item successfully removed from wishlist ...',200)
            return HttpResponse('failure',500)
    else:
        wishlistitems = userwishlist.objects.filter(user = request.user).all()
        data = []
        for wishlistitem in wishlistitems:
            data.append(items.objects.filter(id = wishlistitem.itemId).first())
        return render(request,'orderitems/wishlist.html',{'wishlistitems':data})

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
        return HttpResponse("Item added successfully to cart ...",status=200)
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
        if len(data) > 0:
            return render(request,'orderitems/cart.html',{'cartitems':data,'subtotal':subtotal,'delivery':delivery,'discount':discount})
        else:
            return redirect('shop')

def checkout(request):
    if request.method == 'POST':
        subtotal = 0
        delivery = 10
        newOrder = orderPlaced(firstName = request.POST["firstname"],lastName = request.POST["lastname"],houseAddress = request.POST["housenumber"],appartmentNumber = request.POST["appartmentnumber"]
        ,town = request.POST["Town"], zipcode = request.POST["Zip"], phone = request.POST["phone"],email = request.POST["email"],paymentType = request.POST["paymenttype"])
        newOrder.save()
        cartItems = request.session.get('cartItems') 
        if cartItems is not None:
            for item in cartItems:
                for obj in serializers.deserialize('json',item["item"]):
                    totalPrice = int(item["quantity"]) * obj.object.price
                    subtotal += totalPrice
                    orderItem = orderItems(itemId = obj.object.id, quantity = int(item["quantity"]), totalPrice = totalPrice, order = newOrder)
                    orderItem.save()
        if request.session.get('discountamount') is not None and request.session.get('discountamount') > 0:
            newOrder.discount = request.session.get('discountamount')
        elif request.session.get('discountpercent') is not None and request.session.get('discountpercent') > 0:
            newOrder.discount = subtotal - (subtotal * (request.session.get('discountpercent') / 100))       
        else:
            newOrder.discount = 0
        newOrder.save()     
        newOrder.subTotal = subtotal
        newOrder.save()
        newOrder.totalPrice = newOrder.subTotal - newOrder.discount + delivery
        request.session.flush()
        if request.POST["comments"] is not None and len(request.POST["comments"]) > 0:
            comment = usercomments(comment = request.POST["comments"],user  = request.user)
            comment.save()        
        return HttpResponse("Your Order is Successfully placed",200)
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


def about(request):
    comments = usercomments.objects.all()
    return render(request,'orderitems/about.html',{'comments':comments})

def contact(request):
    if request.method == 'POST':
        message = userMessage(name = request.POST['name'],email = request.POST['email'],subject = request.POST['subject'],message = request.POST['message'])
        message.save()
        return HttpResponse("Message Successfully Submitted ...",200)
    else:
        return render(request,'orderitems/contact.html')