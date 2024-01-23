"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0015_alter_laboratory_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kit',
            name='description',
            field=models.CharField(default='', max_length=500),
        ),
    ]
