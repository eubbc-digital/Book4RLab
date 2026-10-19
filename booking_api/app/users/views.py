"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

import logging

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.exceptions import APIException, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from users.authentication import KeycloakTokenAuthentication
from users.keycloak_account import KeycloakAccountError, KeycloakAccountRejected, update_account
from users.models import InstructorRequest
from users.serializers import UserProfileSerializer

logger = logging.getLogger(__name__)

# Fields Keycloak owns. A change to these is written to Keycloak before it is saved here.
KEYCLOAK_PROFILE_FIELDS = ("time_zone", "country")


class IdentityServiceUnavailable(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = "Identity service unavailable. Try again later."
    default_code = "identity_service_unavailable"


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Authenticated user's profile. Time zone and country are stored in Keycloak."""

    serializer_class = UserProfileSerializer
    authentication_classes = (KeycloakTokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        user = self.request.user
        data = serializer.validated_data
        if any(field in data for field in KEYCLOAK_PROFILE_FIELDS):
            # Keycloak holds these values. The account API needs the user's own token and the full profile.
            token = self.request.META.get("HTTP_AUTHORIZATION", "").split(" ", 1)[-1]
            try:
                update_account(
                    token,
                    first_name=user.name,
                    last_name=user.last_name,
                    attributes={
                        "time_zone": data.get("time_zone", user.time_zone),
                        "country": data.get("country", user.country) or "",
                    },
                )
            except KeycloakAccountRejected as exc:
                logger.info("Keycloak rejected profile values: %s", exc)
                raise ValidationError({"detail": "Keycloak did not accept these profile values."})
            except KeycloakAccountError:
                logger.exception("Could not update profile in Keycloak")
                raise IdentityServiceUnavailable()
        serializer.save()


class InstructorRequestView(APIView):
    """A signed-in user asks for instructor access. The team reviews the request in the admin."""

    authentication_classes = (KeycloakTokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    @staticmethod
    def _state(user):
        if user.groups.filter(name="instructors").exists():
            return "approved", None
        request = InstructorRequest.objects.filter(user=user).first()
        if request is None:
            return "none", None
        if request.approved:
            return "approved", request
        return "pending", request

    def get(self, request):
        state, _ = self._state(request.user)
        return Response({"status": state})

    def post(self, request):
        state, _ = self._state(request.user)
        if state != "none":
            return Response({"status": state}, status=status.HTTP_200_OK)

        user = request.user
        try:
            # The record is kept only if the team is told about it.
            with transaction.atomic():
                instructor_request = InstructorRequest.objects.create(user=user)
                send_mail(
                    subject="Instructor access request",
                    message=(
                        f"Name: {user.name} {user.last_name}\n"
                        f"Email: {user.email}\n"
                        f"Requested at: {instructor_request.requested_at.isoformat()}\n\n"
                        "Verify the requester, then approve the request in the Book4RLab admin."
                    ),
                    from_email=None,
                    recipient_list=[settings.INSTRUCTOR_REQUEST_EMAIL],
                    fail_silently=False,
                )
        except Exception:
            logger.exception("Instructor request could not be recorded or emailed")
            return Response(
                {"detail": "Could not notify the team. Try again later."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {"status": "pending", "requested_at": instructor_request.requested_at},
            status=status.HTTP_201_CREATED,
        )
