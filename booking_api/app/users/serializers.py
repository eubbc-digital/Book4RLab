"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import Group
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import serializers
from utils import send_custom_email, account_activation_token
import os


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("name",)


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for the user profile object"""

    groups = GroupSerializer(many=True)

    class Meta:
        model = get_user_model()
        fields = ("id", "email", "name", "last_name", "country", "time_zone", "groups")
        read_only_fields = ("id", "email")


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object"""

    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "email",
            "password",
            "name",
            "last_name",
            "country",
            "time_zone",
        )
        extra_kwargs = {"password": {"write_only": True, "min_length": 8}}

    def create(self, validated_data):
        """Create a new user with encrypted password and return it"""
        user = get_user_model().objects.create_user(**validated_data)
        group = Group.objects.get(name="students")
        user.groups.add(group)

        subject = "Account activation"
        context = {
            "user_name": user.name,
            "ui_base_url": os.environ.get("UI_BASE_URL"),
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
        }
        template_name = "account_activation_email_template.html"
        recipient = [user.email]

        send_custom_email(subject, template_name, context, recipient)

        return user

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it"""
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user authentication object"""

    email = serializers.CharField()
    password = serializers.CharField(
        style={"input_type": "password"}, trim_whitespace=False
    )

    def validate(self, attrs):
        """Validate and authenticate the user"""
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"), username=email, password=password
        )

        if not user:
            msg = "Unable to authenticate"
            raise serializers.ValidationError(msg, code="authentication")

        attrs["user"] = user
        return attrs
