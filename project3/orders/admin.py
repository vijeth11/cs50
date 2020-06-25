from django.contrib import admin
from .models import Pizza, Toppings
# Register your models here.

class PizzaAdmin(admin.ModelAdmin):
      filter_horizontal = ("selectedTopings",)

admin.site.register(Pizza,PizzaAdmin)
admin.site.register(Toppings)