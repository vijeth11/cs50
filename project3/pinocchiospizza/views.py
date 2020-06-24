from django.shortcuts import render

# Create your views here.

def index(request):
    displayContent= """Noch's has been in business for over 50 years! We've been feeding Harvard and the surrounding area since 1966!

We sell award-winning sicilian-style pizza and mouth-watering steak subs! We have over 750 reviews on Yelp--- check it out!

***** April 6th,2020 UPDATE---Pinocchio's will now be closing every night at 9:00 pm following the recommended curfew set forth by Mayor Walsh. All orders must be for takeout......you can continue to come in to the shop to order or call in. For delivery you can continue to do so thru Grubhub, Doordash and Postmates.....get your orders in by 8:00. Our wishes to everyone to stay safe....maintain social distance and wash your hands!!!!***** """
    return render(request,"pinocchiospizza/index.html",{'pageType':'home','displayContent':displayContent})

def gallery(request):
    return render(request,"pinocchiospizza/gallery.html",{'list':["gallery-"+str(i)+".jpg" for i in range(1,7) ]})