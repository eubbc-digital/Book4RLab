"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from booking.models import Booking, Equipment, Laboratory, TimeFrame, LaboratoryContent
from datetime import datetime, date, timedelta
from django.db.models import Q
from django.utils.crypto import get_random_string
from rest_framework import serializers
from users.serializers import UserSerializer
import re


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id",
            "start_date",
            "end_date",
            "available",
            "public",
            "access_key",
            "password",
            "owner",
            "reserved_by",
            "equipment",
            "timeframe",
        ]
        extra_kwargs = {
            "start_date": {"required": True},
            "end_date": {"required": True},
            "available": {"required": True},
            "public": {"required": True},
            "access_key": {"required": True},
            "user": {"required": True},
            "equipment": {"required": True},
            "owner": {"required": False},
        }

    def create(self, validated_data):
        validated_data["password"] = get_random_string(15)
        validated_data["owner"] = self.context["request"].user
        return Booking.objects.create(**validated_data)


class BookingAccessSerializer(BookingSerializer):
    reserved_by = serializers.SerializerMethodField()
    equipment = serializers.SerializerMethodField()

    class Meta(BookingSerializer.Meta):
        fields = [
            "id",
            "start_date",
            "end_date",
            "available",
            "public",
            "reserved_by",
            "equipment",
        ]

    def get_reserved_by(self, obj):
        if obj.reserved_by:
            return {
                "name": obj.reserved_by.name,
                "last_name": obj.reserved_by.last_name,
                "email": obj.reserved_by.email,
            }
        return None

    def get_equipment(self, obj):
        if obj.reserved_by:
            return {"id": obj.equipment.id, "name": obj.equipment.name}
        return None


class PublicBookingSerializer(serializers.ModelSerializer):
    reserved_by = UserSerializer()

    class Meta:
        model = Booking
        fields = [
            "id",
            "start_date",
            "end_date",
            "available",
            "public",
            "access_key",
            "password",
            "owner",
            "reserved_by",
            "equipment",
        ]


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = [
            "id",
            "name",
            "description",
            "laboratory",
            "enabled",
            "owner",
            "bookings_per_user",
        ]
        extra_kwargs = {
            "name": {"required": True},
            "laboratory": {"required": True},
            "description": {"required": False},
            "owner": {"required": False},
        }

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return Equipment.objects.create(**validated_data)


class TimeFrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeFrame
        fields = [
            "id",
            "start_date",
            "end_date",
            "start_hour",
            "end_hour",
            "slot_duration",
            "equipment",
            "enabled",
            "owner",
        ]
        extra_kwargs = {
            "start_date": {"required": True},
            "end_date": {"required": True},
            "start_hour": {"required": True},
            "end_hour": {"required": True},
            "slot_duration": {"required": True},
            "equipment": {"required": True},
            "owner": {"required": False},
        }

    def create(self, validated_data):
        public = self.context["request"].data.get("public", False)

        start_date = validated_data["start_date"]
        end_date = validated_data["end_date"]
        start_hour = validated_data["start_hour"]
        end_hour = validated_data["end_hour"]

        equipment = validated_data["equipment"]
        slot_duration = validated_data["slot_duration"]

        if start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date")

        time_delta = end_date - start_date
        number_of_days = time_delta.days

        if start_hour > end_hour:
            yesterday = datetime.now() - timedelta(1)
            number_of_slots = int(
                (
                    (
                        datetime.combine(date.today(), end_hour)
                        - datetime.combine(yesterday, start_hour)
                    ).total_seconds()
                    / 60
                )
                / slot_duration
            )
        else:
            number_of_slots = int(
                (
                    (
                        datetime.combine(date.today(), end_hour)
                        - datetime.combine(date.today(), start_hour)
                    ).total_seconds()
                    / 60
                )
                / slot_duration
            )

        validated_data["owner"] = self.context["request"].user
        timeframe = TimeFrame.objects.create(**validated_data)

        bookings = []

        for _ in range(number_of_days + 1):
            start_date = datetime.combine(start_date, start_hour).replace(
                tzinfo=datetime.now().astimezone().tzinfo
            )
            accumulated_date = start_date

            for _ in range(number_of_slots):
                end_date = accumulated_date + timedelta(minutes=slot_duration)

                booking = Booking(
                    start_date=accumulated_date,
                    end_date=end_date,
                    available=True,
                    public=public,
                    password=get_random_string(15),
                    owner=self.context["request"].user,
                    timeframe=timeframe,
                    equipment=equipment,
                )
                bookings.append(booking)

                accumulated_date = end_date

            start_date = start_date + timedelta(days=1)

        Booking.objects.bulk_create(bookings)

        return timeframe


class LaboratorySerializer(serializers.ModelSerializer):
    country = serializers.SerializerMethodField()
    owner_email = serializers.SerializerMethodField()
    has_learnify_modules = serializers.SerializerMethodField()
    instructor = serializers.CharField()

    class Meta:
        model = Laboratory
        fields = "__all__"
        extra_kwargs = {
            "name": {"required": True},
            "description": {"required": False},
            "owner": {"required": False},
            "image": {"required": False},
        }

    is_available_now = serializers.ReadOnlyField()

    def get_country(self, obj):
        if obj.owner and hasattr(obj.owner, "country"):
            return obj.owner.country
        return None

    def get_owner_email(self, obj):
        if obj.owner:
            return obj.owner.email
        return None

    def get_has_learnify_modules(self, obj):
        return obj.laboratory_contents.filter(
            Q(link__iregex=r"^https?://(time\.)?learnify\.se/")
            | Q(video_link__iregex=r"^https?://(time\.)?learnify\.se/")
        ).exists()

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return Laboratory.objects.create(**validated_data)
    
    def validate_instructor(self, value):
        if not value:
            raise serializers.ValidationError("At least one lab instructor is required")

        names = re.split(r'\s*,\s*', value.strip())
        
        # Pattern: Name [Name2] Lastname1 [Lastname2] (2+ letters each)
        pattern = r'^[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}){1,3}$'
        invalid = [name for name in names if not re.match(pattern, name)]
        
        if invalid:
            error_msg = (
                f"Invalid instructor format in: {', '.join(invalid)}. "
                "Required format: Name [SecondName] Lastname [SecondLastname] "
                "(minimum 2 letters each)"
            )
            raise serializers.ValidationError(error_msg)
        
        return ','.join(names)

class LaboratoryContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaboratoryContent
        fields = "__all__"

    def validate(self, data):
        non_null_fields = [
            "text",
            "image",
            "video",
            "video_link",
            "link",
            "title",
            "subtitle",
        ]
        filled_fields = [
            field for field in non_null_fields if data.get(field) is not None
        ]

        if len(filled_fields) != 1:
            raise serializers.ValidationError(
                "Exactly one field among text, image, video, video_link, link, title, subtitle should have a non-null value."
            )

        return data


class UserLaboratoryAccessSerializer(serializers.Serializer):
    laboratory_id = serializers.IntegerField()


class UserBookingAvailabilitySerializer(serializers.Serializer):
    equipment_id = serializers.IntegerField()
    timeframe_id = serializers.IntegerField()
