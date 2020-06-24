from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request,"pinocchiospizza/index.html")

def gallery(request):
    return render(request,"pinocchiospizza/gallery.html",{'list':["gallery-"+str(i)+".jpg" for i in range(1,7) ]})