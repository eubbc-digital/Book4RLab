from rest_framework import serializers
from reservations.models import Booking, Kit, Laboratory

class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = ['id', 'start_date', 'end_date', 'available', 'access_url', 'user', 'kit']
        extra_kwargs = {
            'start_date': {'required': True},
            'end_date': {'required': True},
            'available': {'required': True},
            'access_url': {'required': True},
            'user': {'required': True},
            'kit': {'required': True}
        }


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
