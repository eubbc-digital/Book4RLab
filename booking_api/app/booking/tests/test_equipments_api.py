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

from booking.models import Equipment, Laboratory
from booking.serializers import EquipmentSerializer


EQUIPMENT_URL = reverse('booking:equipmentlist')


class PublicEquipmentsApiTests(TestCase):
    """Test the publicly available equipments API"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required to access the endpoint"""
        res = self.client.get(EQUIPMENT_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateEquipmentsApiTests(TestCase):
    """Test the private equipments API"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'test@upb.edu',
            'Password123'
        )
        self.client.force_authenticate(self.user)

    def test_retrieve_equipment_list(self):
        """Test retrieving a list of equipments"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        Equipment.objects.create(name='Equipment 1', description='Spectrometry Labo', laboratory=laboratory)

        res = self.client.get(EQUIPMENT_URL)

        equipments = Equipment.objects.all()
        serializer = EquipmentSerializer(equipments, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_equipment_successful(self):
        """Test create a new equipment"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')

        payload = {'name':'Equipment 1', 'description':'Spectrometry Labo', 'laboratory': str(laboratory.id)}

        self.client.post(EQUIPMENT_URL, payload)

        exists = Equipment.objects.filter(
            name=payload['name'],
            description=payload['description'],
        ).exists()
        self.assertTrue(exists)

    def test_create_equipment_without_laboratory(self):
        """Test create a new equipment without laboratory"""
        payload = {'name':'Laboratory 1', 'description':'Spectrometry', 'laboratory': ''}

        res = self.client.post(EQUIPMENT_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_invalid_equipment(self):
        """Test creating invalid equipment fails"""
        payload = {'name': '', 'description':'', 'laboratory': '1'}
        res = self.client.post(EQUIPMENT_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_equipment_detail(self):
        """Test retrieve a equipment detail"""
        laboratory = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        equipment = Equipment.objects.create(name='Equipment 1', description='Spectrometry Labo', laboratory=laboratory)

        res = self.client.get(EQUIPMENT_URL + str(equipment.id) + '/')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'id': equipment.id,
            'name': equipment.name,
            'description': equipment.description,
            'laboratory': equipment.laboratory.id
        })

    def test_retrieve_equipment_by_laboratory_id(self):
        """Test retrieve all equipments with laboratory id"""
        laboratory1 = Laboratory.objects.create(name='Laboratory 1', description='Spectrometry')
        laboratory2 = Laboratory.objects.create(name='Laboratory 2', description='Solar')
        Equipment.objects.create(name='Equipment 1', description='Lorem Ipsum', laboratory=laboratory1)
        Equipment.objects.create(name='Equipment 2', description='Lorem Ipsum', laboratory=laboratory1)
        Equipment.objects.create(name='Equipment 3', description='Lorem Ipsum', laboratory=laboratory1)
        Equipment.objects.create(name='Equipment 4', description='Lorem Ipsum', laboratory=laboratory2)

        res = self.client.get(EQUIPMENT_URL + '?laboratory=' + str(laboratory1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 3)

    def test_retrieve_equipment_by_laboratory_id_unsuccessful(self):
        """Test retrieve all equipments with a wrong laboratory id"""
        res = self.client.get(EQUIPMENT_URL + '?laboratory=abc')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
