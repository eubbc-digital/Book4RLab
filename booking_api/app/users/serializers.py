"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("name",)


class UserSerializer(serializers.ModelSerializer):
    """Public user representation (nested in bookings). Identity data is managed in Keycloak."""

    class Meta:
        model = get_user_model()
        fields = ("id", "email", "name", "last_name", "country", "time_zone")
        read_only_fields = fields


class UserProfileSerializer(serializers.ModelSerializer):
    """Profile of the authenticated user. Name and email come from Keycloak and are read-only here."""

    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = get_user_model()
        fields = ("id", "email", "name", "last_name", "country", "time_zone", "institution", "groups")
        read_only_fields = ("id", "email", "name", "last_name", "groups")
