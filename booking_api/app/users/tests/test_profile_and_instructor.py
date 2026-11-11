"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
"""

import time
from unittest import mock

from django.contrib.auth.models import Group
from django.core import mail
from django.test import Client, TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from users.keycloak import sync_user_from_claims, validate_access_token
from users.keycloak_account import KeycloakAccountError, KeycloakAccountRejected
from users.models import InstructorRequest, User
from users.tests.test_keycloak_auth import FakeSigningKey, make_token


class SignedInTestCase(TestCase):
    def setUp(self):
        jwks = mock.Mock()
        jwks.get_signing_key_from_jwt.return_value = FakeSigningKey()
        patcher = mock.patch('users.keycloak._get_jwks_client', return_value=jwks)
        patcher.start()
        self.addCleanup(patcher.stop)
        Group.objects.get_or_create(name='students')
        Group.objects.get_or_create(name='instructors')

    def sign_in(self, **claims):
        token = make_token(**claims)
        user = sync_user_from_claims(validate_access_token(token))
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        return user, client, token


class TimeZoneAndCountryClaimsTests(SignedInTestCase):
    def test_sync_copies_time_zone_and_country_from_claims(self):
        user, _, _ = self.sign_in(time_zone='America/La_Paz', country='BO')
        user.refresh_from_db()
        self.assertEqual(user.time_zone, 'America/La_Paz')
        self.assertEqual(user.country, 'BO')

    def test_sync_keeps_local_values_when_claims_are_missing(self):
        self.sign_in(time_zone='America/La_Paz')
        user, _, _ = self.sign_in()
        self.assertEqual(user.time_zone, 'America/La_Paz')

    def test_sync_stores_the_email_lowercased(self):
        user, _, _ = self.sign_in(email='Ana.Perez@UPB.example')
        user.refresh_from_db()
        self.assertEqual(user.email, 'ana.perez@upb.example')

    def test_sync_copies_institution_from_claims(self):
        user, _, _ = self.sign_in(institution='UPB')
        user.refresh_from_db()
        self.assertEqual(user.institution, 'UPB')


    def test_sync_accepts_long_iana_time_zone(self):
        user, _, _ = self.sign_in(time_zone='America/Argentina/Buenos_Aires')
        user.refresh_from_db()
        self.assertEqual(user.time_zone, 'America/Argentina/Buenos_Aires')

    def test_sync_ignores_claims_that_do_not_fit_and_still_signs_in(self):
        self.sign_in(time_zone='America/La_Paz', country='BO')
        user, client, _ = self.sign_in(time_zone='x' * 65, country='Bolivia, Plurinational State of')
        user.refresh_from_db()
        self.assertEqual(user.time_zone, 'America/La_Paz')
        self.assertEqual(user.country, 'BO')
        self.assertEqual(client.get(reverse('users:me')).status_code, status.HTTP_200_OK)


class ProfileUpdateTests(SignedInTestCase):
    @mock.patch('users.views.update_account')
    def test_old_token_does_not_undo_a_profile_change(self, _):
        user, client, _ = self.sign_in(time_zone='Etc/UTC', iat=int(time.time()) - 60)
        client.patch(reverse('users:me'), {'time_zone': 'Europe/Madrid'}, format='json')

        # Same token, still carrying the old claim
        res = client.get(reverse('users:me'))
        self.assertEqual(res.data['time_zone'], 'Europe/Madrid')

        # A token issued after the change applies its claims again
        user, _, _ = self.sign_in(time_zone='America/La_Paz', iat=int(time.time()) + 5)
        self.assertEqual(user.time_zone, 'America/La_Paz')

    @mock.patch('users.views.update_account')
    def test_time_zone_change_goes_to_keycloak_with_the_users_token_then_is_saved(self, update):
        user, client, token = self.sign_in(time_zone='Etc/UTC')
        res = client.patch(reverse('users:me'), {'time_zone': 'Europe/Madrid'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        update.assert_called_once_with(
            token,
            first_name='Ana',
            last_name='Perez',
            attributes={'time_zone': 'Europe/Madrid', 'country': '', 'institution': ''},
        )
        user.refresh_from_db()
        self.assertEqual(user.time_zone, 'Europe/Madrid')

    @mock.patch('users.views.update_account')
    def test_institution_change_goes_to_keycloak_and_is_saved(self, update):
        user, client, token = self.sign_in(institution='UPB', time_zone='Etc/UTC')
        res = client.patch(reverse('users:me'), {'institution': 'UMSA'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        update.assert_called_once_with(
            token,
            first_name='Ana',
            last_name='Perez',
            attributes={'time_zone': 'Etc/UTC', 'country': '', 'institution': 'UMSA'},
        )
        user.refresh_from_db()
        self.assertEqual(user.institution, 'UMSA')

    @mock.patch('users.views.update_account')
    def test_name_change_does_not_call_keycloak(self, update):
        _, client, _ = self.sign_in()
        res = client.patch(reverse('users:me'), {'name': 'Other'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        update.assert_not_called()

    @mock.patch('users.views.update_account', side_effect=KeycloakAccountError('down'))
    def test_keycloak_failure_returns_503_and_keeps_local_value(self, _):
        user, client, _ = self.sign_in(time_zone='Etc/UTC')
        res = client.patch(reverse('users:me'), {'time_zone': 'Europe/Madrid'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        user.refresh_from_db()
        self.assertEqual(user.time_zone, 'Etc/UTC')

    @mock.patch('users.views.update_account', side_effect=KeycloakAccountRejected('missing field'))
    def test_keycloak_rejection_returns_400_and_keeps_local_value(self, _):
        user, client, _ = self.sign_in(time_zone='Etc/UTC')
        res = client.patch(reverse('users:me'), {'time_zone': 'Europe/Madrid'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user.refresh_from_db()
        self.assertEqual(user.time_zone, 'Etc/UTC')


@override_settings(INSTRUCTOR_REQUEST_EMAIL='team@upb.example', EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class InstructorRequestTests(SignedInTestCase):
    url = '/users/instructor-request/'

    def test_status_none_for_new_student(self):
        _, client, _ = self.sign_in()
        self.assertEqual(client.get(self.url).json(), {'status': 'none'})

    def test_reason_is_saved_and_sent_to_the_team(self):
        user, client, _ = self.sign_in()
        res = client.post(self.url, {'reason': '  Teaching chemistry at UPB  '}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(InstructorRequest.objects.get(user=user).reason, 'Teaching chemistry at UPB')
        self.assertIn('Reason: Teaching chemistry at UPB', mail.outbox[0].body)

    def test_reason_is_optional(self):
        user, client, _ = self.sign_in()
        self.assertEqual(client.post(self.url).status_code, status.HTTP_201_CREATED)
        self.assertEqual(InstructorRequest.objects.get(user=user).reason, '')
        self.assertIn('Reason: No reason given.', mail.outbox[0].body)

    def test_overlong_reason_is_rejected_and_nothing_is_recorded(self):
        user, client, _ = self.sign_in()
        res = client.post(self.url, {'reason': 'x' * 1001}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(InstructorRequest.objects.filter(user=user).exists())
        self.assertEqual(len(mail.outbox), 0)

    def test_request_is_recorded_and_team_is_emailed_once(self):
        user, client, _ = self.sign_in()
        res = client.post(self.url)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.json()['status'], 'pending')
        self.assertTrue(InstructorRequest.objects.filter(user=user, approved=False).exists())
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['team@upb.example'])

        again = client.post(self.url)
        self.assertEqual(again.status_code, status.HTTP_200_OK)
        self.assertEqual(again.json(), {'status': 'pending'})
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(client.get(self.url).json(), {'status': 'pending'})

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend', EMAIL_HOST='127.0.0.1', EMAIL_PORT=1)
    def test_failed_email_keeps_no_record(self):
        user, client, _ = self.sign_in()
        res = client.post(self.url)
        self.assertEqual(res.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertFalse(InstructorRequest.objects.filter(user=user).exists())

    @override_settings(INSTRUCTOR_REQUEST_EMAIL='')
    def test_missing_team_mailbox_keeps_no_record(self):
        user, client, _ = self.sign_in()
        res = client.post(self.url)
        self.assertEqual(res.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertFalse(InstructorRequest.objects.filter(user=user).exists())
        self.assertEqual(len(mail.outbox), 0)

    def test_instructor_role_in_token_is_approved(self):
        # The approver assigns the realm role in Keycloak; the next token carries it and sync adds the group.
        _, client, _ = self.sign_in(realm_access={'roles': ['student', 'instructor']})
        self.assertEqual(client.get(self.url).json(), {'status': 'approved'})
        self.assertEqual(client.post(self.url).json(), {'status': 'approved'})
        self.assertEqual(len(mail.outbox), 0)


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class InstructorApprovalAdminTests(SignedInTestCase):
    def setUp(self):
        super().setUp()
        self.admin = User.objects.create_superuser(email='admin@upb.example', password='x-Admin-pass-1')
        self.site_client = Client()
        self.site_client.force_login(self.admin)

    def approve(self, *requests):
        return self.site_client.post(
            reverse('admin:users_instructorrequest_changelist'),
            {'action': 'approve_requests', '_selected_action': [r.pk for r in requests]},
        )

    def test_approve_records_the_decision_and_the_approver(self):
        user = User.objects.create(email='teacher@upb.example', name='N', last_name='L')
        req = InstructorRequest.objects.create(user=user)
        res = self.approve(req)
        self.assertEqual(res.status_code, 302)
        req.refresh_from_db()
        self.assertTrue(req.approved)
        self.assertEqual(req.approved_by, self.admin)
        self.assertIsNotNone(req.approved_at)

    def test_approving_an_already_approved_request_changes_nothing(self):
        user = User.objects.create(email='done@upb.example', name='N', last_name='L')
        req = InstructorRequest.objects.create(user=user, approved=True, approved_by=self.admin)
        self.approve(req)
        req.refresh_from_db()
        self.assertTrue(req.approved)
        self.assertEqual(req.approved_by, self.admin)
