"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('booking', '0016_alter_kit_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='Equipment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=255)),
                ('description', models.CharField(default='', max_length=500)),
                ('registration_date', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True)),
                ('enabled', models.BooleanField(default=True)),
                ('laboratory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='booking.laboratory')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='equipment_owner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='booking',
            name='kit',
        ),
        migrations.RemoveField(
            model_name='timeframe',
            name='kit',
        ),
        migrations.DeleteModel(
            name='Kit',
        ),
        migrations.AddField(
            model_name='booking',
            name='equipment',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='equipment_reservations', to='booking.equipment'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='timeframe',
            name='equipment',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='timeframes', to='booking.equipment'),
            preserve_default=False,
        ),
    ]
