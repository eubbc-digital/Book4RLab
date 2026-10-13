"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.urls import path
from users import views

app_name = "users"

urlpatterns = [
    path("me/", views.ManageUserView.as_view(), name="me"),
]
