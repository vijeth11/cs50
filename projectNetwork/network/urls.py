
from network.views import likethepost, new_post
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("post", views.new_post, name="new-post"),
    path("post/<int:id>", views.new_post, name="new-post"),
    path("likes/<int:postid>",views.likethepost, name="likepost"),
    path("posts/<str:username>",views.userprofile,name="userprofile"),
    path("followers",views.followers, name="addorremovefollowers"),
    path("followingposts",views.followingposts,name = "followingposts"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
