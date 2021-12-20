from django.shortcuts import render
from rest_framework import generics
from reservations.serializers import BookingSerializer, KitSerializer, LaboratorySerializer
from reservations.models import Booking, Kit, Laboratory


class BookingList(generics.ListCreateAPIView):

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class BookingDetail(generics.RetrieveUpdateDestroyAPIView):

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class KitList(generics.ListCreateAPIView):

    queryset = Kit.objects.all()
    serializer_class = KitSerializer


class KitDetail(generics.RetrieveUpdateDestroyAPIView):

    queryset = Kit.objects.all()
    serializer_class = KitSerializer


class LaboratoryList(generics.ListCreateAPIView):

    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer


class LaboratoryDetail(generics.RetrieveUpdateDestroyAPIView):

    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer
