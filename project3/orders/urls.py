from orders.views import completeOrder
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect

urlpatterns = [
    path("index/", views.index, name="index"),
    path("gallery/",views.gallery, name="gallery"),
    path("menu-order/",views.menu, name="menu"),
    path("book-table/",views.booktable,name="booktable"),
    path("order/",views.order,name="order"),
    path("login/",views.login,name="login"),
    path("register/",views.signup, name= "register"),
    path("logout/",views.logout, name= "logout"),
    path("orderComplete/",views.completeOrder,name="ordercomplete"),
    path("orderItems/",views.getOrderData, name= "orderitems"),
    path("",lambda request: redirect('menu-order/', permanent=False))
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
