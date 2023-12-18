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

from booking.models import Laboratory
from booking.serializers import LaboratorySerializer


LABORATORY_URL = reverse('booking:laboratorylist')


class PublicLaboratoriesApiTests(TestCase):
    """Test the publicly available laboratories API"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required to access the endpoint"""
        res = self.client.get(LABORATORY_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateLaboratoryApiTests(TestCase):
    """Test the private laboratories API"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'test@upb.edu',
            'Password123'
        )
        self.client.force_authenticate(self.user)

    def test_retrieve_laboratory_list(self):
        """Test retrieving a list of laboratories"""
        Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        Laboratory.objects.create(name='Laboratory 2', description='Solar')

        res = self.client.get(LABORATORY_URL)

        laboratories = Laboratory.objects.all()
        serializer = LaboratorySerializer(laboratories, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_laboratory_successful(self):
        """Test create a new laboratory"""
        payload = {'name':'Laboratory 1', 'description':'Spectrometry'}
        self.client.post(LABORATORY_URL, payload)

        exists = Laboratory.objects.filter(
            name=payload['name'],
            description=payload['description'],
        ).exists()
        self.assertTrue(exists)

    def test_create_invalid_laboratory(self):
        """Test creating invalid laboratory fails"""
        payload = {'name': '', 'description':''}
        res = self.client.post(LABORATORY_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_laboratory_detail(self):
        """Test retrieve a laboratory detail"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry', url='http://www.upb.edu')

        res = self.client.get(LABORATORY_URL + str(laboratory.id) + '/')
        
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'id': laboratory.id,
            'name': laboratory.name,
            'description': laboratory.description,
            'url': laboratory.url
        })
