"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.contrib import admin
from booking.models import Booking, Equipment, Laboratory, TimeFrame, LaboratoryContent


class LaboratoryAdmin(admin.ModelAdmin):
    ordering = ["id"]
    list_display = [
        "id",
        "name",
        "university",
        "instructor",
        "course",
        "image",
        "url",
        "enabled",
        "visible",
        "type",
        "owner",
        "availability_type",
    ]
    search_fields = ["name", "university", "owner__email"]


class EquipmentAdmin(admin.ModelAdmin):
    ordering = ["id"]
    list_display = ["id", "name", "description", "laboratory", "enabled", "owner"]
    search_fields = ["name", "owner__email"]


class BookingAdmin(admin.ModelAdmin):
    ordering = ["id"]
    list_display = [
        "id",
        "start_date",
        "end_date",
        "available",
        "public",
        "access_key",
        "password",
        "owner",
        "reserved_by",
        "equipment",
        "timeframe",
    ]
    search_fields = [
        "owner__email",
        "reserved_by__email",
        "timeframe__id",
        "equipment__id",
    ]
    readonly_fields = ["access_key"]


class TimeFrameAdmin(admin.ModelAdmin):
    ordering = ["id"]
    list_display = [
        "id",
        "start_date",
        "end_date",
        "start_hour",
        "end_hour",
        "slot_duration",
        "equipment",
        "enabled",
        "owner",
    ]
    search_fields = ["owner__email"]


class LaboratoryContentAdmin(admin.ModelAdmin):
    ordering = ["id"]
    list_display = [
        "id",
        "laboratory_name",
        "order",
        "title",
        "subtitle",
        "text",
        "image",
        "video",
        "video_link",
        "link",
        "is_last",
    ]

    def laboratory_name(self, obj):
        return f"{obj.laboratory.name} ({obj.laboratory.id})"


admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(Equipment, EquipmentAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(TimeFrame, TimeFrameAdmin)
admin.site.register(LaboratoryContent, LaboratoryContentAdmin)
