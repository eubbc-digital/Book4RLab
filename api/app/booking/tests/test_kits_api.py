from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from booking.models import Kit, Laboratory
from booking.serializers import KitSerializer


KIT_URL = reverse('booking:kitlist')


class PublicKitsApiTests(TestCase):
    """Test the publicly available kits API"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required to access the endpoint"""
        res = self.client.get(KIT_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateKitsApiTests(TestCase):
    """Test the private kits API"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'test@upb.edu',
            'Password123'
        )
        self.client.force_authenticate(self.user)

    def test_retrieve_kit_list(self):
        """Test retrieving a list of kits"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)

        res = self.client.get(KIT_URL)

        kits = Kit.objects.all()
        serializer = KitSerializer(kits, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_kit_successful(self):
        """Test create a new kit"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')

        payload = {'name':'Kit 1', 'description':'Spectrometry Labo', 'laboratory': str(laboratory.id)}
        
        self.client.post(KIT_URL, payload)

        exists = Kit.objects.filter(
            name=payload['name'],
            description=payload['description'],
        ).exists()
        self.assertTrue(exists)

    def test_create_kit_without_laboratory(self):
        """Test create a new kit without laboratory"""
        payload = {'name':'Laboratory 1', 'description':'Spectrometry', 'laboratory': ''}
        
        res = self.client.post(KIT_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_invalid_kit(self):
        """Test creating invalid kit fails"""
        payload = {'name': '', 'description':'', 'laboratory': '1'}
        res = self.client.post(KIT_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_kit_detail(self):
        """Test retrieve a kit detail"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        kit = Kit.objects.create(name='Kit 1', description='Spectrometry Labo', laboratory=laboratory)

        res = self.client.get(KIT_URL + str(kit.id) + '/')
        
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'id': kit.id,
            'name': kit.name,
            'description': kit.description,
            'laboratory': kit.laboratory.id
        })

    def test_retrieve_kit_by_laboratory_id(self):
        """Test retrieve all kits with laboratory id"""
        laboratory1 = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        laboratory2 = Laboratory.objects.create(name='Laboratory 2', description='Solar')
        Kit.objects.create(name='Kit 1', description='Lorem Ipsum', laboratory=laboratory1)
        Kit.objects.create(name='Kit 2', description='Lorem Ipsum', laboratory=laboratory1)
        Kit.objects.create(name='Kit 3', description='Lorem Ipsum', laboratory=laboratory1)
        Kit.objects.create(name='Kit 4', description='Lorem Ipsum', laboratory=laboratory2)

        res = self.client.get(KIT_URL + '?laboratory=' + str(laboratory1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 3)

    def test_retrieve_kit_by_laboratory_id_unsuccessful(self):
        """Test retrieve all kits with a wrong laboratory id"""
        res = self.client.get(KIT_URL + '?laboratory=abc')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
