"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("", include("booking.urls")),
    path("admin/", admin.site.urls),
    path("users/", include("users.urls")),
    path("accounts/", include("django.contrib.auth.urls")),
] + static("/static/", document_root=settings.STATIC_ROOT)
