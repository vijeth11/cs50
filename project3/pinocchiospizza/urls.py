from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("gallery/",views.gallery, name="gallery"),
    path("menu-order/",views.menu, name="menu")
]
