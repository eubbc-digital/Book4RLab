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


def _account_request(method, bearer_token, **kwargs):
    try:
        return requests.request(
            method,
            f"{settings.KEYCLOAK_URL}/realms/{settings.KEYCLOAK_REALM}/account",
            headers={"Authorization": f"Bearer {bearer_token}"},
            timeout=settings.KEYCLOAK_TIMEOUT,
            **kwargs,
        )
    except requests.RequestException as exc:
        raise KeycloakAccountError(f"account {method} failed: {exc}") from exc


def update_account(bearer_token, attributes):
    """
    Update attributes of the signed-in user's own Keycloak profile with their own access token.
    Needs no admin rights. Keycloak treats the posted profile as the whole profile, so the current
    one is read first and only the given attributes are changed; everything else is sent back as is.
    """
    current = _account_request("GET", bearer_token)
    if current.status_code != 200:
        raise KeycloakAccountError(f"account read returned {current.status_code}")
    profile = current.json()
    merged = dict(profile.get("attributes") or {})
    merged.update({name: [value] for name, value in attributes.items()})
    profile["attributes"] = merged

    response = _account_request("POST", bearer_token, json=profile)
    if response.status_code in (200, 204):
        return
    if response.status_code == 400:
        raise KeycloakAccountRejected(response.text)
    raise KeycloakAccountError(f"account update returned {response.status_code}")
