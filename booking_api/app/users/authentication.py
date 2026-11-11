"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
"""

import jwt
from django.conf import settings
from rest_framework import authentication, exceptions

from users.keycloak import sync_user_from_claims, validate_access_token


class KeycloakTokenAuthentication(authentication.BaseAuthentication):
    """Authenticate `Authorization: Bearer <keycloak access token>` requests."""

    keyword = "Bearer"

    def authenticate_header(self, request):
        return f'{self.keyword} realm="{settings.KEYCLOAK_REALM}"'

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).split()
        if not header or header[0].lower() != self.keyword.lower().encode():
            return None
        if len(header) != 2:
            raise exceptions.AuthenticationFailed("Malformed Authorization header.")

        try:
            claims = validate_access_token(header[1].decode())
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired.")
        except jwt.PyJWKClientConnectionError:
            raise exceptions.AuthenticationFailed("Identity service unavailable.")
        except jwt.PyJWTError:
            raise exceptions.AuthenticationFailed("Invalid token.")

        try:
            user = sync_user_from_claims(claims)
        except jwt.PyJWTError as exc:
            # Missing or unverified email: the token is valid but cannot identify a local user
            raise exceptions.AuthenticationFailed(f"Invalid token: {exc}")
        return user, claims
