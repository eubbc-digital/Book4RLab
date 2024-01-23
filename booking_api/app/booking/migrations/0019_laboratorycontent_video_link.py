"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0018_laboratorycontent'),
    ]

    operations = [
        migrations.AddField(
            model_name='laboratorycontent',
            name='video_link',
            field=models.URLField(blank=True, null=True),
        ),
    ]
