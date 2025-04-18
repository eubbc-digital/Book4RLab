"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create a new user and validate email"""
        if not email:
            raise ValueError("Email address required")

        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.is_active = False
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Creates and saves a new super user"""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that suppors using email instead of username"""

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    country = models.CharField(max_length=10, default=None, null=True)
    time_zone = models.CharField(max_length=25, default="Etc/UTC")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"


class InstructorRequest(models.Model):
    """Tracks instructor access requests"""

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="instructor_request"
    )
    requested_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Instructor Access Request"
        verbose_name_plural = "Instructor Access Requests"
