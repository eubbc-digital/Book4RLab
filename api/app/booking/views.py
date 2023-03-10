"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
"""

from django.shortcuts import render
from rest_framework import generics
from booking.serializers import BookingSerializer, KitSerializer, LaboratorySerializer, PublicBookingSerializer, TimeFrameSerializer
from booking.models import Booking, Kit, Laboratory, TimeFrame
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import SuspiciousOperation
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse
from django.conf import settings
from booking.permissions import IsOwnerOrReadOnly

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


class BookingAccess(generics.ListAPIView):

    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset = Booking.objects.all()
        access_key = self.request.query_params.get('access_key')
        password = self.request.query_params.get('pwd')

        if access_key is not None:
            queryset = queryset.filter(access_key=access_key)
        
            if queryset.count() == 1:
                if not queryset[0].public:
                    queryset = queryset.filter(password=password)

            now = datetime.datetime.now()
            queryset = queryset.filter(start_date__lte=now, end_date__gt=now)

            return queryset

        return None


class BookingPublicList(generics.ListAPIView):

    serializer_class = PublicBookingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Booking.objects.filter(public=True).exclude(reserved_by__isnull=True)

        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        kit = self.request.query_params.get('kit')
        
        if start_date is not None and end_date is not None:
            start_date_datetime = datetime.datetime.strptime(start_date, '%Y-%m-%dT%H:%M:%SZ')
            end_date_datetime = datetime.datetime.strptime(end_date, '%Y-%m-%dT%H:%M:%SZ')

            queryset = queryset.filter(start_date__gte=start_date_datetime, start_date__lt=end_date_datetime)

        if kit is not None:
            if not kit.isdigit():
                raise SuspiciousOperation('Kit id must be a number')

            queryset = queryset.filter(kit_id=int(kit))

        return queryset.filter(available=False)


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
            if instance.reserved_by is None: 
                instance.reserved_by = self.request.user

        recipient = [self.request.user.email]
        self.send_confirmation_email(instance, recipient)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance = self.get_object()
            serializer = self.get_serializer(instance)

        return Response(serializer.data)

    def send_confirmation_email(self, instance, recipient):
        subject = 'Booking confirmed!'

        print('Send confirmation email to: ' + str(recipient))

        kit = Kit.objects.get(id=instance.kit_id)
        laboratory = Laboratory.objects.get(id=kit.laboratory_id)

        body = ' Booking confirmed! \n'
        body += f' Your booking for kit {instance.kit.name} has been confirmed\n'
        body += f' Laboratory: {laboratory.name}\n'
        body += ' Details available at https://eubbc-digital.upb.edu/booking/my-reservations'
        body += '\n - UPB Team -'
        
        sender = settings.EMAIL_HOST_USER

        try:
            send_mail(subject, body, sender, recipient, fail_silently=True)
        except BadHeaderError:
            return HttpResponse("Invalid header found.")


class KitList(generics.ListCreateAPIView):

    queryset = Kit.objects.filter(enabled=True)
    serializer_class = KitSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)

    def get_queryset(self):
        queryset = Kit.objects.filter(enabled=True)
        laboratory = self.request.query_params.get('laboratory')

        if laboratory is not None:
            if not laboratory.isdigit():
                raise SuspiciousOperation('Laboratory id must be a number')

            return queryset.filter(laboratory_id=int(laboratory))

        return queryset


class KitDetail(generics.RetrieveUpdateAPIView):

    queryset = Kit.objects.filter(enabled=True)
    serializer_class = KitSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)


class LaboratoryList(generics.ListCreateAPIView):

    serializer_class = LaboratorySerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)

    def get_queryset(self):
        queryset = Laboratory.objects.filter(enabled=True)
        owner = self.request.query_params.get('owner')

        if owner is not None:
            if not owner.isdigit():
                raise SuspiciousOperation('Owner id must be a number')

            return queryset.filter(owner_id=int(owner))

        return queryset


class LaboratoryDetail(generics.RetrieveUpdateAPIView):

    queryset = Laboratory.objects.filter(enabled=True)
    serializer_class = LaboratorySerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class TimeFrameList(generics.ListCreateAPIView):

    queryset = TimeFrame.objects.all()
    serializer_class = TimeFrameSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)

    def get_queryset(self):
        queryset = TimeFrame.objects.all()
        kit = self.request.query_params.get('kit')

        if kit is not None:
            if not kit.isdigit():
                raise SuspiciousOperation('Kit id must be a number')

            return queryset.filter(kit_id=int(kit))

        return queryset


class TimeFrameDetail(generics.RetrieveUpdateDestroyAPIView):

    queryset = TimeFrame.objects.all()
    serializer_class = TimeFrameSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)
    