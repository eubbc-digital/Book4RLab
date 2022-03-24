from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from booking.models import Kit, Laboratory, Booking
from booking.serializers import BookingSerializer

import datetime
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
        self.client.force_authenticate(self.user)

    def test_retrieve_booking_list(self):
        """Test retrieving a list of bookings"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)
        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            access_url='http://remote-lab.upb.edu/GG3883',
            user=self.user,
            kit=kit)

        res = self.client.get(BOOKING_URL)

        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_booking_successful(self):
        """Test create a new kit"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)

        payload = {
            'start_date': datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC), 
            'end_date': datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            'available': False,
            'access_url': 'http://remote-lab.upb.edu/GG3883',
            'user': self.user.id,
            'kit': str(kit.id)
        }
        
        self.client.post(BOOKING_URL, payload)

        exists = Booking.objects.filter(
            start_date=payload['start_date'],
            end_date=payload['end_date'],
            available=payload['available'],
            access_url=payload['access_url'],
            user=payload['user'],
            kit=payload['kit']
        ).exists()
        self.assertTrue(exists)

    def test_create_booking_without_kit(self):
        """Test create a new booking without kit"""
        payload = {
            'start_date': datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC), 
            'end_date': datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            'available': False,
            'access_url': 'http://remote-lab.upb.edu/GG3883',
            'user': self.user.id,
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
            'access_url': '',
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
            access_url='http://remote-lab.upb.edu/GG3883',
            user=self.user,
            kit=kit)

        res = self.client.get(BOOKING_URL + str(booking.id) + '/')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'id': booking.id,
            'start_date': booking.start_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'end_date': booking.end_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'available': booking.available,
            'access_url': booking.access_url,
            'user': booking.user.id,
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
            access_url='http://remote-lab.upb.edu/GG3883',
            user=self.user,
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            access_url='http://remote-lab.upb.edu/GG3883',
            user=self.user,
            kit=kit1)

        Booking.objects.create(start_date=datetime.datetime(2003, 5, 16, 9, 0, tzinfo=pytz.UTC),
            end_date=datetime.datetime(2003, 5, 16, 11, 0, tzinfo=pytz.UTC),
            available=True,
            access_url='http://remote-lab.upb.edu/GG3883',
            user=self.user,
            kit=kit2)

        res = self.client.get(BOOKING_URL + '?kit=' + str(kit1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_retrieve_booking_by_kit_id_unsuccessful(self):
        """Test retrieve all bookings with a wrong kit id"""
        res = self.client.get(BOOKING_URL + '?kit=abc')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
