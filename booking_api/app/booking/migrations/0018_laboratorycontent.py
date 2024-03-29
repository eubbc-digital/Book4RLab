"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Boris Pedraza, Alex Villazon, Omar Ormachea
"""

import booking.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0017_equipment_remove_booking_kit_remove_timeframe_kit_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='LaboratoryContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField()),
                ('text', models.CharField(blank=True, max_length=1500, null=True)),
                ('image', models.ImageField(blank=True, null=True, storage=booking.models.UniqueFilenameStorage(), upload_to=booking.models.generate_unique_filename_image)),
                ('video', models.FileField(blank=True, null=True, storage=booking.models.UniqueFilenameStorage(), upload_to=booking.models.generate_unique_filename_video)),
                ('link', models.URLField(blank=True, null=True)),
                ('title', models.CharField(blank=True, max_length=100, null=True)),
                ('subtitle', models.CharField(blank=True, max_length=100, null=True)),
                ('is_last', models.BooleanField(default=False)),
                ('laboratory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contents', to='booking.laboratory')),
            ],
            options={
                'ordering': ['order'],
                'unique_together': {('laboratory', 'order')},
            },
        ),
    ]
