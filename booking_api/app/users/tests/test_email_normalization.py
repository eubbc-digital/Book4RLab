"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from booking.models import Laboratory

USER_ACCESS_URL = reverse('booking:lab-user-access')
PASSWORD = 'Password123'


class EmailCaseTests(TestCase):
    """Test that the email casing typed by the user never changes the outcome.

    Sign-in itself happens in Keycloak; these cover the local user records.
    """

    def setUp(self):
        self.client = APIClient()

    def test_emails_are_stored_lowercased(self):
        """Test that both the manager and a plain save normalize the address"""

        created = get_user_model().objects.create_user('MiXeD@Example.COM', PASSWORD)
        self.assertEqual(created.email, 'mixed@example.com')
        saved = get_user_model()(email='Admin.Made@Example.COM')
        saved.set_password(PASSWORD)
        saved.save()
        self.assertEqual(saved.email, 'admin.made@example.com')

    def test_lab_access_list_ignores_casing(self):
        """Test that an instructor typing a mixed case email still grants access"""

        user = get_user_model().objects.create_user('student@example.com', PASSWORD)
        owner = get_user_model().objects.create_user('owner@example.com', PASSWORD)
        self.client.force_authenticate(user)
        laboratory = Laboratory.objects.create(
            name='Lab', owner=owner, allowed_emails='Student@Example.COM'
        )

        res = self.client.post(USER_ACCESS_URL, {'laboratory_id': laboratory.id})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['access'])
