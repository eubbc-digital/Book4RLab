"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
"""

import time
from unittest import mock

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from users.keycloak import sync_user_from_claims, validate_access_token
from users.models import User

PRIVATE_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
PUBLIC_PEM = PRIVATE_KEY.public_key().public_bytes(
    serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo
)
PRIVATE_PEM = PRIVATE_KEY.private_bytes(
    serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()
)


def make_token(**overrides):
    now = int(time.time())
    claims = {
        'iss': f"{settings.KEYCLOAK_URL}/realms/{settings.KEYCLOAK_REALM}",
        'sub': 'kc-sub-1',
        'iat': now,
        'exp': now + 300,
        'azp': 'book4rlab',
        'aud': 'account',
        'email': 'Teacher@UPB.edu',
        'email_verified': True,
        'given_name': 'Ana',
        'family_name': 'Perez',
        'realm_access': {'roles': ['student']},
    }
    claims.update(overrides)
    return jwt.encode(claims, PRIVATE_PEM, algorithm='RS256')


class FakeSigningKey:
    key = PUBLIC_PEM


class KeycloakAuthTests(TestCase):
    def setUp(self):
        self.jwks = mock.Mock()
        self.jwks.get_signing_key_from_jwt.return_value = FakeSigningKey()
        patcher = mock.patch('users.keycloak._get_jwks_client', return_value=self.jwks)
        patcher.start()
        self.addCleanup(patcher.stop)
        Group.objects.get_or_create(name='students')
        Group.objects.get_or_create(name='instructors')

    def group_names(self, user):
        return sorted(user.groups.values_list('name', flat=True))

    def test_valid_token_creates_user_with_student_group(self):
        claims = validate_access_token(make_token())
        user = sync_user_from_claims(claims)

        self.assertEqual(user.keycloak_sub, 'kc-sub-1')
        self.assertEqual(user.email, 'teacher@upb.edu')
        self.assertEqual(user.name, 'Ana')
        self.assertEqual(user.last_name, 'Perez')
        self.assertTrue(user.is_active)
        self.assertFalse(user.has_usable_password())
        self.assertEqual(self.group_names(user), ['students'])

    def test_instructor_role_adds_instructors_group_and_removal_drops_it(self):
        user = sync_user_from_claims(validate_access_token(make_token(
            realm_access={'roles': ['student', 'instructor']})))
        self.assertEqual(self.group_names(user), ['instructors', 'students'])

        user = sync_user_from_claims(validate_access_token(make_token(
            realm_access={'roles': ['student']})))
        self.assertEqual(self.group_names(user), ['students'])

    def test_existing_account_is_linked_by_verified_email(self):
        existing = User.objects.create(email='teacher@upb.edu', name='Old', last_name='Name')
        user = sync_user_from_claims(validate_access_token(make_token()))
        self.assertEqual(user.pk, existing.pk)
        self.assertEqual(user.keycloak_sub, 'kc-sub-1')

    def test_unverified_email_never_links_to_existing_account(self):
        User.objects.create(email='teacher@upb.edu', name='Old', last_name='Name')
        claims = validate_access_token(make_token(email_verified=False))
        with self.assertRaises(jwt.InvalidTokenError):
            sync_user_from_claims(claims)
        self.assertFalse(User.objects.filter(keycloak_sub='kc-sub-1').exists())

    def test_wrong_client_rejected(self):
        with self.assertRaises(jwt.InvalidTokenError):
            validate_access_token(make_token(azp='some-other-app'))

    def test_expired_token_rejected(self):
        with self.assertRaises(jwt.ExpiredSignatureError):
            validate_access_token(make_token(exp=int(time.time()) - 3600))

    def test_wrong_issuer_rejected(self):
        with self.assertRaises(jwt.InvalidIssuerError):
            validate_access_token(make_token(iss='https://evil.example/realms/eeda'))

    def test_me_endpoint_with_bearer_token(self):
        client = APIClient()
        res = client.get('/users/me/', HTTP_AUTHORIZATION=f"Bearer {make_token()}")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['email'], 'teacher@upb.edu')
        self.assertEqual([g['name'] for g in res.data['groups']], ['students'])

    def test_me_endpoint_without_token_is_unauthorized(self):
        res = APIClient().get('/users/me/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('Bearer', res['WWW-Authenticate'])

    def test_me_endpoint_with_bad_token_is_unauthorized(self):
        res = APIClient().get('/users/me/', HTTP_AUTHORIZATION='Bearer not-a-jwt')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_legacy_password_endpoints_are_gone(self):
        for path in ['/users/token/', '/users/signup/', '/users/activate/', '/users/instructor-access/']:
            res = APIClient().post(path, {})
            self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND, path)
