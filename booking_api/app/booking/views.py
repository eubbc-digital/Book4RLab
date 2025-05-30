"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from booking.models import Booking, Equipment, Laboratory, TimeFrame, LaboratoryContent
from booking.permissions import IsOwnerOrReadOnly
from booking.serializers import (
    BookingSerializer,
    BookingAccessSerializer,
    EquipmentSerializer,
    LaboratorySerializer,
    PublicBookingSerializer,
    TimeFrameSerializer,
    LaboratoryContentSerializer,
    UserLaboratoryAccessSerializer,
    UserBookingAvailabilitySerializer,
)
from users.models import User
from django.core.exceptions import SuspiciousOperation
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from utils import send_custom_email, get_correct_datetime
import datetime


class BookingList(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Booking.objects.all()
        equipment = self.request.query_params.get("equipment")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if start_date is not None and end_date is not None:
            start_date_datetime = datetime.datetime.strptime(
                start_date, "%Y-%m-%dT%H:%M:%SZ"
            )
            end_date_datetime = datetime.datetime.strptime(
                end_date, "%Y-%m-%dT%H:%M:%SZ"
            )

            queryset = queryset.filter(
                start_date__gte=start_date_datetime, start_date__lt=end_date_datetime
            )

        if equipment is not None:
            if not equipment.isdigit():
                raise SuspiciousOperation("Equipment id must be a number")

            queryset = queryset.filter(equipment_id=int(equipment))

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
    serializer_class = BookingAccessSerializer

    def get_queryset(self):
        queryset = Booking.objects.none()
        access_key = self.request.query_params.get("access_key")
        password = self.request.query_params.get("pwd")

        try:
            if access_key is not None:
                queryset = Booking.objects.filter(access_key=access_key)

                if queryset.count() == 1 and not queryset[0].public:
                    queryset = queryset.filter(password=password)

                now = datetime.datetime.now()
                queryset = queryset.filter(start_date__lte=now, end_date__gt=now)

        except ValidationError:
            queryset = Booking.objects.none()

        return queryset


class BookingPublicList(generics.ListAPIView):
    serializer_class = PublicBookingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Booking.objects.filter(public=True).exclude(reserved_by__isnull=True)

        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        equipment = self.request.query_params.get("equipment")

        if start_date is not None and end_date is not None:
            start_date_datetime = datetime.datetime.strptime(
                start_date, "%Y-%m-%dT%H:%M:%SZ"
            )
            end_date_datetime = datetime.datetime.strptime(
                end_date, "%Y-%m-%dT%H:%M:%SZ"
            )

            queryset = queryset.filter(
                start_date__gte=start_date_datetime, start_date__lt=end_date_datetime
            )

        if equipment is not None:
            if not equipment.isdigit():
                raise SuspiciousOperation("Equipment id must be a number")

            queryset = queryset.filter(equipment_id=int(equipment))

        return queryset.filter(available=False)


class BookingDetail(generics.RetrieveUpdateAPIView):
    queryset = Booking.objects.all()

    serializer_class = BookingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        register = self.request.query_params.get("register")
        confirmed = self.request.query_params.get("confirmed")
        cancelled = self.request.query_params.get("cancelled")

        equipment = Equipment.objects.get(id=instance.equipment_id)
        laboratory = Laboratory.objects.get(id=equipment.laboratory_id)
        base_url = f"{laboratory.url}?access_key={instance.access_key}"
        date_format = "%d/%m/%Y %I:%M %p"
        context = {
            "equipment_name": instance.equipment.name,
            "lab_name": laboratory.name,
            "is_public": self.request.data["public"],
        }

        if register is not None and register == "true":
            if instance.reserved_by is None:
                instance.reserved_by = self.request.user

        if confirmed is not None and confirmed == "true":
            recipient = [self.request.user.email]
            subject = "Booking confirmation"
            user_tz = User.objects.get(email=instance.reserved_by).time_zone
            template = "booking_confirmation_email_template.html"

            context["private_url"] = f"{base_url}&pwd={instance.password}"
            context["public_url"] = base_url
            context["start_date"] = get_correct_datetime(
                instance.start_date, user_tz
            ).strftime(date_format)
            context["end_date"] = get_correct_datetime(
                instance.end_date, user_tz
            ).strftime(date_format)

            send_custom_email(subject, template, context, recipient)

            if laboratory.notify_owner:
                owner_recipient = [laboratory.owner.email]
                owner_subject = "New booking for your laboratory"
                owner_tz = User.objects.get(email=laboratory.owner.email).time_zone
                owner_template = "booking_confirmation_owner_email_template.html"

                owner_context = context
                owner_context["start_date"] = get_correct_datetime(
                    instance.start_date, owner_tz
                ).strftime(date_format)
                owner_context["end_date"] = get_correct_datetime(
                    instance.end_date, owner_tz
                ).strftime(date_format)
                owner_context["student_name"] = (
                    f"{self.request.user.name} {self.request.user.last_name}"
                )
                owner_context["student_email"] = f"{self.request.user.email}"

                send_custom_email(
                    owner_subject, owner_template, owner_context, owner_recipient
                )

        if cancelled is not None and cancelled == "true":
            recipient = [self.request.user.email]
            subject = "Booking cancellation"
            user_tz = User.objects.get(email=instance.reserved_by).time_zone
            template = "booking_cancellation_email_template.html"

            context["start_date"] = get_correct_datetime(
                instance.start_date, user_tz
            ).strftime(date_format)
            context["end_date"] = get_correct_datetime(
                instance.end_date, user_tz
            ).strftime(date_format)

            send_custom_email(subject, template, context, recipient)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance = self.get_object()
            serializer = self.get_serializer(instance)

        return Response(serializer.data)


class EquipmentList(generics.ListCreateAPIView):
    queryset = Equipment.objects.filter(enabled=True)
    serializer_class = EquipmentSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)

    def get_queryset(self):
        queryset = Equipment.objects.filter(enabled=True)
        laboratory = self.request.query_params.get("laboratory")

        if laboratory is not None:
            if not laboratory.isdigit():
                raise SuspiciousOperation("Laboratory id must be a number")

            return queryset.filter(laboratory_id=int(laboratory))

        return queryset


class EquipmentDetail(generics.RetrieveUpdateAPIView):
    queryset = Equipment.objects.filter(enabled=True)
    serializer_class = EquipmentSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)


class TimeFrameList(generics.ListCreateAPIView):
    queryset = TimeFrame.objects.all()
    serializer_class = TimeFrameSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)

    def get_queryset(self):
        queryset = TimeFrame.objects.all()
        equipment = self.request.query_params.get("equipment")

        if equipment is not None:
            if not equipment.isdigit():
                raise SuspiciousOperation("Equipment id must be a number")

            return queryset.filter(equipment_id=int(equipment))

        return queryset


class TimeFrameDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimeFrame.objects.all()
    serializer_class = TimeFrameSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)


class LaboratoryList(generics.ListCreateAPIView):
    serializer_class = LaboratorySerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)

    def get_queryset(self):
        queryset = Laboratory.objects.filter(enabled=True)
        owner = self.request.query_params.get("owner")
        visible = self.request.query_params.get("visible")

        if owner is not None:
            if not owner.isdigit():
                raise SuspiciousOperation("Owner id must be a number")

            return queryset.filter(owner_id=int(owner))

        if visible is not None:
            if visible == "true":
                return queryset.filter(visible=True)
            elif visible == "false":
                return queryset.filter(visible=False)

        return queryset


class PublicLaboratoryList(generics.ListAPIView):
    serializer_class = LaboratorySerializer

    def get_queryset(self):
        queryset = (
            Laboratory.objects.filter(enabled=True).filter(visible=True).order_by("id")
        )
        return queryset


class LaboratoryRetrieve(generics.RetrieveAPIView):
    serializer_class = LaboratorySerializer
    queryset = Laboratory.objects.filter(enabled=True)


class LaboratoryUpdate(generics.UpdateAPIView):
    queryset = Laboratory.objects.filter(enabled=True)

    serializer_class = LaboratorySerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class LaboratoryContentList(generics.ListCreateAPIView):
    serializer_class = LaboratoryContentSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    queryset = LaboratoryContent.objects.all()

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(LaboratoryContentList, self).get_serializer(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        data = request.data
        laboratory_id = data.get("laboratory")
        existing_contents = LaboratoryContent.objects.filter(laboratory=laboratory_id)

        order = data.get("order")
        if order is None:
            return Response(
                {"order": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if data.get("is_last"):
            existing_contents.filter(order__gt=order).delete()

        content_instance = existing_contents.filter(order=order).first()
        if content_instance:
            serializer = LaboratoryContentSerializer(content_instance, data=data)
            if serializer.is_valid():
                field_name = [
                    key
                    for key in data.keys()
                    if key not in ("laboratory", "order", "is_last")
                ][0]
                for field in (
                    "text",
                    "image",
                    "video",
                    "video_link",
                    "link",
                    "title",
                    "subtitle",
                ):
                    if field != field_name:
                        setattr(content_instance, field, None)

                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = LaboratoryContentSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        created_content = LaboratoryContent.objects.filter(
            laboratory=laboratory_id, order=order
        ).first()
        if not created_content:
            return Response(
                {"error": "Failed to retrieve the created content."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            LaboratoryContentSerializer(created_content).data,
            status=status.HTTP_201_CREATED,
        )


class LaboratoryContentDeleteAll(generics.DestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def delete(self, request, *args, **kwargs):
        laboratory_id = kwargs.get("laboratory_id")

        LaboratoryContent.objects.filter(laboratory=laboratory_id).delete()
        return Response("All contents successfully deleted", status=status.HTTP_200_OK)


class LaboratoryContentRetrieve(generics.ListAPIView):
    serializer_class = LaboratoryContentSerializer

    def get_queryset(self):
        laboratory_id = self.kwargs.get("laboratory_id")
        laboratory = Laboratory.objects.get(pk=laboratory_id)
        contents = LaboratoryContent.objects.filter(laboratory=laboratory)
        return contents


class UserLaboratoryAccess(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = UserLaboratoryAccessSerializer(data=request.data)
        if serializer.is_valid():
            laboratory_id = serializer.validated_data.get("laboratory_id")
            user_email = request.user.email

            try:
                laboratory = Laboratory.objects.get(id=laboratory_id)
            except Laboratory.DoesNotExist:
                return Response(
                    {"error": "Laboratory does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            allowed_emails = laboratory.allowed_emails.split(",")
            if user_email in allowed_emails:
                return Response({"access": True}, status=status.HTTP_200_OK)
            else:
                return Response({"access": False}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserBookingAvailability(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = UserBookingAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            equipment_id = serializer.validated_data.get("equipment_id")
            timeframe_id = serializer.validated_data.get("timeframe_id")
            user_id = request.user.id

            try:
                equipment = Equipment.objects.get(id=equipment_id)
            except Equipment.DoesNotExist:
                return Response(
                    {"error": "Equipment does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            max_bookings_per_user = equipment.bookings_per_user
            current_bookings_per_user = (
                Booking.objects.all()
                .filter(timeframe_id=timeframe_id, reserved_by=user_id)
                .count()
            )
            if current_bookings_per_user < max_bookings_per_user:
                return Response({"booking_available": True}, status=status.HTTP_200_OK)
            else:
                return Response({"booking_available": False}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
