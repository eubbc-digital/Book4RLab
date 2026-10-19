"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils import timezone
from django.utils.translation import gettext as _
from users.models import InstructorRequest, User


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
        (_("Personal Info"), {"fields": ("name", "last_name", "country", "time_zone")}),
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


admin.site.register(User, UserAdmin)


@admin.register(InstructorRequest)
class InstructorRequestAdmin(admin.ModelAdmin):
    list_display = ("user", "requested_at", "approved", "approved_by", "approved_at")
    list_filter = ("approved",)
    search_fields = ("user__email", "user__name", "user__last_name")
    readonly_fields = ("user", "requested_at", "approved", "approved_by", "approved_at")
    actions = ["approve_requests"]

    @admin.action(description="Mark selected requests as approved (then assign the role in Keycloak)")
    def approve_requests(self, request, queryset):
        approved = []
        for instructor_request in queryset.select_related("user"):
            if instructor_request.approved:
                continue
            instructor_request.approved = True
            instructor_request.approved_by = request.user
            instructor_request.approved_at = timezone.now()
            instructor_request.save()
            approved.append(instructor_request.user.email)
        if approved:
            self.message_user(
                request,
                "Approved: " + ", ".join(approved) + ". Now give each of them the 'instructor' realm role in the Keycloak admin console.",
                level=messages.SUCCESS,
            )
        else:
            self.message_user(request, "Nothing to approve.", level=messages.INFO)
