from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:entry>", views.wiki, name="wiki"),
    path("search",views.search,name="search"),
    path("randompage",views.randompage,name="random_page"),
    path("create",views.createNewPage,name="create_page"),
    path("edit/<str:entry>",views.EditExisting,name="edit_page")
]
