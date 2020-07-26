from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    followers = models.CharField(max_length=5000,default="")
    following = models.CharField(max_length=5000,default="")

    def countOfFollowers(self):
        return len(list(filter(None, self.followers.split(","))))
    
    def countOfFollowing(self):
        return len(list(filter(None,self.following.split(","))))


class Post(models.Model):
    text = models.CharField(max_length=5000)
    createdDate = models.DateTimeField()
    likes = models.IntegerField()
    likedpeople = models.CharField(max_length=5000,default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def serialize(self):
        return {
            "id":self.id,
            "text":self.text,
            "createdDate":self.createdDate,
            "likes":self.likes,
            "likedpeople":self.likedpeople
        }