"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
"""

from django.contrib import admin
from booking.models import Booking, Kit, Laboratory, TimeFrame
from core import models

class BookingAdmin(admin.ModelAdmin):
    fields = ('start_date', 'end_date', 'available', 'public', 'access_id', 'password', 'owner', 'reserved_by', 'kit')
    readonly_fields = ('access_id',)

admin.site.register(Laboratory)
admin.site.register(Kit)
admin.site.register(Booking, BookingAdmin)
admin.site.register(TimeFrame)
