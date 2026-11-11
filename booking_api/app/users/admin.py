"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

import logging

from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils import timezone
from django.utils.translation import gettext as _
from users.keycloak_admin import KeycloakAdmin, KeycloakAdminError
from users.models import InstructorRequest, User

logger = logging.getLogger(__name__)


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

    @admin.action(description="Approve selected requests and give the instructor role in Keycloak")
    def approve_requests(self, request, queryset):
        pending = [r for r in queryset.select_related("user") if not r.approved]
        if not pending:
            self.message_user(request, "Nothing to approve.", level=messages.INFO)
            return
        try:
            keycloak = KeycloakAdmin()
        except KeycloakAdminError as exc:
            logger.exception("Keycloak admin API unavailable")
            self.message_user(request, f"Nothing approved: Keycloak is not reachable ({exc}).", level=messages.ERROR)
            return

        approved, failed = [], []
        for instructor_request in pending:
            user = instructor_request.user
            # The role is given first; a request is marked approved only once Keycloak has it
            try:
                keycloak_id = keycloak.find_user_id(user)
                if keycloak_id is None:
                    failed.append(f"{user.email} (no matching Keycloak user)")
                    continue
                keycloak.assign_instructor_role(keycloak_id)
            except KeycloakAdminError:
                logger.exception("Could not give the instructor role to %s", user.email)
                failed.append(user.email)
                continue
            instructor_request.approved = True
            instructor_request.approved_by = request.user
            instructor_request.approved_at = timezone.now()
            instructor_request.save()
            approved.append(user.email)

        if approved:
            self.message_user(
                request,
                "Approved and given the instructor role: " + ", ".join(approved)
                + ". Access starts with their next sign-in or token refresh.",
                level=messages.SUCCESS,
            )
        if failed:
            self.message_user(request, "Not approved: " + ", ".join(failed) + ".", level=messages.ERROR)
