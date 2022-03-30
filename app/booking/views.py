from django.shortcuts import render
from rest_framework import generics
from booking.serializers import BookingSerializer, KitSerializer, LaboratorySerializer
from booking.models import Booking, Kit, Laboratory
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import SuspiciousOperation
from rest_framework.response import Response
from rest_framework import status

import datetime

class BookingList(generics.ListCreateAPIView):

    serializer_class = BookingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Booking.objects.all()
        kit = self.request.query_params.get('kit')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date is not None and end_date is not None:
            start_date_datetime = datetime.datetime.strptime(start_date, '%Y-%m-%dT%H:%M:%SZ')
            end_date_datetime = datetime.datetime.strptime(end_date, '%Y-%m-%dT%H:%M:%SZ')

            queryset = queryset.filter(start_date__gte=start_date_datetime, start_date__lt=end_date_datetime)

        if kit is not None:
            if not kit.isdigit():
                raise SuspiciousOperation('Kit id must be a number')

            queryset = queryset.filter(kit_id=int(kit))

        return queryset.filter(available=True)


class BookingUserList(generics.ListAPIView):

    serializer_class = BookingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Booking.objects.all()
        user_id = self.request.user.id

        if user_id is not None:
            return queryset.filter(reserved_by=int(user_id))

        return None


class BookingPublicList(generics.ListAPIView):

    serializer_class = BookingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Booking.objects.filter(public=True).exclude(reserved_by__isnull=True)

        start_date = self.request.query_params.get('start_date')

        if start_date is not None:
            start_date_datetime = datetime.datetime.strptime(start_date, '%Y-%m-%dT%H:%M:%SZ')
            return queryset.filter(start_date__gte=start_date_datetime)

        return queryset


class BookingDetail(generics.RetrieveUpdateAPIView):

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        register = self.request.query_params.get('register')

        if register is not None and register == 'true':
            instance.reserved_by = self.request.user

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance = self.get_object()
            serializer = self.get_serializer(instance)

        return Response(serializer.data)


class KitList(generics.ListCreateAPIView):

    queryset = Kit.objects.all()
    serializer_class = KitSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Kit.objects.all()
        laboratory = self.request.query_params.get('laboratory')

        if laboratory is not None:
            if not laboratory.isdigit():
                raise SuspiciousOperation('Laboratory id must be a number')

            return queryset.filter(laboratory_id=int(laboratory))

        return queryset


class KitDetail(generics.RetrieveUpdateAPIView):

    queryset = Kit.objects.all()
    serializer_class = KitSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class LaboratoryList(generics.ListCreateAPIView):

    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class LaboratoryDetail(generics.RetrieveUpdateAPIView):

    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
