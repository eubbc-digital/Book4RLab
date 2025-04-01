"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from core.models import User, InstructorRequest
from django.utils import timezone
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import authentication, generics, permissions, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.settings import api_settings
from users.serializers import UserSerializer, AuthTokenSerializer, UserProfileSerializer
from utils import account_activation_token, send_custom_email
import os


class CreateUserView(generics.CreateAPIView):
    """Create a new user"""

    serializer_class = UserSerializer


class CreateTokenView(ObtainAuthToken):
    """Get token for user"""

    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""

    serializer_class = UserProfileSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        """Retrieve and return authentication user"""
        return self.request.user


class ActivateAccountView(generics.GenericAPIView):
    def post(self, request):
        uid = request.data.get("uid", None)
        token = request.data.get("token", None)

        if not uid or not token:
            return Response(
                {"message": "uid and token are required in the request body."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response(
                {
                    "message": "Thank you for your email confirmation. Now you can log in to your account."
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Activation link is invalid!"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class InstructorAccessRequestView(generics.CreateAPIView):
    """Manage the request for instructor access"""

    def create(self, request, *args, **kwargs):
        administrator_email = os.environ.get("EMAIL_HOST_USER")
        email = request.data.get("email", None)

        try:
            user = User.objects.get(email=email)

            # Check if user already has instructor access
            if user.groups.filter(name__in=["instructors"]).exists():
                return Response(
                    {"message": "The user already has instructor access"},
                    status=status.HTTP_200_OK,
                )

            # Check for existing pending request
            if hasattr(user, "instructor_request"):
                if user.instructor_request.approved:
                    return Response(
                        {"message": "Instructor access was already approved"},
                        status=status.HTTP_200_OK,
                    )
                return Response(
                    {"message": "Instructor access request is pending approval"},
                    status=status.HTTP_200_OK,
                )

            # Create new request
            InstructorRequest.objects.create(user=user)

            # Send email notification
            subject = "Instructor Access Request"
            context = {
                "user_name": f"{user.name} {user.last_name}",
                "user_email": user.email,
            }
            template_name = "instructor_access_request_template.html"
            recipient = [administrator_email]

            send_custom_email(subject, template_name, context, recipient)

            return Response(
                {
                    "message": "Instructor access request sent",
                    "requested_at": timezone.now().isoformat(),
                },
                status=status.HTTP_201_CREATED,
            )

        except User.DoesNotExist:
            return Response(
                {"message": "Invalid email account"},
                status=status.HTTP_400_BAD_REQUEST,
            )
