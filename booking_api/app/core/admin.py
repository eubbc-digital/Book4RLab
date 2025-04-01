"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _

from core import models


class UserAdmin(BaseUserAdmin):
    search_fields = ("email", "name", "last_name")
    ordering = ["id"]
    list_display = [
        "id",
        "email",
        "name",
        "last_name",
        "country",
        "time_zone",
        "display_user_groups",
        "is_active",
    ]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal Info"), {"fields": ("name", "last_name")}),
        (
            _("Permissions"),
            {"fields": ("is_active", "is_staff", "is_superuser", "groups")},
        ),
        (_("Important dates"), {"fields": ("last_login",)}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )

    def display_user_groups(self, obj):
        return ", ".join([group.name for group in obj.groups.all()])

    display_user_groups.short_description = "Groups"


admin.site.register(models.User, UserAdmin)
