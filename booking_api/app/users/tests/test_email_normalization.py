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

SIGNUP_URL = reverse('users:create')
TOKEN_URL = reverse('users:token')
USER_ACCESS_URL = reverse('lab-user-access')
PASSWORD = 'Password123'


class EmailCaseTests(TestCase):
    """Test that the email casing typed by the user never changes the outcome"""

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

    def test_login_succeeds_for_any_casing(self):
        """Test that every casing of a stored email logs in"""

        user = get_user_model().objects.create_user('user@example.com', PASSWORD)
        user.is_active = True
        user.save()

        for email in ['user@example.com', 'User@Example.com', 'USER@EXAMPLE.COM']:
            with self.subTest(email=email):
                res = self.client.post(
                    TOKEN_URL, {'email': email, 'password': PASSWORD}
                )

                self.assertEqual(res.status_code, status.HTTP_200_OK)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_signup_rejects_a_taken_email_in_another_case(self):
        """Test that a duplicate is a validation error instead of a server error"""

        Group.objects.get_or_create(name='students')
        get_user_model().objects.create_user('taken@example.com', PASSWORD)

        res = self.client.post(SIGNUP_URL, {
            'email': 'TAKEN@Example.COM',
            'password': PASSWORD,
            'name': 'Test',
            'last_name': 'User',
        })

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 1)

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
