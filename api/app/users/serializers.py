"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
"""

from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import Group
from django.core.mail import EmailMultiAlternatives, BadHeaderError
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.html import strip_tags
from rest_framework import serializers

from users.tokens import account_activation_token

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for the user profile object"""

    groups = GroupSerializer(many=True)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'name', 'last_name', 'country', 'time_zone', 'groups')
        read_only_fields = ('id', 'email')

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object"""

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'name', 'last_name',
                  'country', 'time_zone')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def create(self, validated_data):
        """Create a new user with encrypted password and return it"""
        user = get_user_model().objects.create_user(**validated_data)
        group = Group.objects.get(name='students')
        user.groups.add(group)

        self.account_activation_procedure(user, self.context.get('request'))

        return user

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it"""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user

    def account_activation_procedure(self, user, request):
        subject = 'Account activation'
        context = {
          'user_name': user.name,
          'scheme': request.scheme,
          'server_base_url': request.get_host(),
          'uid': urlsafe_base64_encode(force_bytes(user.pk)),
          'token': account_activation_token.make_token(user),
        }
        email_body = render_to_string('account_activation_email_template.html', context)
        email_body_plain = strip_tags(email_body)
        sender = settings.EMAIL_HOST_USER
        recipient = [user.email]

        try:
            print(f'Sending activation email to {recipient}')
            msg = EmailMultiAlternatives(subject, email_body_plain, sender, recipient)
            msg.attach_alternative(email_body, 'text/html')
            msg.send()
        except BadHeaderError:
            return HttpResponse('Invalid header found.')
        except Exception as e:
            print(f'An unexpected error occurred: {e}')


class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user authentication object"""
    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """Validate and authenticate the user"""
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )

        if not user:
            msg = 'Unable to authenticate'
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return attrs
