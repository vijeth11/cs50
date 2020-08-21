from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('',views.index,name="index"),
    path('shop',views.shop,name = "shop"),
    path('wishlist',views.wishlist,name = "wishlist"),
    path('cart',views.cart,name = 'cart')
]
