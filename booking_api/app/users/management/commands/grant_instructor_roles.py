"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
"""

from django.core.management.base import BaseCommand, CommandError

from users.keycloak_admin import KeycloakAdmin, KeycloakAdminError
from users.models import User


class Command(BaseCommand):
    """
    One-time step before switching to Keycloak roles: give the instructor realm role to everyone
    who is in the local "instructors" group, so their next sign-in does not remove their access.
    """

    help = "Give the Keycloak instructor realm role to every user in the local instructors group."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="List the users without changing Keycloak.")

    def handle(self, *args, dry_run=False, **options):
        users = User.objects.filter(groups__name="instructors").order_by("email")
        if dry_run:
            for user in users:
                self.stdout.write(f"would grant: {user.email}")
            self.stdout.write(f"{users.count()} user(s).")
            return

        try:
            keycloak = KeycloakAdmin()
        except KeycloakAdminError as exc:
            raise CommandError(str(exc))

        granted, missing, failed = 0, [], []
        for user in users:
            try:
                keycloak_id = keycloak.find_user_id(user)
                if keycloak_id is None:
                    missing.append(user.email)
                    continue
                keycloak.assign_instructor_role(keycloak_id)
                granted += 1
                self.stdout.write(f"granted: {user.email}")
            except KeycloakAdminError as exc:
                failed.append(f"{user.email} ({exc})")

        self.stdout.write(self.style.SUCCESS(f"{granted} user(s) given the instructor role."))
        for email in missing:
            self.stdout.write(self.style.WARNING(f"no matching Keycloak user: {email}"))
        for entry in failed:
            self.stdout.write(self.style.ERROR(f"failed: {entry}"))
        if failed:
            raise CommandError(f"{len(failed)} user(s) could not be given the role.")
