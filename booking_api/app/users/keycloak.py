"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
"""

import jwt
from django.conf import settings
from django.contrib.auth.models import Group
from django.db import transaction

from users.models import User

# Keycloak realm roles that map to the Django groups the UI and permissions use
ROLE_TO_GROUP = {"instructor": "instructors", "student": "students"}

_jwks_client = None


def _realm_base(base_url):
    return f"{base_url.rstrip('/')}/realms/{settings.KEYCLOAK_REALM}"


def _get_jwks_client():
    global _jwks_client
    if _jwks_client is None:
        certs_url = (
            f"{_realm_base(settings.KEYCLOAK_INTERNAL_URL)}/protocol/openid-connect/certs"
        )
        _jwks_client = jwt.PyJWKClient(certs_url, cache_keys=True)
    return _jwks_client


def validate_access_token(token):
    """Check signature, issuer, expiry and calling client. Returns claims or raises jwt.PyJWTError."""
    signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
    claims = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        issuer=_realm_base(settings.KEYCLOAK_PUBLIC_URL),
        # aud is "account" for most Keycloak tokens; the calling client is checked via azp
        options={"require": ["exp", "iat", "iss", "sub"], "verify_aud": False},
        leeway=30,
    )
    if claims.get("azp") not in settings.KEYCLOAK_ALLOWED_CLIENTS:
        raise jwt.InvalidTokenError(f"client not allowed: {claims.get('azp')}")
    return claims


def _desired_group_names(claims):
    roles = (claims.get("realm_access") or {}).get("roles", [])
    return {group for role, group in ROLE_TO_GROUP.items() if role in roles}


@transaction.atomic
def sync_user_from_claims(claims):
    """
    Find or create the local User for a Keycloak identity and mirror its name and roles.

    Matching: keycloak_sub first, then email (only for a verified email, so an unverified
    Keycloak address can never take over an existing account).
    """
    sub = claims["sub"]
    email = (claims.get("email") or "").lower()
    if not email:
        raise jwt.InvalidTokenError("token has no email claim")

    user = User.objects.filter(keycloak_sub=sub).first()
    if user is None:
        if not claims.get("email_verified"):
            raise jwt.InvalidTokenError("email not verified")
        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            user = User(email=email)
            user.set_unusable_password()
        user.keycloak_sub = sub

    user.email = email
    user.name = claims.get("given_name", "") or user.name
    user.last_name = claims.get("family_name", "") or user.last_name
    # Keycloak is the source of truth for time zone and country; keep the local copy in step.
    user.time_zone = claims.get("time_zone") or user.time_zone
    user.country = claims.get("country") or user.country
    user.is_active = True
    user.save()

    desired = _desired_group_names(claims)
    managed = set(ROLE_TO_GROUP.values())
    current = set(user.groups.filter(name__in=managed).values_list("name", flat=True))
    if desired != current:
        user.groups.remove(*Group.objects.filter(name__in=managed - desired))
        user.groups.add(*Group.objects.filter(name__in=desired - current))
    return user
