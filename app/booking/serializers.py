from rest_framework import serializers
from booking.models import Booking, Kit, Laboratory
from django.utils.crypto import get_random_string

class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = ['id', 'start_date', 'end_date', 'available', 'access_id', 'password', 'user', 'kit']
        extra_kwargs = {
            'start_date': {'required': True},
            'end_date': {'required': True},
            'available': {'required': True},
            'access_id': {'required': True},
            'user': {'required': True},
            'kit': {'required': True}
        }

    def create(self, validated_data):
        validated_data['password'] = get_random_string(15)
        return Booking.objects.create(**validated_data)


class KitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Kit
        fields = ['id', 'name', 'description', 'laboratory']
        extra_kwargs = {
            'name': {'required': True},
            'laboratory': {'required': True}
        }


class LaboratorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Laboratory
        fields = ['id', 'name', 'description']
        extra_kwargs = {
            'name': {'required': True}
        }
