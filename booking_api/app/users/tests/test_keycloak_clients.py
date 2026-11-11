"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
"""

from io import StringIO
from unittest import mock

from django.contrib.auth.models import Group
from django.core.management import CommandError, call_command
from django.test import SimpleTestCase, TestCase, override_settings

from users.keycloak_account import KeycloakAccountError, KeycloakAccountRejected, update_account
from users.keycloak_admin import KeycloakAdmin, KeycloakAdminError
from users.models import User


def response(status_code, body=None):
    res = mock.Mock(status_code=status_code, text=str(body))
    res.json.return_value = body
    return res


class UpdateAccountTests(SimpleTestCase):
    @mock.patch('users.keycloak_account.requests.request')
    def test_posts_the_full_profile_with_only_the_given_attributes_changed(self, request):
        profile = {
            'username': 'ana',
            'email': 'ana@upb.example',
            'firstName': 'Ana',
            'lastName': 'Perez',
            'attributes': {'time_zone': ['Etc/UTC'], 'institution': ['UPB'], 'phone': ['123']},
        }
        request.side_effect = [response(200, profile), response(204)]

        update_account('user-token', attributes={'time_zone': 'Europe/Madrid'})

        method, _ = request.call_args_list[1].args
        posted = request.call_args_list[1].kwargs['json']
        self.assertEqual(method, 'POST')
        self.assertEqual(posted['email'], 'ana@upb.example')
        self.assertEqual(posted['username'], 'ana')
        self.assertEqual(posted['firstName'], 'Ana')
        self.assertEqual(
            posted['attributes'],
            {'time_zone': ['Europe/Madrid'], 'institution': ['UPB'], 'phone': ['123']},
        )
        for call in request.call_args_list:
            self.assertEqual(call.kwargs['headers'], {'Authorization': 'Bearer user-token'})

    @mock.patch('users.keycloak_account.requests.request')
    def test_failed_read_sends_no_update(self, request):
        request.return_value = response(500)
        with self.assertRaises(KeycloakAccountError):
            update_account('user-token', attributes={'time_zone': 'Europe/Madrid'})
        self.assertEqual(request.call_count, 1)

    @mock.patch('users.keycloak_account.requests.request')
    def test_rejected_update_raises_rejected(self, request):
        request.side_effect = [response(200, {'attributes': {}}), response(400, 'bad')]
        with self.assertRaises(KeycloakAccountRejected):
            update_account('user-token', attributes={'country': 'BO'})


@override_settings(KEYCLOAK_ADMIN_CLIENT_ID='book4rlab-admin', KEYCLOAK_ADMIN_CLIENT_SECRET='secret')
class KeycloakAdminTests(TestCase):
    @mock.patch('users.keycloak_admin.requests.request')
    def test_assigns_the_instructor_realm_role_to_the_user(self, request):
        request.side_effect = [
            response(200, {'access_token': 'service-token'}),
            response(200, {'id': 'role-1', 'name': 'instructor'}),
            response(204),
        ]
        KeycloakAdmin().assign_instructor_role('kc-id-1')

        method, url = request.call_args_list[2].args
        self.assertEqual(method, 'POST')
        self.assertTrue(url.endswith('/users/kc-id-1/role-mappings/realm'))
        self.assertEqual(request.call_args_list[2].kwargs['json'], [{'id': 'role-1', 'name': 'instructor'}])
        self.assertEqual(request.call_args_list[2].kwargs['headers'], {'Authorization': 'Bearer service-token'})

    @mock.patch('users.keycloak_admin.requests.request')
    def test_unlinked_user_is_found_by_exact_email(self, request):
        request.side_effect = [response(200, {'access_token': 't'}), response(200, [{'id': 'kc-id-2'}])]
        user = User(email='old@upb.example')
        self.assertEqual(KeycloakAdmin().find_user_id(user), 'kc-id-2')
        self.assertEqual(request.call_args_list[1].kwargs['params'], {'email': 'old@upb.example', 'exact': 'true'})

    @mock.patch('users.keycloak_admin.requests.request')
    def test_linked_user_uses_the_token_sub(self, request):
        request.return_value = response(200, {'access_token': 't'})
        self.assertEqual(KeycloakAdmin().find_user_id(User(email='a@b.c', keycloak_sub='kc-sub')), 'kc-sub')
        self.assertEqual(request.call_count, 1)

    @mock.patch('users.keycloak_admin.requests.request')
    def test_error_status_raises(self, request):
        request.return_value = response(401)
        with self.assertRaises(KeycloakAdminError):
            KeycloakAdmin()

    @override_settings(KEYCLOAK_ADMIN_CLIENT_SECRET='')
    def test_missing_credentials_raise(self):
        with self.assertRaises(KeycloakAdminError):
            KeycloakAdmin()


class GrantInstructorRolesCommandTests(TestCase):
    def setUp(self):
        instructors, _ = Group.objects.get_or_create(name='instructors')
        self.linked = User.objects.create(email='a@upb.example', keycloak_sub='kc-a')
        self.unlinked = User.objects.create(email='b@upb.example')
        self.student = User.objects.create(email='c@upb.example', keycloak_sub='kc-c')
        self.linked.groups.add(instructors)
        self.unlinked.groups.add(instructors)

    @mock.patch('users.management.commands.grant_instructor_roles.KeycloakAdmin')
    def test_dry_run_changes_nothing(self, keycloak_class):
        out = StringIO()
        call_command('grant_instructor_roles', '--dry-run', stdout=out)
        keycloak_class.assert_not_called()
        self.assertIn('would grant: a@upb.example', out.getvalue())
        self.assertNotIn('c@upb.example', out.getvalue())

    @mock.patch('users.management.commands.grant_instructor_roles.KeycloakAdmin')
    def test_grants_the_role_to_every_instructor_found_in_keycloak(self, keycloak_class):
        keycloak = keycloak_class.return_value
        keycloak.find_user_id.side_effect = lambda user: user.keycloak_sub
        out = StringIO()
        call_command('grant_instructor_roles', stdout=out)
        keycloak.assign_instructor_role.assert_called_once_with('kc-a')
        self.assertIn('no matching Keycloak user: b@upb.example', out.getvalue())

    @mock.patch('users.management.commands.grant_instructor_roles.KeycloakAdmin')
    def test_failures_make_the_command_fail(self, keycloak_class):
        keycloak = keycloak_class.return_value
        keycloak.find_user_id.return_value = 'kc-x'
        keycloak.assign_instructor_role.side_effect = KeycloakAdminError('403')
        with self.assertRaises(CommandError):
            call_command('grant_instructor_roles', stdout=StringIO())
