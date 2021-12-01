from django.contrib import admin
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('',views.index,name="index"),
    path('shop/',views.shop,name = "shop"),
    path('wishlist/',views.wishlist,name = "wishlist"),
    path('cart/',views.cart,name = 'cart'),
    path('checkout/',views.checkout, name = 'checkout'),
    path('coupon/<str:code>',views.applycouponcode,name = 'coupon'),
    path('shopitem/<int:itemId>',views.selecteditem,name = 'shopitem'),
    path('loginandregister/',views.loginandregister,name = 'loginandregister'),
    path('signout/',views.signout,name = 'signout'),
    path('about/',views.about,name = 'about'),
    path('contact/',views.contact,name = 'contact')
]+ static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
