"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
"""

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from booking.models import Kit, Laboratory, Booking
from booking.serializers import BookingSerializer

import datetime
import uuid

import pytz

BOOKING_URL = reverse('booking:bookinglist')


class PublicBookingApiTests(TestCase):
    """Test the publicly available Booking API"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required to access the endpoint"""
        res = self.client.get(BOOKING_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateBookingApiTests(TestCase):
    """Test the private Booking API"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'test@upb.edu',
            'Password123'
        )

        self.user2 = get_user_model().objects.create_user(
            'test2@upb.edu',
            'Password123'
        )

        self.client.force_authenticate(self.user)

    def test_retrieve_booking_list(self):
        """Test retrieving a list of bookings"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)
        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            owner=self.user,
            reserved_by=None,
            password='JKLNXNZUOQEJLKD',
            kit=kit)

        res = self.client.get(BOOKING_URL)

        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_booking_list_within_date(self):
        """Test retrieving a list of bookings within date range"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            public=True,
            owner=self.user,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 13, 0, tzinfo=pytz.UTC),
            available=True,
            public=True,
            owner=self.user,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 13, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 15, 0, tzinfo=pytz.UTC),
            available=False,
            public=True,
            owner=self.user,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 17, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            public=False,
            owner=self.user2,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit)

        res = self.client.get(BOOKING_URL + '?start_date=2003-5-16T00:00:00Z&end_date=2003-5-17T00:00:00Z')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_retrieve_booking_public_list(self):
        """Test retrieving a list of public bookings"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=False,
            public=True,
            owner=self.user,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=False,
            public=True,
            owner=self.user,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=False,
            public=False,
            owner=self.user2,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit)

        res = self.client.get(BOOKING_URL + 'public/')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_retrieve_booking_public_list_by_date(self):
        """Test retrieving a list of public bookings within date range and kit"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit1 = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)
        kit2 = Kit.objects.create(name='Kit 2', description='Spectrometry Labo', laboratory=laboratory)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=False,
            public=True,
            owner=self.user,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=False,
            public=True,
            owner=self.user,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2004, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2004, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=False,
            public=True,
            owner=self.user2,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2004, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2004, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=False,
            public=True,
            owner=self.user2,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2004, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2004, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=False,
            public=True,
            owner=self.user2,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit2)

        Booking.objects.create(start_date=datetime.datetime(2008, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2008, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=False,
            public=True,
            owner=self.user2,
            reserved_by=self.user,
            password='JKLNXNZUOQEJLKD',
            kit=kit1)

        res = self.client.get(BOOKING_URL + 'public/?start_date=2004-01-01T0:00:00Z&end_date=2005-01-01T0:00:00Z&kit=' + str(kit1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_create_booking_successful(self):
        """Test create a new kit"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)

        payload = {
            'start_date': datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC), 
            'end_date': datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            'available': False,
            'public': True,
            'access_id': uuid.uuid4(),
            'password': 'JKLNXNZUOQEJLKD',
            'owner': self.user.id,
            'kit': str(kit.id)
        }
        
        self.client.post(BOOKING_URL, payload)

        exists = Booking.objects.filter(
            start_date=payload['start_date'],
            end_date=payload['end_date'],
            available=payload['available'],
            public=payload['public'],
            owner=payload['owner'],
            kit=payload['kit']
        ).exists()

        self.assertTrue(exists)

    def test_create_booking_without_kit(self):
        """Test create a new booking without kit"""
        payload = {
            'start_date': datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC), 
            'end_date': datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            'available': False,
            'public': False,
            'owner': self.user.id,
            'reserved_by': None,
            'kit': ''
        }
        
        res = self.client.post(BOOKING_URL, payload=payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


    def test_create_invalid_booking(self):
        """Test creating invalid booking fails"""
        payload = {
            'start_date': '', 
            'end_date': '',
            'available': False,
            'user': '',
            'kit': ''
        }
        res = self.client.post(BOOKING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_booking_detail(self):
        """Test retrieve a booking detail"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)
        booking = Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            public=False,
            access_id=uuid.uuid4(),
            password='JKLNXNZUOQEJLKD',
            owner=self.user,
            reserved_by=self.user,
            kit=kit)

        res = self.client.get(BOOKING_URL + str(booking.id) + '/')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'id': booking.id,
            'start_date': booking.start_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'end_date': booking.end_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'available': booking.available,
            'public': booking.public,
            'access_id': str(booking.access_id),
            'password': booking.password,
            'owner': booking.owner.id,
            'reserved_by': booking.reserved_by.id,
            'kit': booking.kit.id
        })

    def test_update_booking_detail_with_registering_user(self):
        """Test update a booking with registering user"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)
        
        booking = Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            public=False,
            access_id=uuid.uuid4(),
            password='JKLNXNZUOQEJLKD',
            owner=self.user,
            reserved_by=None,
            kit=kit)

        payload = {
            'available': True
        }

        res = self.client.patch(BOOKING_URL + str(booking.id) + '/?register=true', payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'id': booking.id,
            'start_date': booking.start_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'end_date': booking.end_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'available': True,
            'public': booking.public,
            'access_id': str(booking.access_id),
            'password': booking.password,
            'owner': booking.owner.id,
            'reserved_by': self.user.id,
            'kit': booking.kit.id
        })

    def test_retrieve_booking_by_kit_id(self):
        """Test retrieve all bookings with kit id"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit1 = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)
        kit2 = Kit.objects.create(name='Kit 2', description='Spectrometry Labo', laboratory=laboratory)
        
        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            owner=self.user,
            reserved_by=None,
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            owner=self.user,
            reserved_by=None,
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            owner=self.user,
            reserved_by=None,
            kit=kit2)

        res = self.client.get(BOOKING_URL + '?kit=' + str(kit1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_retrieve_booking_by_user(self):
        """Test retrieve booking by user"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit1 = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)
        kit2 = Kit.objects.create(name='Kit 2', description='Spectrometry Labo', laboratory=laboratory)
        
        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            owner=self.user,
            reserved_by=self.user,
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            owner=self.user,
            reserved_by=self.user,
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            owner=self.user2,
            reserved_by=self.user2,
            kit=kit2)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            owner=self.user2,
            reserved_by=self.user2,
            kit=kit2)

        res = self.client.get(BOOKING_URL + 'me/')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_retrieve_booking_by_kit_id_unsuccessful(self):
        """Test retrieve all bookings with a wrong kit id"""
        res = self.client.get(BOOKING_URL + '?kit=abc')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
