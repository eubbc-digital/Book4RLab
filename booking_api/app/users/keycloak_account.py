"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
"""

import requests
from django.conf import settings


class KeycloakAccountError(Exception):
    """Keycloak account API unreachable or failed."""


class KeycloakAccountRejected(KeycloakAccountError):
    """Keycloak refused the profile values (for example a missing required field)."""


def update_account(bearer_token, first_name, last_name, attributes):
    """
    Update the signed-in user's own Keycloak profile with their own access token.
    Needs no admin rights: Keycloak lets a user edit time zone and country.
    """
    base = settings.KEYCLOAK_URL
    try:
        response = requests.post(
            f"{base}/realms/{settings.KEYCLOAK_REALM}/account",
            json={"firstName": first_name, "lastName": last_name, "attributes": attributes},
            headers={"Authorization": f"Bearer {bearer_token}"},
            timeout=settings.KEYCLOAK_TIMEOUT,
        )
    except requests.RequestException as exc:
        raise KeycloakAccountError(f"account update failed: {exc}") from exc
    if response.status_code in (200, 204):
        return
    if response.status_code == 400:
        raise KeycloakAccountRejected(response.text)
    raise KeycloakAccountError(f"account update returned {response.status_code}")
