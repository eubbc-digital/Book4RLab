from rest_framework import serializers
from booking.models import Booking, Kit, Laboratory
from django.utils.crypto import get_random_string

from users.serializers import UserSerializer

class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = ['id', 'start_date', 'end_date', 'available', 'public', 'access_id', 'password', 'owner', 'reserved_by', 'kit']
        extra_kwargs = {
            'start_date': {'required': True},
            'end_date': {'required': True},
            'available': {'required': True},
            'public': {'required': True},
            'access_id': {'required': True},
            'user': {'required': True},
            'kit': {'required': True}
        }

    def create(self, validated_data):
        validated_data['password'] = get_random_string(15)
        return Booking.objects.create(**validated_data)


class PublicBookingSerializer(serializers.ModelSerializer):

    reserved_by = UserSerializer()

    class Meta:
        model = Booking
        fields = ['id', 'start_date', 'end_date', 'available', 'public', 'access_id', 'password', 'owner', 'reserved_by', 'kit']
        

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
        fields = ['id', 'name', 'description', 'url']
        extra_kwargs = {
            'name': {'required': True}
        }
