from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(items)
admin.site.register(coupon)
admin.site.register(orderPlaced)
admin.site.register(orderItems)
admin.site.register(userwishlist)
admin.site.register(usercomments)
admin.site.register(userMessage)
