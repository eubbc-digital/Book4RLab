"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
"""

from django.contrib import admin
from booking.models import Booking, Equipment, Laboratory, TimeFrame, LaboratoryContent
from core import models

class BookingAdmin(admin.ModelAdmin):
    fields = ('start_date', 'end_date', 'available', 'public', 'access_key', 'password', 'owner', 'reserved_by', 'equipment')
    readonly_fields = ('access_key',)

admin.site.register(Laboratory)
admin.site.register(Equipment)
admin.site.register(Booking, BookingAdmin)
admin.site.register(TimeFrame)
admin.site.register(LaboratoryContent)
