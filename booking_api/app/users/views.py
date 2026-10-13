"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from rest_framework import generics, permissions

from users.authentication import KeycloakTokenAuthentication
from users.serializers import UserProfileSerializer


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Authenticated user's profile. Login, signup, password reset and instructor requests run in Keycloak / eeda SSO."""

    serializer_class = UserProfileSerializer
    authentication_classes = (KeycloakTokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user
