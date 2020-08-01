from django.shortcuts import render,redirect,HttpResponse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import *
from django.contrib.auth.models import User
from django.contrib import auth
from django.utils import timezone
from decimal import Decimal
# Create your views here.

def index(request):
    displayContent= """Noch's has been in business for over 50 years! We've been feeding Harvard and the surrounding area since 1966!

We sell award-winning sicilian-style pizza and mouth-watering steak subs! We have over 750 reviews on Yelp--- check it out!

***** April 6th,2020 UPDATE---Pinocchio's will now be closing every night at 9:00 pm following the recommended curfew set forth by Mayor Walsh. All orders must be for takeout......you can continue to come in to the shop to order or call in. For delivery you can continue to do so thru Grubhub, Doordash and Postmates.....get your orders in by 8:00. Our wishes to everyone to stay safe....maintain social distance and wash your hands!!!!***** """
    return render(request,"orders/index.html",{'pageType':'home','displayContent':displayContent})

def gallery(request):
    return render(request,"orders/gallery.html",{'list':["gallery-"+str(i)+".jpg" for i in range(1,7) ]})

def menu(request):
    pizzas = Pizza.objects.all() 
    subs = Subs.objects.all()
    salads = Salads.objects.all()
    pastas = Pasta.objects.all()
    dinnerplatters = DinnerPlatters.objects.all()
    toppings= Toppings.objects.all()
    times= []
    for i in range(11,22):
        for j in [":00",":15",":30",":45"]:
            times.append(str(i)+j); 
    return render(request,"orders/menu.html",{'pizzas':pizzas,'subs':subs,'salads':salads,'pastas':pastas,'dinnerplatters':dinnerplatters,'blankimageurl':'/media/product-blank.png','toppings':toppings,'timelist':times})

def booktable(request):
    if request.method == 'POST':
        tablebooked =  BookingTable(dateOfBooking = request.POST["toDate"],timeOfBooking = request.POST["toTime"], numberOfPeople = request.POST["people"], firstName = request.POST["firstName"], 
        lastName = request.POST["lastName"], email = request.POST["email"], phone = request.POST["phone"])
        tablebooked.save()
        return HttpResponse(tablebooked)
    else:
        times= [""]
        for i in range(11,22):
            for j in [":00",":15",":30",":45"]:
                times.append(str(i)+j); 
        return render(request,"orders/booktables.html",{"timelist":times,"personsList":range(1,16)})

def signup(request):
    #return HttpResponse("signup")
    if request.method == 'POST':
        # User has info and wants account now!
        if request.POST['password'] == request.POST['passwordConfirm']:
            try:
                user = User.objects.get(username = request.POST['email'])
                return HttpResponse('Username has already been taken',status = 400)
            except User.DoesNotExist:
                user = User.objects.create_user(request.POST['email'],password = request.POST['password'])
                auth.login(request,user)
                return HttpResponse(user)
        else:
            return HttpResponse("error password does not match",status = 400)
    else:
        return HttpResponse("Successfull")

def login(request):
    #return HttpResponse("login")
    if request.method == 'POST':
        user = auth.authenticate(username = request.POST['email'],password = request.POST['password'])
        if user is not None:
            auth.login(request,user)
            data = getOrderItems(user) 
            return JsonResponse({'user':user.get_username(),'id':user.id,'orders':data[0],'total':data[1]},safe=False)
        else:
            return HttpResponse('username or password is incorrect.',status = 400)
    else:
        return render(request,'menu.html')

def logout(request):
    #TODO Need to route to homepage
    if request.method == 'POST':
        auth.logout(request)
        return redirect('index')

@login_required
def order(request):
    if request.method == 'POST':
        orders = Orders.objects.all().filter(person = request.user).filter(status = 'N')
        if len(orders) > 0:
            orders[0].totalprice = orders[0].totalprice + Decimal(request.POST["price"])
            orders[0].save()
            orderitems = OrderItems.objects.all().filter(order = orders[0]).filter(name = request.POST["orderitem"])
            if len(orderitems) > 0:
                orderitems[0].plates = orderitems[0].plates + int(request.POST["plate"])
                if orderitems[0].toppings() != request.POST["selectedToppings"]:   
                    orderitems[0].price += Decimal(len(request.POST["selectedToppings"].split(",")) * 1.50 - len(orderitems[0].selectedtoppings.all())* 1.50)                  
                    orderitems[0].selectedtoppings.clear()
                    for toppingname in request.POST["selectedToppings"].split(","):
                        if toppingname is not '' and not toppingname.isspace():
                            try:
                                orderitems[0].selectedtoppings.add(Toppings.objects.get(name=toppingname.strip()))
                            except:
                                continue                    
                if orderitems[0].price != Decimal(request.POST["price"]) and (request.POST["itemtype"] == "sub" or request.POST["itemtype"] == "dinnerplatter"):
                    orderitems[0].price = request.POST["price"]
                if orderitems[0].plates <= 0:
                    orderitems[0].delete()
                else:
                    orderitems[0].save()
            else:
                orderitems = OrderItems(price = request.POST["price"], name = request.POST["orderitem"], plates = request.POST["plate"], orderitemtype = request.POST["itemtype"],order = orders[0])
                orderitems.save()
                if len(request.POST["selectedToppings"]) > 0:
                    for toppingname in request.POST["selectedToppings"].split(","):
                        if toppingname is not '' and not toppingname.isspace():
                             try:
                                orderitems.selectedtoppings.add(Toppings.objects.get(name=toppingname.strip()))
                             except:
                                continue
                orderitems.save()
        else:
            order = Orders(totalprice = 0.0, status = 'N', date = timezone.datetime.now(), person = request.user)
            order.totalprice = order.totalprice + float(request.POST["price"])
            order.save()            
            orderitems = OrderItems(price = request.POST["price"], name = request.POST["orderitem"], plates = int(request.POST["plate"]), orderitemtype = request.POST["itemtype"],order = order)
            orderitems.save()
            if len(request.POST["selectedToppings"]) > 0:
                    for toppingname in request.POST["selectedToppings"].split(","):
                        if toppingname is not '' and not toppingname.isspace():
                            try:
                                orderitems.selectedtoppings.add(Toppings.objects.get(name=toppingname.strip()))
                            except:
                                continue
            orderitems.save()
        data = getOrderItems(request.user)     
        return JsonResponse({'orders':data[0],'total':data[1]},safe=False)

def getOrderData(request):
    if request.user is not None:
        try:
            data = getOrderItems(request.user)
            return JsonResponse({'orders':data[0],'total':data[1]},safe=False)
        except:
            return HttpResponse("",status=400)

    else:
        return JsonResponse({'orders':[],'total':0},safe=False)

def getOrderItems(user):
    orders = Orders.objects.all().filter(person = user).filter(status = 'N')
    orderData =[]
    totalPrice = 0
    if len(orders) > 0:        
        for orderitem in OrderItems.objects.all().filter(order = orders[0]):
            orderData.append({'name':orderitem.name,'price':orderitem.price,'plate':orderitem.plates,'itemtype':orderitem.orderitemtype,'selectedtoppings':list(orderitem.selectedtoppings.all().values_list('name', flat=True))})
            totalPrice += orderitem.plates * orderitem.price
    return [orderData,totalPrice]

@login_required
def completeOrder(request):
    if request.method == 'POST':
        try:
            #orders = Orders.objects.all().filter(person = request.user).filter(status = 'N')
            if request.POST["deliveryType"] == "DELIVERY":
                Orders.objects.all().filter(person = request.user).filter(status = 'N').update(street = request.POST["street"]
                ,streetNumber = request.POST["streetNumber"]
                ,city = request.POST["city"]
                ,apartmentNumber = request.POST["apartmentNumber"]
                ,floorNumber = request.POST["floorNumber"])
            if request.POST["deliveryTimeType"] == "FUTURE":
               Orders.objects.all().filter(person = request.user).filter(status = 'N').update(deliveryDate = request.POST["deliveryDate"],deliveryTime = request.POST["deliveryTime"])
            
            Orders.objects.all().filter(person = request.user).filter(status = 'N').update(status = 'P'
            ,paymentType = request.POST["paymentType"]
            ,deliveryType = request.POST["deliveryType"]
            ,deliveryTimeType = request.POST["deliveryTimeType"]
            ,firstName = request.POST["firstName"]
            ,lastName = request.POST["lastName"]
            ,phone = request.POST["phone"]
            ,checkoutEmail = request.POST["checkoutEmail"]
            ,companyName = request.POST["companyName"]
            ,comment = request.POST["comment"]
            )
            
            #orders[0].save()
            return HttpResponse("success",status=200)
        except:
            return HttpResponse("",status=500)

def recieveMessage(request):
    if request.method == 'POST':
        newmessage =  MessageTable(contact = request.POST["contact"], email = request.POST["email"], 
        phone = request.POST["phone"],subject = request.POST["title"],message = request.POST["message"])
        newmessage.save()
        return HttpResponse("Success")