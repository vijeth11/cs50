import json
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.urls import reverse
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from .models import User,Post
from django.core.paginator import Paginator


def index(request):
    pages = Paginator(Post.objects.order_by("-createdDate").all(),10)
    pageno = request.GET.get('page')    
    if pageno is not None:
        posts= pages.get_page(pageno)
    else:
        posts = pages.get_page(1)   
    return render(request, "network/index.html",{"posts":posts,"pagenumbers":list(pages.page_range)})

def userprofile(request,username):    
    pages = Paginator(Post.objects.filter(user = username).order_by("-createdDate").all(),10)
    pageno = request.GET.get('page')    
    if pageno is not None:
        posts= pages.get_page(pageno)
    else:
        posts = pages.get_page(1)
    return render(request,"network/index.html",{"posts":posts,"profile":posts[0].user})

@login_required
def followingposts(request):
    usernames =  list(User.objects.get(username= request.user.username).following.split(","))
    userslist = list(User.objects.filter(username__in = usernames).all())
    pages = Paginator(Post.objects.filter(user__in = userslist).order_by("-createdDate").all(),10)
    pageno = request.GET.get('page')    
    if pageno is not None:
        posts= pages.get_page(pageno)
    else:
        posts = pages.get_page(1)
    return render(request, "network/index.html",{"posts":posts})

@csrf_exempt
@login_required
def followers(request):
    if request.method == "POST":
        data = json.loads(request.body)
        follower = request.user
        following = User.objects.get(username = data.get("following"))
        if data.get("action") == "follow":            
            follower.following += following.username + ","  
            following.followers += follower.username + ","            
            follower.save()
            following.save()
        else:
            if(follower.username in following.followers):                
                following.followers = following.followers.replace(follower.username + ",", "")                
            if(following.username in follower.following):                
                follower.following = follower.following.replace(following.username + "," , "")
            follower.save()
            following.save()
        return HttpResponse("success")

@csrf_exempt
def new_post(request,id = None):
    if request.method == "POST":
        data = json.loads(request.body)
        if id is not None:
            post = Post.objects.get(id=id)
            if(post.user.username == request.user.username):
                post.text = data.get("post")
                post.createdDate = datetime.now()
        else:
            post = Post(text=data.get("post"),createdDate = datetime.now(),likes=0,user=request.user)
        post.save()
        return JsonResponse({"result":"success"})
    else:
        return render(request, "network/new_post.html")

def likethepost(request,postid):
    post = Post.objects.get(id=postid)
    if request.user.username in post.likedpeople:
        post.likes -= 1
        post.likedpeople = post.likedpeople.replace(request.user.username+",","")
    else:
        post.likes += 1
        post.likedpeople += request.user.username+","
    post.save()
    return JsonResponse(post.serialize())

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
