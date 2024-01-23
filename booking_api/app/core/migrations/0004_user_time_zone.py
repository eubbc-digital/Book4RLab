"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_create_groups'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='time_zone',
            field=models.CharField(default='Etc/UTC', max_length=25),
        ),
    ]
