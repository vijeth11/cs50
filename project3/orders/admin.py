from django.contrib import admin
from .models import Pizza, Toppings, Subs, Pasta, Salads, DinnerPlatters 
# Register your models here.

class PizzaAdmin(admin.ModelAdmin):
      filter_horizontal = ("selectedTopings",)

admin.site.register(Pizza,PizzaAdmin)
admin.site.register(Toppings)
admin.site.register(Subs)
admin.site.register(Pasta)
admin.site.register(Salads)
admin.site.register(DinnerPlatters)
