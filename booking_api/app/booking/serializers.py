"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
"""

from rest_framework import serializers
from booking.models import Booking, Equipment, Laboratory, TimeFrame, LaboratoryContent
from django.utils.crypto import get_random_string
from datetime import datetime, date, timedelta

from users.serializers import UserSerializer

class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = ['id', 'start_date', 'end_date', 'available', 'public', 'access_key', 'password', 'owner', 'reserved_by', 'equipment', 'timeframe']
        extra_kwargs = {
            'start_date': {'required': True},
            'end_date': {'required': True},
            'available': {'required': True},
            'public': {'required': True},
            'access_key': {'required': True},
            'user': {'required': True},
            'equipment': {'required': True},
            'owner': {'required': False}
        }

    def create(self, validated_data):
        validated_data['password'] = get_random_string(15)
        validated_data['owner'] = self.context['request'].user
        return Booking.objects.create(**validated_data)


class PublicBookingSerializer(serializers.ModelSerializer):

    reserved_by = UserSerializer()

    class Meta:
        model = Booking
        fields = ['id', 'start_date', 'end_date', 'available', 'public', 'access_key', 'password', 'owner', 'reserved_by', 'equipment']


class EquipmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Equipment
        fields = ['id', 'name', 'description', 'laboratory', 'enabled', 'owner']
        extra_kwargs = {
            'name': {'required': True},
            'laboratory': {'required': True},
            'description': {'required': False},
            'owner': {'required': False}
        }

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return Equipment.objects.create(**validated_data)

class TimeFrameSerializer(serializers.ModelSerializer):

    class Meta:
        model = TimeFrame
        fields = ['id', 'start_date', 'end_date', 'start_hour', 'end_hour', 'slot_duration', 'equipment', 'enabled', 'owner']
        extra_kwargs = {
            'start_date': {'required': True},
            'end_date': {'required': True},
            'start_hour': {'required': True},
            'end_hour': {'required': True},
            'slot_duration': {'required': True},
            'equipment': {'required': True},
            'owner': {'required': False}
        }

    def create(self, validated_data):
        public = self.context['request'].data.get('public', False)

        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        start_hour = validated_data['start_hour']
        end_hour = validated_data['end_hour']

        equipment = validated_data['equipment']
        slot_duration = validated_data['slot_duration']

        if start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date")

        time_delta = end_date - start_date
        number_of_days = time_delta.days

        if start_hour > end_hour:
            yesterday = datetime.now() - timedelta(1)
            number_of_slots = int(((datetime.combine(date.today(), end_hour) - datetime.combine(yesterday, start_hour)).total_seconds() / 60) / slot_duration)
        else:
            number_of_slots = int(((datetime.combine(date.today(), end_hour) - datetime.combine(date.today(), start_hour)).total_seconds() / 60) / slot_duration)

        validated_data['owner'] = self.context['request'].user
        timeframe = TimeFrame.objects.create(**validated_data)

        bookings = []

        for _ in range(number_of_days + 1):
            start_date = datetime.combine(start_date, start_hour).replace(tzinfo=datetime.now().astimezone().tzinfo)
            accumulated_date =  start_date

            for _ in range(number_of_slots):
                end_date = accumulated_date + timedelta(minutes=slot_duration)

                booking = Booking(
                    start_date=accumulated_date,
                    end_date=end_date,
                    available=True,
                    public=public,
                    password=get_random_string(15),
                    owner=self.context['request'].user,
                    timeframe=timeframe,
                    equipment=equipment
                )
                bookings.append(booking)

                accumulated_date = end_date

            start_date = start_date + timedelta(days=1)

        Booking.objects.bulk_create(bookings)

        return timeframe

class LaboratorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Laboratory
        fields = '__all__'
        extra_kwargs = {
            'name': {'required': True},
            'description': {'required': False},
            'owner': {'required': False},
            'image': {'required': False}
        }

    is_available_now = serializers.ReadOnlyField()

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return Laboratory.objects.create(**validated_data)

class LaboratoryContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaboratoryContent
        fields = '__all__'

    def validate(self, data):
        non_null_fields = ['text', 'image', 'video', 'video_link', 'link', 'title', 'subtitle']
        filled_fields = [field for field in non_null_fields if data.get(field) is not None]

        if len(filled_fields) != 1:
            raise serializers.ValidationError("Exactly one field among text, image, video, video_link, link, title, subtitle should have a non-null value.")

        return data
