from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index, name="index"),
    path("gallery/",views.gallery, name="gallery"),
    path("menu-order/",views.menu, name="menu")
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
