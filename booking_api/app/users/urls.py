"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.urls import path
from users import views

app_name = "users"

urlpatterns = [
    path("activate/", views.ActivateAccountView.as_view(), name="activate"),
    path(
        "instructor-access/",
        views.InstructorAccessRequestView.as_view(),
        name="instructor-access",
    ),
    path("me/", views.ManageUserView.as_view(), name="me"),
    path("signup/", views.CreateUserView.as_view(), name="create"),
    path("token/", views.CreateTokenView.as_view(), name="token"),
]
