"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
"""

import logging
from datetime import datetime, timedelta, timezone as dt_timezone

import jwt
from django.conf import settings
from django.contrib.auth.models import Group
from django.db import transaction
from django.utils import timezone

from users.models import InstructorRequest, User

logger = logging.getLogger(__name__)

# User fields that Keycloak holds; the local row keeps a copy taken from the token claims
KEYCLOAK_PROFILE_FIELDS = ("time_zone", "country", "institution")

# Keycloak realm roles that map to the Django groups the UI and permissions use
ROLE_TO_GROUP = {"instructor": "instructors", "student": "students"}
INSTRUCTOR_ROLE = "instructor"
# Allowed difference between the Keycloak and API clocks when comparing a token's iat
CLOCK_MARGIN = timedelta(seconds=60)

_jwks_client = None


def _realm_base(base_url):
    return f"{base_url.rstrip('/')}/realms/{settings.KEYCLOAK_REALM}"


def _get_jwks_client():
    global _jwks_client
    if _jwks_client is None:
        certs_url = (
            f"{_realm_base(settings.KEYCLOAK_URL)}/protocol/openid-connect/certs"
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
        issuer=_realm_base(settings.KEYCLOAK_URL),
        # aud is "account" for most Keycloak tokens; the calling client is checked via azp
        options={"require": ["exp", "iat", "iss", "sub"], "verify_aud": False},
        leeway=30,
    )
    if claims.get("azp") not in settings.KEYCLOAK_ALLOWED_CLIENTS:
        raise jwt.InvalidTokenError(f"client not allowed: {claims.get('azp')}")
    return claims


def _realm_roles(claims):
    return (claims.get("realm_access") or {}).get("roles", [])


def _desired_group_names(claims):
    roles = _realm_roles(claims)
    return {group for role, group in ROLE_TO_GROUP.items() if role in roles}


def _revoke_instructor_request_if_role_removed(user, claims):
    """
    An approved request whose role is gone from Keycloak is marked revoked, so the user can request again.

    Only tokens issued after the approval count: one issued before it lacks the role because Keycloak
    had not given it yet, not because it was removed.
    """
    if INSTRUCTOR_ROLE in _realm_roles(claims):
        return
    issued_at = datetime.fromtimestamp(claims.get("iat", 0), tz=dt_timezone.utc)
    InstructorRequest.objects.filter(
        user=user, approved=True, approved_at__lt=issued_at - CLOCK_MARGIN
    ).update(approved=False, revoked_at=timezone.now())


def _copy_profile_claims(user, claims):
    """
    Keycloak is the source of truth for time zone, country and institution; keep the local copy in step.

    Skipped for tokens issued before the user's last profile change here: they still carry the old values.
    A value that does not fit the column is ignored, so one bad attribute cannot break every request.
    """
    if user.profile_updated_at and claims.get("iat", 0) <= user.profile_updated_at.timestamp():
        return
    for field in KEYCLOAK_PROFILE_FIELDS:
        value = claims.get(field)
        if not value:
            continue
        max_length = User._meta.get_field(field).max_length
        if not isinstance(value, str) or len(value) > max_length:
            logger.warning("Ignoring Keycloak %s claim for %s: not a string of at most %s characters", field, claims["sub"], max_length)
            continue
        setattr(user, field, value)


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
    _copy_profile_claims(user, claims)
    # Blocking a user is done in Keycloak (a disabled user gets no token), so is_active is not touched here
    user.save()

    desired = _desired_group_names(claims)
    managed = set(ROLE_TO_GROUP.values())
    current = set(user.groups.filter(name__in=managed).values_list("name", flat=True))
    if desired != current:
        user.groups.remove(*Group.objects.filter(name__in=managed - desired))
        user.groups.add(*Group.objects.filter(name__in=desired - current))
    _revoke_instructor_request_if_role_removed(user, claims)
    return user
