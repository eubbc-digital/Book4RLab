"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.db import migrations
from django.db.models.functions import Lower, Trim


def normalize_emails(apps, schema_editor):
    """Lowercase every stored email so lookups stop depending on casing"""
    apps.get_model("users", "User").objects.update(email=Lower(Trim("email")))


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_create_groups"),
    ]

    operations = [
        migrations.RunPython(normalize_emails, migrations.RunPython.noop),
    ]
