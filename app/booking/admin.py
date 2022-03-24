from django.contrib import admin
from booking.models import Booking, Kit, Laboratory 
from core import models

admin.site.register(Laboratory)
admin.site.register(Kit)
admin.site.register(Booking)