"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
"""

import requests
from django.conf import settings

# Realm role that grants instructor access; sync maps it to the "instructors" group
INSTRUCTOR_ROLE = "instructor"


class KeycloakAdminError(Exception):
    """Keycloak admin API unreachable, misconfigured or failed."""


def _base():
    return settings.KEYCLOAK_URL


def _admin_url(path):
    return f"{_base()}/admin/realms/{settings.KEYCLOAK_REALM}{path}"


def _request(method, url, **kwargs):
    try:
        response = requests.request(method, url, timeout=settings.KEYCLOAK_TIMEOUT, **kwargs)
    except requests.RequestException as exc:
        raise KeycloakAdminError(f"{method} {url} failed: {exc}") from exc
    if response.status_code >= 400:
        raise KeycloakAdminError(f"{method} {url} returned {response.status_code}")
    return response


def _service_token():
    """Access token of Book4RLab's service account (client credentials grant)."""
    if not settings.KEYCLOAK_ADMIN_CLIENT_ID or not settings.KEYCLOAK_ADMIN_CLIENT_SECRET:
        raise KeycloakAdminError("KEYCLOAK_ADMIN_CLIENT_ID and KEYCLOAK_ADMIN_CLIENT_SECRET are not set")
    response = _request(
        "POST",
        f"{_base()}/realms/{settings.KEYCLOAK_REALM}/protocol/openid-connect/token",
        data={
            "grant_type": "client_credentials",
            "client_id": settings.KEYCLOAK_ADMIN_CLIENT_ID,
            "client_secret": settings.KEYCLOAK_ADMIN_CLIENT_SECRET,
        },
    )
    return response.json()["access_token"]


class KeycloakAdmin:
    """Calls the Keycloak admin API as the service account. One token per instance."""

    def __init__(self):
        self._headers = {"Authorization": f"Bearer {_service_token()}"}

    def find_user_id(self, user):
        """Keycloak id of a local user: the token sub when linked, else an exact email match."""
        if user.keycloak_sub:
            return user.keycloak_sub
        matches = _request(
            "GET",
            _admin_url("/users"),
            params={"email": user.email, "exact": "true"},
            headers=self._headers,
        ).json()
        if len(matches) != 1:
            return None
        return matches[0]["id"]

    def assign_instructor_role(self, keycloak_id):
        """Give the instructor realm role. Assigning a role the user already has changes nothing."""
        role = _request("GET", _admin_url(f"/roles/{INSTRUCTOR_ROLE}"), headers=self._headers).json()
        _request(
            "POST",
            _admin_url(f"/users/{keycloak_id}/role-mappings/realm"),
            json=[{"id": role["id"], "name": role["name"]}],
            headers=self._headers,
        )
